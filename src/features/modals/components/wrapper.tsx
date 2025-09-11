// src/features/modals/components/wrapper.tsx
import { ClientOnly } from '@tanstack/react-router'
import React, { useEffect, useRef, ReactNode, cloneElement, isValidElement } from 'react'
import { createPortal } from 'react-dom'
import { useModalBodyLock } from './use-modal-body-lock'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
export interface ModalWrapperProps {
  /**
   * Modal açık/kapalı durumu
   */
  isOpen: boolean
  /**
   * Modal kapatma fonksiyonu
   */
  onClose: () => void
  /**
   * Modal içeriği (tamamen sizin kontrolünüzde)
   */
  children: ReactNode
  /**
   * Modal render edileceği element ID'si
   * @default 'body'
   */
  scopeId?: string | null
  /**
   * Outside click ile kapatmayı devre dışı bırak
   * @default false
   */
  disableOutsideClick?: boolean
  /**
   * Body scroll'u kilitle (Global Modal Manager ile yönetilir)
   * @default true
   */
  lockBodyScroll?: boolean
  /**
   * Container className (tam özelleştirme için)
   */
  containerClassName?: string
  /**
   * Overlay className (özelleştirme için)
   */
  overlayClassName?: string
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  scopeId = 'body',
  disableOutsideClick = false,
  lockBodyScroll = true,
  containerClassName = 'fixed inset-0 z-50 flex h-[100dvh] w-screen items-start justify-start p-0 md:items-center md:justify-center md:p-4',
  overlayClassName = 'absolute inset-0 bg-black/30 md:bg-black/50',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Scope ID'yi normalize et
  const normalizedScopeId = scopeId || 'body'

  // Global modal body lock kullan - scope-aware
  useModalBodyLock(lockBodyScroll && isOpen, normalizedScopeId)

  // Outside click handler
  useEffect(() => {
    if (!isOpen || disableOutsideClick) return

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, disableOutsideClick, onClose])

  // Children'a ref ekleme fonksiyonu
  const cloneChildrenWithRef = (children: ReactNode) => {
    if (isValidElement(children)) {
      return cloneElement(children, {
        ref: contentRef,
        ...(children.props as any),
      })
    }

    return <div ref={contentRef}>{children}</div>
  }

  if (!isOpen) return null

  // Find scope element
  const scopeElement =
    normalizedScopeId === 'body' ? document.body : document.getElementById(normalizedScopeId)

  if (!scopeElement) {
    console.warn(`Scope element not found: ${normalizedScopeId}`)
    return null
  }

  return createPortal(
    <ClientOnly fallback={<div />}>
      <div ref={overlayRef} className={containerClassName} role="dialog" aria-modal="true">
        {/* Overlay */}
        <div data-theme="force-main" className={overlayClassName} />

        {/* Modal Content - Orijinal boyutlarıyla */}
        {cloneChildrenWithRef(children)}
      </div>
    </ClientOnly>,
    scopeElement,
  )
}
