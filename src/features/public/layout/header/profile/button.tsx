import { ChevronRight } from 'lucide-react'
import { useState, useEffect, useRef, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AvatarImageRender } from 'src/components/avatar-image-renderer'
import { useLanguage } from 'src/i18n/prodiver'
import { useAuth } from 'src/providers/auth'
import { useTheme } from 'src/providers/theme-mode'
import { useAuthModal } from '../auth/store'
import { useHeader } from '../store'
import { useSystemSettings } from '../system-settings/store'
import useClickOutside from 'src/hooks/use-click-outside'
import { useTranslation } from 'react-i18next'
import Icon from '@/components/icon'

export function ProfileButton() {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useClickOutside<HTMLDivElement>(closeDropdown, true, buttonRef)
  const { t } = useTranslation('public-header')

  const { openModal: openAuthModal } = useAuthModal()
  const { closeCategories, setInverted } = useHeader()
  const { sessionStatus, user, logout } = useAuth()

  // Portal container'ı client-side'da set et
  useEffect(() => {
    setPortalContainer(document.body)
  }, [])

  function toggleDropdown() {
    if (isDropdownOpen) {
      closeDropdown()
    } else {
      closeCategories()
      setInverted(true)
      setIsDropdownOpen(true)
    }
  }

  function closeDropdown() {
    setIsDropdownOpen(false)
    setInverted(false)
  }

  return (
    <>
      {/* Profil Butonu */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="ml-2 flex items-center gap-x-2 rounded-xs bg-btn-primary px-5 py-2 text-on-btn-primary transition-colors duration-300 ease-in-out hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled"
        aria-label={t('profile.title')}
        aria-expanded={isDropdownOpen}
      >
        {t('profile.title')}
        <Icon name="user-icon" className="size-5 text-on-btn-primary" />
      </button>

      {/* Portal - portalContainer varsa render et */}
      {portalContainer &&
        createPortal(
          <div
            data-visible={isDropdownOpen}
            id="profile-dropdown-wrapper"
            className="pointer-events-none fixed inset-0 z-33 opacity-0 transition-opacity duration-300 data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100"
          >
            {/* Arka Plan Overlay */}
            <div onClick={closeDropdown} className="absolute inset-0 z-33 bg-black/40" />

            {/* Header Boşluğu */}
            <div className="absolute top-0 left-0 z-33 h-16 w-full bg-box-surface" />

            {/* Dropdown İçeriği */}
            <div
              ref={dropdownRef}
              className="pointer-events-none absolute top-16 right-0 left-1/2 z-35 flex w-full max-w-8xl -translate-x-1/2 justify-end"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                data-visible={isDropdownOpen}
                className="w-72 border border-gray-200 bg-box-surface shadow-lg data-[visible=true]:pointer-events-auto"
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
          portalContainer,
        )}
    </>
  )
}

function UnauthorizeDropdownContent({ openAuthModal, closeDropdown }: any) {
  const { openModal: openSystemSettingsModal, currency } = useSystemSettings()
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { t } = useTranslation('public-header')

  return (
    <>
      <MenuItem
        label={t('profile.login_register')}
        onClick={() => {
          openAuthModal('login')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />
      <MenuItem
        label={t('settings.language')}
        value={language.label}
        onClick={() => {
          openSystemSettingsModal('language')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />

      <MenuItem
        label={t('settings.currency')}
        value={currency.name}
        onClick={() => {
          openSystemSettingsModal('currency')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />
      <MenuItem
        label={t('settings.theme')}
        value={t(`settings.${theme}_theme`)}
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

function AuthorizeDropdownContent({ user, logout, closeDropdown }: any) {
  const { openModal: openSystemSettingsModal, currency } = useSystemSettings()
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { t } = useTranslation('public-header')

  return (
    <>
      <div className="flex items-center p-4">
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
      <MenuItem label={t('profile.my_profile')} onClick={() => {}} showChevron />
      <MenuItem label={t('profile.my_reservations')} onClick={() => {}} showChevron />
      <MenuItem label={t('profile.my_favorites')} onClick={() => {}} showChevron />
      <Separator />
      <MenuItem
        label={t('settings.language')}
        value={language.label}
        onClick={() => {
          openSystemSettingsModal('language')
          closeDropdown()
        }}
        showChevron
      />
      <MenuItem
        label={t('settings.currency')}
        value={currency.name}
        onClick={() => {
          openSystemSettingsModal('currency')
          closeDropdown()
        }}
        showChevron
      />
      <MenuItem
        label={t('settings.theme')}
        value={t(`settings.${theme}_theme`)}
        onClick={() => {
          openSystemSettingsModal('theme')
          closeDropdown()
        }}
        showChevron
      />
      <Separator />
      <MenuItem label={t('profile.logout')} onClick={logout} />
    </>
  )
}

function MenuItem({ label, description, value, onClick, showChevron, control }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-gray-100"
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
  const { t } = useTranslation('public-header')

  return (
    <button
      aria-label="Download Mobile App"
      className="flex items-center justify-between px-4 pt-3 pb-4 text-start"
      onClick={() => {
        const element = document.getElementById('app-promo-section')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          closeDropdown()
        }
      }}
    >
      <div className="flex flex-col gap-y-1">
        <h6 className="font-semibold text-primary-500">{t('profile.download_app')}</h6>
        <p className="text-size-sm text-gray-600">{t('profile.download_app_description')}</p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-black" />
    </button>
  )
}

function Separator() {
  return <div className="border-t border-gray-100" />
}
