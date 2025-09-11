import { useEffect } from 'react'
import { modalManager } from './manager'

export function useModalBodyLock(isOpen: boolean) {
  useEffect(() => {
    if (isOpen) {
      modalManager.openModal()
    } else {
      modalManager.closeModal()
    }

    // Cleanup on unmount
    return () => {
      if (isOpen) {
        modalManager.closeModal()
      }
    }
  }, [isOpen])
}
