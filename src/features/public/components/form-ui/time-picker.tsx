import { Clock } from 'lucide-react'
import React, { useState, useEffect, useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { BaseInput } from './base-input'

interface Props {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  description?: string
  className?: string
  id?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  rounding?: number
  allowedTimes?: string[]
}

export const TimePicker = ({
  label,
  value,
  onChange,
  error,
  description,
  className,
  id,
  required,
  disabled = false,
  placeholder = 'SS:DD',
  rounding,
  allowedTimes,
}: Props) => {
  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')

    if (rawValue.length === 0) {
      setInputValue('')
      return
    }

    let hour = rawValue.slice(0, 2)
    let minute = rawValue.slice(2, 4)

    if (hour.length === 2 && parseInt(hour, 10) > 23) {
      hour = '23'
    }

    if (minute.length === 2 && parseInt(minute, 10) > 59) {
      minute = '59'
    }

    const formattedValue = rawValue.length > 2 ? `${hour}:${minute}` : hour
    setInputValue(formattedValue)
  }

  const handleBlur = useCallback(() => {
    if (!inputValue) {
      onChange('')
      return
    }

    const parts = inputValue.split(':')
    let hour = parseInt(parts[0], 10) || 0
    let minute = parseInt(parts[1], 10) || 0

    if (hour > 23 || minute > 59) {
      if (hour === 24 && minute === 0) {
        // 24:00 -> 00:00 olarak kabul edilecek
      } else {
        hour = 0
        minute = 0
      }
    }

    let finalTime: string
    let totalMinutes = hour * 60 + minute

    if (allowedTimes && allowedTimes.length > 0) {
      finalTime = allowedTimes.reduce((prev, curr) => {
        const prevDiff = Math.abs(timeStringToMinutes(prev) - totalMinutes)
        const currDiff = Math.abs(timeStringToMinutes(curr) - totalMinutes)
        return currDiff < prevDiff ? curr : prev
      })
    } else if (rounding && rounding > 0) {
      const roundedMinute = Math.round(minute / rounding) * rounding
      totalMinutes = hour * 60 + roundedMinute
      const finalHour = Math.floor(totalMinutes / 60) % 24
      const finalMinute = totalMinutes % 60
      finalTime = minutesToTimeString(finalHour * 60 + finalMinute)
    } else {
      const finalHour = Math.floor(totalMinutes / 60) % 24
      const finalMinute = totalMinutes % 60
      finalTime = minutesToTimeString(finalHour * 60 + finalMinute)
    }

    onChange(finalTime)
    setInputValue(finalTime)
  }, [inputValue, onChange, rounding, allowedTimes])

  return (
    <BaseInput
      htmlFor={id}
      label={label}
      error={error}
      required={required}
      className={className}
      description={description}
    >
      <div className="relative">
        <input
          id={id}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={5}
          className={twMerge(
            'w-full rounded-xs border px-3 py-2 pl-10 text-size transition-colors',
            'border-gray-300 bg-box-surface text-on-box-black',
            'placeholder:text-gray-500',
            'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
          )}
        />
        <Clock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </BaseInput>
  )
}

TimePicker.displayName = 'TimePicker'

// ============================================================================
// YARDIMCI FONKSİYONLAR
// ============================================================================
const timeStringToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const minutesToTimeString = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
