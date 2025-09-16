import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface HeaderState {
  isCategoriesOpen: boolean
  isProfileOpen: boolean
  isInverted: boolean
}

interface HeaderActions {
  openCategories: () => void
  closeCategories: () => void
  toggleCategories: () => void
  setProfileOpen: (value: boolean) => void
  closeAll: () => void
}

type HeaderStore = HeaderState & HeaderActions

export function HeaderStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<HeaderStore>()(
      immer((set, get) => ({
        isCategoriesOpen: false,
        isProfileOpen: false,
        isInverted: false,

        openCategories: () => {
          set((state) => {
            // Önce profile'ı kapat
            state.isProfileOpen = false
            // Sonra category'yi aç
            state.isCategoriesOpen = true
            // İnvert'i aktifleştir
            state.isInverted = true
          })
        },

        closeCategories: () => {
          set((state) => {
            state.isCategoriesOpen = false
            // Sadece profile açık değilse invert'i kapat
            if (!state.isProfileOpen) {
              state.isInverted = false
            }
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

        setProfileOpen: (value: boolean) => {
          set((state) => {
            if (value) {
              // Profile açılıyorsa, category'yi kapat
              state.isCategoriesOpen = false
              state.isProfileOpen = true
              state.isInverted = true
            } else {
              // Profile kapanıyorsa
              state.isProfileOpen = false
              // Sadece category açık değilse invert'i kapat
              if (!state.isCategoriesOpen) {
                state.isInverted = false
              }
            }
          })
        },

        closeAll: () => {
          set((state) => {
            state.isCategoriesOpen = false
            state.isProfileOpen = false
            state.isInverted = false
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
