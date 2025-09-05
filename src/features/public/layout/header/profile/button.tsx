import { ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { AvatarImageRender } from 'src/components/avatar-image-renderer'
import useClickOutside from 'src/hooks/use-click-outside'
import { useLanguage } from 'src/i18n/prodiver'
import { useAuth } from 'src/providers/auth'
import { useTheme } from 'src/providers/theme-mode'
import { useAuthModal } from '../auth/store'
import { useHeader } from '../store'
import { useSystemSettings } from '../system-settings/store'

export function AuthButton() {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useClickOutside<HTMLDivElement>(closeDropdown, true, buttonRef)

  const { openModal: openAuthModal } = useAuthModal()
  const { setInverted, isInverted, closeAll, closeCategories } = useHeader()
  const { theme, setTheme } = useTheme()
  const { sessionStatus, user, logout } = useAuth()

  function toggleDropdown() {
    if (isInverted) {
      closeAll()
    } else {
      closeCategories()
      setInverted(true)
    }
  }

  function closeDropdown() {
    setInverted(false)
  }

  return (
    <>
      {createPortal(
        <div
          data-visible={isInverted}
          id="profile-dropdown"
          className="pointer-events-none fixed inset-0 z-33 opacity-0 transition-opacity duration-300 ease-in-out data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100"
        >
          {/* Arka plan */}
          data-visible={isInverted}
          <div className="pointer-events-none absolute inset-0 z-34 bg-black-40 data-[visible=true]:pointer-events-auto" />
          {/* Header şeridi */}
          <div className="absolute top-0 left-0 z-35 h-17 w-full bg-box-surface" />
          {/* Dropdown */}
          <div
            ref={dropdownRef}
            className="pointer-events-none absolute top-17 right-0 left-[50%] z-35 flex w-full max-w-8xl translate-x-[-50%] justify-end"
          >
            <div
              data-visible={isInverted}
              className="pointer-events-none w-72 border border-gray-200 bg-box-surface shadow-lg data-[visible=true]:pointer-events-auto"
            >
              {sessionStatus === 'unauthenticated' ? (
                <UnauthorizeDropdownContent
                  openAuthModal={openAuthModal}
                  closeDropdown={closeDropdown}
                />
              ) : (
                <AuthorizeDropdownContent
                  user={user}
                  logout={logout}
                  closeDropdown={closeDropdown}
                />
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Profil Butonu */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="ml-2 flex items-center gap-x-2 rounded-xs bg-btn-primary px-5 py-2 text-on-btn-primary transition-colors duration-300 ease-in-out hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled"
        aria-label="Kullanıcı profili ve ayarlar"
      >
        Profil
        <UserIcon />
      </button>
    </>
  )
}

function UnauthorizeDropdownContent({ openAuthModal, closeDropdown }: any) {
  const { openModal: openSystemSettingsModal, currency } = useSystemSettings()
  const { language } = useLanguage()
  const { theme } = useTheme()

  return (
    <>
      <MenuItem
        label="Oturum açın veya kaydolun"
        onClick={() => {
          openAuthModal('login')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />
      <MenuItem
        label="Dil"
        value={language.label}
        onClick={() => {
          openSystemSettingsModal('language')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />

      <MenuItem
        label="Para Birimi"
        value={currency.name}
        onClick={() => {
          openSystemSettingsModal('currency')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />
      <MenuItem
        label="Tema"
        value={theme}
        onClick={() => {
          openSystemSettingsModal('theme')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />
      <MobileAppDownload closeDropdown={closeDropdown} />
    </>
  )
}

function AuthorizeDropdownContent({ user, logout, theme, setTheme }: any) {
  const { openModal: openSystemSettingsModal } = useSystemSettings()

  return (
    <>
      <div className="flex items-center">
        <AvatarImageRender
          avatarUrl={user?.avatarURL}
          fallbackText={user?.displayName || 'Kullanıcı'}
          className="h-12 w-12"
        />
        <div className="ml-4">
          <p className="font-semibold">{user?.displayName}</p>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>
      <Separator />
      <MenuItem label="Profilim" onClick={() => {}} showChevron />
      <MenuItem label="Rezervasyonlarım" onClick={() => {}} showChevron />
      <MenuItem label="Favorilerim" onClick={() => {}} showChevron />
      <Separator />
      <MenuItem
        label="Dil"
        value="Türkçe"
        onClick={() => openSystemSettingsModal('language')}
        showChevron
      />
      <MenuItem
        label="Para Birimi"
        value="Dolar ($)"
        onClick={() => openSystemSettingsModal('currency')}
        showChevron
      />

      <Separator />
      <MenuItem label="Çıkış Yap" onClick={logout} />
    </>
  )
}

function MenuItem({ label, description, value, onClick, showChevron, control }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-100"
    >
      <div className="flex items-center">
        <div>
          <p className="text-size-sm font-semibold text-on-box-black">{label}</p>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <div className="flex items-center">
        {value && (
          <span className="mr-2 text-size-sm text-gray-800 first-letter:uppercase">{value}</span>
        )}
        {control}
        {showChevron && <ChevronRight size={18} className="shrink-0 text-black" />}
      </div>
    </button>
  )
}

function MobileAppDownload({ closeDropdown }: any) {
  return (
    <button
      aria-label="Download Mobile App"
      className="flex items-center justify-between px-4 py-3 text-start"
      onClick={() => {
        const element = document.getElementById('app-promo-section')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          closeDropdown()
        }
      }}
    >
      <div className="flex flex-col gap-y-1">
        <h6 className="font-semibold text-primary-500">Uygulamayı İndir</h6>
        <p className="text-size-sm text-gray-600">
          Avantajlardan faydalanmak için uygulamayı stordan indir!
        </p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-black" />
    </button>
  )
}

function Separator() {
  return <div className="my-1 border-t border-gray-100" />
}

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none">
    <path
      d="M4.8875 12.825C5.525 12.3375 6.2375 11.9531 7.025 11.6719C7.8125 11.3906 8.6375 11.25 9.5 11.25C10.3625 11.25 11.1875 11.3906 11.975 11.6719C12.7625 11.9531 13.475 12.3375 14.1125 12.825C14.55 12.3125 14.8906 11.7313 15.1344 11.0813C15.3781 10.4313 15.5 9.7375 15.5 9C15.5 7.3375 14.9156 5.92188 13.7469 4.75313C12.5781 3.58438 11.1625 3 9.5 3C7.8375 3 6.42188 3.58438 5.25313 4.75313C4.08438 5.92188 3.5 7.3375 3.5 9C3.5 9.7375 3.62188 10.4313 3.86563 11.0813C4.10938 11.7313 4.45 12.3125 4.8875 12.825ZM9.5 9.75C8.7625 9.75 8.14063 9.49688 7.63438 8.99063C7.12813 8.48438 6.875 7.8625 6.875 7.125C6.875 6.3875 7.12813 5.76562 7.63438 5.25938C8.14063 4.75313 8.7625 4.5 9.5 4.5C10.2375 4.5 10.8594 4.75313 11.3656 5.25938C11.8719 5.76562 12.125 6.3875 12.125 7.125C12.125 7.8625 11.8719 8.48438 11.3656 8.99063C10.8594 9.49688 10.2375 9.75 9.5 9.75ZM9.5 16.5C8.4625 16.5 7.4875 16.3031 6.575 15.9094C5.6625 15.5156 4.86875 14.9813 4.19375 14.3063C3.51875 13.6313 2.98438 12.8375 2.59063 11.925C2.19688 11.0125 2 10.0375 2 9C2 7.9625 2.19688 6.9875 2.59063 6.075C2.98438 5.1625 3.51875 4.36875 4.19375 3.69375C4.86875 3.01875 5.6625 2.48438 6.575 2.09063C7.4875 1.69688 8.4625 1.5 9.5 1.5C10.5375 1.5 11.5125 1.69688 12.425 2.09063C13.3375 2.48438 14.1313 3.01875 14.8063 3.69375C15.4813 4.36875 16.0156 5.1625 16.4094 6.075C16.8031 6.9875 17 7.9625 17 9C17 10.0375 16.8031 11.0125 16.4094 11.925C16.0156 12.8375 15.4813 13.6313 14.8063 14.3063C14.1313 14.9813 13.3375 15.5156 12.425 15.9094C11.5125 16.3031 10.5375 16.5 9.5 16.5Z"
      fill="#F8F8F8"
    />
  </svg>
)
