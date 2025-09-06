import { Clock } from 'lucide-react'
import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Sadece focus dışındayken external value'yu kabul et
    if (!isFocused) {
      setInputValue(value)
    }
  }, [value, isFocused])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9:]/g, '')

    // Kullanıcı siliyorsa izin ver
    if (rawValue.length < inputValue.length) {
      setInputValue(rawValue)
      return
    }

    // Eğer zaten : varsa ve kullanıcı : yazmaya çalışıyorsa, engellle
    if (rawValue.includes(':') && e.target.value.endsWith(':') && inputValue.includes(':')) {
      return
    }

    // Max 5 karakter (SS:DD)
    if (rawValue.replace(':', '').length > 4) {
      return
    }

    // Otomatik : ekleme - kullanıcı 3. karakteri yazınca
    if (rawValue.length === 2 && !rawValue.includes(':') && inputValue.length === 1) {
      const hour = rawValue
      if (parseInt(hour, 10) <= 23) {
        setInputValue(hour + ':')
        // Cursor'ı : sonrasına taşı
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(3, 3)
          }
        }, 0)
      } else {
        // 24 ve üzeri, sadece ilk rakamı al ve : ekle
        setInputValue(rawValue[0] + ':' + rawValue[1])
      }
      return
    }

    // Normal durum - değeri ayarla
    setInputValue(rawValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace ile : silinmeye çalışıldığında
    if (e.key === 'Backspace' && inputValue.endsWith(':')) {
      e.preventDefault()
      setInputValue(inputValue.slice(0, -1))
    }
  }

  const formatAndValidateTime = (input: string): string => {
    // Boş input
    if (!input) return ''

    // : işaretini temizle
    const numbers = input.replace(/[^0-9]/g, '')

    if (numbers.length === 0) return ''

    let hour: number
    let minute: number

    if (numbers.length === 1) {
      // Tek haneli saat - kullanıcı mantığı:
      // 0-2: Başına 0 ekle (00, 01, 02)
      // 3-9: Olduğu gibi kabul et, dakika 00 (03:00 - 09:00)
      const h = parseInt(numbers, 10)
      if (h <= 2) {
        hour = h
        minute = 0
      } else {
        hour = h
        minute = 0
      }
    } else if (numbers.length === 2) {
      // İki haneli - saat olarak kabul et
      hour = parseInt(numbers, 10)
      minute = 0
      if (hour > 23) {
        // 24-99 arası, ilk rakamı saat, ikinciyi dakika yap
        hour = parseInt(numbers[0], 10)
        minute = parseInt(numbers[1], 10) * 10 // x0 dakika
      }
    } else if (numbers.length === 3) {
      // 3 haneli - ilk 2'si saat, 3. dakikanın ilk hanesi
      const h = parseInt(numbers.slice(0, 2), 10)
      if (h <= 23) {
        hour = h
        minute = parseInt(numbers[2], 10) * 10 // x0 dakika
      } else {
        // İlki saat, son ikisi dakika
        hour = parseInt(numbers[0], 10)
        minute = parseInt(numbers.slice(1, 3), 10)
      }
    } else {
      // 4 haneli - SS DD
      hour = parseInt(numbers.slice(0, 2), 10)
      minute = parseInt(numbers.slice(2, 4), 10)
    }

    // Saat ve dakika validasyonu
    hour = Math.min(hour, 23)
    minute = Math.min(minute, 59)

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }

  const applyRoundingAndConstraints = (timeString: string): string => {
    if (!timeString) return ''

    const [hours, minutes] = timeString.split(':').map(Number)
    let totalMinutes = hours * 60 + minutes

    // Allowed times varsa en yakınını bul
    if (allowedTimes && allowedTimes.length > 0) {
      return allowedTimes.reduce((prev, curr) => {
        const prevDiff = Math.abs(timeStringToMinutes(prev) - totalMinutes)
        const currDiff = Math.abs(timeStringToMinutes(curr) - totalMinutes)
        return currDiff < prevDiff ? curr : prev
      })
    }

    // Rounding varsa uygula
    if (rounding && rounding > 0) {
      const roundedMinute = Math.round(minutes / rounding) * rounding
      totalMinutes = hours * 60 + roundedMinute
    }

    // Final değerleri hesapla
    const finalHour = Math.floor(totalMinutes / 60) % 24
    const finalMinute = totalMinutes % 60

    return `${String(finalHour).padStart(2, '0')}:${String(finalMinute).padStart(2, '0')}`
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = useCallback(() => {
    setIsFocused(false)

    // Format ve validate et
    const formatted = formatAndValidateTime(inputValue)

    if (!formatted) {
      onChange('')
      setInputValue('')
      return
    }

    // Rounding ve constraints uygula
    const finalTime = applyRoundingAndConstraints(formatted)

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
          ref={inputRef}
          id={id}
          type="text" // text tutuyoruz ama inputMode ile sayısal klavye açıyoruz
          inputMode="numeric" // Mobile'da sayısal klavye açar
          pattern="[0-9:]*" // iOS Safari için ek destek
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
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
