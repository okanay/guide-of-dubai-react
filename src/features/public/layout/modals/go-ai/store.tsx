import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface GoAiModalState {
  isOpen: boolean
  scopeId: string | null
}

interface GoAiModalActions {
  openModal: (scopeId?: string) => void
  closeModal: () => void
  toggleModal: (scopeId?: string) => void
  setScopeId: (scopeId: string | null) => void
}

type GoAiModalStore = GoAiModalState & GoAiModalActions

export function GoAiModalStore({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<GoAiModalStore>()(
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

  return <GoAiModalStoreContext.Provider value={store}>{children}</GoAiModalStoreContext.Provider>
}

const GoAiModalStoreContext = createContext<StoreApi<GoAiModalStore> | undefined>(undefined)

export function useGoAiModal() {
  const context = useContext(GoAiModalStoreContext)
  if (!context) {
    throw new Error('useGoAiModal must be used within GoAiModalStore')
  }
  return useStore(context, (state) => state)
}
