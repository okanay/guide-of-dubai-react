import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import Cookies from 'js-cookie'
import {
  CURRENCY_COOKIE_NAME,
  CURRENCY_COOKIE_OPTIONS,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from 'src/i18n/currency-config'

interface SystemSettingsModalState {
  isOpen: boolean
  scopeId: string | null
  currency: Currency
}

interface SystemSettingsModalActions {
  openModal: (scopeId?: string) => void
  closeModal: () => void
  toggleModal: (scopeId?: string) => void
  setScopeId: (scopeId: string | null) => void
  setCurrency: (currencyCode: CurrencyCode) => void
}

type SystemSettingsModalStore = SystemSettingsModalState & SystemSettingsModalActions

interface SystemSettingsModalStoreProps extends PropsWithChildren {
  initialCurrency?: Currency
}

export function SystemSettingsModalStore({
  children,
  initialCurrency = DEFAULT_CURRENCY,
}: SystemSettingsModalStoreProps) {
  const [store] = useState(() =>
    createStore<SystemSettingsModalStore>()(
      immer((set, get) => ({
        isOpen: false,
        scopeId: null,
        currency: initialCurrency,

        openModal: (scopeId = 'body') => {
          set((state) => {
            state.isOpen = true
            state.scopeId = scopeId
          })
        },

        closeModal: () => {
          set((state) => {
            state.isOpen = false
            state.scopeId = null
          })
        },

        toggleModal: (scopeId = 'body') => {
          const { isOpen } = get()
          if (isOpen) {
            get().closeModal()
          } else {
            get().openModal(scopeId)
          }
        },

        setScopeId: (scopeId) => {
          set((state) => {
            state.scopeId = scopeId
          })
        },

        setCurrency: (currencyCode: CurrencyCode) => {
          const newCurrency = SUPPORTED_CURRENCIES.find(
            (currency) => currency.code === currencyCode,
          )

          if (!newCurrency) {
            console.warn(`Unsupported currency code: ${currencyCode}`)
            return
          }

          // Update currency in store
          set((state) => {
            state.currency = newCurrency
          })

          // Persist to cookie and localStorage
          Cookies.set(CURRENCY_COOKIE_NAME, newCurrency.code, CURRENCY_COOKIE_OPTIONS)

          if (typeof window !== 'undefined') {
            localStorage.setItem('currency', newCurrency.code)

            // Update HTML data attribute for CSS theming
            document.documentElement.setAttribute('data-currency', newCurrency.code)
          }
        },
      })),
    ),
  )

  return (
    <SystemSettingsModalStoreContext.Provider value={store}>
      {children}
    </SystemSettingsModalStoreContext.Provider>
  )
}

const SystemSettingsModalStoreContext = createContext<
  StoreApi<SystemSettingsModalStore> | undefined
>(undefined)

export function useSystemSettings() {
  const context = useContext(SystemSettingsModalStoreContext)
  if (!context) {
    throw new Error('useSystemSettingsModal must be used within SystemSettingsModalStore')
  }
  return useStore(context, (state) => state)
}
