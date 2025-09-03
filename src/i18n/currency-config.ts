import { CookieAttributes } from 'node_modules/@types/js-cookie'

declare global {
  type Currency = (typeof SUPPORTED_CURRENCIES)[number]
  type CurrencyCode = Currency['code']
  type CurrencySymbol = Currency['symbol']
}

export const SUPPORTED_CURRENCIES = [
  {
    code: 'aed',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    flag: '🇦🇪',
  },
  {
    code: 'usd',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
  },
  {
    code: 'eur',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
  },
  {
    code: 'gbp',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
  },
] as const

export const CURRENCY_CODES = SUPPORTED_CURRENCIES.map((currency) => currency.code)
export const DEFAULT_CURRENCY: Currency = SUPPORTED_CURRENCIES[1]

export const CURRENCY_STORAGE_KEY = 'currency'
export const CURRENCY_COOKIE_NAME = 'currency'
export const CURRENCY_COOKIE_OPTIONS = {
  expires: 365,
  path: '/',
  sameSite: 'lax' as CookieAttributes['sameSite'],
}

// API Header names
export const API_HEADERS = {
  LANGUAGE: 'CUSTOM_HEADER_LANGUAGE',
  CURRENCY: 'CUSTOM_HEADER_CURRENCY',
} as const
