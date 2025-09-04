// src/features/public/layout/header/auth/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface AuthModalState {
  isOpen: boolean
  mode: 'login' | 'register' | 'forgot-password' | 'verify'
}

interface AuthModalActions {
  openModal: (mode?: 'login' | 'register' | 'forgot-password' | 'verify') => void
  closeModal: () => void
  setMode: (mode: 'login' | 'register' | 'forgot-password' | 'verify') => void
}

type AuthModalStore = AuthModalState & AuthModalActions

export function AuthModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<AuthModalStore>()(
      immer((set) => ({
        isOpen: false,
        mode: 'login',

        openModal: (mode = 'login') => {
          set((state) => {
            state.isOpen = true
            state.mode = mode
          })
        },

        closeModal: () => {
          set((state) => {
            state.isOpen = false
          })
        },

        setMode: (mode) => {
          set((state) => {
            state.mode = mode
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
