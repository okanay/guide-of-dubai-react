import Icon from '@/components/icon'
import { DatePickerText } from '@/features/public/components/form-ui/date-picker'
import { NumericStepper } from '@/features/public/components/form-ui/numeric-stepper'
import { useLanguage } from '@/i18n/prodiver'
import { activitySearchSchema } from '@/routes/$lang/_public/activities.route'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { format, parseISO } from 'date-fns'
import { useRef, useState } from 'react'
import { Control, Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { DropdownPortal } from '@/components/dropdown-portal'

// Formun tipini Zod şemasından türet
type SearchFormValues = z.infer<typeof activitySearchSchema>

interface SearchFormProps {
  initialData?: Partial<SearchFormValues>
}

// ============================================================================
// MAIN SEARCH FORM COMPONENT
// ============================================================================
export const SearchForm = ({ initialData }: SearchFormProps) => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [isParticipantOpen, setIsParticipantOpen] = useState(false)
  const participantTriggerRef = useRef<HTMLDivElement>(null)

  const { control, handleSubmit, watch } = useForm<SearchFormValues>({
    resolver: zodResolver(activitySearchSchema),
    defaultValues: {
      date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
      adult: initialData?.adult || 2,
      child: initialData?.child || 1,
    },
  })

  // Katılımcı sayısını anlık olarak izle
  const [adults, children] = watch(['adult', 'child'])

  // Form gönderildiğinde
  const onSubmit = (data: SearchFormValues) => {
    navigate({
      to: '/$lang/activities/search',
      params: {
        lang: language.value,
      },
      search: {
        date: data.date,
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
        {/* Tarih Seçici */}
        <div className="relative flex h-14 flex-1 flex-col items-start justify-center border-gray-200 px-4 py-2.5 text-start shadow md:border-r md:py-0 md:shadow-none">
          <label className="text-xs font-medium text-gray-700">
            {t('global-form:labels.date')}
          </label>
          <Controller
            name="date"
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

        {/* Katılımcı Seçici */}
        <div
          ref={participantTriggerRef}
          className="relative flex h-14 flex-1 flex-col items-start justify-center px-4 py-2.5 text-start shadow md:py-0 md:shadow-none"
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
          <span>{t('global-form:search.tour')}</span>
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
  control: Control<SearchFormValues>
}

const ParticipantsDropdown = ({
  isOpen,
  triggerRef,
  onClose,
  control,
}: ParticipantsDropdownProps) => {
  const { t } = useTranslation()

  return (
    <DropdownPortal
      isOpen={isOpen}
      triggerRef={triggerRef}
      onClose={onClose}
      placement="bottom-start"
      className="w-full max-w-[calc(100%_-_2rem)] rounded-xs border border-gray-200 bg-white shadow-xl md:max-w-[320px]"
    >
      <div className="flex flex-col gap-y-4 p-4">
        <Controller
          name="adult"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">
                {t('global-form:participants.adults')}
              </label>
              <NumericStepper
                value={field.value || 1}
                onChange={field.onChange}
                min={1}
                className="w-32"
              />
            </div>
          )}
        />
        <Controller
          name="child"
          control={control}
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">
                {t('global-form:participants.children')}
              </label>
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
