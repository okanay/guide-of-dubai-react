import { DropdownPortal } from '@/components/dropdown-portal'
import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import { useLanguage } from '@/i18n/prodiver'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { Clock, MapPin, X, Building, Star, Bed } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHotelStore } from './store'

interface HotelSuggestion {
  id: string
  name: string
  type: 'hotel' | 'location' | 'recent'
  location?: string
  stars?: number
  rating?: number
  priceFrom?: number
  description?: string
  isPopular?: boolean
}

// ============================================================================
// MAIN SEARCH FORM COMPONENT
// ============================================================================
export const SearchForm = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { t } = useTranslation('global-form')
  const { filters, setFilterValue } = useHotelStore()

  // Search dropdown state
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchTriggerRef = useRef<HTMLDivElement>(null)

  // Participants dropdown state
  const [isParticipantOpen, setIsParticipantOpen] = useState(false)
  const participantTriggerRef = useRef<HTMLDivElement>(null)

  // Search değeri değiştiğinde filtreleme yap
  const filteredSuggestions = useMemo(() => {
    return []
  }, [filters.search])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const searchParams = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== undefined && key !== 'setFilterValue',
      ),
    )

    navigate({
      to: '/$lang/hotels/search',
      params: {
        lang: language.value,
      },
      search: searchParams,
      resetScroll: false,
    })
  }

  return (
    <section className="bg-box-surface pb-4 md:py-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-main flex-col gap-y-4 border-b border-gray-200 bg-white p-4 md:flex-row md:items-center md:p-0 md:shadow"
      >
        {/* Search Input */}
        <div
          ref={searchTriggerRef}
          className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none"
        >
          <label className="text-xs font-medium text-gray-700">{t('labels.search')}</label>

          <div className="relative -mt-1.5 w-full">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => {
                setFilterValue('search', e.target.value)
                if (!isSearchOpen) {
                  setIsSearchOpen(true)
                }
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={t('placeholders.search_hotel')}
              className="w-full border-none bg-transparent pr-6 text-start text-size-sm font-semibold focus:outline-none"
              autoComplete="off"
            />

            {filters.search && (
              <button
                type="button"
                onClick={() => {
                  setFilterValue('search', '')
                  setIsSearchOpen(true)
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
              setFilterValue('search', suggestion.name)
              setIsSearchOpen(false)
            }}
            suggestions={filteredSuggestions}
            searchValue={filters.search}
          />
        </div>

        {/* Check-in Date */}
        <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">{t('labels.checkin')}</label>
          <DatePickerText
            value={filters.dateStart ? parseISO(filters.dateStart) : new Date()}
            onChange={(dateStart) =>
              setFilterValue('dateStart', dateStart ? format(dateStart, 'yyyy-MM-dd') : '')
            }
            minDate={new Date()}
            className="w-full text-start text-size-sm font-semibold"
            dropdownClassName="mt-2.5 -ml-4"
          />
        </div>

        {/* Check-out Date */}
        <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">{t('labels.checkout')}</label>
          <DatePickerText
            value={filters.dateEnd ? parseISO(filters.dateEnd) : new Date()}
            onChange={(dateEnd) =>
              setFilterValue('dateEnd', dateEnd ? format(dateEnd, 'yyyy-MM-dd') : '')
            }
            minDate={new Date()}
            className="w-full text-start text-size-sm font-semibold"
            dropdownClassName="mt-2.5 -ml-4"
          />
        </div>

        {/* Guests Selector */}
        <div
          ref={participantTriggerRef}
          className="relative flex h-14 min-w-[200px] flex-col items-start justify-center px-4 py-2.5 text-start shadow md:py-0 md:shadow-none"
        >
          <label className="text-xs font-medium text-gray-700">{t('labels.guests')}</label>
          <button
            type="button"
            onClick={() => setIsParticipantOpen(!isParticipantOpen)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="text-size-sm font-semibold">
              {`${filters.adult} ${t('participants.adults')}, ${filters.child} ${t('participants.children')}`}
            </span>
          </button>

          {/* Participants Dropdown */}
          <ParticipantsDropdown
            isOpen={isParticipantOpen}
            triggerRef={participantTriggerRef}
            onClose={() => setIsParticipantOpen(false)}
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="flex h-14 w-full shrink-0 items-center justify-center gap-x-2 bg-btn-primary px-6 font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover md:w-fit"
        >
          <Icon name="search" className="h-5 w-5" />
          <span>{t('actions.search_hotels')}</span>
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
  onSelect: (suggestion: HotelSuggestion) => void
  suggestions: HotelSuggestion[]
  searchValue: string
}

const SearchSuggestionsDropdown = ({
  isOpen,
  triggerRef,
  onClose,
  onSelect,
  suggestions,
  searchValue,
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
            <Building className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="font-medium">{t('suggestions.no_results.title')}</p>
            <p className="mt-1">{t('suggestions.no_results.description', { searchValue })}</p>
          </div>
        )}

        {/* Arama değeri boşken gösterilecek mesaj */}
        {suggestions.length === 0 && searchValue.trim().length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            <Clock className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p>{t('suggestions.start_typing.title')}</p>
            <p className="mt-1 text-xs">{t('suggestions.start_typing.description')}</p>
          </div>
        )}

        {/* Popüler destinasyonlar/oteller başlığı (arama boşken) */}
        {searchValue.trim().length === 0 && suggestions.length > 0 && (
          <div className="px-4 py-2">
            <h4 className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
              {t('suggestions.popular_hotels')}
            </h4>
          </div>
        )}

        {/* Öneriler listesi */}
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion)}
            className="w-full border-b border-gray-50 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary-50">
                  {suggestion.type === 'hotel' ? (
                    <Building className="h-5 w-5 text-primary-500" />
                  ) : (
                    <MapPin className="h-5 w-5 text-primary-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{suggestion.name}</p>
                    {suggestion.stars && (
                      <div className="flex items-center">
                        {Array.from({ length: suggestion.stars }, (_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>

                  {suggestion.type === 'hotel' && suggestion.location && (
                    <div className="mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{suggestion.location}</span>
                    </div>
                  )}

                  {suggestion.description && (
                    <p className="mt-1 text-xs text-gray-500">{suggestion.description}</p>
                  )}

                  {suggestion.rating && suggestion.priceFrom && (
                    <div className="mt-1 flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Icon name="star" className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">{suggestion.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-600">
                          ${suggestion.priceFrom}+ {t('labels.per_night')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                {t(`suggestions.types.${suggestion.type}`)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </DropdownPortal>
  )
}

// Participants Dropdown Component
interface ParticipantsDropdownProps {
  isOpen: boolean
  triggerRef: any
  onClose: () => void
}

const ParticipantsDropdown = ({ isOpen, triggerRef, onClose }: ParticipantsDropdownProps) => {
  const { t } = useTranslation('global-form')
  const { filters, setFilterValue } = useHotelStore()

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
            value={filters.adult}
            onChange={(value) => setFilterValue('adult', value)}
            min={1}
            className="w-32"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-black">{t('participants.children')}</label>
          <NumericStepper
            value={filters.child}
            onChange={(value) => setFilterValue('child', value)}
            min={0}
            className="w-32"
          />
        </div>
      </div>
    </DropdownPortal>
  )
}
