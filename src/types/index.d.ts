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

/** İçerik tipleri */
type ContentType =
  | 'news'
  | 'article'
  | 'opinion'
  | 'report'
  | 'magazine'
  | 'podcast'
  | 'stream'
  | 'event'

/** İçerik durumları */
type ContentStatus = 'draft' | 'archived' | 'pending' | 'scheduled' | 'published' | 'deleted'

/** İçerik durumu (yeni/eski - vektör arama için) */
type ContentState = 'old' | 'new'

/** Liste tipleri */
type ListType = 'system' | 'custom' | 'newsletter'

/** Newsletter template tipleri */
type NewsletterTemplate =
  | 'default'
  | 'opinion'
  | 'news'
  | 'report'
  | 'event'
  | 'stream'
  | 'magazine'
  | 'article'
  | 'empty'

/** Sosyal medya platformları */
type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'github'
  | 'website'

/** Sayfalama bilgileri için evrensel tip */
type PaginationView = {
  total: number
  page: number
  limit: number
  totalPages: number
}

// =============================================================================
// II. USER, AUTH & PERMISSIONS
// (Kullanıcı, kimlik doğrulama ve yetkilendirme ile ilgili tüm tipler)
// =============================================================================

/** Bir kullanıcının sahip olabileceği aksiyon bazlı izinler */
type Permission =
  | 'file:upsert'
  | 'file:delete'
  | 'content:news:upsert:own'
  | 'content:article:upsert:own'
  | 'content:opinion:upsert:own'
  | 'content:report:upsert:own'
  | 'content:magazine:upsert:own'
  | 'content:podcast:upsert:own'
  | 'content:stream:upsert:own'
  | 'content:event:upsert:own'
  | 'content:any:schedule'
  | 'content:any:set:publish'
  | 'content:modify:other'
  | 'content:modify:published'
  | 'content:any:delete'
  | 'content:category:upsert'
  | 'content:list:upsert'
  | 'system:settings:modify'
  | 'newsletter:send'
  | 'content:list:collection:modify'

/** Sosyal medya linklerini tutan yapı */
type SocialMediaEntry = {
  platform: SocialPlatform
  url: string
}

/** Herkese açık profil detayları */
type PublicProfileDetails = {
  socialMedia?: SocialMediaEntry[]
  publicEmail?: string
  title?: string
  description?: string
  company?: string
  location?: string
  website?: string
  isStaff?: boolean
}

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

/** Admin panelinde kullanıcı listeleme için daha sade bir görünüm */
type UserListView = {
  id: string
  email: string
  displayName?: string
  username?: string
  avatarURL?: string
  role: Role
  authProvider: AuthProvider
  status: UserStatus
  lastLogin: string
  createdAt: string
}

/** Sadece herkese açık bilgileri içeren profil görünümü (ör: yazar sayfası) */
type UserProfilePublicView = {
  id: string
  username?: string
  displayName?: string
  firstName?: string
  lastName?: string
  avatarURL?: string
  publicDetails?: PublicProfileDetails
  createdAt: string
}

/** Başarılı bir giriş sonrası dönen yanıt */
interface LoginResponse {
  user: UserProfileView
  permissions: Permission[]
}

/** E-posta/şifre ile yeni kullanıcı kaydı için istek tipi */
type UserCreateRequest = {
  email: string
  password: string
  username: string
  firstName: string
  lastName: string
}

/** Kullanıcının kendi profilini güncellerken kullandığı istek tipi */
type ProfileUpdateRequest = {
  displayName?: string
  firstName?: string
  lastName?: string
  avatarURL?: string
  privateDetails?: any
  publicDetails?: Omit<PublicProfileDetails, 'isStaff'> // Kullanıcı 'isStaff' durumunu değiştiremez
}

/** Adminin bir kullanıcının staff durumunu güncellemesi için istek tipi */
type AdminStaffUpdateRequest = {
  userId: string
  isStaff: boolean
}

/** Kullanıcıları listeleme endpoint'inin tam yanıt tipi */
type UsersListResponse = {
  success: boolean
  data: {
    users: UserListView[]
    pagination: PaginationView
  }
}

// =============================================================================
// III. CONTENT & RELATED ENTITIES
// (İçerik, kategori, liste ve yazar ile ilgili tüm tipler)
// =============================================================================

/** İçerik kartları ve listelemeler için sadeleştirilmiş yazar görünümü */
type AuthorCardView = {
  id: string
  username?: string
  displayName?: string
  avatarURL?: string
  publicDetails?: PublicProfileDetails
}

