// src/types/index.d.ts

// =============================================================================
// I. CORE ENUMS & GLOBAL TYPES
// (Uygulama genelinde kullanılan temel ve küresel tipler)
// =============================================================================

/** Kullanıcı rolleri */
type Role = 'Guest' | 'Reader' | 'Editor' | 'Admin'

/** Kullanıcı hesap durumları */
type UserStatus = 'Active' | 'Suspended' | 'Deleted'

/** Oturum durumu (frontend için) */
type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

/** Kimlik doğrulama sağlayıcıları */
type AuthProvider =
  | 'credentials'
  | 'google'
  | 'facebook'
  | 'twitter'
  | 'apple'
  | 'microsoft'
  | 'github'
  | 'linkedin'
  | 'guest'

/** API'de gösterilen, güvenli kullanıcı profili */
type UserProfileView = {
  id: string
  role: Role
  email: string
  username?: string
  emailVerified: boolean
  displayName?: string
  firstName?: string
  lastName?: string
  avatarURL?: string
  publicDetails?: PublicProfileDetails
  privateDetails?: any // Genellikle kullanıcıya özel, gösterilmeyen veriler
  createdAt: string
  updatedAt: string
}

/** Başarılı bir giriş sonrası dönen yanıt */
interface LoginResponse {
  user: UserProfileView
}
