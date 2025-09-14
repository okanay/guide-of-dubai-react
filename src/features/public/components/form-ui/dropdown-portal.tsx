import React, { useState, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import useClickOutside from '@/hooks/use-click-outside'

// ============================================================================
// TYPES
// ============================================================================
type Placement =
  | 'bottom-start'
  | 'bottom-end'
  | 'bottom-center'
  | 'top-start'
  | 'top-end'
  | 'top-center'

interface DropdownPortalProps {
  isOpen: boolean
  triggerRef: any
  children: React.ReactNode
  className?: string
  onClose: () => void
  placement?: Placement
  offset?: number
  autoFlip?: boolean
}

// ============================================================================
// COMPONENT
// ============================================================================
export const DropdownPortal: React.FC<DropdownPortalProps> = ({
  isOpen,
  triggerRef,
  children,
  className = '',
  onClose,
  placement = 'bottom-start',
  offset = 4,
  autoFlip = true,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [actualPlacement, setActualPlacement] = useState<Placement>(placement)
  const [isPositioned, setIsPositioned] = useState(false)

  const dropdownRef = useClickOutside<HTMLDivElement>(() => isOpen && onClose(), true, triggerRef)

  // Pozisyon hesaplama
  const calculatePosition = () => {
    if (!triggerRef.current) return

    const trigger = triggerRef.current.getBoundingClientRect()
    const viewport = { width: window.innerWidth, height: window.innerHeight }

    // AutoFlip logic - sadece Y ekseni
    let finalPlacement = placement
    if (autoFlip) {
      const spaceBelow = viewport.height - trigger.bottom
      const spaceAbove = trigger.top

      if (placement.startsWith('bottom') && spaceBelow < 200 && spaceAbove > spaceBelow) {
        finalPlacement = placement.replace('bottom', 'top') as Placement
      } else if (placement.startsWith('top') && spaceAbove < 200 && spaceBelow > spaceAbove) {
        finalPlacement = placement.replace('top', 'bottom') as Placement
      }
    }

    // Y pozisyonu
    const top = finalPlacement.startsWith('bottom')
      ? trigger.bottom + window.scrollY + offset
      : trigger.top + window.scrollY - offset

    // X pozisyonu
    const [, alignment] = finalPlacement.split('-')
    let left = trigger.left + window.scrollX

    if (alignment === 'end') {
      left = trigger.right + window.scrollX
    } else if (alignment === 'center') {
      left = trigger.left + window.scrollX + trigger.width / 2
    }

    setPosition({ top, left })
    setActualPlacement(finalPlacement)
  }

  // İlk pozisyon hesaplama
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setIsPositioned(false)
      return
    }

    calculatePosition()
    setIsPositioned(true)
  }, [isOpen])

  // Event listeners
  useEffect(() => {
    if (!isOpen || !isPositioned) return

    window.addEventListener('resize', calculatePosition, { passive: true })
    window.addEventListener('scroll', calculatePosition, { passive: true })
    window.addEventListener('orientationchange', calculatePosition, { passive: true })

    return () => {
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', calculatePosition)
      window.removeEventListener('orientationchange', calculatePosition)
    }
  }, [isOpen, isPositioned])

  // Render
  if (!isOpen || !isPositioned) return null

  // Transform hesaplama
  const getTransform = () => {
    const transforms = []

    if (actualPlacement.endsWith('-end')) transforms.push('translateX(-100%)')
    if (actualPlacement.endsWith('-center')) transforms.push('translateX(-50%)')
    if (actualPlacement.startsWith('top')) transforms.push('translateY(-100%)')

    return transforms.join(' ') || undefined
  }

  return createPortal(
    <div
      ref={dropdownRef}
      className={`${className} transition-opacity duration-150 ease-out`}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        zIndex: 50,
        opacity: 1,
        transform: getTransform(),
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
