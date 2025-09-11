import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// =============================================================================
// STORE DEFINITION
// =============================================================================
interface MobileMenuState {
  isOpen: boolean
  activeSubmenu: string | null
}

interface MobileMenuActions {
  openMenu: () => void
  closeMenu: () => void
  toggleMenu: () => void
  setActiveSubmenu: (submenu: string | null) => void
  goBack: () => void
}

type MobileMenuStore = MobileMenuState & MobileMenuActions

export function MobileMenuStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<MobileMenuStore>()(
      immer((set, get) => ({
        isOpen: false,
        activeSubmenu: null,

        openMenu: () => {
          set((state) => {
            state.isOpen = true
            state.activeSubmenu = null
          })
        },

        closeMenu: () => {
          set((state) => {
            state.isOpen = false
            state.activeSubmenu = null
          })
        },

        toggleMenu: () => {
          const { isOpen } = get()
          if (isOpen) {
            get().closeMenu()
          } else {
            get().openMenu()
          }
        },

        setActiveSubmenu: (submenu: string | null) => {
          set((state) => {
            state.activeSubmenu = submenu
          })
        },

        goBack: () => {
          set((state) => {
            state.activeSubmenu = null
          })
        },
      })),
    ),
  )

  return <MobileMenuStoreContext.Provider value={store}>{children}</MobileMenuStoreContext.Provider>
}

const MobileMenuStoreContext = createContext<StoreApi<MobileMenuStore> | undefined>(undefined)

export function useMobileMenu() {
  const context = useContext(MobileMenuStoreContext)
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuStore')
  }
  return useStore(context, (state) => state)
}
