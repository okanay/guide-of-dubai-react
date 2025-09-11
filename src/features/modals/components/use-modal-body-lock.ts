import { useEffect } from 'react'
import { modalManager } from './manager'

export function useModalBodyLock(isOpen: boolean, scopeId: string = 'body') {
  useEffect(() => {
    if (isOpen) {
      modalManager.openModal(scopeId)
    } else {
      modalManager.closeModal(scopeId)
    }

    // Cleanup on unmount
    return () => {
      if (isOpen) {
        modalManager.closeModal(scopeId)
      }
    }
  }, [isOpen, scopeId])
}
