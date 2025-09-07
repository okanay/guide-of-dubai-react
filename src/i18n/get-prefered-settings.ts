import { getCookie, getHeader } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { DEFAULT_LANGUAGE, I18N_COOKIE_NAME, SUPPORTED_LANGUAGES } from './config'
import { DEFAULT_CURRENCY, CURRENCY_COOKIE_NAME, SUPPORTED_CURRENCIES } from './currency-config'
import { THEME_COOKIE_NAME, THEME_DEFAULT, THEME_SET } from 'src/providers/theme-mode'

interface PreferredSettingsData {
  lang: string
}

interface PreferredSettingsResponse {
  language: typeof DEFAULT_LANGUAGE
  currency: typeof DEFAULT_CURRENCY
  theme: Theme
}

export const getPreferedSettings = createServerFn({ method: 'GET' })
  .validator((data: PreferredSettingsData) => data)
  .handler(async (ctx): Promise<PreferredSettingsResponse> => {
    const { lang: requestedLanguage } = ctx.data

    // Extract values from cookies and headers
    const languageCookie = getCookie(I18N_COOKIE_NAME)
    const currencyCookie = getCookie(CURRENCY_COOKIE_NAME)
    const themeCookie = getCookie(THEME_COOKIE_NAME) as Theme | undefined
    const browserLanguage = getHeader('accept-language')?.split(',')[0]?.trim()

    // Determine preferred language
    const language = determinePreferredLanguage({
      requestedLanguage,
      cookieLanguage: languageCookie,
      browserLanguage,
    })

    // Determine preferred currency
    const currency = determinePreferredCurrency(currencyCookie)

    // Determine preferred theme
    const theme = determinePreferredTheme(themeCookie)

    return {
      language,
      currency,
      theme,
    }
  })

/**
 * Determines the preferred language based on multiple sources
 */
function determinePreferredLanguage({
  requestedLanguage,
  cookieLanguage,
  browserLanguage,
}: {
  requestedLanguage: string
  cookieLanguage?: string
  browserLanguage?: string
}) {
  // 1. Check if requested language is supported
  if (requestedLanguage) {
    const matchedLanguage = findSupportedLanguageValue(requestedLanguage)
    if (matchedLanguage) return matchedLanguage
  }

  // 2. Check cookie language
  if (cookieLanguage) {
    const matchedLanguage = findSupportedLanguage(cookieLanguage)
    if (matchedLanguage) return matchedLanguage
  }

  // 3. Check browser language
  if (browserLanguage) {
    const matchedLanguage = findSupportedLanguage(browserLanguage)
    if (matchedLanguage) return matchedLanguage
  }

  // 4. Fallback to default
  return DEFAULT_LANGUAGE
}

/**
 * Finds a supported language that matches the given locale
 */
function findSupportedLanguage(locale: string) {
  return SUPPORTED_LANGUAGES.find(({ supportLocale }) => supportLocale.includes(locale as never))
}

function findSupportedLanguageValue(locale: string) {
  return SUPPORTED_LANGUAGES.find(({ value }) => value === locale)
}

/**
 * Determines the preferred currency based on cookie value
 */
function determinePreferredCurrency(currencyCookie?: string) {
  if (!currencyCookie) return DEFAULT_CURRENCY

  const matchedCurrency = SUPPORTED_CURRENCIES.find((currency) => currency.code === currencyCookie)
  return matchedCurrency || DEFAULT_CURRENCY
}

/**
 * Determines the preferred theme based on cookie value
 */
function determinePreferredTheme(themeCookie?: Theme) {
  if (!themeCookie || !THEME_SET.includes(themeCookie)) {
    return THEME_DEFAULT
  }

  return themeCookie
}
