import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
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
} from 'date-fns'
import { BaseInput } from './base-input'
import { DropdownPortal } from '@/components/dropdown-portal'
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
  maxDate?: Date
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
  maxDate,
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
      maxDate={maxDate}
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
              'relative h-11 w-full cursor-pointer rounded-xs border bg-box-surface px-3 py-2 text-left text-size transition-colors',
              'border-gray-100 hover:border-gray-400',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none',
              'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-60',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-100',
            )}
          >
            <DatePickerIndicator
              value={value}
              placeholder={defaultPlaceholder}
              locale={language.locale}
              className={twMerge(
                'block truncate font-medium',
                !value && 'font-normal text-gray-500',
              )}
            />
            <Calendar className="absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-400" />
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
  maxDate?: Date
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
  maxDate,
  triggerRef = null,
  children,
}: DatePickerRawProps) => {
  const { t } = useTranslation('global-components')
  const datePickerHook = useDatePicker({
    selectedDate: value,
    locale,
    minDate,
    maxDate,
  })

  const formattedDate = useMemo(() => {
    if (!value) return ''
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    }).format(value)
  }, [value, locale])

  const handleSelectDate = (day: Date) => {
    onChange(day)
  }

  const handleClearDate = () => {
    onChange(null)
  }

  const handleTodayClick = () => {
    onChange(new Date())
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
          'w-full max-w-[22rem] rounded-xs border border-gray-200 bg-box-surface shadow-2xl',
          dropdownClassName,
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-2 py-3">
          <button
            type="button"
            onClick={datePickerHook.goToPrevMonth}
            className="flex size-7.5 items-center justify-center rounded-xs transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            aria-label={t('form.date_picker.previous_month')}
          >
            <ChevronLeft className="size-5 text-gray-600" />
          </button>

          <div className="text-size font-semibold text-on-box-black">
            {datePickerHook.monthName}
          </div>

          <button
            type="button"
            onClick={datePickerHook.goToNextMonth}
            className="flex size-7.5 items-center justify-center rounded-xs transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            aria-label={t('form.date_picker.next_month')}
          >
            <ChevronRight className="size-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-2.5">
          <div className="mb-2 grid grid-cols-7 gap-2">
            {datePickerHook.weekdays.map((day, index) => (
              <div
                key={`weekday-${index}`}
                className="flex h-8 items-center justify-center !text-size-xs font-medium text-gray-700 uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {datePickerHook.calendarGrid.map((day) => {
              const isCurrentMonth = isSameMonth(day, datePickerHook.viewDate)
              const isSelected = value ? isSameDay(day, value) : false
              const isTodaysDate = isToday(day)
              const isDisabled =
                (minDate && isBefore(day, minDate)) || (maxDate && isAfter(day, maxDate))

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
                    isTodaysDate && !isSelected && 'bg-primary-50 font-semibold text-primary-500',
                    // Selected state
                    isSelected &&
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
          <button
            type="button"
            onClick={handleTodayClick}
            className="flex h-8 items-center rounded-xs px-3 text-body-sm font-medium text-primary-600"
          >
            {t('form.date_picker.today')}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearDate}
              className="flex h-8 items-center rounded-xs px-3 text-body-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
            >
              {t('form.date_picker.clear')}
            </button>

            <button
              type="button"
              onClick={datePickerHook.closeCalendar}
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
// 3. DATE PICKER TEXT - react-hook-form ile uyumlu
// ============================================================================
interface DatePickerTextProps {
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  dropdownClassName?: string
  className?: string
  placeholder?: string
}

export const DatePickerText = ({
  value,
  onChange,
  minDate,
  maxDate,
  className,
  placeholder,
  dropdownClassName,
}: DatePickerTextProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { language } = useLanguage()
  const { t } = useTranslation('global-components')

  return (
    <DatePickerRaw
      value={value}
      onChange={onChange}
      locale={language.locale}
      minDate={minDate}
      maxDate={maxDate}
      triggerRef={triggerRef}
      dropdownClassName={dropdownClassName}
    >
      {({ openCalendar, formattedDate }) => (
        <button
          ref={triggerRef}
          type="button"
          onClick={openCalendar}
          className={twMerge(
            'cursor-pointer font-medium text-on-box-black transition-colors hover:text-primary-600 focus:text-primary-600 focus:outline-none',
            !value && 'font-normal text-gray-500',
            className,
          )}
        >
          {formattedDate || placeholder || t('form.date_picker.select_date')}
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
  maxDate?: Date
}

function useDatePicker({ selectedDate, locale, minDate, maxDate }: UseDatePickerProps) {
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

  const goToNextMonth = useCallback(() => {
    setViewDate((current) => {
      const nextMonth = addMonths(current, 1)
      // maxDate kontrolü - eğer bir sonraki ay maxDate'ten sonraysa geçme
      if (maxDate && isAfter(startOfMonth(nextMonth), endOfMonth(maxDate))) {
        return current
      }
      return nextMonth
    })
  }, [maxDate])

  const goToPrevMonth = useCallback(() => {
    setViewDate((current) => {
      const prevMonth = subMonths(current, 1)
      // minDate kontrolü - eğer bir önceki ay minDate'ten önce ise geçme
      if (minDate && isBefore(endOfMonth(prevMonth), startOfMonth(minDate))) {
        return current
      }
      return prevMonth
    })
  }, [minDate])

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
