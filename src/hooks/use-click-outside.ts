// src/hooks/use-click-outside.ts
import { useEffect, useRef, RefObject } from 'react'

type Handler = (event: MouseEvent | TouchEvent) => void

function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: Handler,
  active: boolean = true,
  exceptRef?: RefObject<HTMLElement | null>,
  exceptId?: string,
): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active || typeof document === 'undefined') return

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current
      const exceptEl = exceptRef?.current
      const exceptById = exceptId ? document.getElementById(exceptId) : null

      if (
        !el ||
        el.contains(event.target as Node) ||
        (exceptEl && exceptEl.contains(event.target as Node)) ||
        (exceptById && exceptById.contains(event.target as Node))
      ) {
        return
      }

      // Dropdown elementine tıklanmışsa kapatma (mevcut dropdown desteği korunuyor)
      if (isDropdownElement(event.target as Element)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, active, exceptRef, exceptId])

  return ref
}

// Dropdown detection utility (existing logic preserved from your original code)
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

export default useClickOutside