/** Kategori görünüm modeli */
type CategoryView = {
  id: string
  slug: string
  name: string
  description?: string
  bannerImageURL?: string
}

/** Kategori oluşturma ve güncelleme için kullanılan tip */
type CategoryUpsert = {
  slug: string
  name: string
  description?: string
  bannerImageURL?: string
}

/** İçeriklerin listeleme ve kart görünümlerindeki temsili */
type ContentCardView = {
  id: string
  state: ContentState
  type: ContentType
  status: ContentStatus
  slug: string
  createdAt: Date
  publishedAt?: Date | string | null
  updatedAt?: Date | string | null
  scheduledFor?: Date | string | null
  cardTitle: string
  cardDescription?: string | null
  cardImageURL?: string | null
  cardImageAlt?: string | null
  categoryName?: string | null
  contentShortJSON?: string | null
  pdfFileURL?: string | null
  videoURL?: string | null
  isSponsored: boolean
  author: AuthorCardView
}

/** İçerik detay sayfası için gereken tüm verileri içeren model */
type ContentPageView = {
  id: string
  state: ContentState
  type: ContentType
  status: ContentStatus
  slug: string
  author: AuthorCardView
  publishedAt?: Date | string | null
  scheduledFor?: Date | string | null
  isSponsored: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  seoTags?: string[]
  seoImageURL?: string | null
  cardTitle: string
  cardDescription?: string | null
  cardImageURL?: string | null
  cardImageAlt?: string | null
  categoryId?: string | null
  categorySlug?: string | null
  categoryName?: string | null
  contentHTML?: string | null
  contentShortHTML?: string | null
  contentJSON?: string | null
  contentShortJSON?: string | null
  pdfFileURL?: string | null
  videoURL?: string | null
}

/** Veritabanındaki `contents` tablosunun tam karşılığı */
type Content = ContentPageView & {
  authorID: string
  searchVector: string
  createdAt: Date
  updatedAt: Date
}

type EventContent = {
  title: string
  eventDate: string
  location: string
  eventURL?: string
  description?: string
}

// =============================================================================
// IV. LISTS
// (İçerik listeleri ile ilgili tipler)
// =============================================================================

/** Bir liste içindeki tek bir eleman */
type ListItemView = {
  displayOrder: number
  content: ContentCardView
}

/** Liste görünüm modeli */
type ListView = {
  id: string
  type: ListType
  name: string
  slug: string
  description?: string
  isSponsored: boolean
  seoTitle?: string
  seoDescription?: string
  cardTitle?: string
  cardDescription?: string
  cardImageURL?: string
  bannerImageURL?: string
  items?: ListItemView[]
}

/** Liste oluşturma ve güncelleme için kullanılan tip */
type ListUpsert = {
  name: string
  slug: string
  description: string
  isSponsored: boolean
  seoTitle: string
  seoDescription: string
  cardTitle: string
  cardDescription: string
  cardImageURL?: string
  bannerImageURL: string
  type: ListType
}

type ListFilter = {
  page: number
  limit: number
  type?: ListType
  withItems?: Boolean
}

/** Liste elemanlarını toplu güncelleme için girdi */
type UpdateListItemsInput = {
  contentIds: string[]
}

/** Listelerin genel sırasını güncellemek için girdi */
type ReorderListsInput = {
  listIds: string[]
}

// =============================================================================
// VII. COLLECTIONS
// (Liste koleksiyonları ile ilgili tipler)
// =============================================================================

/** Liste koleksiyonu - birden fazla listeyi gruplandırır */
type ListCollection = {
  id: string
  slug: string
  name: string
  description: string
}

/** Liste koleksiyonunun tam görünümü - içindeki listelerle birlikte */
type ListCollectionView = {
  collection: ListCollection
  items: ListView[] // Koleksiyon içindeki listeler
}

/** Koleksiyon oluşturma ve güncelleme için kullanılan tip */
type CollectionUpsert = {
  slug: string
  name: string
  description: string
}

/** Koleksiyona liste ekleme/çıkarma için girdi */
type AddRemoveListFromCollectionInput = {
  listId: string
}

/** Koleksiyon listelerinin sırasını güncellemek için girdi */
type ReorderCollectionItemsInput = {
  listIds: string[]
}

// =============================================================================
// V. API FILTERS & RESPONSES
// (API istek ve yanıtları için kullanılan özel tipler)
// =============================================================================

