import { ChevronDown } from 'lucide-react'
import { useLanguage } from 'src/i18n/prodiver'
import { useSystemSettings } from './store'

export function SystemSettingsButton() {
  const { openModal, currency } = useSystemSettings()
  const { language } = useLanguage()

  return (
    <button
      onClick={() => openModal()}
      className="group btn-default flex items-center rounded-full px-2 py-1"
      aria-label="Dil, para birimi ve tema ayarları"
    >
      <span>{language.label}</span>
      <span className="mx-2">-</span>
      <span>{currency.code.toUpperCase()}</span>
      <ChevronDown
        size={16}
        className="ml-2 rounded-full text-primary-500 transition-colors duration-300 ease-in-out group-hover:bg-btn-primary group-hover:text-on-btn-primary group-focus:bg-btn-primary-focus group-focus:text-on-btn-primary hover:bg-btn-primary-hover"
      />
    </button>
  )
}
