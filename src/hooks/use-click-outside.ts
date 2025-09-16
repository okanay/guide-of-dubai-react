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

export default useClickOutside
