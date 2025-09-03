import { getHeaders, setCookie, getCookie } from '@tanstack/react-start/server'
import { DEFAULT_LANGUAGE } from 'src/i18n/config'
import { DEFAULT_CURRENCY } from 'src/i18n/currency-config'

interface AppFetchOptions extends RequestInit {
  overrideLanguage?: string
  overrideCurrency?: string
}

export const AppFetch = async (url: string, options: AppFetchOptions = {}) => {
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL
  const clientHeaders = getHeaders()

  const languageCookie = getCookie('language') || DEFAULT_LANGUAGE.value
  const currencyCookie = getCookie('currency') || DEFAULT_CURRENCY.code

  const customHeaders = {
    'X-Language': options.overrideLanguage || languageCookie,
    'X-Currency': options.overrideCurrency || currencyCookie,
  }

  const { overrideLanguage, overrideCurrency, ...cleanOptions } = options

  const headersToForward = new Headers({
    ...cleanOptions.headers,
    ...clientHeaders,
    ...customHeaders,
    'X-True-Client-IP': clientHeaders['cf-connecting-ip'] || '',
  })

  // Backend'e fetch isteğini yap
  const response = await fetch(`${BACKEND_URL}${url}`, {
    ...cleanOptions,
    headers: headersToForward,
  })

  // Set-Cookie header'ını işle
  const setCookieHeader = response.headers.get('Set-Cookie')
  if (setCookieHeader) {
    setCookie(setCookieHeader, '')
  }

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  })
}
