import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
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
import useClickOutside from 'src/hooks/use-click-outside'
import { useLanguage } from 'src/i18n/prodiver'

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
  id,
  required,
  disabled = false,
  startPlaceholder = 'Başlangıç tarihi',
  endPlaceholder = 'Bitiş tarihi',
  minDate,
  maxDate,
}: BetweenDatePickerProps) => {
  const { language } = useLanguage()
  const triggerRef = useRef<HTMLDivElement>(null)

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

    if (!start && !end) return `${startPlaceholder} - ${endPlaceholder}`
    if (start && !end) return `${start} - ${endPlaceholder}`
    if (!start && end) return `${startPlaceholder} - ${end}`
    return `${start} - ${end}`
  }, [startDate, endDate, startPlaceholder, endPlaceholder, language.locale])

  return (
    <BetweenDatePickerRaw
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      locale={language.locale}
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
            onClick={openCalendar}
            className={twMerge(
              'relative flex h-11 w-full cursor-pointer items-center justify-start rounded-xs border border-gray-300 bg-box-surface px-3 py-2 text-left text-size transition-colors',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
              error && 'border-error-500',
              disabled && 'cursor-not-allowed bg-gray-100 text-gray-500 opacity-50',
            )}
          >
            <span className={twMerge('block truncate', !startDate && !endDate && 'text-gray-500')}>
              {formattedDateRange}
            </span>
            <Calendar className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
  minDate?: Date
  maxDate?: Date
  triggerRef?: any
  children: (props: {
    isOpen: boolean
    openCalendar: () => void
    closeCalendar: () => void
    formattedStartDate: string
    formattedEndDate: string
  }) => React.ReactNode
}

export const BetweenDatePickerRaw = ({
  startDate,
  endDate,
  onChange,
  locale = 'tr-TR',
  minDate,
  maxDate,
  triggerRef = null,
  children,
}: BetweenDatePickerRawProps) => {
  const betweenDatePickerHook = useBetweenDatePicker({
    startDate,
    endDate,
    locale,
    minDate,
    maxDate,
  })

  const formatDate = useCallback(
    (date: Date | null) => {
      if (!date) return ''
      return new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
    },
    [locale],
  )

  return (
    <>
      {children({
        isOpen: betweenDatePickerHook.isOpen,
        openCalendar: betweenDatePickerHook.openCalendar,
        closeCalendar: betweenDatePickerHook.closeCalendar,
        formattedStartDate: formatDate(startDate),
        formattedEndDate: formatDate(endDate),
      })}

      {betweenDatePickerHook.isOpen && (
        <BetweenCalendarPanel
          startDate={startDate}
          endDate={endDate}
          onChange={onChange}
          onClose={betweenDatePickerHook.closeCalendar}
          triggerRef={triggerRef}
          hook={betweenDatePickerHook}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </>
  )
}

// ============================================================================
// 3. BETWEEN DATE PICKER TEXT - Basit text versiyonu
// ============================================================================
export function BetweenDatePickerText() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  const handleChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <BetweenDatePickerRaw
      startDate={startDate}
      endDate={endDate}
      onChange={handleChange}
      locale={language.locale}
      triggerRef={triggerRef}
    >
      {({ openCalendar, formattedStartDate, formattedEndDate }) => (
        <div
          ref={triggerRef}
          onClick={openCalendar}
          className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-black"
        >
          <span>{formattedStartDate || 'Start Date'}</span>
          <ArrowRight className="h-4 w-4" />
          <span>{formattedEndDate || 'End Date'}</span>
        </div>
      )}
    </BetweenDatePickerRaw>
  )
}

// ============================================================================
// 4. BETWEEN CALENDAR PANEL - Modal/Popover
// ============================================================================
interface BetweenCalendarPanelProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (startDate: Date | null, endDate: Date | null) => void
  onClose: () => void
  triggerRef: any
  hook: ReturnType<typeof useBetweenDatePicker>
  minDate?: Date
  maxDate?: Date
  className?: string
}

function BetweenCalendarPanel({
  startDate,
  endDate,
  onChange,
  onClose,
  triggerRef,
  hook,
  minDate,
  maxDate,
  className,
}: BetweenCalendarPanelProps) {
  const panelRef = useClickOutside<HTMLDivElement>(onClose, true, triggerRef)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      })
    }
  }, [triggerRef])

  const handleSelectDate = (day: Date) => {
    if (hook.selectionMode === 'start' || (!startDate && !endDate)) {
      // İlk tarih seçiliyor
      onChange(day, null)
      hook.setSelectionMode('end')
    } else if (hook.selectionMode === 'end') {
      // İkinci tarih seçiliyor
      if (startDate && isBefore(day, startDate)) {
        // Eğer seçilen tarih başlangıçtan önceyse, başlangıç tarihi yap
        onChange(day, startDate)
      } else {
        onChange(startDate, day)
      }
      onClose()
    }
  }

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false
    return isWithinInterval(day, { start: startDate, end: endDate })
  }

  const isRangeStart = (day: Date) => {
    return startDate ? isSameDay(day, startDate) : false
  }

  const isRangeEnd = (day: Date) => {
    return endDate ? isSameDay(day, endDate) : false
  }

  return createPortal(
    <div
      ref={panelRef}
      className={twMerge(
        'absolute z-50 w-80 rounded-xs border border-gray-200 bg-box-surface p-4 shadow-lg',
        className,
      )}
      style={{ top: position.top, left: position.left }}
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <button
          type="button"
          onClick={hook.goToPrevMonth}
          className="rounded-full p-1.5 hover:bg-gray-100"
          aria-label="Önceki ay"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="font-semibold">{hook.monthName}</div>
        <button
          type="button"
          onClick={hook.goToNextMonth}
          className="rounded-full p-1.5 hover:bg-gray-100"
          aria-label="Sonraki ay"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Selection Info */}
      <div className="mb-4 text-center text-sm text-gray-600">
        {hook.selectionMode === 'start' ? 'Başlangıç tarihi seçin' : 'Bitiş tarihi seçin'}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {hook.weekdays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {hook.calendarGrid.map((day) => {
          const isCurrentMonth = isSameMonth(day, hook.viewDate)
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
              className={twMerge(
                'relative flex h-9 w-9 items-center justify-center text-sm transition-colors',
                !isCurrentMonth && 'text-gray-400',
                isCurrentMonth && 'hover:bg-gray-100',
                isTodaysDate && 'font-bold',
                inRange && 'bg-primary-100',
                (rangeStart || rangeEnd) &&
                  'rounded-full bg-primary-500 text-white hover:bg-primary-600',
                !rangeStart && !rangeEnd && inRange && 'rounded-none',
                rangeStart && !rangeEnd && 'rounded-l-full rounded-r-none',
                rangeEnd && !rangeStart && 'rounded-l-none rounded-r-full',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
              disabled={isDisabled}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      {/* Reset Button */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => {
            onChange(null, null)
            hook.setSelectionMode('start')
          }}
          className="w-full rounded-xs px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
        >
          Temizle
        </button>
      </div>
    </div>,
    document.body,
  )
}

// ============================================================================
// 5. BETWEEN DATE PICKER HOOK - Logic kısmı
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
    // Eğer hiçbiri seçili değilse start mode'dan başla
    if (!startDate && !endDate) {
      setSelectionMode('start')
    } else if (startDate && !endDate) {
      setSelectionMode('end')
    } else if (startDate && endDate) {
      setSelectionMode('start')
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

  const goToNextMonth = () => setViewDate((current) => addMonths(current, 1))
  const goToPrevMonth = () => setViewDate((current) => subMonths(current, 1))

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
