import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuth } from '@/providers/auth'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useMobileMenu } from './store'
import { modalManager } from '@/features/modals/global/manager'
import { useGlobalModalStore } from '@/features/modals/global/store'
import { AuthModalComponent } from '@/features/modals/auth/modal'
import { LoginTermsText } from '@/features/modals/auth/modal'
import Icon from '@/components/icon'

export function MobileMenu() {
  const { isOpen, closeMenu } = useMobileMenu()
  const { t } = useTranslation('layout-header')
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  // Portal container set et
  useEffect(() => {
    setPortalContainer(document.body)
  }, [])

  // Ekran büyüyünce zorla kapat
  useEffect(() => {
    if (isLargeScreen && isOpen) {
      closeMenu()
    }
  }, [isLargeScreen, isOpen, closeMenu])

  useEffect(() => {
    if (isOpen) {
      modalManager.openModal('body')
    } else {
      modalManager.closeModal('body')
    }
  }, [isOpen])

  if (!portalContainer) return null

  return createPortal(
    <div
      id="mobile-menu-container"
      data-open={isOpen}
      className="pointer-events-none fixed inset-0 z-50 transition-all duration-300 data-[open=true]:pointer-events-auto"
    >
      {/* Scrim/Overlay */}
      <div
        onClick={closeMenu}
        data-open={isOpen}
        data-theme="force-main"
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 data-[open=false]:opacity-0 data-[open=true]:opacity-100"
      />

      {/* Menu Panel */}
      <div
        data-open={isOpen}
        className="absolute top-0 left-0 flex h-full w-full transform flex-col bg-box-surface shadow-xl transition-transform duration-300 ease-out data-[open=false]:-translate-x-full data-[open=true]:translate-x-0 md:max-w-sm lg:hidden"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-2">
          <h2 className="text-lg font-semibold text-on-box-black">{t('buttons.menu')}</h2>
          <button
            onClick={closeMenu}
            className="flex items-center justify-center rounded-full p-2 text-on-box-black transition-colors hover:bg-gray-100"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <MenuContent />
          </div>
        </div>
      </div>
    </div>,
    portalContainer,
  )
}

function MenuContent() {
  const { sessionStatus, user, logout } = useAuth()
  const { t } = useTranslation(['layout-header', 'global-modal'])
  const { open: openGlobalModal } = useGlobalModalStore()

  // Auth modal açma fonksiyonu
  const openAuthModal = async (mode = 'login') => {
    await openGlobalModal(AuthModalComponent, { mode, closeOnLoginBack: true })
  }

  return (
    <div className="space-y-6">
      {/* Auth Section */}
      <div>
        {sessionStatus === 'authenticated' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <span className="text-lg font-semibold text-primary-600">
                  {user?.displayName?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-on-box-black">{user?.displayName}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full text-left text-sm text-red-600 hover:text-red-700"
            >
              {t('layout-header:profile.logout')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-y-3">
            <MobileLoginAuthButtons openAuthModal={openAuthModal} />
            <div className="text-start text-pretty">
              <LoginTermsText />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Mobile için özel LoginAuthButtons bileşeni
const MobileLoginAuthButtons = ({ openAuthModal }: { openAuthModal: (mode: string) => void }) => {
  const { t } = useTranslation('global-modal')

  return (
    <div className="flex flex-col gap-y-2">
      {/* Main Options */}
      <div className="space-y-2">
        <MobileAuthButton
          icon="phone"
          iconClass="h-5 w-5 text-black"
          label={t('auth.continue_with_phone')}
          onClick={() => openAuthModal('phone-login')}
        />
        <MobileAuthButton
          icon="email"
          iconClass="h-5 w-5"
          label={t('auth.continue_with_email')}
          onClick={() => openAuthModal('email-login')}
        />
      </div>
      {/* Divider */}
      <div className="flex items-center gap-x-2 py-2">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">{t('auth.or_divider')}</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>
      {/* Social Options */}
      <div className="space-y-2">
        <MobileAuthButton
          icon="socials/apple"
          iconClass="h-5 w-5 text-black dark:invert"
          label={t('auth.continue_with_apple')}
          onClick={() => {}}
        />
        <MobileAuthButton
          icon="socials/google"
          iconClass="h-5 w-5"
          label={t('auth.continue_with_google')}
          onClick={() => {}}
        />
        <MobileAuthButton
          icon="socials/facebook"
          iconClass="h-5 w-5"
          label={t('auth.continue_with_facebook')}
          onClick={() => {}}
        />
      </div>
    </div>
  )
}

interface MobileAuthButtonProps {
  icon: string
  iconClass: string
  label: string
  onClick: () => void
}

function MobileAuthButton({ icon, iconClass, label, onClick }: MobileAuthButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xs border border-gray-300 p-3 hover:bg-gray-50"
    >
      <div className="flex items-center gap-x-4">
        <Icon name={icon} className={iconClass} />
        <span className="font-semibold">{label}</span>
      </div>
      <Icon name="chevron-right" className="h-5 w-5 text-gray-400" />
    </button>
  )
}
