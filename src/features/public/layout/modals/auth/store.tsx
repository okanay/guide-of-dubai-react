import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// Genişletilmiş mod türleri
export type AuthModalMode =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify'
  | 'email-login'
  | 'phone-login'

interface AuthModalState {
  isOpen: boolean
  mode: AuthModalMode
  scopeId: string | null
}

interface AuthModalActions {
  openModal: (mode?: AuthModalMode, scopeId?: string) => void
  closeModal: () => void
  setMode: (mode: AuthModalMode) => void
  setScopeId: (scopeId: string | null) => void
}

type AuthModalStore = AuthModalState & AuthModalActions

export function AuthModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<AuthModalStore>()(
      immer((set) => ({
        isOpen: false,
        mode: 'login', // Varsayılan mod
        scopeId: null,

        openModal: (mode = 'login', scopeId = 'body') => {
          set((state) => {
            state.isOpen = true
            state.mode = mode
            state.scopeId = scopeId
          })
        },

        closeModal: () => {
          set((state) => {
            state.isOpen = false
            state.scopeId = null
          })
        },

        setMode: (mode) => {
          set((state) => {
            state.mode = mode
          })
        },

        setScopeId: (scopeId) => {
          set((state) => {
            state.scopeId = scopeId
          })
        },
      })),
    ),
  )

  return <AuthModalStoreContext.Provider value={store}>{children}</AuthModalStoreContext.Provider>
}

const AuthModalStoreContext = createContext<StoreApi<AuthModalStore> | undefined>(undefined)

export function useAuthModal() {
  const context = useContext(AuthModalStoreContext)
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalStore')
  }
  return useStore(context, (state) => state)
}
