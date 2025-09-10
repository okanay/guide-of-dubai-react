import { useLanguage } from 'src/i18n/prodiver'
import { NewsletterForm } from './form-newsletter'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'
import { useSystemSettings } from '../modals/system-settings/store'

// Abonelik ve ödeme yöntemleri bölümü
export const SubscriptionSection = () => {
  const { t } = useTranslation('layout-footer')

  return (
    <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-y-8">
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-white">{t('subscription.title')}</h4>
          <p className="text-size-sm text-gray-400">{t('subscription.description')}</p>
        </div>
        <NewsletterForm />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] items-end gap-x-20 gap-y-8">
          <div>
            <h4 className="mb-4 text-size-sm font-semibold text-gray-300">
              {t('subscription.payment_channels')}
            </h4>
            <div className="flex items-center gap-x-3">
              <Icon name="american-express" className="h-7 w-7" />
              <Icon name="visa" className="h-7 w-7" />
              <Icon name="mastercard" className="h-7 w-7" />
              <Icon name="union-pay" className="h-7 w-7" />
            </div>
          </div>
          <SystemSettingsButton />
        </div>
      </div>
      <AppDownloadCard />
    </div>
  )
}

const SystemSettingsButton = () => {
  const { openModal, currency } = useSystemSettings()
  const { language } = useLanguage()
  const { t } = useTranslation('layout-footer')

  return (
    <div>
      <h4 className="mb-4 text-size-sm font-semibold text-gray-300">
        {t('subscription.language_currency')}
      </h4>
      <button
        onClick={() => openModal('main')}
        className="w-30 rounded-xs bg-white py-2 text-size-sm font-semibold text-black transition-colors hover:bg-gray-200"
      >
        {language.label} - {currency.symbol}
      </button>
    </div>
  )
}

// Uygulama indirme kartı
const AppDownloadCard = () => {
  const { t } = useTranslation('layout-footer')

  return (
    <div className="flex h-full flex-col items-start gap-10 rounded-xs sm:flex-row sm:items-center sm:justify-between sm:bg-card-surface sm:p-6">
      <div>
        <h2 className="text-size-xl leading-tight font-bold text-white">
          {t('subscription.app_download.title')}
        </h2>
        <p className="mt-2 mb-4 text-size-lg text-gray-300">
          {t('subscription.app_download.description')}
        </p>
        <div className="flex items-center gap-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/public/footer/app-store.png"
              alt={t('mobile_app.app_store_alt')}
              className="h-10 w-auto"
            />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/public/footer/google-play.png"
              alt={t('mobile_app.google_play_alt')}
              className="h-10 w-auto"
            />
          </a>
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-center gap-y-2 sm:flex">
        <img
          src="/images/public/footer/qr-code.png"
          alt={t('subscription.app_download.qr_alt')}
          className="size-30 rounded-xs p-1"
        />
        <span className="text-xs text-gray-400">{t('subscription.app_download.scan_text')}</span>
      </div>
    </div>
  )
}
