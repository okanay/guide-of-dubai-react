import { useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { PropsWithChildren, useEffect, useState } from 'react'
import { useAuth } from 'src/providers/auth'

// ================================
// TYPES
// ================================

interface ProtectedRouteProps extends PropsWithChildren {
  /**
   * Kullanıcının sahip olması gereken roller
   * Birden fazla rol verilirse, kullanıcının en az birine sahip olması yeterli (OR logic)
   */
  allowedRoles?: Role[]

  /**
   * Kullanıcının sahip olması gereken permission'lar
   * requireAllPermissions true ise hepsine sahip olmalı (AND logic)
   * requireAllPermissions false ise en az birine sahip olması yeterli (OR logic)
   */
  allowedPermissions?: Permission[]

  /**
   * Tüm permission'lara sahip olması gerekiyor mu?
   * @default false
   */
  requireAllPermissions?: boolean

  /**
   * Yetki yoksa yönlendirilecek URL
   * @default '/login'
   */
  redirectTo?: string

  /**
   * Ters mantık: Authenticated kullanıcıları başka yere yönlendir
   * Login/Register sayfaları için kullanılır
   */
  redirectIfAuthenticated?: boolean

  /**
   * Authenticated kullanıcıların yönlendirileceği URL (redirectIfAuthenticated true ise)
   * @default '/'
   */
  authenticatedRedirectTo?: string

  /**
   * Loading durumunda gösterilecek component
   */
  loadingComponent?: React.ReactNode

  /**
   * Yetki yokken gösterilecek fallback (redirect yerine)
   */
  fallback?: React.ReactNode

  /**
   * Redirect yerine fallback göster
   * @default false
   */
  useFallback?: boolean
}

// ================================
// HELPER FUNCTIONS
// ================================

function checkAccess(
  user: any,
  permissions: Permission[],
  allowedRoles?: Role[],
  allowedPermissions?: Permission[],
  requireAllPermissions?: boolean,
): boolean {
  if (!user) return false

  // Role kontrolü
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user.role)
    if (!hasRequiredRole) return false
  }

  // Permission kontrolü
  if (allowedPermissions && allowedPermissions.length > 0) {
    const hasPermission = requireAllPermissions
      ? allowedPermissions.every((p) => permissions.includes(p))
      : allowedPermissions.some((p) => permissions.includes(p))

    if (!hasPermission) return false
  }

  return true
}

// ================================
// MAIN COMPONENT
// ================================

