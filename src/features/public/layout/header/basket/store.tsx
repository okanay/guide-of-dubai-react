// src/features/public/layout/header/basket/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface BasketModalState {
  isOpen: boolean
}

interface BasketModalActions {
  openModal: () => void
  closeModal: () => void
  toggleModal: () => void
}

type BasketModalStore = BasketModalState & BasketModalActions

export function BasketModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<BasketModalStore>()(
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
