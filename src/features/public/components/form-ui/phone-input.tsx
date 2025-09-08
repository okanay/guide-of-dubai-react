import {
  CountryCode,
  formatIncompletePhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/min'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { CircleFlag } from 'react-circle-flags'
import { useTranslation } from 'react-i18next'
import { BaseInput } from './base-input'
import { useLanguage } from 'src/i18n/prodiver'
import { getCountries } from 'src/utils/countries'

// ============================================================================
// 1. REACT KOMPONENTİ (UI)
// ============================================================================

export interface Props extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  description?: string
  className?: string
  defaultCountry?: CountryCode
}

const DEFAULT_ISO: CountryCode = 'AE'

export const PhoneInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      value,
      onChange,
      error,
      required = false,
      className,
      description,
      defaultCountry = DEFAULT_ISO,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation('components')
    const defaultPlaceholder = placeholder || t('form.phone_input.placeholder')

    const {
      inputValue,
      handleChange,
      placeholder: computedPlaceholder,
      activeCountry,
    } = usePhoneInput(value, defaultCountry, onChange)

    const handleBlur = () => {
      if (inputValue === '+') {
        onChange?.('')
      }
    }

    return (
      <BaseInput
        htmlFor={props.id}
        label={label}
        error={error}
        required={required}
        className={className}
        description={description}
      >
        <div className="group relative">
          <div className="pointer-events-none absolute top-1/2 left-3 z-10 flex -translate-y-1/2 items-center gap-2">
            {/* API bağımsız bayrak komponenti */}
            <div className="flex size-6 items-center justify-center overflow-hidden rounded-sm">
              <CircleFlag
                countryCode={activeCountry.iso2.toLowerCase()}
                height="24"
                width="24"
                className="object-cover"
              />
            </div>
            <div className="ml-1 h-10 w-px bg-gray-200 transition-colors group-focus-within:bg-primary-500" />
          </div>
          <input
            {...props}
            ref={ref}
            type="tel"
            value={inputValue}
            onChange={handleChange}
            placeholder={computedPlaceholder}
            onBlur={handleBlur}
            className={twMerge(
              'w-full rounded-xs border px-3 py-2 pl-14 text-size transition-colors',
              'border-gray-300 bg-box-surface text-on-box-black',
              'placeholder:text-gray-500',
              'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
              className,
            )}
          />
        </div>
      </BaseInput>
    )
  },
)

// ============================================================================
// 2. CUSTOM HOOK (GÜNCELLENMİŞ KOMPONENT MANTIĞI)
// ============================================================================

interface Country {
  iso2: CountryCode
  name: string
  dialCode: string
  format: string
}

// Sadece kısa kodlar için öncelik haritası (tam numara girilmediğinde)
const INITIAL_PRIORITY_MAP: Record<string, CountryCode> = {
  '1': 'US',
  '44': 'GB',
  '7': 'RU',
  '39': 'IT',
  '47': 'NO',
  '61': 'AU',
}

const usePhoneInput = (
  initialValue: string = '',
  defaultCountry: CountryCode = DEFAULT_ISO,
  onChange?: (value: string) => void,
) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const { language } = useLanguage() // Aktif dili al

  const countries = useMemo(() => getCountries(language.locale), [language.locale])

  const detectedCountry = useMemo((): CountryCode => {
    const potentialNumber = inputValue.startsWith('+') ? inputValue : `+${inputValue}`
    const digitsOnly = potentialNumber.replace(/\D/g, '')

    if (!digitsOnly) return defaultCountry

    const phoneNumber = parsePhoneNumberFromString(potentialNumber)
    if (phoneNumber && phoneNumber.country) {
      return phoneNumber.country
    }

    for (const [dialCode, priorityCountry] of Object.entries(INITIAL_PRIORITY_MAP)) {
      if (digitsOnly.startsWith(dialCode)) {
        return priorityCountry
      }
    }

    // Ülke listesi artık hook içinde olduğu için direkt kullanabiliriz.
    const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length)
    const matchedCountry = sortedCountries.find((c) => digitsOnly.startsWith(c.dialCode))

    if (matchedCountry) return matchedCountry.iso2

    return defaultCountry
  }, [inputValue, defaultCountry, countries])

  const activeCountry = useMemo(
    () =>
      countries.find((c) => c.iso2 === detectedCountry) ||
      countries.find((c) => c.iso2 === defaultCountry)!,
    [detectedCountry, defaultCountry, countries],
  )

  const placeholder = useMemo(
    () => `+${activeCountry.dialCode} ${activeCountry.format}`,
    [activeCountry],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value
      if (!rawValue.startsWith('+')) {
        rawValue = `+${rawValue.replace(/\+/g, '')}`
      }
      const formatted = formatIncompletePhoneNumber(rawValue, detectedCountry)
      setInputValue(formatted)
      onChange?.(formatted)
    },
    [detectedCountry, onChange],
  )

  useEffect(() => {
    if (initialValue !== inputValue) setInputValue(initialValue)
  }, [initialValue])

  return { inputValue, handleChange, placeholder, activeCountry }
}

PhoneInput.displayName = 'PhoneInput'

// +1 242 555 0123  → 🇧🇸 Bahamas
// +1 246 555 0123  → 🇧🇧 Barbados
// +1 264 555 0123  → 🇦🇮 Anguilla
// +1 268 555 0123  → 🇦🇬 Antigua ve Barbuda
// +1 284 555 0123  → 🇻🇬 British Virgin Islands
// +1 340 555 0123  → 🇻🇮 US Virgin Islands
// +1 345 555 0123  → 🇰🇾 Cayman Islands
// +1 441 555 0123  → 🇧🇲 Bermuda
// +1 473 555 0123  → 🇬🇩 Grenada
// +1 649 555 0123  → 🇹🇨 Turks ve Caicos
// +1 664 555 0123  → 🇲🇸 Montserrat
// +1 670 555 0123  → 🇲🇵 Northern Mariana Islands
// +1 671 555 0123  → 🇬🇺 Guam
// +1 684 555 0123  → 🇦🇸 American Samoa
// +1 721 555 0123  → 🇸🇽 Sint Maarten
// +1 758 555 0123  → 🇱🇨 Saint Lucia
// +1 767 555 0123  → 🇩🇲 Dominica
// +1 784 555 0123  → 🇻🇨 Saint Vincent ve Grenadines
// +1 787 555 0123  → 🇵🇷 Puerto Rico
// +1 809 555 0123  → 🇩🇴 Dominican Republic
// +1 829 555 0123  → 🇩🇴 Dominican Republic (ikinci kod)
// +1 849 555 0123  → 🇩🇴 Dominican Republic (üçüncü kod)
// +1 868 555 0123  → 🇹🇹 Trinidad ve Tobago
// +1 869 555 0123  → 🇰🇳 Saint Kitts ve Nevis
// +1 876 555 0123  → 🇯🇲 Jamaica
// +1 939 555 0123  → 🇵🇷 Puerto Rico (ikinci kod)
