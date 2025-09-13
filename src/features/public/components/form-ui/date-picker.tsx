import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { DropdownPortal } from './dropdown-portal'
import { useLanguage } from 'src/i18n/prodiver'
import { useTranslation } from 'react-i18next'

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
  dropdownClassName?: string
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
  dropdownClassName,
  id,
  required,
  disabled = false,
  placeholder,
  minDate,
}: DatePickerProps) => {
  const { language } = useLanguage()
  const { t } = useTranslation('global-components')
  const triggerRef = useRef<HTMLButtonElement>(null)

  const defaultPlaceholder = placeholder || t('form.date_picker.placeholder')

  return (
    <DatePickerRaw
      value={value}
      onChange={onChange}
      locale={language.locale}
      minDate={minDate}
      dropdownClassName={dropdownClassName}
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
              placeholder={defaultPlaceholder}
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
  dropdownClassName?: string
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
  dropdownClassName,
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
    // Metin formatını daha okunaklı hale getirelim: '12 Eylül Cuma'
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    }).format(value)
  }, [value, locale])

  const handleSelectDate = (day: Date) => {
    onChange(day)
    datePickerHook.closeCalendar()
  }

  const handleClearDate = () => {
    onChange(null)
    datePickerHook.closeCalendar()
  }

  return (
    <>
      {children({
        isOpen: datePickerHook.isOpen,
        openCalendar: datePickerHook.openCalendar,
        closeCalendar: datePickerHook.closeCalendar,
        formattedDate,
      })}

      <DropdownPortal
        isOpen={datePickerHook.isOpen}
        triggerRef={triggerRef}
        onClose={datePickerHook.closeCalendar}
        placement="bottom-start"
        className={twMerge(
          'w-80 rounded-xs border border-gray-200 bg-box-surface p-4 shadow-lg',
          dropdownClassName,
        )}
      >
        <div className="flex items-center justify-between pb-4">
          <button
            type="button"
            onClick={datePickerHook.goToPrevMonth}
            className="rounded-full p-1.5 hover:bg-gray-100"
            aria-label="Önceki ay"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="font-semibold">{datePickerHook.monthName}</div>
          <button
            type="button"
            onClick={datePickerHook.goToNextMonth}
            className="rounded-full p-1.5 hover:bg-gray-100"
            aria-label="Sonraki ay"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-1 text-center">
          {datePickerHook.weekdays.map((day, index) => (
            <div key={`weekday-${index}`} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
          {datePickerHook.calendarGrid.map((day) => {
            const isCurrentMonth = isSameMonth(day, datePickerHook.viewDate)
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

        <div className="mt-4 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={handleClearDate}
            className="w-full rounded-xs px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
          >
            Temizle
          </button>
        </div>
      </DropdownPortal>
    </>
  )
}

// ============================================================================
// 3. DATE PICKER TEXT - react-hook-form ile uyumlu
// ============================================================================
interface DatePickerTextProps {
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  dropdownClassName?: string
  className?: string
  placeholder?: string
}

export const DatePickerText = ({
  value,
  onChange,
  minDate,
  className,
  placeholder,
  dropdownClassName,
}: DatePickerTextProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { language } = useLanguage()
  const { t } = useTranslation('global-form')

  return (
    <DatePickerRaw
      value={value}
      onChange={onChange}
      locale={language.locale}
      minDate={minDate}
      triggerRef={triggerRef}
      dropdownClassName={dropdownClassName}
    >
      {({ openCalendar, formattedDate }) => (
        <button
          ref={triggerRef}
          type="button"
          onClick={openCalendar}
          className={twMerge('hover:text-primary cursor-pointer text-gray-800', className)}
        >
          {/* FormattedDate'i kullan, eğer boşsa placeholder göster */}
          {formattedDate || placeholder || t('labels.select_date')}
        </button>
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
  placeholder,
  locale = 'tr-TR',
  className,
  onClick,
  children,
}: DatePickerIndicatorProps) => {
  const { t } = useTranslation('global-components')
  const defaultPlaceholder = placeholder || t('form.date_picker.placeholder')

  const formattedDate = useMemo(() => {
    if (!value) return defaultPlaceholder
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(value)
  }, [value, locale, defaultPlaceholder])

  if (children) {
    return (
      <span className={className} onClick={onClick}>
        {children(formattedDate)}
      </span>
    )
  }

  return (
    <span className={className} onClick={onClick}>
      {formattedDate}
    </span>
  )
}

// ============================================================================
// 5. DATE PICKER HOOK - Logic kısmı
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

DatePicker.displayName = 'DatePicker'
DatePickerRaw.displayName = 'DatePickerRaw'
DatePickerText.displayName = 'DatePickerText'
