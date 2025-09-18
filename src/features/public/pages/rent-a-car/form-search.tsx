import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { TimePickerRaw } from '@/features/public/components/form-ui/time-picker'
import { useLanguage } from '@/i18n/prodiver'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { useRentACarStore } from './store'

export const SearchForm = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { t } = useTranslation('global-form')
  const { filters, setFilterValue } = useRentACarStore()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const searchParams = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== undefined && key !== 'setFilterValue',
      ),
    )

    navigate({
      to: '/$lang/rent-a-car/search',
      params: { lang: language.value },
      search: searchParams,
      replace: true,
      resetScroll: true,
    })
  }

  return (
    <section className="bg-box-surface pb-4 md:py-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-main flex-col gap-y-4 border-b border-gray-200 bg-white p-4 md:flex-row md:items-center md:divide-x md:divide-gray-200 md:p-0 md:shadow"
      >
        {/* Pickup Date */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.pickup')} {t('labels.date')}
          </label>
          <DatePickerText
            value={parseISO(filters.dateStart)}
            onChange={(date) => setFilterValue('dateStart', date ? format(date, 'yyyy-MM-dd') : '')}
            minDate={new Date()}
            className="w-full text-start text-size-sm font-semibold"
            dropdownClassName="mt-2.5 -ml-4"
          />
        </div>

        {/* Pickup Time */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.pickup')} {t('labels.time')}
          </label>
          <TimePickerRaw
            value={filters.timeStart}
            onChange={(time) => setFilterValue('timeStart', time)}
            rounding={15}
          >
            {({ inputProps }) => (
              <input
                {...inputProps}
                placeholder={t('placeholders.time_format')}
                className="w-full border-none bg-transparent p-0 text-start text-size-sm font-semibold focus:outline-none"
              />
            )}
          </TimePickerRaw>
        </div>

        {/* Drop-off Date */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.dropoff')} {t('labels.date')}
          </label>
          <DatePickerText
            value={parseISO(filters.dateEnd)}
            onChange={(date) => setFilterValue('dateEnd', date ? format(date, 'yyyy-MM-dd') : '')}
            minDate={new Date()}
            className="w-full text-start text-size-sm font-semibold"
            dropdownClassName="mt-2.5 -ml-4"
          />
        </div>

        {/* Drop-off Time */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.dropoff')} {t('labels.time')}
          </label>
          <TimePickerRaw
            value={filters.timeEnd}
            onChange={(time) => setFilterValue('timeEnd', time)}
            rounding={15}
          >
            {({ inputProps }) => (
              <input
                {...inputProps}
                placeholder={t('placeholders.time_format')}
                className="w-full border-none bg-transparent p-0 text-start text-size-sm font-semibold focus:outline-none"
              />
            )}
          </TimePickerRaw>
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex h-14 w-full shrink-0 items-center justify-center gap-x-2 bg-btn-primary px-6 font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover md:w-fit"
        >
          <Icon name="search" className="h-5 w-5" />
          <span>{t('actions.search_cars')}</span>
        </button>
      </form>
    </section>
  )
}
