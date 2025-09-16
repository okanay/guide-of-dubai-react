import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { TimePickerRaw } from '@/features/public/components/form-ui/time-picker'
import { useLanguage } from '@/i18n/prodiver'
import { rentACarSearchSchema } from '@/routes/$lang/_public/rent-a-car.route'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

type SearchFormValues = z.infer<typeof rentACarSearchSchema>

interface SearchFormProps {
  initialData?: Partial<SearchFormValues>
}

export const SearchForm = ({ initialData }: SearchFormProps) => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { t } = useTranslation('global-form')
  const router = useRouter()

  const { control, handleSubmit } = useForm<SearchFormValues>({
    resolver: zodResolver(rentACarSearchSchema),
    defaultValues: {
      dateStart: initialData?.dateStart || format(new Date(), 'yyyy-MM-dd'),
      dateEnd: initialData?.dateEnd || format(new Date(), 'yyyy-MM-dd'),
      timeStart: initialData?.timeStart || '10:00',
      timeEnd: initialData?.timeEnd || '20:00',
    },
  })

  const onSubmit = (data: SearchFormValues) => {
    navigate({
      to: '/$lang/rent-a-car/search',
      params: {
        lang: language.value,
      },
      search: {
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
      },
      resetScroll: false,
    })
  }

  return (
    <section className="bg-box-surface pb-4 md:py-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex max-w-main flex-col gap-y-4 border-b border-gray-200 bg-white p-4 md:flex-row md:items-center md:divide-x md:divide-gray-200 md:p-0 md:shadow"
      >
        {/* Alış Tarihi */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.date-rent-a-car-start')}
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
                dropdownClassName="mt-2.5 -ml-4"
              />
            )}
          />
        </div>

        {/* Alış Saati */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.time-rent-a-car-start')}
          </label>
          <Controller
            name="timeStart"
            control={control}
            render={({ field }) => (
              <TimePickerRaw value={field.value || ''} onChange={field.onChange} rounding={15}>
                {({ inputProps }) => (
                  <input
                    {...inputProps}
                    placeholder={t('placeholders.time-rent-a-car-start')}
                    className="w-full border-none bg-transparent p-0 text-start text-size-sm font-semibold focus:outline-none"
                  />
                )}
              </TimePickerRaw>
            )}
          />
        </div>

        {/* Bırakış Tarihi */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.date-rent-a-car-end')}
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
                dropdownClassName="mt-2.5 -ml-4"
              />
            )}
          />
        </div>

        {/* Bırakış Saati */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.time-rent-a-car-end')}
          </label>
          <Controller
            name="timeEnd"
            control={control}
            render={({ field }) => (
              <TimePickerRaw value={field.value || ''} onChange={field.onChange} rounding={15}>
                {({ inputProps }) => (
                  <input
                    {...inputProps}
                    placeholder={t('placeholders.time-rent-a-car-end')}
                    className="w-full border-none bg-transparent p-0 text-start text-size-sm font-semibold focus:outline-none"
                  />
                )}
              </TimePickerRaw>
            )}
          />
        </div>

        {/* Arama Butonu */}
        <button
          type="submit"
          className="flex h-14 w-full shrink-0 items-center justify-center gap-x-2 bg-btn-primary px-6 font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover md:w-fit"
        >
          <Icon name="search" className="h-5 w-5" />
          <span>{t('search.rent-a-car')}</span>
        </button>
      </form>
    </section>
  )
}
