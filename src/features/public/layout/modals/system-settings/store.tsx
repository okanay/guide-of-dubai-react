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

type ModalMode = 'main' | 'language' | 'currency' | 'theme'

interface SystemSettingsModalState {
  isOpen: boolean
  scopeId: string | null
  currency: Currency
  mode: ModalMode
}

interface SystemSettingsModalActions {
  openModal: (mode?: ModalMode, scopeId?: string) => void
  closeModal: () => void
  toggleModal: (mode?: ModalMode, scopeId?: string) => void
  setScopeId: (scopeId: string | null) => void
  setCurrency: (currencyCode: CurrencyCode) => void
  setMode: (mode: ModalMode) => void
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
        mode: 'main',

        openModal: (mode = 'main', scopeId = 'body') => {
          set((state) => {
            state.isOpen = true
            state.scopeId = scopeId
            state.mode = mode
          })
        },

        closeModal: () => {
          set((state) => {
            state.isOpen = false
            state.scopeId = null
          })
        },

        toggleModal: (mode = 'main', scopeId = 'body') => {
          const { isOpen } = get()
          if (isOpen) {
            get().closeModal()
          } else {
            get().openModal(mode, scopeId)
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

          set((state) => {
            state.currency = newCurrency
          })

          Cookies.set(CURRENCY_COOKIE_NAME, newCurrency.code, CURRENCY_COOKIE_OPTIONS)

          if (typeof window !== 'undefined') {
            localStorage.setItem('currency', newCurrency.code)
            document.documentElement.setAttribute('data-currency', newCurrency.code)
          }
        },
        setMode: (mode) => {
          set((state) => {
            state.mode = mode
          })
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
