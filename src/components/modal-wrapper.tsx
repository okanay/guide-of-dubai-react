import { ClientOnly } from '@tanstack/react-router'
import React, { useEffect, useRef, ReactNode, cloneElement, isValidElement } from 'react'
import { createPortal } from 'react-dom'

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
   * Body scroll'u kilitle
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
  containerClassName = 'fixed inset-0 z-50 flex items-start justify-start p-0 md:items-center md:justify-center md:p-4',
  overlayClassName = 'absolute inset-0 hidden bg-black/50 dark:bg-white/50 md:block',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Body scroll lock
  useEffect(() => {
    if (lockBodyScroll && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, lockBodyScroll])

  // Outside click handler - Global event listener approach
  useEffect(() => {
    if (!isOpen || disableOutsideClick) return

    const handleClickOutside = (event: MouseEvent) => {
      // Content ref'i varsa ve tıklama content'in dışındaysa modal'ı kapat
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Event listener'ı document'e ekle
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
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
  const scopeElement = scopeId
    ? scopeId === 'body'
      ? document.body
      : document.getElementById(scopeId)
    : document.body

  return createPortal(
    <ClientOnly fallback={<div />}>
      <div ref={overlayRef} className={containerClassName} role="dialog" aria-modal="true">
        {/* Overlay */}
        <div className={overlayClassName} />

        {/* Modal Content - Ref ile sarmalanmış */}
        {cloneChildrenWithRef(children)}
      </div>
    </ClientOnly>,
    scopeElement!,
  )
}
