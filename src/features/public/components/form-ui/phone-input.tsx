import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  CountryCode,
  formatIncompletePhoneNumber,
  getCountryCallingCode,
  getExampleNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js/min'
import examples from 'libphonenumber-js/mobile/examples'
import { BaseInput } from './base-input' // Projendeki base-input'un yolunu kontrol etmeyi unutma

// ============================================================================
// 1. ÜLKE VERİLERİ VE AYARLARI
// ============================================================================

interface Country {
  iso2: CountryCode
  name: string
  dialCode: string
  format: string
}

// Senin tarafından sağlanan tam ülke listesi
const PRESET_COUNTRIES: CountryCode[] = [
  'AF',
  'AL',
  'DZ',
  'AS',
  'AD',
  'AO',
  'AI',
  'AG',
  'AR',
  'AM',
  'AW',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BH',
  'BD',
  'BB',
  'BY',
  'BE',
  'BZ',
  'BJ',
  'BM',
  'BT',
  'BO',
  'BA',
  'BW',
  'BR',
  'IO',
  'BN',
  'BG',
  'BF',
  'BI',
  'CV',
  'KH',
  'CM',
  'CA',
  'KY',
  'CF',
  'TD',
  'CL',
  'CN',
  'CX',
  'CC',
  'CO',
  'KM',
  'CG',
  'CD',
  'CK',
  'CR',
  'HR',
  'CU',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'EC',
  'EG',
  'SV',
  'GQ',
  'ER',
  'EE',
  'ET',
  'FK',
  'FO',
  'FJ',
  'FI',
  'FR',
  'GF',
  'PF',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GI',
  'GR',
  'GL',
  'GD',
  'GP',
  'GU',
  'GT',
  'GG',
  'GN',
  'GW',
  'GY',
  'HT',
  'VA',
  'HN',
  'HK',
  'HU',
  'IS',
  'IN',
  'ID',
  'IR',
  'IQ',
  'IE',
  'IM',
  'IL',
  'IT',
  'JM',
  'JP',
  'JE',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KP',
  'KR',
  'KW',
  'KG',
  'LA',
  'LV',
  'LB',
  'LS',
  'LR',
  'LY',
  'LI',
  'LT',
  'LU',
  'MO',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MQ',
  'MR',
  'MU',
  'YT',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'ME',
  'MS',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'NC',
  'NZ',
  'NI',
  'NE',
  'NG',
  'NU',
  'NF',
  'MP',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PY',
  'PE',
  'PH',
  'PL',
  'PT',
  'PR',
  'QA',
  'RE',
  'RO',
  'RU',
  'RW',
  'BL',
  'SH',
  'KN',
  'LC',
  'MF',
  'PM',
  'VC',
  'WS',
  'SM',
  'ST',
  'SA',
  'SN',
  'RS',
  'SC',
  'SL',
  'SG',
  'SX',
  'SK',
  'SI',
  'SB',
  'SO',
  'ZA',
  'SS',
  'ES',
  'LK',
  'SD',
  'SR',
  'SJ',
  'SZ',
  'SE',
  'CH',
  'SY',
  'TW',
  'TJ',
  'TZ',
  'TH',
  'TL',
  'TG',
  'TK',
  'TO',
  'TT',
  'TN',
  'TR',
  'TM',
  'TC',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UY',
  'UZ',
  'VU',
  'VE',
  'VN',
  'VG',
  'VI',
  'WF',
  'EH',
  'YE',
  'ZM',
  'ZW',
]
const DEFAULT_COUNTRY_ISO2: CountryCode = 'AE' // Varsayılan ülke BAE olarak ayarlandı

const getCountryData = (): Country[] => {
  // Intl.DisplayNames API'ı, ISO kodlarından ülke isimlerini doğru bir şekilde alır.
  const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })
  return PRESET_COUNTRIES.map((iso2) => {
    let format = '... ... .. ..'
    try {
      const example = getExampleNumber(iso2, examples)
      if (example) format = example.formatNational()
    } catch (error) {
      console.warn(`[PhoneInput] Could not get example for ${iso2}:`, error)
    }
    return {
      iso2,
      name: countryNames.of(iso2) || iso2,
      dialCode: getCountryCallingCode(iso2),
      format,
    }
  })
}

const countries: Country[] = getCountryData()

// ============================================================================
// 2. CUSTOM HOOK (GÜNCELLENMİŞ KOMPONENT MANTIĞI)
// ============================================================================

const usePhoneInput = (
  initialValue: string = '',
  defaultCountry: CountryCode = DEFAULT_COUNTRY_ISO2,
  onChange?: (value: string) => void,
) => {
  const [inputValue, setInputValue] = useState(initialValue)

  const detectedCountry = useMemo((): CountryCode => {
    const potentialNumber = inputValue.startsWith('+') ? inputValue : `+${inputValue}`

    // YENİ KURAL: Eğer numara "+1" ise, önceliği ABD'ye ver.
    const digitsOnly = potentialNumber.replace(/\D/g, '')
    if (digitsOnly === '1') {
      return 'US'
    }

    // `libphonenumber-js` tam numarayı (alan koduyla birlikte) parse ederek en doğru sonucu verir.
    const phoneNumber = parsePhoneNumberFromString(potentialNumber)
    if (phoneNumber && phoneNumber.country) {
      return phoneNumber.country
    }

    // Fallback: Kısa kodlar için manuel ülke tespiti yap.
    if (!digitsOnly) return defaultCountry
    const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length)
    const matchedCountry = sortedCountries.find((c) => digitsOnly.startsWith(c.dialCode))

    if (matchedCountry) return matchedCountry.iso2

    return defaultCountry
  }, [inputValue, defaultCountry])

  const activeCountry = useMemo(
    () =>
      countries.find((c) => c.iso2 === detectedCountry) ||
      countries.find((c) => c.iso2 === defaultCountry)!,
    [detectedCountry, defaultCountry],
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
  }, [initialValue, inputValue])

  return { inputValue, handleChange, placeholder, activeCountry }
}

// ============================================================================
// 3. REACT KOMPONENTİ (UI)
// ============================================================================

export interface PhoneInputProps extends Omit<React.ComponentProps<'input'>, 'onChange' | 'value'> {
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  description?: string
  className?: string
  defaultCountry?: CountryCode
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      required = false,
      className,
      description,
      defaultCountry = DEFAULT_COUNTRY_ISO2,
      ...props
    },
    ref,
  ) => {
    const { inputValue, handleChange, placeholder, activeCountry } = usePhoneInput(
      value,
      defaultCountry,
      onChange,
    )
    const flagUrl = `https://flagcdn.com/h80/${activeCountry.iso2.toLowerCase()}.png`

    return (
      <BaseInput
        htmlFor={props.id}
        label={label}
        error={error}
        required={required}
        className={className}
        description={description}
      >
        <div className="relative">
          <div className="pointer-events-none absolute top-1/2 left-3 z-10 flex -translate-y-1/2 items-center gap-2">
            <img
              src={flagUrl}
              alt={`${activeCountry.name} flag`}
              className="h-4 w-6 object-cover"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
            />
            <div className="ml-1 h-11 w-px bg-gray-200" />
          </div>
          <input
            {...props}
            ref={ref}
            type="tel"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
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

PhoneInput.displayName = 'PhoneInput'
