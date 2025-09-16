import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Calendar, ChevronLeft, ChevronRight, ArrowRight, X } from 'lucide-react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  isAfter,
  isBefore,
  isWithinInterval,
} from 'date-fns'
import { BaseInput } from './base-input'
import { DropdownPortal } from '@/components/dropdown-portal'
import { useLanguage } from 'src/i18n/prodiver'
import { useTranslation } from 'react-i18next'

// ============================================================================
// 1. BETWEEN DATE PICKER - Ana kullanım componenti
// ============================================================================
interface BetweenDatePickerProps {
  label?: string
  startDate: Date | null
  endDate: Date | null
  onChange: (startDate: Date | null, endDate: Date | null) => void
  error?: string
  description?: string
  className?: string
  dropdownClassName?: string
  id?: string
  required?: boolean
  disabled?: boolean
  startPlaceholder?: string
  endPlaceholder?: string
  minDate?: Date
  maxDate?: Date
}

export const BetweenDatePicker = ({
  label,
  startDate,
  endDate,
  onChange,
  error,
  description,
  className,
  dropdownClassName,
  id,
  required,
  disabled = false,
  startPlaceholder,
  endPlaceholder,
  minDate,
  maxDate,
}: BetweenDatePickerProps) => {
  const { language } = useLanguage()
  const { t } = useTranslation('global-components')
  const triggerRef = useRef<HTMLDivElement>(null)

  const defaultStartPlaceholder =
    startPlaceholder || t('form.date_picker_between.start_placeholder')
  const defaultEndPlaceholder = endPlaceholder || t('form.date_picker_between.end_placeholder')

  const formattedDateRange = useMemo(() => {
    const formatDate = (date: Date | null) => {
      if (!date) return null
      return new Intl.DateTimeFormat(language.locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
    }

    const start = formatDate(startDate)
    const end = formatDate(endDate)

    if (!start && !end) return `${defaultStartPlaceholder} - ${defaultEndPlaceholder}`
    if (start && !end) return `${start} - ${defaultEndPlaceholder}`
    if (!start && end) return `${defaultStartPlaceholder} - ${end}`
    return `${start} - ${end}`
  }, [startDate, endDate, defaultStartPlaceholder, defaultEndPlaceholder, language.locale])

  return (
    <BetweenDatePickerRaw
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      locale={language.locale}
      dropdownClassName={dropdownClassName}
      minDate={minDate}
      maxDate={maxDate}
      triggerRef={triggerRef}
    >
      {({ openCalendar }) => (
        <BaseInput
          htmlFor={id}
          label={label}
          error={error}
          required={required}
          className={className}
          description={description}
        >
          <div
            ref={triggerRef}
            onClick={!disabled ? openCalendar : undefined}
            className={twMerge(
              'relative flex h-11 w-full items-center justify-start rounded-xs border bg-box-surface px-3 py-2 text-left text-size transition-colors',
              'border-gray-100 hover:border-gray-400',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none',
              'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-60',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-100',
              !disabled && 'cursor-pointer',
              disabled && 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-500 opacity-60',
            )}
            tabIndex={disabled ? -1 : 0}
          >
            <span
              className={twMerge(
                'block truncate font-medium',
                !startDate && !endDate && 'font-normal text-gray-500',
              )}
            >
              {formattedDateRange}
            </span>
            <Calendar className="absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-400" />
          </div>
        </BaseInput>
      )}
    </BetweenDatePickerRaw>
  )
}

// ============================================================================
// 2. BETWEEN DATE PICKER RAW - Özel tasarımlar için
// ============================================================================
interface BetweenDatePickerRawProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (startDate: Date | null, endDate: Date | null) => void
  locale?: string
  dropdownClassName?: string
  minDate?: Date
  maxDate?: Date
  triggerRef?: any
  children: (props: {
    isOpen: boolean
    openCalendar: () => void
    closeCalendar: () => void
  }) => React.ReactNode
}

