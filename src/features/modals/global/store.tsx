import React, { createContext, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// =============================================================================
// TYPES
// =============================================================================
export interface ModalInstance {
  id: string
  component: React.ComponentType<any>
  props: Record<string, any>
  resolve?: (data?: any) => void
  reject?: (error?: any) => void
  zIndex: number
  createdAt: number
}

interface GlobalModalState {
  stack: ModalInstance[]
  nextZIndex: number
}

interface GlobalModalActions {
  open: <T = any>(component: React.ComponentType<any>, props?: Record<string, any>) => Promise<T>
  close: (id: string, data?: any) => void
  goBack: (data?: any) => void
  clear: () => void
  isOpen: (id?: string) => boolean
  getTopModal: () => ModalInstance | null
  getStackCount: () => number
}

type GlobalModalStore = GlobalModalState & GlobalModalActions

// =============================================================================
// PROVIDER
// =============================================================================
interface GlobalModalStoreProps {
  children: React.ReactNode
}

export function GlobalModalStoreProvider({ children }: GlobalModalStoreProps) {
  const [store] = useState(() =>
    createStore<GlobalModalStore>()(
      immer((set, get) => ({
        // INITIAL STATE
        stack: [],
        nextZIndex: 1000,

        // ACTIONS
        open: <T = any,>(
          component: React.ComponentType<any>,
          props: Record<string, any> = {},
        ): Promise<T> => {
          return new Promise<T>((resolve, reject) => {
            const modalId = `modal_${Date.now()}_${Math.random().toString(36).slice(2)}`

            const newModal: ModalInstance = {
              id: modalId,
              component,
              props: {
                ...props,
                // Modal'a otomatik olarak close fonksiyonunu geç
                onClose: (data?: any) => get().close(modalId, data),
                onGoBack: (data?: any) => get().goBack(data),
              },
              resolve,
              reject,
              zIndex: get().nextZIndex,
              createdAt: Date.now(),
            }

            set((state) => {
              state.stack.push(newModal)
              state.nextZIndex += 10
            })
          })
        },

        close: (id: string, data?: any) => {
          set((state) => {
            const modalIndex = state.stack.findIndex((modal) => modal.id === id)
            if (modalIndex === -1) return

            const modal = state.stack[modalIndex]

            // Promise'i resolve et
            if (modal.resolve) {
              modal.resolve(data)
            }

            // Modal'ı stack'ten kaldır
            state.stack.splice(modalIndex, 1)
          })
        },

        goBack: (data?: any) => {
          set((state) => {
            if (state.stack.length === 0) return

            // En üstteki (son) modal'ı al
            const topModal = state.stack[state.stack.length - 1]

            // Promise'i resolve et
            if (topModal.resolve) {
              topModal.resolve(data)
            }

            // Stack'ten kaldır
            state.stack.pop()
          })
        },

        clear: () => {
          set((state) => {
            // Tüm promise'leri reject et
            state.stack.forEach((modal) => {
              if (modal.reject) {
                modal.reject(new Error('Modal cleared'))
              }
            })

            state.stack = []
            state.nextZIndex = 1000
          })
        },

        isOpen: (id?: string) => {
          const { stack } = get()
          if (id) {
            return stack.some((modal) => modal.id === id)
          }
          return stack.length > 0
        },

        getTopModal: () => {
          const { stack } = get()
          return stack.length > 0 ? stack[stack.length - 1] : null
        },

        getStackCount: () => {
          const { stack } = get()
          return stack.length
        },
      })),
    ),
  )

  return (
    <GlobalModalStoreContext.Provider value={store}>{children}</GlobalModalStoreContext.Provider>
  )
}

const GlobalModalStoreContext = createContext<StoreApi<GlobalModalStore> | undefined>(undefined)

// =============================================================================
// HOOK
// =============================================================================
export function useGlobalModalStore() {
  const context = useContext(GlobalModalStoreContext)
  if (!context) {
    throw new Error('useGlobalModalStore must be used within GlobalModalStoreProvider')
  }
  return useStore(context, (state) => state)
}

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Modal açmak için convenience hook
 * Örnek kullanım:
 * const modal = useModal()
 * const result = await modal.open(AuthModal, { mode: 'login' })
 */
export function useModal() {
  const { open, close, goBack } = useGlobalModalStore()

  return {
    open,
    close,
    goBack,
  }
}

/**
 * Modal içinde kullanılmak üzere convenience hook
 * Modal component'leri bu hook ile kendi durumlarını yönetebilir
 */
export function useModalInstance() {
  const store = useGlobalModalStore()

  return {
    close: (data?: any) => store.goBack(data),
    isTopModal: () => {
      const topModal = store.getTopModal()
      return topModal !== null
    },
    stackCount: store.getStackCount(),
  }
}
