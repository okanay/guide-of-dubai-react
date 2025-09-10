import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SearchModalState {
  isOpen: boolean
  scopeId: string | null
}

interface SearchModalActions {
  openModal: (scopeId?: string) => void
  closeModal: () => void
  toggleModal: (scopeId?: string) => void
  setScopeId: (scopeId: string | null) => void
}

type SearchModalStore = SearchModalState & SearchModalActions

export function SearchModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<SearchModalStore>()(
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
