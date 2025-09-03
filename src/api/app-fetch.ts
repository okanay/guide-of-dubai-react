import { getHeaders, setCookie } from '@tanstack/react-start/server'

export const AppFetch = async (url: string, options: RequestInit = {}) => {
  const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL
  const clientHeaders = getHeaders()

  const headersToForward = new Headers({
    ...options.headers,
    ...clientHeaders,
    'X-True-Client-IP': clientHeaders['cf-connecting-ip'] || '',
  })

  // Backend'e fetch isteğini yap
  const backendResponse = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers: headersToForward,
  })

  // Set-Cookie header'ını işle
  const setCookieHeader = backendResponse.headers.get('Set-Cookie')
  if (setCookieHeader) {
    setCookie(setCookieHeader, '')
  }

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    headers: backendResponse.headers,
  })
}
