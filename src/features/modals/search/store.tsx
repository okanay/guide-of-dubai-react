import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface SearchModalState {
  searchQuery: string
  searchResults: any[]
  isLoading: boolean
}

interface SearchModalActions {
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  setLoading: (loading: boolean) => void
}

type SearchModalStore = SearchModalState & SearchModalActions

export function SearchModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<SearchModalStore>()(
      immer((set, get) => ({
        // Initial state
        searchQuery: '',
        searchResults: [],
        isLoading: false,

        // Actions - future search logic
        setSearchQuery: (query) => {
          set((state) => {
            state.searchQuery = query
          })
        },

        clearSearch: () => {
          set((state) => {
            state.searchQuery = ''
            state.searchResults = []
            state.isLoading = false
          })
        },

        setLoading: (loading) => {
          set((state) => {
            state.isLoading = loading
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
