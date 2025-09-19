import { useAuthModal } from '@/features/modals/auth/store'
import { useSystemSettings } from '@/features/modals/system-settings/store'
import { useLanguage } from '@/i18n/prodiver'
import { useAuth } from '@/providers/auth'
import { useTheme } from '@/providers/theme-mode'
import { X, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useMobileMenu } from './store'
import { useModalBodyLock } from '@/features/modals/components/use-modal-body-lock'
import { useMediaQuery } from '@/hooks/use-media-query'
import { LoginAuthButtons, LoginTermsText } from '@/features/modals/auth/modal'

export function MobileMenu() {
  const { isOpen, closeMenu } = useMobileMenu()
  const { t } = useTranslation('layout-header')
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  // Global modal body lock
  useModalBodyLock(isOpen, 'mobile-menu-root')

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
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-on-box-black">{t('buttons.menu')}</h2>
          <button
            onClick={closeMenu}
            className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
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

  return (
    <div className="space-y-6">
      {/* Auth Section */}
      <div className="border-b border-gray-200 pb-6">
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
            <LoginAuthButtons scopeId="mobile-menu-container" />
            <div className="text-start text-pretty">
              <LoginTermsText />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
