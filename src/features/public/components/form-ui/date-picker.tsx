import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { twMerge } from 'tailwind-merge'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
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
} from 'date-fns'
import { BaseInput } from './base-input'
import useClickOutside from 'src/hooks/use-click-outside'
import { useLanguage } from 'src/i18n/prodiver'

// ============================================================================
// 1. COMPLETE DATE PICKER - Ana kullanım componenti (BaseInput ile)
// ============================================================================
interface DatePickerProps {
  label?: string
  value: Date | null
  onChange: (date: Date | null) => void
  error?: string
  description?: string
  className?: string
  id?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  minDate?: Date
}

export const DatePicker = ({
  label,
  value,
  onChange,
  error,
  description,
  className,
  id,
  required,
  disabled = false,
  placeholder = 'Tarih seçin',
  minDate,
}: DatePickerProps) => {
  const { language } = useLanguage()
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <DatePickerRaw
      value={value}
      onChange={onChange}
      locale={language.locale}
      minDate={minDate}
      triggerRef={triggerRef}
    >
      {({ openCalendar, formattedDate }) => (
        <BaseInput
          htmlFor={id}
          label={label}
          error={error}
          required={required}
          className={className}
          description={description}
        >
          <button
            ref={triggerRef}
            id={id}
            type="button"
            onClick={openCalendar}
            disabled={disabled}
            className={twMerge(
              'relative h-11 w-full cursor-pointer rounded-xs border border-gray-300 bg-box-surface px-3 py-2 text-left text-size transition-colors',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
              error && 'border-error-500',
            )}
          >
            <DatePickerIndicator
              value={value}
              placeholder={placeholder}
              locale={language.locale}
              className={twMerge(!value && 'text-gray-500')}
            />
            <Calendar className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </button>
        </BaseInput>
      )}
    </DatePickerRaw>
  )
}

// ============================================================================
// 2. DATE PICKER RAW - Sadece logic + calendar, UI'sız (özel tasarımlar için)
// ============================================================================
interface DatePickerRawProps {
  value: Date | null
  onChange: (date: Date | null) => void
  locale?: string
  minDate?: Date
  triggerRef?: any
  children: (props: {
    isOpen: boolean
    openCalendar: () => void
    closeCalendar: () => void
    formattedDate: string
  }) => React.ReactNode
}

export const DatePickerRaw = ({
  value,
  onChange,
  locale = 'tr-TR',
  minDate,
  triggerRef = null,
  children,
}: DatePickerRawProps) => {
  const datePickerHook = useDatePicker({
    selectedDate: value,
    locale,
    minDate,
  })

  const formattedDate = useMemo(() => {
    if (!value) return ''
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(value)
  }, [value, locale])

  return (
    <>
      {children({
        isOpen: datePickerHook.isOpen,
        openCalendar: datePickerHook.openCalendar,
        closeCalendar: datePickerHook.closeCalendar,
        formattedDate,
      })}

      {datePickerHook.isOpen && (
        <CalendarPanel
          value={value}
          onChange={onChange}
          onClose={datePickerHook.closeCalendar}
          triggerRef={triggerRef}
          hook={datePickerHook}
          minDate={minDate}
        />
      )}
    </>
  )
}

// ============================================================================
// 3. DATE PICKER TEXT - Basit text versiyonu (örnek kullanım)
// ============================================================================
export function DatePickerText() {
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  return (
    <DatePickerRaw
      value={checkIn}
      onChange={setCheckIn}
      locale={language.locale}
      triggerRef={triggerRef}
    >
      {({ openCalendar, formattedDate }) => (
        <div
          ref={triggerRef}
          onClick={openCalendar}
          className="cursor-pointer text-gray-600 hover:text-black"
        >
          {formattedDate || 'Pick a Date'}
        </div>
      )}
    </DatePickerRaw>
  )
}

// ============================================================================
// 4. DATE PICKER INDICATOR - Tarih formatlamak için yardımcı component
// ============================================================================
interface DatePickerIndicatorProps {
  value?: Date | null
  placeholder?: string
  locale?: string
  className?: string
  onClick?: () => void
  children?: (formattedDate: string) => React.ReactNode
}

export const DatePickerIndicator = ({
  value,
  placeholder = 'Tarih seçin',
  locale = 'tr-TR',
  className,
  onClick,
  children,
}: DatePickerIndicatorProps) => {
  const formattedDate = useMemo(() => {
    if (!value) return placeholder
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(value)
  }, [value, locale, placeholder])

  // Eğer children function varsa onu kullan
  if (children) {
    return (
      <span className={className} onClick={onClick}>
        {children(formattedDate)}
      </span>
    )
  }

  // Değilse sadece text döndür
  return (
    <span className={className} onClick={onClick}>
      {formattedDate}
    </span>
  )
}

// ============================================================================
// 5. CALENDAR PANEL - Modal/Popover (iç kullanım)
// ============================================================================
interface CalendarPanelProps {
  value: Date | null
  onChange: (date: Date | null) => void
  onClose: () => void
  triggerRef: any
  hook: ReturnType<typeof useDatePicker>
  minDate?: Date
  className?: string
}

function CalendarPanel({
  value,
  onChange,
  onClose,
  triggerRef,
  hook,
  minDate = new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
  className,
}: CalendarPanelProps) {
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
    onChange(day)
    onClose()
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

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {hook.weekdays.map((day, index) => (
          <div key={`weekday-${index}`} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {hook.calendarGrid.map((day) => {
          const isCurrentMonth = isSameMonth(day, hook.viewDate)
          const isSelected = value ? isSameDay(day, value) : false
          const isTodaysDate = isToday(day)
          const isDisabled = minDate && day < minDate

          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() => handleSelectDate(day)}
              className={twMerge(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                !isCurrentMonth && 'text-gray-400',
                isCurrentMonth && 'hover:bg-gray-100',
                isTodaysDate && 'font-bold text-primary-600',
                isSelected && 'bg-primary-500 text-on-btn-primary hover:bg-primary-600',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
              disabled={isDisabled}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>,
    document.body,
  )
}

// ============================================================================
// 6. DATE PICKER HOOK - Logic kısmı (en az dokunacağın kısım)
// ============================================================================
interface UseDatePickerProps {
  selectedDate: Date | null
  locale: string
  minDate?: Date
}

function useDatePicker({ selectedDate, locale, minDate }: UseDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(selectedDate || new Date())

  const openCalendar = () => setIsOpen(true)
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
    if (selectedDate) {
      setViewDate(selectedDate)
    }
  }, [selectedDate])

  return {
    isOpen,
    viewDate,
    monthName,
    weekdays,
    calendarGrid,
    openCalendar,
    closeCalendar,
    goToNextMonth,
    goToPrevMonth,
  }
}

// Display name'leri
DatePicker.displayName = 'DatePicker'
DatePickerRaw.displayName = 'DatePickerRaw'
