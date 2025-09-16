import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import { RadioGroup } from '@/features/public/components/form-ui/radio-input'
import { Checkbox } from '@/features/public/components/form-ui/checkbox'
import { useLanguage } from '@/i18n/prodiver'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { MapPin, ArrowUpDown, Building, Clock, X } from 'lucide-react'
import { useRef, useState, useMemo } from 'react'
import { Control, Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { DropdownPortal } from '@/components/dropdown-portal'
import { flightsFormSchema } from '@/routes/$lang/_public/flights.route'

type SearchFormValues = z.infer<typeof flightsFormSchema>

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

  // Dropdown states
  const [isFromOpen, setIsFromOpen] = useState(false)
  const [isToOpen, setIsToOpen] = useState(false)
  const [isPassengerOpen, setIsPassengerOpen] = useState(false)

  // Refs for dropdowns
  const fromTriggerRef = useRef<HTMLDivElement>(null)
  const toTriggerRef = useRef<HTMLDivElement>(null)
  const passengerTriggerRef = useRef<HTMLDivElement>(null)

  const { control, handleSubmit, setValue, reset } = useForm<SearchFormValues>({
    resolver: zodResolver(flightsFormSchema),
    defaultValues: {
      tripType: initialData?.tripType || 'round-trip',
      from: initialData?.from || '',
      to: initialData?.to || '',
      departureDate: initialData?.departureDate || format(new Date(), 'yyyy-MM-dd'),
      returnDate: initialData?.returnDate || format(new Date(), 'yyyy-MM-dd'),
      adults: initialData?.adults || 1,
      children: initialData?.children || 0,
      directFlightsOnly: initialData?.directFlightsOnly || false,
    },
  })

  // Watch specific fields
  const tripType = useWatch({ control, name: 'tripType' })
  const adults = useWatch({ control, name: 'adults' })
  const children = useWatch({ control, name: 'children' })
  const fromValue = useWatch({ control, name: 'from' })
  const toValue = useWatch({ control, name: 'to' })

  // Trip type options
  const tripTypeOptions = [
    { value: 'one-way', label: 'Tek Yön' },
    { value: 'round-trip', label: 'Gidiş - Dönüş' },
  ]

  // Trip type değiştiğinde return date'i temizle/ayarla
  const handleTripTypeChange = (newTripType: 'one-way' | 'round-trip') => {
    setValue('tripType', newTripType)
    if (newTripType === 'one-way') {
      setValue('returnDate', undefined)
    } else {
      setValue('returnDate', format(new Date(), 'yyyy-MM-dd'))
    }
  }

  // Swap locations function
  const handleSwapLocations = () => {
    const currentFrom = fromValue
    const currentTo = toValue
    setValue('from', currentTo)
    setValue('to', currentFrom)
  }

  const onSubmit = (data: SearchFormValues) => {
    navigate({
      to: '/$lang/flights/search',
      params: {
        lang: language.value,
      },
      search: {
        tripType: data.tripType,
        from: data.from,
        to: data.to,
        departureDate: data.departureDate,
        returnDate: data.returnDate,
        adults: data.adults,
        children: data.children,
        directFlightsOnly: data.directFlightsOnly,
      },
      resetScroll: false,
    })
  }

  return (
    <section className="bg-box-surface pb-4 md:py-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-main bg-white md:shadow">
        {/* Trip Type and Direct Flights Row */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <Controller
            name="tripType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="tripType"
                value={field.value}
                onChange={(value) => handleTripTypeChange(value as any)}
                options={tripTypeOptions}
                className="flex w-full flex-row flex-wrap space-y-0 gap-x-4"
              />
            )}
          />

          <Controller
            name="directFlightsOnly"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="direct-flights"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                label="Aktarmasız Uçuşlar"
                className="ml-4"
              />
            )}
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
              <label className="text-xs font-medium text-gray-700">Nereden</label>
              <Controller
                name="from"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <LocationInput
                      value={field.value || ''}
                      onChange={(value) => {
                        field.onChange(value)
                        setIsFromOpen(false)
                      }}
                      onFocus={() => setIsFromOpen(true)}
                      onClear={() => field.onChange('')}
                      placeholder="Kalkış noktası"
                    />

                    <LocationDropdown
                      isOpen={isFromOpen}
                      triggerRef={fromTriggerRef}
                      onClose={() => setIsFromOpen(false)}
                      onSelect={(airport) => {
                        const displayValue =
                          airport.type === 'city'
                            ? airport.name
                            : `${airport.city} (${airport.code})`
                        field.onChange(displayValue)
                        setIsFromOpen(false)
                      }}
                      searchValue={field.value || ''}
                      excludeValue={toValue}
                    />
                  </>
                )}
              />
            </div>

            {/* Swap Button - Only show for round-trip */}
            {tripType === 'round-trip' && (
              <div className="absolute top-1/2 right-4 z-20 -translate-y-[50%] md:top-auto md:right-auto md:left-1/2 md:-translate-x-[55%] md:translate-y-0">
                <button
                  type="button"
                  onClick={handleSwapLocations}
                  className="flex size-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800 md:size-10 md:h-8 md:w-8"
                  aria-label="Yerleri değiştir"
                >
                  <ArrowUpDown className="size-4 text-primary-500 md:size-4" />
                </button>
              </div>
            )}

            {/* To Location */}
            <div
              ref={toTriggerRef}
              className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 py-2.5 pr-4 pl-6 text-start shadow md:border-r md:py-0 md:shadow-none"
            >
              <label className="text-xs font-medium text-gray-700">Nereye</label>
              <Controller
                name="to"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <LocationInput
                      value={field.value || ''}
                      onChange={(value) => {
                        field.onChange(value)
                        setIsToOpen(false)
                      }}
                      onFocus={() => setIsToOpen(true)}
                      onClear={() => field.onChange('')}
                      placeholder="Varış noktası"
                    />

                    <LocationDropdown
                      isOpen={isToOpen}
                      triggerRef={toTriggerRef}
                      onClose={() => setIsToOpen(false)}
                      onSelect={(airport) => {
                        const displayValue =
                          airport.type === 'city'
                            ? airport.name
                            : `${airport.city} (${airport.code})`
                        field.onChange(displayValue)
                        setIsToOpen(false)
                      }}
                      searchValue={field.value || ''}
                      excludeValue={fromValue}
                    />
                  </>
                )}
              />
            </div>
          </div>

          {/* Departure Date */}
          <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 py-2.5 pl-4 text-start shadow md:border-r md:py-0 md:shadow-none">
            <label className="text-xs font-medium text-gray-700">Gidiş Tarihi</label>
            <Controller
              name="departureDate"
              control={control}
              render={({ field }) => (
                <DatePickerText
                  value={field.value ? parseISO(field.value) : new Date()}
                  onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                  minDate={new Date()}
                  className="w-full text-start text-size-sm font-semibold"
                  dropdownClassName="mt-2.5 -ml-4"
                />
              )}
            />
          </div>

          {/* Return Date - Only show for round-trip */}
          {tripType === 'round-trip' && (
            <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
              <label className="text-xs font-medium text-gray-700">Dönüş Tarihi</label>
              <Controller
                name="returnDate"
                control={control}
                render={({ field }) => (
                  <DatePickerText
                    value={field.value ? parseISO(field.value) : new Date()}
                    onChange={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    minDate={new Date()}
                    className="w-full text-start text-size-sm font-semibold"
                    dropdownClassName="mt-2.5 -ml-4"
                  />
                )}
              />
            </div>
          )}

          {/* Passenger Selection */}
          <div
            ref={passengerTriggerRef}
            className="relative flex h-14 min-w-[200px] flex-col items-start justify-center px-4 py-2.5 text-start shadow md:py-0 md:shadow-none"
          >
            <label className="text-xs font-medium text-gray-700">Yolcular</label>
            <button
              type="button"
              onClick={() => setIsPassengerOpen(!isPassengerOpen)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-size-sm font-semibold">
                {`${adults} Yetişkin${children! > 0 ? `, ${children} Çocuk` : ''}`}
              </span>
            </button>

            <PassengerDropdown
              isOpen={isPassengerOpen}
              triggerRef={passengerTriggerRef}
              onClose={() => setIsPassengerOpen(false)}
              control={control}
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="flex h-14 w-full shrink-0 items-center justify-center gap-x-2 bg-btn-primary px-6 font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover md:w-fit"
          >
            <Icon name="search" className="h-5 w-5" />
            <span>Uçuş Ara</span>
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
    <div className="relative w-full">
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
  const filteredAirports = []

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
            <p className="font-medium">Sonuç bulunamadı</p>
            <p className="mt-1">"{searchValue}" için sonuç bulunamadı</p>
          </div>
        )}

        {filteredAirports.length === 0 && searchValue.trim().length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p>Yazmaya başlayın</p>
            <p className="mt-1 text-xs">Havaalanı veya şehir adı yazın</p>
          </div>
        )}
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
  control: Control<SearchFormValues>
}

const PassengerDropdown = ({ isOpen, triggerRef, onClose, control }: PassengerDropdownProps) => {
  return (
    <DropdownPortal
      isOpen={isOpen}
      triggerRef={triggerRef}
      onClose={onClose}
      placement="bottom-end"
      className="w-full max-w-[calc(100%_-_2rem)] rounded-xs border border-gray-200 bg-white shadow-xl md:max-w-[320px]"
    >
      <div className="flex flex-col gap-y-4 p-4">
        <Controller
          name="adults"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-black">Yetişkin</label>
                <p className="text-xs text-gray-500">12 yaş üstü</p>
              </div>
              <NumericStepper
                value={field.value || 1}
                onChange={field.onChange}
                min={1}
                max={9}
                className="w-32"
              />
            </div>
          )}
        />

        <Controller
          name="children"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-black">Çocuk</label>
                <p className="text-xs text-gray-500">2-12 yaş arası</p>
              </div>
              <NumericStepper
                value={field.value || 0}
                onChange={field.onChange}
                min={0}
                max={8}
                className="w-32"
              />
            </div>
          )}
        />
      </div>
    </DropdownPortal>
  )
}
