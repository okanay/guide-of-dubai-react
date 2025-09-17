import { DropdownPortal } from '@/components/dropdown-portal'
import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import { useLanguage } from '@/i18n/prodiver'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { Clock, MapPin, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHotelStore } from './store'

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
        {/* Arama Kelimesi */}
        <div
          ref={searchTriggerRef}
          className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none"
        >
          <label className="text-xs font-medium text-gray-700">{t('labels.search-otel')}</label>

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

            {filters.search && (
              <button
                type="button"
                onClick={() => {
                  setFilterValue('search', '')
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
              setFilterValue('search', suggestion.name)
              setIsSearchOpen(false)
            }}
            suggestions={filteredSuggestions}
            searchValue={filters.search}
          />
        </div>

        {/* Tarih Başlangıç */}
        <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('labels.date-hotel-start')}
          </label>
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

        {/* Tarih Dönüş */}
        <div className="relative flex h-14 min-w-[200px] flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">{t('labels.date-hotel-end')}</label>
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
  suggestions: unknown[]
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
            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="font-medium">{t('suggestions.no-results-title')}</p>
            <p className="mt-1">{t('suggestions.no-results-description', { searchValue })}</p>
          </div>
        )}

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
      placement="bottom-end"
      className="w-full max-w-[calc(100%_-_2rem)] rounded-xs border border-gray-200 bg-white shadow-xl md:max-w-[320px]"
    >
      <div className="flex flex-col gap-y-4 p-4">
        {/* Adults Counter */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-black">{t('participants.adults')}</label>
          <NumericStepper
            value={filters.adult}
            onChange={(value) => setFilterValue('adult', value)}
            min={1}
            className="w-32"
          />
        </div>

        {/* Children Counter */}
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
