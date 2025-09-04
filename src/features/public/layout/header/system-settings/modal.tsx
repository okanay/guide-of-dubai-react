import { Check, Globe, Monitor, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import useClickOutside from 'src/hooks/use-click-outside'
import { SUPPORTED_LANGUAGES } from 'src/i18n/config'
import { useLanguage } from 'src/i18n/prodiver'
import { useTheme } from 'src/providers/theme-mode'
import { useSystemSettingsModal } from './store'

export function SystemSettingsModal() {
  const { isOpen, closeModal } = useSystemSettingsModal()
  const modalRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const { language, changeLanguage } = useLanguage()

  // Click outside to close
  useClickOutside(() => closeModal(), isOpen, modalRef)

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, closeModal])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative max-h-[90vh] w-full max-w-md overflow-hidden bg-box-surface shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 id="settings-title" className="text-lg font-semibold text-black">
            Sistem Ayarları
          </h2>
          <button
            onClick={closeModal}
            className="rounded-full p-1 text-black transition-colors duration-300 hover:text-black-60"
            aria-label="Ayarları kapat"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] space-y-6 overflow-y-auto p-4">
          {/* Language Settings */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-on-box-black">
              <Globe size={16} className="text-primary-500" />
              Dil Seçimi
            </h3>
            <div className="space-y-2">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => changeLanguage(lang.value)}
                  data-status={language.value === lang.value ? 'active' : 'inactive'}
                  className="flex h-12 w-full items-center justify-start gap-x-4 border border-gray-200 px-3 py-3 font-medium text-on-box-black transition-colors hover:bg-gray-50 data-[status=active]:border-primary-200 data-[status=active]:bg-primary-50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-6 w-6 items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: lang.icon }}
                    />
                    <span>{lang.label}</span>
                  </div>
                  {language.value === lang.value && (
                    <Check size={16} className="text-primary-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-on-box-black">
              <Monitor size={16} className="text-primary-500" />
              Tema
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setTheme('system')}
                data-status={theme === 'system' ? 'active' : 'inactive'}
                className="flex h-12 w-full items-center justify-start gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-colors hover:bg-gray-50 data-[status=active]:border-primary-200 data-[status=active]:bg-primary-50"
              >
                <span>🖥️ </span>
                <span>Sistem Teması</span>
                {theme === 'system' && <Check size={16} className="text-primary-500" />}
              </button>
              <button
                onClick={() => setTheme('light')}
                data-status={theme === 'light' ? 'active' : 'inactive'}
                className="flex h-12 w-full items-center justify-start gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-colors hover:bg-gray-50 data-[status=active]:border-primary-200 data-[status=active]:bg-primary-50"
              >
                <span>☀️ </span>
                <span>Açık Tema</span>
                {theme === 'light' && <Check size={16} className="text-primary-500" />}
              </button>
              <button
                onClick={() => setTheme('dark')}
                data-status={theme === 'dark' ? 'active' : 'inactive'}
                className="flex h-12 w-full items-center justify-start gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-colors hover:bg-gray-50 data-[status=active]:border-primary-200 data-[status=active]:bg-primary-50"
              >
                <span>🌙 </span>
                <span>Koyu Tema</span>
                {theme === 'dark' && <Check size={16} className="text-primary-500" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={closeModal}
            className="w-full bg-btn-primary px-4 py-2 font-medium text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
