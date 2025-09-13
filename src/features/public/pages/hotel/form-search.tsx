import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import useClickOutside from '@/hooks/use-click-outside'
import { useLanguage } from '@/i18n/prodiver'
import { hotelsSearchSchema } from '@/routes/$lang/_public/hotels.route'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

// Formun tipini Zod şemasından türet
type SearchFormValues = z.infer<typeof hotelsSearchSchema>

interface SearchFormProps {
  initialData?: Partial<SearchFormValues>
}

export const SearchForm = ({ initialData }: SearchFormProps) => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isParticipantOpen, setIsParticipantOpen] = useState(false)
  const participantRef = useClickOutside<HTMLDivElement>(() => setIsParticipantOpen(false))

  const { control, handleSubmit, watch } = useForm<SearchFormValues>({
    resolver: zodResolver(hotelsSearchSchema),
    defaultValues: {
      search: initialData?.search || '',
      dateStart: initialData?.dateStart || format(new Date(), 'yyyy-MM-dd'),
      dateEnd: initialData?.dateEnd || format(new Date(), 'yyyy-MM-dd'),
      adult: initialData?.adult || 2,
      child: initialData?.child || 1,
    },
  })

  // Katılımcı sayısını anlık olarak izle
  const [adults, children] = watch(['adult', 'child'])

  // Form gönderildiğinde
  const onSubmit = (data: SearchFormValues) => {
    navigate({
      to: '/$lang/hotels/search',
      params: {
        lang: language.value,
      },
      search: {
        search: data.search,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        adult: data.adult,
        child: data.child,
      },
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <section className="bg-box-surface pb-4 md:py-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex max-w-main flex-col gap-y-4 border-b border-gray-200 bg-white p-4 md:flex-row md:items-center md:p-0 md:shadow"
      >
        {/* Arama Kelimesi */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('global-form:labels.search-otel')}
          </label>
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                value={field.value}
                onChange={field.onChange}
                className="w-full text-start text-size-sm font-semibold"
              />
            )}
          />
        </div>

        {/* Tarih Başlangıç */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('global-form:labels.date-hotel-start')}
          </label>
          <Controller
            name="dateStart"
            control={control}
            render={({ field }) => (
              <DatePickerText
                value={field.value ? parseISO(field.value) : new Date()}
                onChange={(dateStart) =>
                  field.onChange(dateStart ? format(dateStart, 'yyyy-MM-dd') : '')
                }
                minDate={new Date()}
                className="w-full text-start text-size-sm font-semibold"
              />
            )}
          />
        </div>

        {/* Tarih Dönüş */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('global-form:labels.date-hotel-end')}
          </label>
          <Controller
            name="dateEnd"
            control={control}
            render={({ field }) => (
              <DatePickerText
                value={field.value ? parseISO(field.value) : new Date()}
                onChange={(dateEnd) => field.onChange(dateEnd ? format(dateEnd, 'yyyy-MM-dd') : '')}
                minDate={new Date()}
                className="w-full text-start text-size-sm font-semibold"
              />
            )}
          />
        </div>

        {/* Katılımcı Seçici */}
        <div
          className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:py-0 md:shadow-none"
          ref={participantRef}
        >
          <label className="text-xs font-medium text-gray-700">
            {t('global-form:labels.participants-hotel')}
          </label>
          <button
            type="button"
            onClick={() => setIsParticipantOpen(!isParticipantOpen)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-size-sm font-semibold">
              {`${adults} ${t('global-form:participants.adults')}, ${children} ${t('global-form:participants.children')}`}
            </span>
          </button>

          {isParticipantOpen && (
            <div className="absolute top-full left-0 z-10 w-full border border-t-0 border-gray-200 bg-white shadow-xl">
              <div className="flex flex-col gap-y-4 p-4">
                <Controller
                  name="adult"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <label>{t('global-form:participants.adults')}</label>
                      <NumericStepper
                        value={field.value || 1}
                        onChange={field.onChange}
                        min={1}
                        className="w-40"
                      />
                    </div>
                  )}
                />
                <Controller
                  name="child"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <label>{t('global-form:participants.children')}</label>
                      <NumericStepper
                        value={field.value || 0}
                        onChange={field.onChange}
                        min={0}
                        className="w-40"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* Arama Butonu */}
        <button
          type="submit"
          className="flex h-14 w-full shrink-0 items-center justify-center gap-x-2 bg-btn-primary px-6 font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover md:w-fit"
        >
          <Icon name="search" className="h-5 w-5" />
          <span>{t('global-form:search.hotel')}</span>
        </button>
      </form>
    </section>
  )
}