export const BetweenDatePickerRaw = ({
  startDate,
  endDate,
  onChange,
  locale = 'tr-TR',
  dropdownClassName,
  minDate,
  maxDate,
  triggerRef = null,
  children,
}: BetweenDatePickerRawProps) => {
  const { t } = useTranslation('global-components')
  const betweenDatePickerHook = useBetweenDatePicker({
    startDate,
    endDate,
    locale,
    minDate,
    maxDate,
  })

  const handleSelectDate = (day: Date) => {
    if (betweenDatePickerHook.selectionMode === 'start' || (!startDate && !endDate)) {
      onChange(day, null)
      betweenDatePickerHook.setSelectionMode('end')
    } else if (betweenDatePickerHook.selectionMode === 'end') {
      if (startDate && isBefore(day, startDate)) {
        onChange(day, startDate)
      } else {
        onChange(startDate, day)
      }
      betweenDatePickerHook.closeCalendar()
    }
  }

  const handleClearDates = () => {
    onChange(null, null)
    betweenDatePickerHook.setSelectionMode('start')
  }

  const handleTodayStart = () => {
    const today = new Date()
    onChange(today, endDate)
    betweenDatePickerHook.setSelectionMode('end')
  }

  const handleTodayEnd = () => {
    const today = new Date()
    onChange(startDate, today)
    betweenDatePickerHook.closeCalendar()
  }

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false
    return isWithinInterval(day, { start: startDate, end: endDate })
  }

  const isRangeStart = (day: Date) => (startDate ? isSameDay(day, startDate) : false)
  const isRangeEnd = (day: Date) => (endDate ? isSameDay(day, endDate) : false)

  const getSelectionModeText = () => {
    if (betweenDatePickerHook.selectionMode === 'start') {
      return t('form.date_picker_between.select_start')
    }
    return t('form.date_picker_between.select_end')
  }

  return (
    <>
      {children({
        isOpen: betweenDatePickerHook.isOpen,
        openCalendar: betweenDatePickerHook.openCalendar,
        closeCalendar: betweenDatePickerHook.closeCalendar,
      })}

      <DropdownPortal
        isOpen={betweenDatePickerHook.isOpen}
        triggerRef={triggerRef}
        onClose={betweenDatePickerHook.closeCalendar}
        placement="bottom-start"
        className={twMerge(
          'w-full max-w-[22rem] rounded-xs border border-gray-200 bg-box-surface shadow-2xl',
          dropdownClassName,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-2 py-3">
          <button
            type="button"
            onClick={betweenDatePickerHook.goToPrevMonth}
            className="flex size-7.5 items-center justify-center rounded-xs transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            aria-label={t('form.date_picker.previous_month')}
          >
            <ChevronLeft className="size-5 text-gray-600" />
          </button>

          <div className="text-size font-semibold text-on-box-black">
            {betweenDatePickerHook.monthName}
          </div>

          <button
            type="button"
            onClick={betweenDatePickerHook.goToNextMonth}
            className="flex size-7.5 items-center justify-center rounded-xs transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            aria-label={t('form.date_picker.next_month')}
          >
            <ChevronRight className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Selection Mode Indicator */}
        <div className="border-b border-gray-100 px-2 py-2">
          <div className="text-center text-body-sm font-medium text-primary-600">
            {getSelectionModeText()}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-2.5">
          <div className="mb-2 grid grid-cols-7 gap-2">
            {betweenDatePickerHook.weekdays.map((day, index) => (
              <div
                key={`weekday-${index}`}
                className="flex h-8 items-center justify-center !text-size-xs font-medium text-gray-700 uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {betweenDatePickerHook.calendarGrid.map((day) => {
              const isCurrentMonth = isSameMonth(day, betweenDatePickerHook.viewDate)
              const isTodaysDate = isToday(day)
              const isDisabled =
                (minDate && isBefore(day, minDate)) || (maxDate && isAfter(day, maxDate))
              const inRange = isInRange(day)
              const rangeStart = isRangeStart(day)
              const rangeEnd = isRangeEnd(day)

              return (
                <button
                  key={day.toString()}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  disabled={isDisabled}
                  className={twMerge(
                    'relative flex size-10 items-center justify-center rounded-xs !text-size transition-colors duration-150',
                    // Base states
                    !isCurrentMonth && 'text-gray-400',
                    isCurrentMonth &&
                      !isDisabled &&
                      'text-on-box-black hover:bg-primary-50 hover:text-primary-600',
                    // Today indicator
                    isTodaysDate &&
                      !rangeStart &&
                      !rangeEnd &&
                      'bg-primary-50 font-semibold text-primary-500',
                    // Range states
                    inRange && !rangeStart && !rangeEnd && 'bg-primary-100 text-primary-700',
                    (rangeStart || rangeEnd) &&
                      'bg-btn-primary font-semibold !text-on-btn-primary shadow-sm hover:bg-btn-primary-hover',
                    // Disabled state
                    isDisabled &&
                      'cursor-not-allowed text-gray-300 hover:bg-transparent hover:text-gray-300',
                    // Focus state
                    'focus:ring-2 focus:ring-primary-200 focus:ring-offset-1 focus:outline-none',
                  )}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-2 border-t border-gray-100 py-3 pr-2.5 pl-2">
          <div className="flex items-center gap-2">
            {betweenDatePickerHook.selectionMode === 'start' ? (
              <button
                type="button"
                onClick={handleTodayStart}
                className="flex h-8 items-center rounded-xs px-3 text-body-sm font-medium text-primary-600"
              >
                {t('form.date_picker.today')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTodayEnd}
                className="flex h-8 items-center rounded-xs px-3 text-body-sm font-medium text-primary-600"
              >
                {t('form.date_picker.today')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearDates}
              className="flex h-8 items-center rounded-xs px-3 text-body-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              {t('form.date_picker_between.clear')}
            </button>

            <button
              type="button"
              onClick={betweenDatePickerHook.closeCalendar}
              className="flex size-7.5 items-center justify-center rounded-xs text-gray-500 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              aria-label="Kapat"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      </DropdownPortal>
    </>
  )
}

// ============================================================================
// 3. BETWEEN DATE PICKER TEXT - react-hook-form uyumlu
// ============================================================================
interface BetweenDatePickerTextProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (startDate: Date | null, endDate: Date | null) => void
  minDate?: Date
  maxDate?: Date
  className?: string
  dropdownClassName?: string
  startPlaceholder?: string
  endPlaceholder?: string
}

export const BetweenDatePickerText = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  className,
  dropdownClassName,
  startPlaceholder,
  endPlaceholder,
}: BetweenDatePickerTextProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { language } = useLanguage()
  const { t } = useTranslation('global-components')

  const formatDate = useCallback(
    (date: Date | null) => {
      if (!date) return null
      return new Intl.DateTimeFormat(language.locale, {
        day: 'numeric',
        month: 'long',
      }).format(date)
    },
    [language.locale],
  )

  const formattedStartDate = useMemo(
    () =>
      formatDate(startDate) || startPlaceholder || t('form.date_picker_between.start_placeholder'),
    [startDate, formatDate, startPlaceholder, t],
  )
  const formattedEndDate = useMemo(
    () => formatDate(endDate) || endPlaceholder || t('form.date_picker_between.end_placeholder'),
    [endDate, formatDate, endPlaceholder, t],
  )

  return (
    <BetweenDatePickerRaw
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      locale={language.locale}
      dropdownClassName={dropdownClassName}
      minDate={minDate}
      maxDate={maxDate}
      triggerRef={triggerRef}
    >
      {({ openCalendar }) => (
        <button
          ref={triggerRef}
          type="button"
          onClick={openCalendar}
          className={twMerge(
            'cursor-pointer font-medium text-on-box-black transition-colors hover:text-primary-600 focus:text-primary-600 focus:outline-none',
            !startDate && !endDate && 'font-normal text-gray-500',
            className,
          )}
        >
          <span className={twMerge(!startDate && 'text-gray-500')}>{formattedStartDate}</span>
          <ArrowRight className="mx-2 inline size-4 flex-shrink-0 text-gray-400" />
          <span className={twMerge(!endDate && 'text-gray-500')}>{formattedEndDate}</span>
        </button>
      )}
    </BetweenDatePickerRaw>
  )
}

// ============================================================================
// 4. BETWEEN DATE PICKER HOOK - Logic kısmı
// ============================================================================
interface UseBetweenDatePickerProps {
  startDate: Date | null
  endDate: Date | null
  locale: string
  minDate?: Date
  maxDate?: Date
}

type SelectionMode = 'start' | 'end'

function useBetweenDatePicker({
  startDate,
  endDate,
  locale,
  minDate,
  maxDate,
}: UseBetweenDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(startDate || new Date())
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('start')

  const openCalendar = () => {
    setIsOpen(true)
    if (!startDate || (startDate && endDate)) {
      setSelectionMode('start')
    } else {
      setSelectionMode('end')
    }
  }

  const closeCalendar = useCallback(() => setIsOpen(false), [])

  const monthName = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(viewDate),
    [viewDate, locale],
  )

  const weekdays = useMemo(() => {
    const firstDayOfWeek = startOfWeek(new Date())
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(firstDayOfWeek)
      date.setDate(firstDayOfWeek.getDate() + i)
      return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)
    })
  }, [locale])

  const calendarGrid = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate))
    const end = endOfWeek(endOfMonth(viewDate))
    return eachDayOfInterval({ start, end })
  }, [viewDate])

  const goToNextMonth = useCallback(() => {
    setViewDate((current) => {
      const nextMonth = addMonths(current, 1)
      if (maxDate && isAfter(startOfMonth(nextMonth), endOfMonth(maxDate))) {
        return current
      }
      return nextMonth
    })
  }, [maxDate])

  const goToPrevMonth = useCallback(() => {
    setViewDate((current) => {
      const prevMonth = subMonths(current, 1)
      if (minDate && isBefore(endOfMonth(prevMonth), startOfMonth(minDate))) {
        return current
      }
      return prevMonth
    })
  }, [minDate])

  useEffect(() => {
    if (startDate) {
      setViewDate(startDate)
    }
  }, [startDate])

  return {
    isOpen,
    viewDate,
    monthName,
    weekdays,
    calendarGrid,
    selectionMode,
    setSelectionMode,
    openCalendar,
    closeCalendar,
    goToNextMonth,
    goToPrevMonth,
  }
}

// Display name'leri
BetweenDatePicker.displayName = 'BetweenDatePicker'
BetweenDatePickerRaw.displayName = 'BetweenDatePickerRaw'
BetweenDatePickerText.displayName = 'BetweenDatePickerText'
