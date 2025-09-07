import Cookies from 'js-cookie'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  I18N_COOKIE_NAME,
  I18N_COOKIE_OPTIONS,
  I18N_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from './config'
import i18nConfig from './index'

interface Context {
  language: Language
  isReady: boolean
  changeLanguage: (value: LanguageValue) => void
}

export const LanguageContext = createContext<Context | undefined>(undefined)

interface Props {
  children: React.ReactNode
  serverLanguage?: Language
}

export const LanguageProvider: React.FC<Props> = ({
  children,
  serverLanguage = DEFAULT_LANGUAGE,
}) => {
  const [isReady, setIsReady] = useState(false)
  const [language, setLanguage] = useState<Language>(serverLanguage)
  const i18n = i18nConfig(serverLanguage.value)

  const changeLanguage = useCallback(
    (value: LanguageValue) => {
      if (value === language.value) return

      const newLanguage = SUPPORTED_LANGUAGES.find((l) => l.value === value) || language

      // Persist preferences
      Cookies.set(I18N_COOKIE_NAME, newLanguage.locale, I18N_COOKIE_OPTIONS)

      if (typeof window !== 'undefined') {
        localStorage.setItem(I18N_STORAGE_KEY, newLanguage.locale)
        document.documentElement.lang = newLanguage.locale
      }

      // Change i18n and navigate
      i18n.changeLanguage(newLanguage.value).then(() => {
        setLanguage(newLanguage)

        // Update URL
        const currentPath = window.location.pathname
        const segments = currentPath.split('/').filter(Boolean)
        const [, ...restPath] = segments
      })
    },
    [language, i18n],
  )

  useEffect(() => {
    const handleReady = () => setIsReady(true)

    if (i18n.isInitialized) {
      setTimeout(handleReady, 0)
    } else {
      i18n.on('initialized', handleReady)
      i18n.on('loaded', handleReady)

      return () => {
        i18n.off('initialized', handleReady)
        i18n.off('loaded', handleReady)
      }
    }
  }, [i18n])

  return (
    <LanguageContext.Provider
      value={{
        language,
        isReady,
        changeLanguage,
      }}
    >
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}

export default LanguageProvider
