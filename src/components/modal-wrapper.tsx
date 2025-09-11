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
// UTILITIES
// =============================================================================
const isSafariIOS = () => {
  if (typeof window === 'undefined') return false

  const userAgent = window.navigator.userAgent.toLowerCase()
  const isSafari = /safari/.test(userAgent) && !/chrome|chromium|crios|fxios|opios/.test(userAgent)
  const isIOS = /iphone|ipad|ipod/.test(userAgent)

  return isSafari && isIOS
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
  const originalScrollY = useRef<number>(0)

  // Safari iOS liquid glass fix - Basit ve etkili
  useEffect(() => {
    if (!isOpen) return

    if (isSafariIOS()) {
      // Scroll pozisyonunu kaydet
      originalScrollY.current = window.scrollY

      // Body'yi sabitle - Safari liquid glass fix
      document.body.style.position = 'fixed'
      document.body.style.top = `-${originalScrollY.current}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
    } else if (lockBodyScroll) {
      // Normal tarayıcılar için basit scroll lock
      document.body.style.overflow = 'hidden'
    }

    return () => {
      if (isSafariIOS()) {
        // Safari styles'ı temizle ve scroll'u restore et
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, originalScrollY.current)
      } else {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen, lockBodyScroll])

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
  const scopeElement = scopeId
    ? scopeId === 'body'
      ? document.body
      : document.getElementById(scopeId)
    : document.body

  return createPortal(
    <ClientOnly fallback={<div />}>
      <div
        ref={overlayRef}
        className={containerClassName}
        role="dialog"
        aria-modal="true"
        style={{
          // Safari iOS için ekstra yüksek z-index
          zIndex: isSafariIOS() ? 2147483647 : undefined,
        }}
      >
        {/* Overlay */}
        <div className={overlayClassName} />

        {/* Modal Content - Orijinal boyutlarıyla */}
        {cloneChildrenWithRef(children)}
      </div>
    </ClientOnly>,
    scopeElement!,
  )
}