export function ProtectedRoute({
  children,
  allowedRoles,
  allowedPermissions,
  requireAllPermissions = false,
  redirectTo = '/login',
  redirectIfAuthenticated = false,
  authenticatedRedirectTo = '/',
  loadingComponent,
  fallback,
  useFallback = false,
}: ProtectedRouteProps) {
  const navigate = useNavigate()
  const { user, permissions, sessionStatus } = useAuth()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Loading durumunda bekle
    if (sessionStatus === 'loading') {
      return
    }

    const isAuthenticated = sessionStatus === 'authenticated'

    // Scenario 1: Login/Register sayfaları - authenticated kullanıcıları yönlendir
    if (redirectIfAuthenticated) {
      if (isAuthenticated) {
        navigate({ to: authenticatedRedirectTo, replace: true })
      } else {
        setShouldRender(true)
      }
      return
    }

    // Scenario 2: Protected sayfalar - unauthenticated kullanıcıları yönlendir
    if (!isAuthenticated) {
      if (!useFallback) {
        navigate({ to: redirectTo, replace: true })
      } else {
        setShouldRender(true)
      }
      return
    }

    // Authenticated ama role/permission kontrolü gerekiyorsa
    const hasAccess = checkAccess(
      user,
      permissions,
      allowedRoles,
      allowedPermissions,
      requireAllPermissions,
    )

    if (!hasAccess) {
      if (!useFallback) {
        navigate({ to: redirectTo, replace: true })
      } else {
        setShouldRender(true)
      }
    } else {
      setShouldRender(true)
    }
  }, [
    user,
    permissions,
    sessionStatus,
    allowedRoles,
    allowedPermissions,
    requireAllPermissions,
    redirectTo,
    redirectIfAuthenticated,
    authenticatedRedirectTo,
    navigate,
    useFallback,
  ])

  // Loading state - her zaman göster
  if (sessionStatus === 'loading') {
    return <>{loadingComponent || <div>Loading...</div>}</>
  }

  // Render kontrolü - yetki kontrolü tamamlanana kadar içerik gösterme
  if (!shouldRender) {
    return <>{loadingComponent || <div>Checking permissions...</div>}</>
  }

  // Fallback kullanımı
  if (useFallback) {
    const isAuthenticated = sessionStatus === 'authenticated'

    // Login/Register sayfası ve kullanıcı authenticated ise
    if (redirectIfAuthenticated && isAuthenticated) {
      return <>{fallback || null}</>
    }

    // Protected sayfa ve kullanıcı authenticated değilse
    if (!redirectIfAuthenticated && !isAuthenticated) {
      return <>{fallback || <div>Please login to continue</div>}</>
    }

    // Role/Permission kontrolü
    if (!redirectIfAuthenticated) {
      const hasAccess = checkAccess(
        user,
        permissions,
        allowedRoles,
        allowedPermissions,
        requireAllPermissions,
      )

      if (!hasAccess) {
        return <>{fallback || <div>You don't have permission to access this page</div>}</>
      }
    }
  }

  return <>{children}</>
}

// ================================
// PRESET COMPONENTS WITH BETTER DEFAULTS
// ================================

/**
 * Sadece unauthenticated kullanıcılar için
 * Authenticated kullanıcıları /'e yönlendirir
 */
export function RequireGuest({
  children,
  loadingComponent,
  ...props
}: Omit<ProtectedRouteProps, 'redirectIfAuthenticated' | 'allowedRoles' | 'allowedPermissions'>) {
  return (
    <ProtectedRoute
      redirectIfAuthenticated={true}
      loadingComponent={loadingComponent || <LoadingScreen />}
      {...props}
    >
      {children}
    </ProtectedRoute>
  )
}

/**
 * Editor veya Admin rolüne sahip kullanıcılar için
 */
export function RequireEditor({
  children,
  redirectTo = '/not-found',
  loadingComponent,
  ...props
}: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute
      allowedRoles={['Editor', 'Admin']}
      redirectTo={redirectTo}
      loadingComponent={loadingComponent || <LoadingScreen />}
      {...props}
    >
      {children}
    </ProtectedRoute>
  )
}

/**
 * Sadece Admin rolüne sahip kullanıcılar için
 */
export function RequireAdmin({
  children,
  redirectTo = '/not-found',
  loadingComponent,
  ...props
}: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute
      allowedRoles={['Admin']}
      redirectTo={redirectTo}
      loadingComponent={loadingComponent || <LoadingScreen />}
      {...props}
    >
      {children}
    </ProtectedRoute>
  )
}

/**
 * Sadece authenticated kullanıcılar için
 * Unauthenticated kullanıcıları /login'e yönlendirir
 */
export function RequireAuth({
  children,
  loadingComponent,
  ...props
}: Omit<ProtectedRouteProps, 'redirectIfAuthenticated'>) {
  return (
    <ProtectedRoute
      redirectIfAuthenticated={false}
      loadingComponent={loadingComponent || <LoadingScreen />}
      {...props}
    >
      {children}
    </ProtectedRoute>
  )
}

// ================================
// DEFAULT LOADING COMPONENT
// ================================

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Loader2 className="mb-4 h-12 w-12 animate-spin text-gray-700" />
      <p className="text-center text-lg text-gray-700">Loading...</p>
    </div>
  )
}
