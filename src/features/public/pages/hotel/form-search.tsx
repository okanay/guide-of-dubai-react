import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import { useLanguage } from '@/i18n/prodiver'
import { hotelsSearchSchema } from '@/routes/$lang/_public/hotels.route'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { Building, Clock, MapPin, Star, X } from 'lucide-react'
import { useRef, useState, useMemo } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { DropdownPortal } from '@/components/dropdown-portal'

// Form tipini Zod şemasından türet
type SearchFormValues = z.infer<typeof hotelsSearchSchema>

interface SearchFormProps {
  initialData?: Partial<SearchFormValues>
}

// Mock suggestions - gerçek uygulamada API'den gelecek
const mockSuggestions = [
  { id: 'recent-1', name: 'Dubai Marina', type: 'recent' },
  { id: 'recent-2', name: 'Burj Al Arab', type: 'recent' },
  {
    id: 'hotel-1',
    name: 'Burj Al Arab Jumeirah',
    type: 'hotel',
    location: 'Dubai, UAE',
    rating: 5,
  },
  { id: 'hotel-2', name: 'Atlantis The Palm', type: 'hotel', location: 'Dubai, UAE', rating: 5 },
  {
    id: 'hotel-3',
    name: 'Four Seasons Hotel Istanbul',
    type: 'hotel',
    location: 'Istanbul, Turkey',
    rating: 5,
  },
  { id: 'location-1', name: 'Istanbul', type: 'location', country: 'Türkiye' },
  { id: 'location-2', name: 'Antalya', type: 'location', country: 'Türkiye' },
  { id: 'location-3', name: 'Dubai', type: 'location', country: 'UAE' },
]

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
    resolver: zodResolver(hotelsSearchSchema),
    defaultValues: {
      search: initialData?.search || '',
      dateStart: initialData?.dateStart || format(new Date(), 'yyyy-MM-dd'),
      dateEnd: initialData?.dateEnd || format(new Date(), 'yyyy-MM-dd'),
      adult: initialData?.adult || 2,
      child: initialData?.child || 1,
    },
  })

  const [adults, children, searchValue] = watch(['adult', 'child', 'search'])

  // Search değeri değiştiğinde filtreleme yap
  const filteredSuggestions = useMemo(() => {
    if (!searchValue || searchValue.trim().length === 0) {
      // Arama değeri boşsa son aramaları göster
      return mockSuggestions.filter((item) => item.type === 'recent')
    }

    const trimmedSearch = searchValue.trim().toLowerCase()

    return mockSuggestions.filter(
      (item) =>
        item.name.toLowerCase().includes(trimmedSearch) ||
        (item.type === 'hotel' && item.location?.toLowerCase().includes(trimmedSearch)) ||
        (item.type === 'location' && item.country?.toLowerCase().includes(trimmedSearch)),
    )
  }, [searchValue])

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
        <div
          ref={searchTriggerRef}
          className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none"
        >
          <label className="text-xs font-medium text-gray-700">{t('labels.search-otel')}</label>
          <Controller
            name="search"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                      if (!isSearchOpen) {
                        setIsSearchOpen(true)
                      }
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={(e) => {
                      const relatedTarget = e.relatedTarget as HTMLElement
                      if (!relatedTarget?.closest('[data-search-dropdown]')) {
                        setTimeout(() => setIsSearchOpen(false), 200)
                      }
                    }}
                    placeholder={t('placeholders.search-hotel')}
                    className="w-full border-none bg-transparent pr-6 text-start text-size-sm font-semibold focus:outline-none"
                    autoComplete="off"
                  />

                  {field.value && (
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('')
                        setIsSearchOpen(true) // Temizleme sonrası dropdown'ı aç
                      }}
                      className="absolute top-1/2 right-0 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Search Suggestions Dropdown */}
                <SearchSuggestionsDropdown
                  isOpen={isSearchOpen}
                  triggerRef={searchTriggerRef}
                  onClose={() => setIsSearchOpen(false)}
                  onSelect={(suggestion) => {
                    field.onChange(suggestion.name)
                    setIsSearchOpen(false)
                  }}
                  suggestions={filteredSuggestions}
                  searchValue={field.value || ''}
                  hasError={!!fieldState.error}
                />
              </>
            )}
          />
        </div>

        {/* Tarih Başlangıç */}
        <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.date-hotel-start')}
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
          <label className="text-xs font-medium text-gray-700">{t('labels.date-hotel-end')}</label>
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

        {/* Katılımcı Seçici */}
        <div
          ref={participantTriggerRef}
          className="relative flex h-14 min-w-[200px] flex-col items-start justify-center px-4 py-2.5 text-start shadow md:py-0 md:shadow-none"
        >
          <label className="text-xs font-medium text-gray-700">
            {t('labels.participants-hotel')}
          </label>
          <button
            type="button"
            onClick={() => setIsParticipantOpen(!isParticipantOpen)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-size-sm font-semibold">
              {`${adults} ${t('participants.adults')}, ${children} ${t('participants.children')}`}
            </span>
          </button>

          {/* Participants Dropdown */}
          <ParticipantsDropdown
            isOpen={isParticipantOpen}
            triggerRef={participantTriggerRef}
            onClose={() => setIsParticipantOpen(false)}
            control={control}
          />
        </div>

        {/* Arama Butonu */}
        <button
          type="submit"
          className="flex h-14 w-full shrink-0 items-center justify-center gap-x-2 bg-btn-primary px-6 font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover md:w-fit"
        >
          <Icon name="search" className="h-5 w-5" />
          <span>{t('search.hotel')}</span>
        </button>
      </form>
    </section>
  )
}