/** İçerik filtreleme parametreleri */
type ContentFilter = {
  type?: ContentType
  search?: string
  categorySlug?: string
  authorUsername?: string
  status?: ContentStatus
  isSponsored?: boolean
  tags?: string[]
  page: number
  limit: number
}

/** Sayfalanmış içerik kartları için API yanıtı */
type ContentCardViewResponse = {
  contents: ContentCardView[]
  pagination: PaginationView
  metadata: Record<string, any>
}

/** Yazar sayfası için API yanıtı */
type EditorPageViewResponse = {
  editor: UserProfilePublicView
  contents: ContentCardView[]
  pagination: PaginationView
}

/** Tek bir liste ve sayfalanmış elemanları için API yanıtı */
type ListWithItemsResponse = {
  list: ListView
  contents: ContentCardView[]
  pagination: PaginationView
  metadata: Record<string, any>
}

// =============================================================================
// VI. SYSTEM & OTHER TYPES
// (Sistem ayarları, stream katılımcıları gibi diğer tipler)
// =============================================================================

/** Sistem ayarları için anahtar tipleri - GÜNCELLENDİ */
type SystemSettingsKey =
  | 'live-stream-status'
  | 'site-maintenance'
  | 'banner-image-holder'
  | 'popup-settings'
  | 'newsletter-default-list-slug'
  | 'delete-all-cache'
  | 'refresh-search-vectors'
  | 'countdown-settings'
  | string

/** Sistem ayarı görünüm modeli */
type SystemSettingView = {
  key: SystemSettingsKey
  value: any
}

type CountdownSettings = {
  isActive: boolean
  mobileImageUrl: string
  desktopImageUrl: string
  redirectUrl: string
  countdown: number // Unix timestamp
  message: string
  showFrequency: number // Saat cinsinden
}

/** Pop-up gösterim sıklığı tipleri - YENİ */
type PromoteCookieFrequency =
  | 'just-one'
  | 'every-5m'
  | 'every-3h'
  | 'every-12h'
  | 'daily'
  | 'weekly'

/** Banner ayarları için tip - GÜNCELLENDİ */
type BannerSettings = {
  isActive: boolean
  mobileImageUrl: string
  desktopImageUrl: string
  redirectUrl: string
}

/** Pop-up ayarları için tip - YENİ */
type PopupSettings = {
  isActive: boolean
  imageUrl: string
  redirectUrl: string
  showFrequency: PopupFrequency
}

/** Stream katılımcısı rolü */
type ParticipantRole = 'speaker' | 'moderator'

/** Stream katılımcısı modeli */
type StreamParticipant = {
  id: string
  name: string
  role: ParticipantRole
  imageUrl?: string
  description?: string
}

interface ListSubscriberView {
  subscriberId: string
  email: string
  subscribedAt: string
  isRegistered: boolean
  status: string
  source: string
  userId?: string
  userDisplayName?: string
  userAvatarURL?: string
}

interface ListSubscribersResponse {
  subscribers: ListSubscriberView[]
  pagination: PaginationView
}

interface GetSubscribersByListParams {
  page?: number
  limit?: number
  search?: string
}

// =============================================================================
// VIII. APPLICATIONS
// (Başvuru sistemi ile ilgili tüm tipler)
// =============================================================================

/** Başvuru durumları */
type ApplicationStatus = 'new' | 'pending' | 'contacted' | 'archived' | 'spam'

/** Temel başvuru modeli */
type Application = {
  id: string
  type: string
  status: ApplicationStatus
  payload: any // JSON payload - tipine göre farklı olacak
  ipAddress?: string
  userAgent?: string
  createdAt: string
  updatedAt: string
}

/** Admin paneli için başvuru görünümü */
type ApplicationView = {
  id: string
  type: string
  status: ApplicationStatus
  payload: WorkWithUsPayload | any // Payload tipi başvuru tipine göre değişir
  ipAddress?: string
  createdAt: string
}

/** Sayfalanmış başvuru listesi */
type ApplicationsListResponse = {
  applications: ApplicationView[]
  pagination: PaginationView
}

/** Başvuru durumu güncelleme isteği */
type UpdateApplicationStatusRequest = {
  status: ApplicationStatus
}

/** Başvuru filtreleme parametreleri */
type ApplicationFilter = {
  type: string
  search?: string
  status?: ApplicationStatus
  page: number
  limit: number
}
