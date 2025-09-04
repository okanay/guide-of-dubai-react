import { Check, DollarSign, Globe, Monitor, X } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from 'src/i18n/config'
import { SUPPORTED_CURRENCIES } from 'src/i18n/currency-config'
import { useLanguage } from 'src/i18n/prodiver'
import { useTheme } from 'src/providers/theme-mode'
import { useSystemSettings } from './store'
import { ModalWrapper } from 'src/components/modal-wrapper'

export function SystemSettingsModal() {
  const { isOpen, closeModal, scopeId, currency, setCurrency } = useSystemSettings()
  const { theme, setTheme } = useTheme()
  const { language, changeLanguage } = useLanguage()

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={closeModal}
      scopeId={scopeId}
      disableOutsideClick={false}
    >
      {/* Modal */}
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-auto md:max-h-[90vh] md:w-full md:max-w-md md:shadow-2xl">
        {/* Header - Her zaman sabit */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
          <h2 id="settings-title" className="text-lg font-semibold text-on-box-black">
            Sistem Ayarları
          </h2>
          <button
            onClick={closeModal}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Ayarları kapat"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content - Kaydırılabilir alan */}
        <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-4">
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
                    className="flex h-12 w-full items-center justify-between gap-x-4 border border-gray-200 px-3 py-3 font-medium text-on-box-black transition-all duration-200 hover:border-primary-200 hover:bg-gray-50 data-[status=active]:border-primary-500 data-[status=active]:bg-primary-50"
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

            {/* Currency Settings */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-on-box-black">
                <DollarSign size={16} className="text-primary-500" />
                Para Birimi
              </h3>
              <div className="space-y-2">
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <button
                    key={curr.code}
                    onClick={() => setCurrency(curr.code)}
                    data-status={currency.code === curr.code ? 'active' : 'inactive'}
                    className="flex h-14 w-full items-center justify-between gap-x-4 border border-gray-200 px-3 py-3 font-medium text-on-box-black transition-all duration-200 hover:border-primary-200 hover:bg-gray-50 data-[status=active]:border-primary-500 data-[status=active]:bg-primary-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center text-xl">
                        {curr.flag}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">{curr.name}</div>
                        <div className="text-xs text-gray-600">
                          {curr.symbol} - {curr.code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    {currency.code === curr.code && (
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
                  className="flex h-12 w-full items-center justify-between gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-all duration-200 hover:border-primary-200 hover:bg-gray-50 data-[status=active]:border-primary-500 data-[status=active]:bg-primary-50"
                >
                  <div className="flex items-center gap-3">
                    <span>🖥️</span>
                    <span>Sistem Teması</span>
                  </div>
                  {theme === 'system' && <Check size={16} className="text-primary-500" />}
                </button>
                <button
                  onClick={() => setTheme('light')}
                  data-status={theme === 'light' ? 'active' : 'inactive'}
                  className="flex h-12 w-full items-center justify-between gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-all duration-200 hover:border-primary-200 hover:bg-gray-50 data-[status=active]:border-primary-500 data-[status=active]:bg-primary-50"
                >
                  <div className="flex items-center gap-3">
                    <span>☀️</span>
                    <span>Açık Tema</span>
                  </div>
                  {theme === 'light' && <Check size={16} className="text-primary-500" />}
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  data-status={theme === 'dark' ? 'active' : 'inactive'}
                  className="flex h-12 w-full items-center justify-between gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-all duration-200 hover:border-primary-200 hover:bg-gray-50 data-[status=active]:border-primary-500 data-[status=active]:bg-primary-50"
                >
                  <div className="flex items-center gap-3">
                    <span>🌙</span>
                    <span>Koyu Tema</span>
                  </div>
                  {theme === 'dark' && <Check size={16} className="text-primary-500" />}
                </button>
              </div>
            </div>

            {/* Mobil için extra spacing */}
            <div className="h-20 md:hidden" />
          </div>
        </div>

        {/* Footer - Her zaman sabit */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={closeModal}
            className="w-full bg-btn-primary px-4 py-3 font-medium text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled"
          >
            Tamam
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}
