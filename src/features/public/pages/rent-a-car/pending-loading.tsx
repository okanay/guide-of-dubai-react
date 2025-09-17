import { useTranslation } from 'react-i18next'

export function RentACarPendingComponent() {
  const { t } = useTranslation('global-common')

  return (
    <div
      className="bg-background flex min-h-[400px] flex-col items-center justify-center pt-10 pb-6"
      aria-label={t('loading_message')}
      role="status"
    >
      <div className="relative flex size-24 items-center justify-center">
        {/* Dönen Halka Animasyonu */}
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent" />
        {/* Marka Logosu */}
        <img src="/images/brand/brand-logo-primary.svg" alt="Loading..." className="size-14" />
      </div>
    </div>
  )
}

export const RentACarPendingIndicator = () => {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center gap-x-4 bg-white/10 backdrop-blur-xs">
      <div className="absolute size-24 animate-spin rounded-full border-4 border-solid border-primary-500 border-t-transparent" />
      <img src="/images/brand/brand-logo-primary.svg" alt="Loading..." className="size-14" />
    </div>
  )
}
