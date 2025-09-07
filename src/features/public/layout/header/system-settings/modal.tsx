import {
  ArrowLeft,
  Check,
  ChevronRight,
  DollarSign,
  Globe,
  Monitor,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import { ModalWrapper } from 'src/components/modal-wrapper'
import { SUPPORTED_LANGUAGES } from 'src/i18n/config'
import { SUPPORTED_CURRENCIES } from 'src/i18n/currency-config'
import { useLanguage } from 'src/i18n/prodiver'
import { useTheme } from 'src/providers/theme-mode'
import { useSystemSettings } from './store'
import { RadioIndicator } from 'src/features/public/components/form-ui/radio-input'
import { useTranslation } from 'react-i18next'
import { useState, useRef } from 'react'
import Icon from '@/components/icon'

export function SystemSettingsModal() {
  const { isOpen, closeModal, scopeId, mode, setMode } = useSystemSettings()
  const { t } = useTranslation('public-header')

  // useRef ile language değişikliği takibi (state değil!)
  const languageChangedRef = useRef(false)

  const handleClose = () => {
    closeModal()
    setTimeout(() => setMode('main'), 300)

    // Sadece dil değiştirilmişse reload yap
    if (languageChangedRef.current) {
      languageChangedRef.current = false
      window.location.reload()
    }
  }

  // Language değişikliği için callback
  const handleLanguageChange = () => {
    languageChangedRef.current = true
  }

  const renderContent = () => {
    switch (mode) {
      case 'language':
        return <LanguageSettings onLanguageChange={handleLanguageChange} />
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
        return t('settings.language_selection')
      case 'currency':
        return t('settings.currency_selection')
      case 'theme':
        return t('settings.theme_selection')
      case 'main':
      default:
        return t('settings.title')
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
            {t('settings.ok')}
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
  const { t } = useTranslation('public-header')

  return (
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
  )
}

// Language Settings'e onLanguageChange prop'u eklendi
function LanguageSettings({ onLanguageChange }: { onLanguageChange: () => void }) {
  const { language, changeLanguage } = useLanguage()

  const handleLanguageChange = (newLanguage: LanguageValue) => {
    if (newLanguage !== language.value) {
      onLanguageChange() // Parent'a bildir
      changeLanguage(newLanguage) // Dili değiştir
    }
  }

  return (
    <div className="p-4">
      <div className="space-y-2">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SystemSettingsRadioCard
            key={lang.value}
            icon={<Icon name={lang.flag} className="flex h-6 w-6 items-center justify-center" />}
            title={lang.label}
            isSelected={language.value === lang.value}
            onClick={() => handleLanguageChange(lang.value)}
          />
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
          <SystemSettingsRadioCard
            key={curr.code}
            icon={<Icon name={curr.flag} className="flex h-6 w-6 items-center justify-center" />}
            title={curr.name}
            description={`${curr.symbol} - ${curr.code.toUpperCase()}`}
            isSelected={currency.code === curr.code}
            onClick={() => setCurrency(curr.code)}
            className="h-14"
          />
        ))}
      </div>
    </div>
  )
}

function ThemeSettings() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('public-header')

  return (
    <div className="p-4">
      <div className="space-y-2">
        <SystemSettingsRadioCard
          icon={<Monitor size={20} />}
          title={t('settings.system_theme')}
          isSelected={theme === 'system'}
          onClick={() => setTheme('system')}
        />

        <SystemSettingsRadioCard
          icon={<Sun size={20} />}
          title={t('settings.light_theme')}
          isSelected={theme === 'light'}
          onClick={() => setTheme('light')}
        />

        <SystemSettingsRadioCard
          icon={<Moon size={20} />}
          title={t('settings.dark_theme')}
          isSelected={theme === 'dark'}
          onClick={() => setTheme('dark')}
        />
      </div>
    </div>
  )
}

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
      className={`group/ri flex h-12 w-full items-center justify-between gap-x-4 border border-gray-200 px-4 font-medium text-on-box-black transition-all duration-200 group-data-[checked=true]/ri:border-primary-500 group-data-[checked=true]/ri:bg-primary-50 hover:border-primary-200 hover:bg-gray-50 ${className || ''}`}
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
