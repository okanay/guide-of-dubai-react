import { ClientOnly } from '@tanstack/react-router'
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { SearchModalComponent } from '../search/modal'
import { ModalInstance, useGlobalModalStore } from './store'
import { MobileMenuComponent } from '@/features/public/layout/header/mobile-menu'

// =============================================================================
// MAIN RENDERER
// =============================================================================
export const GlobalModalRenderer: React.FC = () => {
  const { stack } = useGlobalModalStore()

  if (stack.length === 0) return null

  return createPortal(
    <ClientOnly fallback={null}>
      <div
        id="global-modal-container"
        className="pointer-events-none"
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
// MODAL LAYER
// =============================================================================
interface ModalLayerProps {
  modal: ModalInstance
}

const ModalLayer: React.FC<ModalLayerProps> = ({ modal }) => {
  const { close, goBack, getVisibleModals } = useGlobalModalStore()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Outside click logic
  useEffect(() => {
    if (!modal.isVisible) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element

      // İlk kontrol: Modal content'e tıklanmış mı?
      if (contentRef.current && contentRef.current.contains(target as Node)) {
        return
      }

      // İkinci kontrol: Overlay'e tıklanmış mı?
      if (overlayRef.current && !overlayRef.current.contains(target as Node)) {
        return
      }

      // Üçüncü kontrol: Bu modal en üstteki modal mı?
      const visibleModals = getVisibleModals()
      const topModal = visibleModals.reduce(
        (top, current) => (current.stackIndex > top.stackIndex ? current : top),
        visibleModals[0],
      )

      if (modal.id !== topModal?.id) {
        return
      }

      close()
    }

    // mousedown yerine click kullanarak daha güvenli olalım
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [modal.isVisible, modal.id, modal.stackIndex, close, getVisibleModals])

  // ESC key handling
  useEffect(() => {
    if (!modal.isVisible) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      const visibleModals = getVisibleModals()
      const topModal = visibleModals.reduce(
        (top, current) => (current.stackIndex > top.stackIndex ? current : top),
        visibleModals[0],
      )

      if (modal.id === topModal?.id) {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modal.isVisible, modal.id, close, getVisibleModals])

  // Modal component'i name'e göre seç
  const renderModalComponent = () => {
    const commonProps = {
      ...modal.props,
      onClose: close,
      onGoBack: goBack,
      ref: contentRef,
    }

    switch (modal.name) {
      case 'search':
        return <SearchModalComponent {...commonProps} />
      case 'mobile-menu':
        return <MobileMenuComponent {...commonProps} />
      default:
        console.warn(`Unknown modal: ${modal.name}`)
        return <div className="bg-red-100 p-4 text-red-800">Unknown modal: {modal.name}</div>
    }
  }

  // Modal görünür değilse render etme
  if (!modal.isVisible) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex h-[100dvh] w-screen items-start justify-start p-0 md:items-center md:justify-center md:p-4"
      role="dialog"
      aria-modal="true"
      data-modal-name={modal.name}
      data-modal-id={modal.id}
      data-stack-index={modal.stackIndex}
      style={{
        zIndex: modal.zIndex,
        pointerEvents: 'auto',
      }}
    >
      {/* Overlay - Bu sadece background */}
      <div className="absolute inset-0 bg-black/30 md:bg-black/50" data-theme="force-main" />

      {/* Modal Content Container */}
      {renderModalComponent()}
    </div>
  )
}
