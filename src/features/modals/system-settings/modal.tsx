import { ArrowLeft, ChevronRight, DollarSign, Globe, Monitor, Moon, Sun, X } from 'lucide-react'
import { ModalWrapper } from '@/features/modals/components/wrapper'
import { useLanguage } from 'src/i18n/prodiver'
import { useTheme } from 'src/providers/theme-mode'
import { useSystemSettings } from './store'
import { RadioIndicator } from 'src/features/public/components/form-ui/radio-input'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import Icon from '@/components/icon'
import { useNavigate } from '@tanstack/react-router'
import { SUPPORTED_LANGUAGES } from '@/i18n/config-language'
import { SUPPORTED_CURRENCIES } from '@/i18n/config-currency'

export function SystemSettingsModal() {
  const { isOpen, closeModal, scopeId, mode, setMode } = useSystemSettings()

  const handleClose = () => {
    closeModal()
    setTimeout(() => setMode('main'), 300)
  }

  const renderContent = () => {
    switch (mode) {
      case 'language':
        return <LanguageSection onClose={handleClose} />
      case 'currency':
        return <CurrencySection onClose={handleClose} />
      case 'theme':
        return <ThemeSection onClose={handleClose} />
      case 'main':
      default:
        return <MainSection onClose={handleClose} />
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
        {renderContent()}
      </div>
    </ModalWrapper>
  )
}

// Ana Ayarlar Bölümü
function MainSection({ onClose }: { onClose: () => void }) {
  const { setMode, currency } = useSystemSettings()
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { t } = useTranslation('global-modal')

  return (
    <>
      {/* Main Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
        <div className="w-8" />
        <h2 className="flex-1 text-center text-lg font-semibold text-on-box-black">
          {t('settings.title')}
        </h2>
        <div className="w-8">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Ayarları kapat"
          >
            <X className="size-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto">
        <div className="space-y-2 p-4">
          <button
            onClick={() => setMode('language')}
            className="flex w-full items-center justify-between border border-gray-200 p-3 text-left transition-colors hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-600" />
              <div>
                <p className="font-medium">{t('settings.language')}</p>
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
                <p className="font-medium">{t('settings.currency')}</p>
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
              {theme === 'light' ? (
                <Sun size={20} className="text-gray-600" />
              ) : theme === 'dark' ? (
                <Moon size={20} className="text-gray-600" />
              ) : (
                <Monitor size={20} className="text-gray-600" />
              )}
              <div>
                <p className="font-medium">{t('settings.theme')}</p>
                <p className="text-sm text-gray-500 first-letter:uppercase">
                  {t(`settings.${theme}_theme`)}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
        <button
          onClick={onClose}
          className="dark:text-dark w-full bg-btn-primary px-4 py-3 font-semibold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled dark:bg-primary-500"
        >
          {t('settings.close')}
        </button>
      </div>
    </>
  )
}

// Dil Ayarları Bölümü
function LanguageSection({ onClose }: { onClose: () => void }) {
  const { setMode } = useSystemSettings()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation('global-modal')
  const navigate = useNavigate()

  // Geçici seçim state'i
  const [selectedLanguage, setSelectedLanguage] = useState(language.value)

  // Değişiklik yapıldı mı kontrolü
  const hasChanges = selectedLanguage !== language.value

  const handleConfirm = () => {
    if (hasChanges) {
      // Dili değiştir
      changeLanguage(selectedLanguage)

      // Modal'ı kapat
      onClose()

      // Sayfayı yenile
      setTimeout(() => {
        navigate({
          to: '.',
          params: { lang: selectedLanguage },
          resetScroll: true,
          reloadDocument: true,
        })
      }, 100)
    } else {
      // Değişiklik yoksa sadece ana menüye dön
      setMode('main')
    }
  }

  const handleBack = () => {
    // Geri butonuna basıldığında değişiklikleri geri al
    setSelectedLanguage(language.value)
    setMode('main')
  }

  return (
    <>
      {/* Language Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
        <div className="w-8">
          <button
            onClick={handleBack}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Geri"
          >
            <ArrowLeft className="size-6" />
          </button>
        </div>
        <h2 className="flex-1 text-center text-lg font-semibold text-on-box-black">
          {t('settings.language_selection')}
        </h2>
        <div className="w-8">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Kapat"
          >
            <X className="size-6" />
          </button>
        </div>
      </div>

      {/* Language Content */}
      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <SystemSettingsRadioCard
                key={lang.value}
                icon={
                  <Icon name={lang.flag} className="flex h-6 w-6 items-center justify-center" />
                }
                title={lang.label}
                isSelected={selectedLanguage === lang.value}
                onClick={() => setSelectedLanguage(lang.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Language Footer - Sabit Tamam Butonu */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
        <button
          onClick={handleConfirm}
          className="dark:text-dark w-full bg-btn-primary px-4 py-3 font-semibold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled dark:bg-primary-500"
        >
          {t(hasChanges ? 'settings.change' : 'settings.ok')}
        </button>
      </div>
    </>
  )
}

// Para Birimi Ayarları Bölümü
function CurrencySection({ onClose }: { onClose: () => void }) {
  const { setMode, currency, setCurrency } = useSystemSettings()
  const { t } = useTranslation('global-modal')

  // Geçici seçim state'i
  const [selectedCurrency, setSelectedCurrency] = useState(currency.code)

  // Değişiklik yapıldı mı kontrolü
  const hasChanges = selectedCurrency !== currency.code

  const handleConfirm = () => {
    if (hasChanges) {
      // Para birimini değiştir
      setCurrency(selectedCurrency)
    }
    // Ana menüye dön
    setMode('main')
  }

  const handleBack = () => {
    // Geri butonuna basıldığında değişiklikleri geri al
    setSelectedCurrency(currency.code)
    setMode('main')
  }

  return (
    <>
      {/* Currency Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
        <div className="w-8">
          <button
            onClick={handleBack}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Geri"
          >
            <ArrowLeft className="size-6" />
          </button>
        </div>
        <h2 className="flex-1 text-center text-lg font-semibold text-on-box-black">
          {t('settings.currency_selection')}
        </h2>
        <div className="w-8">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Kapat"
          >
            <X className="size-6" />
          </button>
        </div>
      </div>

      {/* Currency Content */}
      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-2">
            {SUPPORTED_CURRENCIES.map((curr) => (
              <SystemSettingsRadioCard
                key={curr.code}
                icon={
                  <Icon name={curr.flag} className="flex h-6 w-6 items-center justify-center" />
                }
                title={curr.name}
                description={`${curr.symbol} - ${curr.code.toUpperCase()}`}
                isSelected={selectedCurrency === curr.code}
                onClick={() => setSelectedCurrency(curr.code)}
                className="h-14"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Currency Footer - Sabit Tamam Butonu */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
        <button
          onClick={handleConfirm}
          className="dark:text-dark w-full bg-btn-primary px-4 py-3 font-semibold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled dark:bg-primary-500"
        >
          {t(hasChanges ? 'settings.change' : 'settings.ok')}
        </button>
      </div>
    </>
  )
}

// Tema Ayarları Bölümü
function ThemeSection({ onClose }: { onClose: () => void }) {
  const { setMode } = useSystemSettings()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('global-modal')

  // Geçici seçim state'i
  const [selectedTheme, setSelectedTheme] = useState(theme)

  // Değişiklik yapıldı mı kontrolü
  const hasChanges = selectedTheme !== theme

  const handleConfirm = () => {
    if (hasChanges) {
      // Temayı değiştir
      setTheme(selectedTheme)
    }
    // Ana menüye dön
    setMode('main')
  }

  const handleBack = () => {
    // Geri butonuna basıldığında değişiklikleri geri al
    setSelectedTheme(theme)
    setMode('main')
  }

  return (
    <>
      {/* Theme Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-box-surface p-4">
        <div className="w-8">
          <button
            onClick={handleBack}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Geri"
          >
            <ArrowLeft className="size-6" />
          </button>
        </div>
        <h2 className="flex-1 text-center text-lg font-semibold text-on-box-black">
          {t('settings.theme_selection')}
        </h2>
        <div className="w-8">
          <button
            onClick={onClose}
            className="rounded-full p-1 text-on-box-black transition-colors duration-300 hover:text-black-60"
            aria-label="Kapat"
          >
            <X className="size-6" />
          </button>
        </div>
      </div>

      {/* Theme Content */}
      <div style={{ scrollbarWidth: 'thin' }} className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-2">
            <SystemSettingsRadioCard
              icon={<Monitor size={20} />}
              title={t('settings.system_theme')}
              isSelected={selectedTheme === 'system'}
              onClick={() => setSelectedTheme('system')}
            />

            <SystemSettingsRadioCard
              icon={<Sun size={20} />}
              title={t('settings.light_theme')}
              isSelected={selectedTheme === 'light'}
              onClick={() => setSelectedTheme('light')}
            />

            <SystemSettingsRadioCard
              icon={<Moon size={20} />}
              title={t('settings.dark_theme')}
              isSelected={selectedTheme === 'dark'}
              onClick={() => setSelectedTheme('dark')}
            />
          </div>
        </div>
      </div>

      {/* Theme Footer - Sabit Tamam Butonu */}
      <div className="shrink-0 border-t border-gray-200 bg-gray-50 p-4">
        <button
          onClick={handleConfirm}
          className="dark:text-dark w-full bg-btn-primary px-4 py-3 font-semibold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus disabled:bg-btn-primary-disabled dark:bg-primary-500"
        >
          {t(hasChanges ? 'settings.change' : 'settings.ok')}
        </button>
      </div>
    </>
  )
}

// Radio Card Bileşeni
interface RadioCard {
  icon?: React.ReactNode
  title: string
  description?: string
  isSelected: boolean
  onClick: () => void
  className?: string
}

const SystemSettingsRadioCard = ({
  icon,
  title,
  description,
  isSelected,
  onClick,
  className,
}: RadioCard) => {
  return (
    <button
      onClick={onClick}
      data-checked={isSelected}
      className={`group/ri flex h-12 w-full items-center justify-between gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-all duration-200 hover:border-primary-200 hover:bg-gray-50 data-[checked=true]:border-primary-500 data-[checked=true]:bg-primary-50 ${className || ''}`}
    >
      <div className="flex items-center gap-3">
        {icon && <span>{icon}</span>}
        <div className="text-left">
          <div className="text-sm font-medium">{title}</div>
          {description && <div className="text-xs text-gray-600">{description}</div>}
        </div>
      </div>

      <RadioIndicator />
    </button>
  )
}
