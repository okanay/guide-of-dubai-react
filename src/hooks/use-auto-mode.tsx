import { useRef, useEffect, useCallback } from 'react'

// Auto-Mode Context - Callback'leri yönetmek için
interface AutoModeCallback {
  id: string
  callback: (value: string) => void
  transform?: (value: string) => string
}

class AutoModeManager {
  private callbacks: Map<string, AutoModeCallback[]> = new Map()

  subscribe(sourceId: string, callback: AutoModeCallback) {
    if (!this.callbacks.has(sourceId)) {
      this.callbacks.set(sourceId, [])
    }
    this.callbacks.get(sourceId)!.push(callback)
  }

  unsubscribe(sourceId: string, callbackId: string) {
    const callbacks = this.callbacks.get(sourceId)
    if (callbacks) {
      const index = callbacks.findIndex((cb) => cb.id === callbackId)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  notify(sourceId: string, value: string) {
    const callbacks = this.callbacks.get(sourceId)
    if (callbacks) {
      callbacks.forEach((cb) => {
        const transformedValue = cb.transform ? cb.transform(value) : value
        cb.callback(transformedValue)
      })
    }
  }
}

// Global auto-mode manager instance
const autoModeManager = new AutoModeManager()

// Geliştirilmiş useAutoMode Hook
export const useAutoMode = (
  enabled: boolean,
  sourceId: string, // targetRef yerine unique ID
  handleValueChange: (value: string) => void,
  transform?: (value: string) => string, // Değer dönüştürme fonksiyonu (slug için)
) => {
  const callbackId = useRef(`callback_${Math.random().toString(36).substr(2, 9)}`)
  const isManuallyEdited = useRef(false)

  useEffect(() => {
    if (!enabled || !sourceId) return

    const callback: AutoModeCallback = {
      id: callbackId.current,
      callback: (value: string) => {
        if (!isManuallyEdited.current) {
          handleValueChange(value)
        }
      },
      transform,
    }

    autoModeManager.subscribe(sourceId, callback)

    return () => {
      autoModeManager.unsubscribe(sourceId, callbackId.current)
    }
  }, [enabled, sourceId, handleValueChange, transform])

  const handleManualEdit = useCallback(() => {
    if (enabled) {
      isManuallyEdited.current = true
    }
  }, [enabled])

  // Auto-mode toggle edildiğinde manual edit flag'ini resetle
  useEffect(() => {
    if (enabled) {
      isManuallyEdited.current = false
    }
  }, [enabled])

  // Source component'tan değer değişikliklerini broadcast etmek için
  const notifyChange = useCallback(
    (value: string) => {
      autoModeManager.notify(sourceId, value)
    },
    [sourceId],
  )

  return {
    handleManualEdit,
    isManuallyEdited: isManuallyEdited.current,
    notifyChange, // Source component'lar için
  }
}
