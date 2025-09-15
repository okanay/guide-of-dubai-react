import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { useLanguage } from '@/i18n/prodiver'
import { rentACarSearchSchema } from '@/routes/$lang/_public/rent-a-car.route'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

// Form tipini Zod şemasından türet
type SearchFormValues = z.infer<typeof rentACarSearchSchema>

interface SearchFormProps {
  initialData?: Partial<SearchFormValues>
}

// ============================================================================
// MAIN SEARCH FORM COMPONENT
// ============================================================================
export const SearchForm = ({ initialData }: SearchFormProps) => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { t } = useTranslation('global-form')

  // Search dropdown state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchTriggerRef = useRef<HTMLDivElement>(null)

  // Participants dropdown state
  const [isParticipantOpen, setIsParticipantOpen] = useState(false)
  const participantTriggerRef = useRef<HTMLDivElement>(null)

  const { control, handleSubmit, watch } = useForm<SearchFormValues>({
    resolver: zodResolver(rentACarSearchSchema),
    defaultValues: {
      dateStart: initialData?.dateStart || format(new Date(), 'yyyy-MM-dd'),
      dateEnd: initialData?.dateEnd || format(new Date(), 'yyyy-MM-dd'),
      timeStart: initialData?.timeStart || '',
      timeEnd: initialData?.timeEnd || '',
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
        {/* Tarih Başlangıç */}
        <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
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

        {/* Tarih Dönüş */}
        <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
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