// ============================================================================
// DROPDOWN COMPONENTS
// ============================================================================

// Search Suggestions Dropdown Component
interface SearchSuggestionsDropdownProps {
  isOpen: boolean
  triggerRef: any
  onClose: () => void
  onSelect: (suggestion: any) => void
  suggestions: typeof mockSuggestions
  searchValue: string
  hasError?: boolean
}

const SearchSuggestionsDropdown = ({
  isOpen,
  triggerRef,
  onClose,
  onSelect,
  suggestions,
  searchValue,
  hasError = false,
}: SearchSuggestionsDropdownProps) => {
  const { t } = useTranslation('global-form')

  // Dropdown açık değilse render etme
  if (!isOpen) return null

  return (
    <DropdownPortal
      isOpen={isOpen}
      triggerRef={triggerRef}
      onClose={onClose}
      className="w-full max-w-[calc(100%_-_2rem)] rounded-xs border border-gray-200 bg-white shadow-xl md:max-w-[480px]"
    >
      <div className="py-1" data-search-dropdown>
        {/* Sonuç bulunamadı mesajı */}
        {suggestions.length === 0 && searchValue.trim().length > 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="font-medium">{t('suggestions.no-results-title')}</p>
            <p className="mt-1">{t('suggestions.no-results-description', { searchValue })}</p>
          </div>
        )}

        {/* Suggestions listesi */}
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.id}
            type="button"
            onClick={() => {
              onSelect(suggestion)
            }}
            onMouseDown={(e) => {
              e.preventDefault()
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            tabIndex={0}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {suggestion.type === 'hotel' && <Building className="h-4 w-4 text-blue-500" />}
              {suggestion.type === 'location' && <MapPin className="h-4 w-4 text-green-500" />}
              {suggestion.type === 'recent' && <Clock className="h-4 w-4 text-gray-400" />}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-black">
                {highlightSearchTerm(suggestion.name, searchValue)}
              </div>

              {suggestion.type === 'hotel' && suggestion.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>{suggestion.location}</span>
                  {suggestion.rating && (
                    <>
                      <span>•</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{suggestion.rating}</span>
                    </>
                  )}
                </div>
              )}

              {suggestion.type === 'location' && suggestion.country && (
                <div className="text-xs text-gray-500">{suggestion.country}</div>
              )}

              {suggestion.type === 'recent' && (
                <div className="text-xs text-gray-500">{t('suggestions.recent-search')}</div>
              )}
            </div>

            {/* Badge */}
            <div className="flex-shrink-0">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-900 capitalize">
                {t(`suggestions.types.${suggestion.type}`)}
              </span>
            </div>
          </button>
        ))}

        {/* Arama değeri boşken gösterilecek mesaj */}
        {suggestions.length === 0 && searchValue.trim().length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p>{t('suggestions.start-typing-title')}</p>
            <p className="mt-1 text-xs">{t('suggestions.start-typing-description')}</p>
          </div>
        )}
      </div>
    </DropdownPortal>
  )
}

// Arama terimini vurgulama fonksiyonu
const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm.trim()})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className="bg-yellow-200 font-semibold">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

// Participants Dropdown Component
interface ParticipantsDropdownProps {
  isOpen: boolean
  triggerRef: any
  onClose: () => void
  control: Control<SearchFormValues>
}

const ParticipantsDropdown = ({
  isOpen,
  triggerRef,
  onClose,
  control,
}: ParticipantsDropdownProps) => {
  const { t } = useTranslation('global-form')

  return (
    <DropdownPortal
      isOpen={isOpen}
      triggerRef={triggerRef}
      onClose={onClose}
      placement="bottom-end"
      className="w-full max-w-[calc(100%_-_2rem)] rounded-xs border border-gray-200 bg-white shadow-xl md:max-w-[320px]"
    >
      <div className="flex flex-col gap-y-4 p-4">
        {/* Adults Counter */}
        <Controller
          name="adult"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">{t('participants.adults')}</label>
              <NumericStepper
                value={field.value || 1}
                onChange={field.onChange}
                min={1}
                className="w-32"
              />
            </div>
          )}
        />

        {/* Children Counter */}
        <Controller
          name="child"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">{t('participants.children')}</label>
              <NumericStepper
                value={field.value || 0}
                onChange={field.onChange}
                min={0}
                className="w-32"
              />
            </div>
          )}
        />
      </div>
    </DropdownPortal>
  )
}
