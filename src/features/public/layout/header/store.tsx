import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface HeaderState {
  isCategoriesOpen: boolean
  isMobileMenuOpen: boolean
}

interface HeaderActions {
  openCategories: () => void
  closeCategories: () => void
  toggleCategories: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleMobileMenu: () => void
  closeAll: () => void
}

type HeaderStore = HeaderState & HeaderActions

export function HeaderStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<HeaderStore>()(
      immer((set, get) => ({
        isCategoriesOpen: false,
        isMobileMenuOpen: false,

        openCategories: () => {
          set((state) => {
            state.isCategoriesOpen = true
            state.isMobileMenuOpen = false
          })
        },

        closeCategories: () => {
          set((state) => {
            state.isCategoriesOpen = false
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

        openMobileMenu: () => {
          set((state) => {
            state.isMobileMenuOpen = true
            state.isCategoriesOpen = false
          })
        },

        closeMobileMenu: () => {
          set((state) => {
            state.isMobileMenuOpen = false
          })
        },

        toggleMobileMenu: () => {
          const { isMobileMenuOpen } = get()
          if (isMobileMenuOpen) {
            get().closeMobileMenu()
          } else {
            get().openMobileMenu()
          }
        },

        closeAll: () => {
          set((state) => {
            state.isCategoriesOpen = false
            state.isMobileMenuOpen = false
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
