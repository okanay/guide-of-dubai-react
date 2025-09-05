import { ArrowLeft, Check, ChevronRight, DollarSign, Globe, Monitor, Moon, X } from 'lucide-react'
import { ModalWrapper } from 'src/components/modal-wrapper'
import { SUPPORTED_LANGUAGES } from 'src/i18n/config'
import { SUPPORTED_CURRENCIES } from 'src/i18n/currency-config'
import { useLanguage } from 'src/i18n/prodiver'
import { useTheme } from 'src/providers/theme-mode'
import { useSystemSettings } from './store'

export function SystemSettingsModal() {
  const { isOpen, closeModal, scopeId, mode, setMode } = useSystemSettings()

  const handleClose = () => {
    closeModal()
    // Modalı kapatırken animasyonun bitmesini bekleyip modu sıfırlıyoruz.
    setTimeout(() => setMode('main'), 300)
  }

  const renderContent = () => {
    switch (mode) {
      case 'language':
        return <LanguageSettings />
      case 'currency':
        return <CurrencySettings />
      case 'theme':
        return <ThemeSettings />
      case 'main':
      default:
        return <MainSettings />
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'language':
        return 'Dil Seçimi'
      case 'currency':
        return 'Para Birimi Seçimi'
      case 'theme':
        return 'Tema Seçimi'
      case 'main':
      default:
        return 'Ayarlar'
    }
  }

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      scopeId={scopeId}
      disableOutsideClick={false}
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-box-surface md:h-auto md:max-h-[90vh] md:w-full md:max-w-md md:shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
          <div className="w-8">
            {mode !== 'main' && (
              <button
                onClick={() => setMode('main')}
                className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
                aria-label="Geri"
              >
                <ArrowLeft className="size-6" />
              </button>
            )}
          </div>
          <h2
            id="settings-title"
            className="flex-1 text-center text-lg font-semibold text-on-box-black"
          >
            {getTitle()}
          </h2>
          <div className="w-8">
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
              aria-label="Ayarları kapat"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>

        {/* Content - Kaydırılabilir alan */}
        <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
          <button
            onClick={handleClose}
            className="w-full bg-btn-primary px-4 py-3 font-medium text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled"
          >
            Tamam
          </button>
        </div>
      </div>
    </ModalWrapper>
  )
}

function MainSettings() {
  const { setMode, currency } = useSystemSettings()
  const { language } = useLanguage()
  const { theme } = useTheme()

  return (
    <div className="space-y-2 p-4">
      <button
        onClick={() => setMode('language')}
        className="flex w-full items-center justify-between border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <Globe size={20} className="text-gray-600" />
          <div>
            <p className="font-medium">Dil</p>
            <p className="text-sm text-gray-500">{language.label}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </button>
      <button
        onClick={() => setMode('currency')}
        className="flex w-full items-center justify-between border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <DollarSign size={20} className="text-gray-600" />
          <div>
            <p className="font-medium">Para Birimi</p>
            <p className="text-sm text-gray-500">{currency.name}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </button>
      <button
        onClick={() => setMode('theme')}
        className="flex w-full items-center justify-between border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <Moon size={20} className="text-gray-600" />

          <div>
            <p className="font-medium">Tema</p>
            <p className="text-sm text-gray-500 first-letter:uppercase">{theme}</p>
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </button>
    </div>
  )
}

function LanguageSettings() {
  const { language, changeLanguage } = useLanguage()

  return (
    <div className="p-4">
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
            {language.value === lang.value && <Check size={16} className="text-primary-500" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function CurrencySettings() {
  const { currency, setCurrency } = useSystemSettings()
  return (
    <div className="p-4">
      <div className="space-y-2">
        {SUPPORTED_CURRENCIES.map((curr) => (
          <button
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            data-status={currency.code === curr.code ? 'active' : 'inactive'}
            className="flex h-14 w-full items-center justify-between gap-x-4 border border-gray-200 px-3 py-3 font-medium text-on-box-black transition-all duration-200 hover:border-primary-200 hover:bg-gray-50 data-[status=active]:border-primary-500 data-[status=active]:bg-primary-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center text-xl">{curr.flag}</div>
              <div className="text-left">
                <div className="text-sm font-medium">{curr.name}</div>
                <div className="text-xs text-gray-600">
                  {curr.symbol} - {curr.code.toUpperCase()}
                </div>
              </div>
            </div>
            {currency.code === curr.code && <Check size={16} className="text-primary-500" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="p-4">
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
  )
}
