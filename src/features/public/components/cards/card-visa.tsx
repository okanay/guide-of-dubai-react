import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

interface VisaCardProps {
  visa: VisaProduct
  currency: Currency
}

export const VisaCard = ({ visa, currency }: VisaCardProps) => {
  const { t } = useTranslation('page-visa')
  const price = visa.prices[currency.code]

  return (
    <div className="flex h-full flex-col rounded-xs border border-t-8 border-gray-100 border-t-btn-primary bg-white px-4 py-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-x-4 border-b border-dotted border-gray-100 pb-4">
        <div>
          <h3 className="text-size-lg font-bold text-on-box-black">{visa.title}</h3>
          {visa.subtitle && <p className="text-size-sm text-gray-600">{visa.subtitle}</p>}
        </div>
        {/* Price */}
        <div className="text-end">
          <span className="text-size-sm text-gray-600">{t('global-card:labels.price')}</span>
          <div className="text-size-xl font-bold">
            {currency.symbol}
            {price}
          </div>
        </div>
      </div>

      {/* Features List */}
      <ul className="flex flex-col gap-y-2 py-4">
        <li className="flex items-center justify-between text-size-sm">
          <span className="flex items-center gap-x-1 text-badge-green">
            <Icon name="clock-half" className="size-4" />
            {t('global-card:labels.processing_time')}
          </span>
          <span>{visa.processingDays}</span>
        </li>

        {visa.hasValidityPeriod && (
          <li className="flex items-start justify-between text-size-sm">
            <span className="flex items-center gap-x-1 text-badge-green">
              <Icon name="form-paper" className="size-4" />
              {t('global-card:labels.validity_period')}
            </span>
            <span className="flex flex-col text-end">
              <span>{visa.stayDays}</span>
              <span>{visa.validityDays}</span>
            </span>
          </li>
        )}
      </ul>

      {/* Apply Button */}
      <button className="mt-auto w-fit bg-btn-primary px-4 py-2 text-size-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover">
        {t('global-card:actions.visa_apply')}
      </button>
    </div>
  )
}
