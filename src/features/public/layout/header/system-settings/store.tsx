// src/features/public/layout/header/system-settings/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SystemSettingsModalState {
  isOpen: boolean
}

interface SystemSettingsModalActions {
  openModal: () => void
  closeModal: () => void
  toggleModal: () => void
}

type SystemSettingsModalStore = SystemSettingsModalState & SystemSettingsModalActions

export function SystemSettingsModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<SystemSettingsModalStore>()(
      immer((set, get) => ({
        isOpen: false,

        openModal: () => {
          set((state) => {
            state.isOpen = true
          })
        },

        closeModal: () => {
          set((state) => {
            state.isOpen = false
          })
        },

        toggleModal: () => {
          const { isOpen } = get()
          if (isOpen) {
            get().closeModal()
          } else {
            get().openModal()
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

export function useSystemSettingsModal() {
  const context = useContext(SystemSettingsModalStoreContext)
  if (!context) {
    throw new Error('useSystemSettingsModal must be used within SystemSettingsModalStore')
  }
  return useStore(context, (state) => state)
}
