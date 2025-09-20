import {
  CURRENCY_COOKIE_NAME,
  CURRENCY_COOKIE_OPTIONS,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from '@/i18n/config-currency'
import Cookies from 'js-cookie'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SystemSettingsState {
  currency: Currency
}

interface SystemSettingsActions {
  setCurrency: (currencyCode: CurrencyCode) => void
}

type SystemSettingsStore = SystemSettingsState & SystemSettingsActions

interface SystemSettingsStoreProps extends PropsWithChildren {
  initialCurrency?: Currency
}

export function SystemSettingsStore({
  children,
  initialCurrency = DEFAULT_CURRENCY,
}: SystemSettingsStoreProps) {
  const [store] = useState(() =>
    createStore<SystemSettingsStore>()(
      immer((set) => ({
        currency: initialCurrency,

        setCurrency: (currencyCode: CurrencyCode) => {
          const newCurrency = SUPPORTED_CURRENCIES.find(
            (currency) => currency.code === currencyCode,
          )

          if (!newCurrency) {
            console.warn(`Unsupported currency code: ${currencyCode}`)
            return
          }

          set((state) => {
            state.currency = newCurrency
          })

          Cookies.set(CURRENCY_COOKIE_NAME, newCurrency.code, CURRENCY_COOKIE_OPTIONS)

          if (typeof window !== 'undefined') {
            localStorage.setItem('currency', newCurrency.code)
            document.documentElement.setAttribute('data-currency', newCurrency.code)
          }
        },
      })),
    ),
  )

  return (
    <SystemSettingsStoreContext.Provider value={store}>
      {children}
    </SystemSettingsStoreContext.Provider>
  )
}

const SystemSettingsStoreContext = createContext<StoreApi<SystemSettingsStore> | undefined>(
  undefined,
)

export function useSystemSettings() {
  const context = useContext(SystemSettingsStoreContext)
  if (!context) {
    throw new Error('useSystemSettingsStore must be used within SystemSettingsStore')
  }
  return useStore(context, (state) => state)
}
