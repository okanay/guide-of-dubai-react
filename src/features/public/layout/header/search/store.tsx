// src/features/public/layout/header/search/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SearchModalState {
  isOpen: boolean
}

interface SearchModalActions {
  openModal: () => void
  closeModal: () => void
  toggleModal: () => void
}

type SearchModalStore = SearchModalState & SearchModalActions

export function SearchModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<SearchModalStore>()(
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
    <SearchModalStoreContext.Provider value={store}>{children}</SearchModalStoreContext.Provider>
  )
}

const SearchModalStoreContext = createContext<StoreApi<SearchModalStore> | undefined>(undefined)

export function useSearchModal() {
  const context = useContext(SearchModalStoreContext)
  if (!context) {
    throw new Error('useSearchModal must be used within SearchModalStore')
  }
  return useStore(context, (state) => state)
}
