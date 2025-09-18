import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import { RadioGroup } from '@/features/public/components/form-ui/radio-input'
import { Checkbox } from '@/features/public/components/form-ui/checkbox'
import { useLanguage } from '@/i18n/prodiver'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO, subDays } from 'date-fns'
import { MapPin, ArrowUpDown, Clock, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownPortal } from '@/components/dropdown-portal'
import { useFlightStore } from './store'

interface SearchFormProps {
  initialData?: Partial<{
    tripType?: 'one-way' | 'round-trip'
    from?: string
    to?: string
    departureDate?: string
    returnDate?: string
    adults?: number
    children?: number
    directFlightsOnly?: boolean
  }>
}

// ============================================================================
// MAIN SEARCH FORM COMPONENT
// ============================================================================
export const SearchForm = ({ initialData }: SearchFormProps) => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { t } = useTranslation('global-form')
  const { filters, setFilterValue } = useFlightStore()

  // Dropdown states
  const [isFromOpen, setIsFromOpen] = useState(false)
  const [isToOpen, setIsToOpen] = useState(false)
  const [isPassengerOpen, setIsPassengerOpen] = useState(false)

  // Refs for dropdowns
  const fromTriggerRef = useRef<HTMLDivElement>(null)
  const toTriggerRef = useRef<HTMLDivElement>(null)
  const passengerTriggerRef = useRef<HTMLDivElement>(null)

  // Trip type options
  const tripTypeOptions = [
    { value: 'one-way', label: t('flight.one_way') },
    { value: 'round-trip', label: t('flight.round_trip') },
  ]

  // Trip type değiştiğinde return date'i temizle/ayarla
  const handleTripTypeChange = (newTripType: 'one-way' | 'round-trip') => {
    setFilterValue('tripType', newTripType)
    if (newTripType === 'one-way') {
      setFilterValue('returnDate', undefined)
    } else {
      setFilterValue('returnDate', format(new Date(), 'yyyy-MM-dd'))
    }
  }

  // Swap locations function
  const handleSwapLocations = () => {
    const currentFrom = filters.from
    const currentTo = filters.to
    setFilterValue('from', currentTo)
    setFilterValue('to', currentFrom)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const searchParams = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== undefined && key !== 'setFilterValue',
      ),
    )

    navigate({
      to: '/$lang/flights/search',
      params: {
        lang: language.value,
      },
      search: searchParams,
      resetScroll: false,
    })
  }

  return (
    <section className="bg-box-surface pb-4 md:py-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-main bg-white md:shadow">
        {/* Trip Type and Options Row */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <RadioGroup
            name="tripType"
            value={filters.tripType}
            onChange={(value) => handleTripTypeChange(value as 'one-way' | 'round-trip')}
            options={[
              { value: 'one-way', label: t('options.trip_types.one_way') },
              { value: 'round-trip', label: t('options.trip_types.round_trip') },
            ]}
            className="flex w-full flex-row flex-wrap space-y-0 gap-x-4"
          />

          <Checkbox
            id="direct-flights"
            checked={filters.directFlightsOnly}
            onChange={(e) => setFilterValue('directFlightsOnly', e.target.checked)}
            label={t('options.direct_flights_only')}
            className="ml-4"
          />
        </div>

        {/* Main Search Fields */}
        <div className="flex flex-col gap-y-4 p-4 md:flex-row md:items-center md:gap-y-0 md:p-0">
          <div className="relative flex flex-1 flex-col gap-y-4 md:flex-row md:items-center md:gap-y-0 md:p-0">
            {/* From Location */}
            <div
              ref={fromTriggerRef}
              className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 py-2.5 pr-6 pl-4 text-start shadow md:border-r md:py-0 md:shadow-none"
            >
              <label className="text-xs font-medium text-gray-700">{t('labels.from')}</label>
              <LocationInput
                value={filters.from}
                onChange={(value) => {
                  setFilterValue('from', value)
                  setIsFromOpen(true)
                }}
                onFocus={() => setIsFromOpen(true)}
                onClear={() => setFilterValue('from', '')}
                placeholder={t('placeholders.departure_point')}
              />

              <LocationDropdown
                isOpen={isFromOpen}
                triggerRef={fromTriggerRef}
                onClose={() => setIsFromOpen(false)}
                onSelect={(airport) => {
                  const displayValue =
                    airport.type === 'city' ? airport.name : `${airport.city} (${airport.code})`
                  setFilterValue('from', displayValue)
                  setIsFromOpen(false)
                }}
                searchValue={filters.from}
                excludeValue={filters.to}
              />
            </div>

            {/* Swap Button */}
            <div className="absolute top-1/2 right-4 z-20 -translate-y-[50%] md:top-auto md:right-auto md:left-1/2 md:-translate-x-[55%] md:translate-y-0">
              <button
                type="button"
                onClick={handleSwapLocations}
                className="flex size-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800 md:size-10 md:h-8 md:w-8"
                aria-label={t('actions.swap_locations')}
              >
                <ArrowUpDown className="size-4 text-primary-500 md:size-4" />
              </button>
            </div>

            {/* To Location */}
            <div
              ref={toTriggerRef}
              className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 py-2.5 pr-4 pl-6 text-start shadow md:border-r md:py-0 md:shadow-none"
            >
              <label className="text-xs font-medium text-gray-700">{t('labels.to')}</label>
              <LocationInput
                value={filters.to}
                onChange={(value) => {
                  setFilterValue('to', value)
                  setIsToOpen(true)
                }}
                onFocus={() => setIsToOpen(true)}
                onClear={() => setFilterValue('to', '')}
                placeholder={t('placeholders.arrival_point')}
              />

              <LocationDropdown
                isOpen={isToOpen}
                triggerRef={toTriggerRef}
                onClose={() => setIsToOpen(false)}
                onSelect={(airport) => {
                  const displayValue =
                    airport.type === 'city' ? airport.name : `${airport.city} (${airport.code})`
                  setFilterValue('to', displayValue)
                  setIsToOpen(false)
                }}
                searchValue={filters.to}
                excludeValue={filters.from}
              />
            </div>
          </div>

          {/* Departure Date */}
          <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 py-2.5 pl-4 text-start shadow md:border-r md:py-0 md:shadow-none">
            <label className="text-xs font-medium text-gray-700">{t('labels.departure')}</label>
            <DatePickerText
              value={filters.departureDate ? parseISO(filters.departureDate) : new Date()}
              onChange={(date) =>
                setFilterValue('departureDate', date ? format(date, 'yyyy-MM-dd') : '')
              }
              minDate={subDays(new Date(), 1)}
              className="w-full text-start text-size-sm font-semibold"
              dropdownClassName="mt-2.5 -ml-4"
            />
          </div>

          {/* Return Date - Only show for round-trip */}
          {filters.tripType === 'round-trip' && (
            <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
              <label className="text-xs font-medium text-gray-700">{t('labels.arrival')}</label>
              <DatePickerText
                value={filters.returnDate ? parseISO(filters.returnDate) : new Date()}
                onChange={(date) =>
                  setFilterValue('returnDate', date ? format(date, 'yyyy-MM-dd') : '')
                }
                minDate={subDays(new Date(), 1)}
                className="w-full text-start text-size-sm font-semibold"
                dropdownClassName="mt-2.5 -ml-4"
              />
            </div>
          )}

          {/* Passenger Selection */}
          <div
            ref={passengerTriggerRef}
            className="relative flex h-14 min-w-[200px] flex-col items-start justify-center px-4 py-2.5 text-start shadow md:py-0 md:shadow-none"
          >
            <label className="text-xs font-medium text-gray-700">{t('labels.passengers')}</label>
            <button
              type="button"
              onClick={() => setIsPassengerOpen(!isPassengerOpen)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-size-sm font-semibold">
                {`${filters.adults} ${t('participants.adults')}${filters.children > 0 ? `, ${filters.children} ${t('participants.children')}` : ''}`}
              </span>
            </button>

            <PassengerDropdown
              isOpen={isPassengerOpen}
              triggerRef={passengerTriggerRef}
              onClose={() => setIsPassengerOpen(false)}
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex h-14 w-full shrink-0 items-center justify-center gap-x-2 bg-btn-primary px-6 font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover md:w-fit"
          >
            <Icon name="search" className="h-5 w-5" />
            <span>{t('actions.search_flights')}</span>
          </button>
        </div>
      </form>
    </section>
  )
}

// ============================================================================
// LOCATION INPUT COMPONENT
// ============================================================================
interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  onFocus: () => void
  onClear: () => void
  placeholder: string
}

