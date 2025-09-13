// src/features/public/components/form-ui/dropdown.tsx
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import useClickOutside from '@/hooks/use-click-outside'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
interface DropdownPortalProps {
  isOpen: boolean
  triggerRef: any // Basit tutalım, type hatası istemiyoruz
  children: React.ReactNode
  className?: string
  onClose: () => void
  placement?: 'bottom-start' | 'bottom-end' | 'bottom-center'
  offset?: number
}

// ============================================================================
// DROPDOWN PORTAL COMPONENT
// ============================================================================
export const DropdownPortal: React.FC<DropdownPortalProps> = ({
  isOpen,
  triggerRef,
  children,
  className = '',
  onClose,
  placement = 'bottom-start',
  offset = 8,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [isPositioned, setIsPositioned] = useState(false) // Pozisyon hazır mı kontrolü

  const dropdownRef = useClickOutside<HTMLDivElement>(
    () => {
      if (isOpen) onClose()
    },
    true,
    triggerRef,
  )

  // useLayoutEffect kullanarak DOM paint öncesi pozisyonu hesapla
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef?.current) {
      setIsPositioned(false)
      return
    }

    const updatePosition = () => {
      if (!triggerRef?.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      let top = triggerRect.bottom + window.scrollY + offset
      let left = triggerRect.left + window.scrollX

      // Placement hesaplama - CSS ile uyumlu
      switch (placement) {
        case 'bottom-start':
          // left zaten doğru
          break
        case 'bottom-end':
          left = triggerRect.right + window.scrollX
          break
        case 'bottom-center':
          left = triggerRect.left + window.scrollX + triggerRect.width / 2
          break
      }

      setPosition({ top, left })
      setIsPositioned(true) // Pozisyon hesaplandı, artık gösterebiliriz
    }

    updatePosition()
  }, [isOpen, triggerRef, placement, offset])

  // Scroll ve resize eventleri için normal useEffect
  useEffect(() => {
    if (!isOpen || !isPositioned) return

    const updatePosition = () => {
      if (!triggerRef?.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      let top = triggerRect.bottom + window.scrollY + offset
      let left = triggerRef.left + window.scrollX

      switch (placement) {
        case 'bottom-start':
          break
        case 'bottom-end':
          left = triggerRect.right + window.scrollX
          break
        case 'bottom-center':
          left = triggerRect.left + window.scrollX + triggerRect.width / 2
          break
      }

      setPosition({ top, left })
    }

    const handleResize = () => updatePosition()
    const handleScroll = () => updatePosition()

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen, isPositioned, triggerRef, placement, offset])

  // Dropdown açık değilse veya pozisyon hesaplanmadıysa render etme
  if (!isOpen || !isPositioned) return null

  return createPortal(
    <div
      ref={dropdownRef}
      className={`${className} transition-opacity duration-150 ease-out`}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 50,
        opacity: isPositioned ? 1 : 0, // Pozisyon hazır olana kadar görünmez
        // CSS ile alignment - JS karışmıyor
        ...(placement === 'bottom-end' && { transform: 'translateX(-100%)' }),
        ...(placement === 'bottom-center' && { transform: 'translateX(-50%)' }),
      }}
    >
      {children}
    </div>,
    document.body,
  )
}

// ============================================================================
// DISPLAY NAME
// ============================================================================
DropdownPortal.displayName = 'DropdownPortal'
