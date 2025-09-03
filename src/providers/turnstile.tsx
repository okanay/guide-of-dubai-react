import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { createStore, useStore } from 'zustand'
import type { StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// =============================================================================
// CLOUDFLARE TURNSTILE TYPES (Official API & Custom Callback)
// =============================================================================

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
      getResponse: (widgetId?: string) => string | undefined
      isExpired: (widgetId?: string) => boolean
    }
    // Script'in `onload` parametresi için global callback fonksiyonu
    onTurnstileLoaded?: () => void
  }
}

interface TurnstileOptions {
  sitekey: string
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact'
  tabindex?: number
  callback?: (token: string) => void
  'error-callback'?: (error?: string) => void
  'expired-callback'?: () => void
  'before-interactive-callback'?: () => void
  'after-interactive-callback'?: () => void
  'unsupported-callback'?: () => void
  'timeout-callback'?: () => void
  cData?: string
  retry?: 'auto' | 'never'
  'retry-interval'?: number
  'refresh-expired'?: 'auto' | 'manual' | 'never'
  language?: string
  execution?: 'render' | 'execute'
  appearance?: 'always' | 'execute' | 'interaction-only'
}

// =============================================================================
// TYPES
// =============================================================================

interface TurnstileState {
  token: string | null
  widgetId: string | null
  isReady: boolean
  isVerifying: boolean
  error: string | null
  isExpired: boolean
  resetCount: number
}

interface TurnstileActions {
  setToken: (token: string) => void
  setWidgetId: (widgetId: string) => void
  setError: (error: string) => void
  setExpired: () => void
  setIsVerifying: (loading: boolean) => void
  setReady: (ready: boolean) => void
  refreshToken: () => void
  reset: () => void
}

type TurnstileStore = TurnstileState & TurnstileActions

// =============================================================================
// STORE CREATION
// =============================================================================

const initialState: TurnstileState = {
  token: null,
  widgetId: null,
  isReady: false,
  isVerifying: false,
  error: null,
  isExpired: false,
  resetCount: 0,
}

const createTurnstileStore = () => {
  return createStore<TurnstileStore>()(
    immer((set, get) => ({
      ...initialState,

      setToken: (token: string) => {
        set({
          token,
          isReady: true,
          error: null,
          isVerifying: false,
          isExpired: false,
        })
      },

      setWidgetId: (widgetId: string) => {
        set({ widgetId })
      },

      setError: (error: string) => {
        set({
          token: null,
          isReady: false,
          error,
          isVerifying: false,
        })
      },

      setExpired: () => {
        set({
          token: null,
          isReady: false,
          isExpired: true,
          isVerifying: false,
        })
      },

      setIsVerifying: (isLoading: boolean) => {
        set({ isVerifying: isLoading, isReady: false })
      },

      setReady: (isReady: boolean) => {
        set({ isReady })
      },

      refreshToken: () => {
        const state = get()

        if (window.turnstile && state.widgetId) {
          try {
            window.turnstile.reset(state.widgetId)
            set({
              resetCount: state.resetCount + 1,
              token: null,
              isReady: false,
              isVerifying: true,
              error: null,
            })
          } catch (error) {
            set({ error: 'Reset operation failed' })
          }
        } else {
          console.warn('⚠️ Turnstile API or widget ID not found')
          set({ error: 'Turnstile not ready' })
        }
      },

      reset: () => {
        set(initialState)
      },
    })),
  )
}

// =============================================================================
// PROVIDER & MANAGER
// =============================================================================

export function TurnstileProvider({ children }: PropsWithChildren) {
  const [store] = useState(createTurnstileStore)

  return (
    <TurnstileStoreProvider value={store}>
      <TurnstileManager />
      {children}
    </TurnstileStoreProvider>
  )
}

function TurnstileManager() {
  const store = useTurnstileStoreContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  if (!store) return null

  const { setToken, setWidgetId, setError, setExpired, setIsVerifying } = store.getState()

  useEffect(() => {
    let isMounted = true

    const renderWidget = () => {
      if (!isMounted || !window.turnstile || !containerRef.current) return

      try {
        setIsVerifying(true)
        const sitekey = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY
        if (!sitekey) throw new Error('Turnstile site key not found')

        const widgetId = window.turnstile.render(containerRef.current, {
          sitekey,
          theme: 'auto',
          size: 'normal',
          retry: 'auto',
          'retry-interval': 8000,
          'refresh-expired': 'auto',
          callback: (token: string) => setToken(token),
          'error-callback': (error?: string) => setError(error || 'Unknown error'),
          'expired-callback': () => setExpired(),
          'before-interactive-callback': () => setIsVerifying(true),
          'timeout-callback': () => setError('Operation timed out'),
        })

        if (widgetId) {
          widgetIdRef.current = widgetId
          setWidgetId(widgetId)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Initialization failed')
        }
      }
    }

    // Script zaten yüklenmişse widget'ı hemen render et.
    if (window.turnstile) {
      renderWidget()
    } else {
      // Değilse, script yüklendiğinde `onload` ile tetiklenecek olan global callback'i ayarla.
      window.onTurnstileLoaded = renderWidget
    }

    return () => {
      isMounted = false
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (error) {
          console.warn('⚠️ Widget cleanup error:', error)
        }
      }
      // Memory leak önlemek için global callback'i temizle.
      if (window.onTurnstileLoaded) {
        window.onTurnstileLoaded = undefined
      }
    }
  }, []) // Sadece component mount ve unmount olduğunda çalışır.

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: -100,
        left: 0,
        zIndex: -1,
        opacity: 0,
        width: '300px',
        height: '65px',
      }}
    />
  )
}

// =============================================================================
// CONTEXT & HOOKS
// =============================================================================

type TurnstileContext = StoreApi<TurnstileStore> | undefined
const TurnstileContext = createContext<TurnstileContext>(undefined)

export function useTurnstileStore() {
  const context = useContext(TurnstileContext)
  if (!context) {
    throw new Error('useTurnstileStore must be used within TurnstileProvider')
  }
  return useStore(context, (state) => state)
}

export function useTurnstile() {
  const store = useTurnstileStore()
  return {
    token: store.token,
    isReady: store.isReady,
    isLoading: store.isVerifying,
    error: store.error,
    isExpired: store.isExpired,
    resetCount: store.resetCount,
    refreshToken: store.refreshToken,
  }
}

export const TurnstileStoreProvider = TurnstileContext.Provider
export const useTurnstileStoreContext = () => useContext(TurnstileContext)
