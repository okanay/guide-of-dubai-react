import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import { useLanguage } from '@/i18n/prodiver'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DropdownPortal } from '@/components/dropdown-portal'
import { useActivityStore } from './store'

interface SearchFormProps {
  initialData?: Partial<{
    date?: string
    adult?: number
    child?: number
  }>
}

// ============================================================================
// MAIN SEARCH FORM COMPONENT
// ============================================================================
export const SearchForm = ({ initialData }: SearchFormProps) => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { filters, setFilterValue } = useActivityStore()

  const [isParticipantOpen, setIsParticipantOpen] = useState(false)
  const participantTriggerRef = useRef<HTMLDivElement>(null)

  // Form gönderildiğinde
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const searchParams = Object.fromEntries(
      Object.entries(filters).filter(
        ([key, value]) => value !== undefined && key !== 'setFilterValue',
      ),
    )

    navigate({
      to: '/$lang/activities/search',
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
        {/* Date Picker */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">{t('labels.date')}</label>
          <DatePickerText
            value={filters.date ? parseISO(filters.date) : new Date()}
            onChange={(date) => setFilterValue('date', date ? format(date, 'yyyy-MM-dd') : '')}
            minDate={new Date()}
            className="w-full text-start text-size-sm font-semibold"
            dropdownClassName="mt-2.5 -ml-4"
          />
        </div>

        {/* Participants Selector */}
        <div
          ref={participantTriggerRef}
          className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:py-0 md:shadow-none"
        >
          <label className="text-xs font-medium text-gray-700">{t('labels.participants')}</label>
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
          <span>{t('actions.search_activities')}</span>
        </button>
      </form>
    </section>
  )
}

// ============================================================================
// DROPDOWN COMPONENTS
// ============================================================================

// Participants Dropdown Component
interface ParticipantsDropdownProps {
  isOpen: boolean
  triggerRef: any
  onClose: () => void
}

const ParticipantsDropdown = ({ isOpen, triggerRef, onClose }: ParticipantsDropdownProps) => {
  const { t } = useTranslation('global-form')
  const { filters, setFilterValue } = useActivityStore()

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
