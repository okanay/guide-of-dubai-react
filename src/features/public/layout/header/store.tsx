import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface HeaderState {
  isCategoriesOpen: boolean
  isInverted: boolean
}

interface HeaderActions {
  openCategories: () => void
  closeCategories: () => void
  toggleCategories: () => void
  setInverted: (value: boolean) => void
  closeAll: () => void
}

type HeaderStore = HeaderState & HeaderActions

export function HeaderStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<HeaderStore>()(
      immer((set, get) => ({
        isCategoriesOpen: false,
        isInverted: false,

        openCategories: () => {
          set((state) => {
            state.isCategoriesOpen = true
            state.isInverted = true
          })
        },

        closeCategories: () => {
          set((state) => {
            state.isCategoriesOpen = false
            state.isInverted = false
          })
        },

        toggleCategories: () => {
          const { isCategoriesOpen } = get()
          if (isCategoriesOpen) {
            get().closeCategories()
          } else {
            get().openCategories()
          }
        },

        setInverted: (value: boolean) => {
          set((state) => {
            state.isInverted = value
          })
        },

        closeAll: () => {
          set((state) => {
            state.isCategoriesOpen = false
          })
        },
      })),
    ),
  )

  return <HeaderStoreContext.Provider value={store}>{children}</HeaderStoreContext.Provider>
}

const HeaderStoreContext = createContext<StoreApi<HeaderStore> | undefined>(undefined)

export function useHeader() {
  const context = useContext(HeaderStoreContext)
  if (!context) {
    throw new Error('useHeader must be used within HeaderStore')
  }
  return useStore(context, (state) => state)
}
