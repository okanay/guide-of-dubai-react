import { useAuthModal } from '@/features/modals/auth/store'
import { useSystemSettings } from '@/features/modals/system-settings/store'
import { useLanguage } from '@/i18n/prodiver'
import { useAuth } from '@/providers/auth'
import { useTheme } from '@/providers/theme-mode'
import { X, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useMobileMenu } from './store'

export function MobileMenu() {
  const { isOpen, activeSubmenu, closeMenu } = useMobileMenu()
  const { t } = useTranslation('layout-header')

  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const originalScrollY = useRef<number>(0)

  // Portal container'ı client-side'da set et
  useEffect(() => {
    setPortalContainer(document.body)
  }, [])

  // Global body scroll lock with Safari iOS fix
  useEffect(() => {
    if (!isOpen) return

    // Scroll pozisyonunu kaydet
    originalScrollY.current = window.scrollY

    // Body'yi sabitle - Tüm tarayıcılar için liquid glass/viewport fix
    document.body.style.position = 'fixed'
    document.body.style.top = `-${originalScrollY.current}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.overflow = 'hidden'

    return () => {
      // Styles'ı temizle ve scroll'u restore et
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, originalScrollY.current)
    }
  }, [isOpen])

  if (!portalContainer) return null

  return createPortal(
    <div
      data-open={isOpen}
      className="pointer-events-none fixed inset-0 z-50 transition-all duration-300 data-[open=true]:pointer-events-auto"
    >
      {/* Overlay */}
      <div
        onClick={closeMenu}
        data-open={isOpen}
        data-theme="force-main"
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 data-[open=false]:opacity-0 data-[open=true]:opacity-100"
      />

      {/* Menu Panel */}
      <div
        data-open={isOpen}
        data-submenu={activeSubmenu !== null}
        className="absolute top-0 left-0 h-full w-full max-w-sm transform bg-box-surface shadow-xl transition-transform duration-300 ease-out data-[open=false]:-translate-x-full data-[open=true]:translate-x-0 md:max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            {activeSubmenu && <BackButton />}
            <h2 className="text-lg font-semibold text-on-box-black">
              {activeSubmenu ? t(`buttons.${activeSubmenu}`) : t('buttons.menu')}
            </h2>
          </div>
          <CloseButton />
        </div>

        {/* Content */}
        <div className="flex h-full flex-col overflow-hidden"></div>
      </div>
    </div>,
    portalContainer,
  )
}

// =============================================================================
// SUB COMPONENTS
// =============================================================================
function CloseButton() {
  const { closeMenu } = useMobileMenu()
  const { t } = useTranslation('global-modal')

  return (
    <button
      onClick={closeMenu}
      className="flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      aria-label={t('settings.close')}
    >
      <X className="h-5 w-5" />
    </button>
  )
}

function BackButton() {
  const { goBack } = useMobileMenu()
  const { t } = useTranslation('global-modal')

  return (
    <button
      onClick={goBack}
      className="flex items-center justify-center rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      aria-label={t('settings.back')}
    >
      <ChevronRight className="h-4 w-4 rotate-180" />
    </button>
  )
}
