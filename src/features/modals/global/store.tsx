import React, { createContext, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { modalManager } from '../components/manager'

// =============================================================================
// TYPES
// =============================================================================
export interface ModalInstance {
  id: string
  name: string
  props?: Record<string, any>
  isVisible: boolean
  replace?: boolean
  zIndex: number
  stackIndex: number
}

interface GlobalModalState {
  stack: ModalInstance[]
  nextZIndex: number
  currentStackIndex: number
}

interface GlobalModalActions {
  open: (
    name: string,
    options?: {
      replace?: boolean
      visible?: boolean
      props?: Record<string, any>
    },
  ) => string
  close: () => void
  closeModal: (id: string) => void
  closeByName: (name: string) => void
  goBack: () => void
  setVisible: (id: string, visible: boolean) => void
  getActiveModal: () => ModalInstance | null
  getModalByName: (name: string) => ModalInstance | null
  isModalOpen: (name: string) => boolean
  clear: () => void
  getCurrentStackIndex: () => number
  getVisibleModals: () => ModalInstance[]
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
        nextZIndex: 50,
        currentStackIndex: 0,

        // ACTIONS
        open: (name, options = {}) => {
          const { replace = false, visible = true, props = {} } = options
          const { stack, nextZIndex, currentStackIndex } = get()

          // Aynı isimde modal zaten açık mı kontrol et
          const existingModal = stack.find((modal) => modal.name === name)

          if (existingModal) {
            set((state) => {
              const modalIndex = state.stack.findIndex((m) => m.id === existingModal.id)
              if (modalIndex !== -1) {
                const modal = state.stack[modalIndex]
                modal.isVisible = true
                modal.props = { ...modal.props, ...props }
                modal.zIndex = state.nextZIndex
                modal.stackIndex = state.currentStackIndex
                state.nextZIndex += 10
                state.currentStackIndex += 1

                // En üste taşı
                state.stack.splice(modalIndex, 1)
                state.stack.push(modal)
              }
            })
            return existingModal.id
          }

          // Yeni modal instance oluştur
          const modalId = `modal_${name}_${Date.now()}`
          const newModal: ModalInstance = {
            id: modalId,
            name,
            props,
            isVisible: visible,
            replace,
            zIndex: nextZIndex,
            stackIndex: currentStackIndex,
          }

          set((state) => {
            // Replace true ise önceki modalları gizle
            if (replace && state.stack.length > 0) {
              state.stack.forEach((modal) => {
                modal.isVisible = false
              })
            }

            // Yeni modalı ekle
            state.stack.push(newModal)
            state.nextZIndex += 10
            state.currentStackIndex += 1

            // Body lock ekle - DEBUG
            const visibleModals = state.stack.filter((m) => m.isVisible)

            if (visibleModals.length === 1) {
              modalManager.openModal('body')
            }
          })

          return modalId
        },

        close: () => {
          const { stack } = get()
          if (stack.length === 0) {
            return
          }

          set((state) => {
            // En üstteki (son) modalı kaldır
            const removedModal = state.stack.pop()

            // Body lock durumunu güncelle
            const visibleModals = state.stack.filter((m) => m.isVisible)

            if (visibleModals.length === 0) {
              modalManager.closeModal('body')
            }

            // Eğer kaldırılan modal replace=true idi ve altında gizli modal varsa, onu görünür yap
            if (removedModal?.replace && state.stack.length > 0) {
              const lastModal = state.stack[state.stack.length - 1]
              if (!lastModal.isVisible) {
                lastModal.isVisible = true
              }
            }
          })
        },

        closeModal: (id: string) => {
          set((state) => {
            const modalIndex = state.stack.findIndex((modal) => modal.id === id)
            if (modalIndex === -1) {
              return
            }

            // Modalı kaldır
            state.stack.splice(modalIndex, 1)

            // Body lock durumunu güncelle
            const visibleModals = state.stack.filter((m) => m.isVisible)

            if (visibleModals.length === 0) {
              modalManager.closeModal('body')
            }
          })
        },

        closeByName: (name: string) => {
          set((state) => {
            const modalIndex = state.stack.findIndex((modal) => modal.name === name)
            if (modalIndex === -1) {
              return
            }

            // Modalı kaldır
            state.stack.splice(modalIndex, 1)

            // Body lock durumunu güncelle
            const visibleModals = state.stack.filter((m) => m.isVisible)
            if (visibleModals.length === 0) {
              modalManager.closeModal('body')
            }
          })
        },

        goBack: () => {
          const { stack } = get()
          if (stack.length === 0) return

          set((state) => {
            const currentModal = state.stack[state.stack.length - 1]

            // Mevcut modalı kaldır
            state.stack.pop()

            // Body lock durumunu güncelle
            const visibleModals = state.stack.filter((m) => m.isVisible)
            if (visibleModals.length === 0) {
              modalManager.closeModal('body')
            }

            // Eğer kaldırılan modal replace=true idi ve altında modal varsa, onu görünür yap
            if (currentModal?.replace && state.stack.length > 0) {
              const previousModal = state.stack[state.stack.length - 1]
              if (!previousModal.isVisible) {
                previousModal.isVisible = true
              }
            }
          })
        },

        setVisible: (id: string, visible: boolean) => {
          set((state) => {
            const modal = state.stack.find((m) => m.id === id)
            if (modal) {
              modal.isVisible = visible
            }

            // Body lock durumunu güncelle
            const visibleModals = state.stack.filter((m) => m.isVisible)
            if (visibleModals.length === 0) {
              modalManager.closeModal('body')
            } else if (visibleModals.length === 1 && visible) {
              modalManager.openModal('body')
            }
          })
        },

        getActiveModal: () => {
          const { stack } = get()
          const visibleModals = stack.filter((modal) => modal.isVisible)
          return visibleModals.length > 0 ? visibleModals[visibleModals.length - 1] : null
        },

        getModalByName: (name: string) => {
          const { stack } = get()
          return stack.find((modal) => modal.name === name) || null
        },

        isModalOpen: (name: string) => {
          const { stack } = get()
          const modal = stack.find((modal) => modal.name === name)
          return modal ? modal.isVisible : false
        },

        getCurrentStackIndex: () => {
          const { currentStackIndex } = get()
          return currentStackIndex
        },

        getVisibleModals: () => {
          const { stack } = get()
          return stack.filter((modal) => modal.isVisible)
        },

        clear: () => {
          set((state) => {
            state.stack = []
            state.nextZIndex = 50
            state.currentStackIndex = 0
            modalManager.closeModal('body')
          })
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
