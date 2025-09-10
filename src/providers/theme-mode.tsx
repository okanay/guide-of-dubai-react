import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import Cookies from 'js-cookie'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

declare global {
  type Theme = 'light' | 'dark' | 'system'
}

interface DataState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

type Props = PropsWithChildren & {
  initialTheme: Theme
}

export const THEME_SET: Theme[] = ['light', 'dark', 'system']
export const THEME_DEFAULT: Theme = 'system'
export const THEME_COOKIE_NAME = 'theme'
export const THEME_COOKIE_DURATION = 365

export function ThemeStore({ children, initialTheme }: Props) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set) => ({
        theme: initialTheme,
        setTheme: (theme) => {
          if (!THEME_SET.includes(theme)) return

          set({ theme })

          if (theme === 'system') {
            Cookies.remove(THEME_COOKIE_NAME)
            localStorage.removeItem('theme')
            document.documentElement.removeAttribute('data-theme')
            document.documentElement.removeAttribute('class')

            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
            const systemTheme = prefersDarkMode ? 'dark' : 'light'
            document.documentElement.setAttribute('data-theme', systemTheme)
            document.documentElement.className = systemTheme
          } else {
            Cookies.set(THEME_COOKIE_NAME, theme, { expires: THEME_COOKIE_DURATION })
            localStorage.setItem('theme', theme)
            document.documentElement.setAttribute('data-theme', theme)
            document.documentElement.className = theme
          }
        },
      })),
    ),
  )

  return <ThemeContext.Provider value={store}>{children}</ThemeContext.Provider>
}

export const getPreferedTheme = createServerFn({ method: 'GET' }).handler(async () => {
  const themeFromCookie = getCookie(THEME_COOKIE_NAME) as Theme | undefined

  if (themeFromCookie && THEME_SET.includes(themeFromCookie)) {
    return themeFromCookie
  }

  // The server cannot detect the OS preference, so it defaults to 'system' if no cookie is found.
  return THEME_DEFAULT
})

// Context and helper functions
type Context = StoreApi<DataState> | undefined
const ThemeContext = createContext<Context>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return useStore(context, (state) => state)
}

export const CreateThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
    (function() {
      try {
        function getCookieValue(name) {
          const regex = new RegExp('(^| )' + name + '=([^;]+)')
          const match = document.cookie.match(regex)
          return match ? match[2] : null
        }

        function getLocalStorageTheme() {
          try {
            return localStorage.getItem('theme')
          } catch (e) {
            return null
          }
        }

        function getSystemTheme() {
          return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }

        const cookieTheme = getCookieValue('${THEME_COOKIE_NAME}')
        const localTheme = getLocalStorageTheme()
        const savedTheme = cookieTheme || localTheme

        let resolvedTheme
        if (!savedTheme || savedTheme === 'system') {
          resolvedTheme = getSystemTheme()
        } else if (['light', 'dark'].includes(savedTheme)) {
          resolvedTheme = savedTheme
        } else {
          resolvedTheme = getSystemTheme()
        }

        const root = document.documentElement

        root.removeAttribute('data-theme')
        root.className = root.className.replace(/\b(light|dark|system)\b/g, '').trim()

        root.setAttribute('data-theme', resolvedTheme)
        root.className = (root.className + ' ' + resolvedTheme).trim()

        if (window.matchMedia) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

          function handleThemeChange(e) {
            const currentSavedTheme = getCookieValue('${THEME_COOKIE_NAME}') || getLocalStorageTheme()
            if (!currentSavedTheme || currentSavedTheme === 'system') {
              const newTheme = e.matches ? 'dark' : 'light'
              root.setAttribute('data-theme', newTheme)
              root.className = root.className.replace(/\b(light|dark|system)\b/g, '').trim()
              root.className = (root.className + ' ' + newTheme).trim()
            }
          }

          if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleThemeChange)
          } else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleThemeChange)
          }
        }

      } catch (error) {
        console.warn('Theme script error:', error)
        const root = document.documentElement
        root.setAttribute('data-theme', 'light')
        root.className = root.className.replace(/\b(light|dark|system)\b/g, '').trim()
        root.className = (root.className + ' light').trim()
      }
      })()
      `,
      }}
    />
  )
}
