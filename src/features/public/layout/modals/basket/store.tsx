import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface BasketModalState {
  isOpen: boolean
  scopeId: string | null
}

interface BasketModalActions {
  openModal: (scopeId?: string) => void
  closeModal: () => void
  toggleModal: (scopeId?: string) => void
  setScopeId: (scopeId: string | null) => void
}

type BasketModalStore = BasketModalState & BasketModalActions

export function BasketModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<BasketModalStore>()(
      immer((set, get) => ({
        isOpen: false,
        scopeId: null,

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
      })),
    ),
  )

  return (
    <BasketModalStoreContext.Provider value={store}>{children}</BasketModalStoreContext.Provider>
  )
}

const BasketModalStoreContext = createContext<StoreApi<BasketModalStore> | undefined>(undefined)

export function useBasketModal() {
  const context = useContext(BasketModalStoreContext)
  if (!context) {
    throw new Error('useBasketModal must be used within BasketModalStore')
  }
  return useStore(context, (state) => state)
}
