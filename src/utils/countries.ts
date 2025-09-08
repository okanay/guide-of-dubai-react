import { CountryCode, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js/min'
import examples from 'libphonenumber-js/mobile/examples'

export interface CountryOption {
  value: CountryCode
  label: string
  dialCode: string
}

export interface Country {
  iso2: CountryCode
  name: string
  dialCode: string
  format: string
}

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

/**
 * Ülkelerin listesini, belirtilen dildeki isimleriyle birlikte oluşturur.
 * @param locale - 'tr-TR', 'en-US' gibi bir locale string'i.
 * @returns Uluslararasılaştırılmış ülke verileri dizisi.
 */
export const getCountries = (locale: string): Country[] => {
  try {
    const countryNames = new Intl.DisplayNames([locale], { type: 'region' })

    return PRESET_COUNTRIES.map((iso2) => {
      let format = '... ... .. ..' // Varsayılan format
      try {
        const example = getExampleNumber(iso2, examples)
        if (example) {
          format = example.formatNational()
        }
      } catch (error) {
        // Belirli bir ülke için örnek numara bulunamazsa uyarı ver ama devam et
        console.warn(`[getCountries] Could not get example for ${iso2}:`, error)
      }

      return {
        iso2,
        name: countryNames.of(iso2) || iso2,
        dialCode: getCountryCallingCode(iso2),
        format,
      }
    })
  } catch (error) {
    // Intl API'si başarısız olursa konsola hata yaz ve boş bir dizi dön.
    console.error('Uluslararası ülke listesi oluşturulurken hata:', error)
    return []
  }
}

/**
 * Ülke listesini, belirtilen dilde oluşturur.
 * @param locale - 'tr-TR', 'en-US' gibi bir locale string'i.
 */
export const getCountryOptions = (locale: string): CountryOption[] => {
  try {
    const countryNames = new Intl.DisplayNames([locale], { type: 'region' })
    const options = PRESET_COUNTRIES.map((iso2) => ({
      value: iso2,
      label: countryNames.of(iso2) || iso2,
      dialCode: getCountryCallingCode(iso2),
    }))

    // Ülkeleri lokal alfabeye göre sırala
    return options.sort((a, b) => a.label.localeCompare(b.label, locale))
  } catch (error) {
    console.error('Ülke listesi oluşturulurken hata:', error)
    // Hata durumunda boş liste dön
    return []
  }
}
