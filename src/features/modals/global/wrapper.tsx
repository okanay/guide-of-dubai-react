import { ClientOnly } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useGlobalModalStore } from './store'
import { modalManager } from './manager'

// =============================================================================
// MAIN PROVIDER COMPONENT
// =============================================================================
export const GlobalModalProvider: React.FC = () => {
  const { stack } = useGlobalModalStore()

  // Body lock yönetimi
  useEffect(() => {
    if (stack.length > 0) {
      modalManager.openModal('body')
    } else {
      modalManager.closeModal('body')
    }

    // Cleanup on unmount
    return () => {
      if (stack.length > 0) {
        modalManager.closeModal('body')
      }
    }
  }, [stack.length])

  if (stack.length === 0) return null

  return createPortal(
    <ClientOnly fallback={null}>
      <div
        id="global-modal-container"
        className="pointer-events-none fixed inset-0 z-1000"
        data-stack-count={stack.length}
      >
        {stack.map((modal) => (
          <ModalLayer key={modal.id} modal={modal} />
        ))}
      </div>
    </ClientOnly>,
    document.body,
  )
}

// =============================================================================
// MODAL LAYER COMPONENT
// =============================================================================
interface ModalLayerProps {
  modal: {
    id: string
    component: React.ComponentType<any>
    props: Record<string, any>
    zIndex: number
  }
}

const ModalLayer: React.FC<ModalLayerProps> = ({ modal }) => {
  const { close, goBack, getTopModal } = useGlobalModalStore()

  useEffect(() => {
    const isTopModal = () => {
      const topModal = getTopModal()
      return topModal?.id === modal.id
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isTopModal()) {
        goBack()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      if (!isTopModal()) return

      // Scrim check - data-scrim true ise modal'ı kapat
      const scrimElement = document.querySelector('[data-scrim="true"]')
      if (scrimElement && scrimElement.contains(target)) {
        goBack()
        return
      }

      // Modal content'e tıklanmışsa return et
      const modalElement = document.querySelector(`[data-modal-id="${modal.id}"]`)
      if (modalElement && modalElement.contains(target)) return

      // Dropdown check (mevcut logic'i koru)
      if (isDropdownElement(target)) return

      // Outside click - modal'ı kapat
      goBack()
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [modal.id, close, goBack, getTopModal])

  const Component = modal.component

  return (
    <div
      className="fixed inset-0 flex h-[100dvh] w-screen items-center justify-center md:p-4"
      style={{
        zIndex: modal.zIndex,
        pointerEvents: 'auto',
      }}
      data-modal-id={modal.id}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" data-theme="force-main" data-scrim={true} />

      {/* Modal Content */}
      <Component {...modal.props} />
    </div>
  )
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const isDropdownElement = (element: Element | null): boolean => {
  if (!element) return false

  // Element kendisi dropdown mu?
  if (element.id?.startsWith('dropdown-')) return true

  // Parent elementleri kontrol et
  let currentElement = element.parentElement
  while (currentElement) {
    if (currentElement.id?.startsWith('dropdown-')) return true
    currentElement = currentElement.parentElement
  }

  return false
}
