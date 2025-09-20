import { LoginAuthButtons, LoginTermsText } from '@/features/modals/auth/modal'
import { useAuth } from '@/providers/auth'
import { useMediaQuery } from '@/hooks/use-media-query'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchButton } from '@/features/modals/search/button'

interface MobileMenuProps {
  onClose?: () => void
  onGoBack?: () => void
  ref: any
}

export function MobileMenuComponent({ onClose, onGoBack, ref }: MobileMenuProps) {
  const { t } = useTranslation('layout-header')
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  // Ekran büyüyünce zorla kapat
  useEffect(() => {
    if (isLargeScreen) {
      onClose?.()
    }
  }, [isLargeScreen, onClose])

  const handleContentClick = (e: React.MouseEvent) => {
    console.log('📱 Mobile menu content clicked, preventing propagation')
    e.stopPropagation()
  }

  return (
    <div
      ref={ref}
      className="pointer-events-auto relative flex h-full w-full max-w-sm transform flex-col bg-box-surface"
      onClick={handleContentClick}
      data-mobile-menu="true"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-on-box-black">{t('buttons.menu')}</h2>
        <button
          onClick={(e) => {
            e.stopPropagation()
            console.log('❌ Mobile menu close button clicked')
            onClose?.()
          }}
          className="flex items-center justify-center rounded-full p-2 text-on-box-black transition-colors hover:bg-gray-100"
          aria-label="Close mobile menu"
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

      {/* Debug Info */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
        <div className="text-xs text-gray-600">
          <p>✅ Global Modal System</p>
          <p>✅ Smart Outside Click</p>
          <p>✅ CSS Animations</p>
        </div>
      </div>
    </div>
  )
}

function MenuContent() {
  const { sessionStatus, user, logout } = useAuth()
  const { t } = useTranslation(['layout-header', 'global-modal'])

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
            {/* Global modal sistemi için scopeId kaldırıldı */}
            <LoginAuthButtons />
            <div className="text-start text-pretty">
              <LoginTermsText />
            </div>
          </div>
        )}
      </div>

      <SearchButton variant="icon" />
    </div>
  )
}