const LocationInput = ({ value, onChange, onFocus, onClear, placeholder }: LocationInputProps) => {
  return (
    <div className="relative -mt-1.5 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-start text-size-sm font-semibold focus:outline-none"
        autoComplete="off"
      />

      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ============================================================================
// LOCATION DROPDOWN COMPONENT
// ============================================================================
interface LocationDropdownProps {
  isOpen: boolean
  triggerRef: any
  onClose: () => void
  onSelect: (airport: any) => void
  searchValue: string
  excludeValue?: string
}

const LocationDropdown = ({
  isOpen,
  triggerRef,
  onClose,
  onSelect,
  searchValue,
  excludeValue = '',
}: LocationDropdownProps) => {
  const { t } = useTranslation('global-form')
  const filteredAirports: any[] = []

  if (!isOpen) return null

  return (
    <DropdownPortal
      isOpen={isOpen}
      triggerRef={triggerRef}
      onClose={onClose}
      className="w-full max-w-[calc(100%_-_2rem)] rounded-xs border border-gray-200 bg-white shadow-xl md:max-w-[480px]"
    >
      <div className="py-1">
        {filteredAirports.length === 0 && searchValue.trim().length > 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="font-medium">{t('suggestions.no_results.title')}</p>
            <p className="mt-1">{t('suggestions.no_results.description', { searchValue })}</p>
          </div>
        )}

        {filteredAirports.length === 0 && searchValue.trim().length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p>{t('suggestions.start_typing.title')}</p>
            <p className="mt-1 text-xs">{t('suggestions.start_typing.description')}</p>
          </div>
        )}

        {/* Popular Destinations when no search */}
        {filteredAirports.length === 0 && searchValue.trim().length === 0 && (
          <div className="px-4 py-2">
            <h4 className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
              {t('suggestions.popular_destinations')}
            </h4>
            {/* Example popular destinations */}
            {[
              { code: 'IST', name: 'Istanbul', city: 'Istanbul', country: 'Turkey' },
              { code: 'DXB', name: 'Dubai', city: 'Dubai', country: 'UAE' },
              { code: 'LHR', name: 'London', city: 'London', country: 'UK' },
            ].map((airport) => (
              <button
                key={airport.code}
                onClick={() => onSelect(airport)}
                className="flex w-full items-center gap-3 rounded px-2 py-2 text-left hover:bg-gray-50"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                  <span className="text-xs font-medium text-gray-600">{airport.code}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{airport.city}</p>
                  <p className="text-xs text-gray-500">
                    {airport.name}, {airport.country}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{t('suggestions.types.airport')}</span>
              </button>
            ))}
          </div>
        )}

        {/* Render filtered airports here when search results exist */}
        {filteredAirports.map((airport) => (
          <button
            key={airport.code}
            onClick={() => onSelect(airport)}
            className="w-full border-b border-gray-50 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                  <span className="text-sm font-medium text-gray-600">{airport.code}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{airport.city}</p>
                  <p className="text-xs text-gray-500">{airport.name}</p>
                </div>
              </div>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-400">
                {t(`suggestions.types.${airport.type || 'airport'}`)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </DropdownPortal>
  )
}

// ============================================================================
// PASSENGER DROPDOWN COMPONENT
// ============================================================================
interface PassengerDropdownProps {
  isOpen: boolean
  triggerRef: any
  onClose: () => void
}

const PassengerDropdown = ({ isOpen, triggerRef, onClose }: PassengerDropdownProps) => {
  const { t } = useTranslation('global-form')
  const { filters, setFilterValue } = useFlightStore()

  return (
    <DropdownPortal
      isOpen={isOpen}
      triggerRef={triggerRef}
      onClose={onClose}
      placement="bottom-start"
      className="w-full max-w-[calc(100%_-_2rem)] rounded-xs border border-gray-200 bg-white shadow-xl md:max-w-[320px]"
    >
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-black">{t('participants.adults')}</label>
          <NumericStepper
            value={filters.adults}
            onChange={(value) => setFilterValue('adults', value)}
            min={1}
            className="w-32"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-black">{t('participants.children')}</label>
          <NumericStepper
            value={filters.children}
            onChange={(value) => setFilterValue('children', value)}
            min={0}
            className="w-32"
          />
        </div>
      </div>
    </DropdownPortal>
  )
}
