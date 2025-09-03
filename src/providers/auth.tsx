import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { createServerFn } from '@tanstack/react-start'
import { AppFetch } from 'src/api/app-fetch'

// ================================
// STORE TYPES & STATE
// ================================

interface AuthState {
  user: UserProfileView | null
  sessionStatus: SessionStatus
}

interface AuthActions {
  setAuthData: (data: LoginResponse) => void
  clearAuth: () => void
  getMe: () => Promise<void>
  logout: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

// ================================
// MAIN STORE LOGIC
// ================================

const createAuthStore = (initialData?: LoginResponse | null) => {
  // Initial state belirleme
  const initialState: AuthState = initialData
    ? {
        user: initialData.user,
        sessionStatus: 'authenticated',
      }
    : {
        user: null,
        sessionStatus: 'unauthenticated',
      }

  return createStore<AuthStore>()(
    immer((set, get) => ({
      ...initialState,

      setAuthData: (data: LoginResponse) => {
        set((state) => {
          state.user = data.user
          state.sessionStatus = 'authenticated'
        })
      },

      clearAuth: () => {
        set((state) => {
          state.user = null
          state.sessionStatus = 'unauthenticated'
        })
      },

      getMe: async () => {
        try {
          const data = await apiGetMe()
          get().setAuthData(data)
        } catch (error) {
          console.warn('GetMe failed:', error)
          get().clearAuth()
          throw error
        }
      },

      logout: async () => {
        try {
          await apiLogout()
          window.location.reload()
        } catch (error) {
          console.warn('Logout API failed:', error)
        } finally {
          get().clearAuth()
        }
      },
    })),
  )
}

// ================================
// CONTEXT & PROVIDER
// ================================

type AuthContext = StoreApi<AuthStore> | undefined
const AuthContext = createContext<AuthContext>(undefined)

interface AuthProviderProps extends PropsWithChildren {
  initialUser?: UserProfileView | null
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  // Store'u oluştururken initial data kullan
  const [store] = useState(() => {
    const initialData = initialUser ? { user: initialUser } : null

    return createAuthStore(initialData)
  })

  useEffect(() => {
    const initializeAuth = async () => {
      const currentState = store.getState()

      // Eğer initial data ile başladıysak (SSR'dan geldiyse)
      if (currentState.user && currentState.sessionStatus === 'authenticated') {
        try {
          // Arka planda session'ı validate et
          await store.getState().getMe()
        } catch (error) {
          console.warn('Session validation failed:', error)
          // Session geçersizse auth'u temizle
          store.getState().clearAuth()
        }
      }
    }

    initializeAuth()
  }, [store])

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

// ================================
// CUSTOM HOOK
// ================================

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return useStore(context, (state) => state)
}

// ================================
// API FUNCTIONS
// ================================

async function apiGetMe(): Promise<LoginResponse> {
  const response = await fetch(import.meta.env.VITE_APP_BACKEND_URL + '/v1/protected/auth/get-me', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error('Auth failed')
  }

  const data = result.data as LoginResponse
  return data
}

async function apiLogout(): Promise<void> {
  const response = await fetch(import.meta.env.VITE_APP_BACKEND_URL + '/v1/protected/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  if (!result.success) {
    throw new Error('Logout failed')
  }
}

export const apiGetMeInitial = createServerFn().handler(async () => {
  try {
    const response = await AppFetch('/v1/protected/auth/get-me', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error('Auth failed')
    }

    const data = result.data as LoginResponse
    return data
  } catch (error) {
    return {
      user: null,
    }
  }
})

// ================================
// UTILITY HOOKS
// ================================

export function useUser() {
  const { user } = useAuth()
  return user
}
