import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'
import { ButtonFavorite } from '../buttons/button-favorite'

interface SimCardProps {
  card: SimCard
  currency: Currency
}

export const SimCard = ({ card, currency }: SimCardProps) => {
  const { t } = useTranslation(['page-sim-cards', 'global-card'])
  const price = card.prices[currency.code]

  return (
    <article className="flex h-full min-h-120 flex-col overflow-hidden rounded-xs border border-gray-100 bg-white">
      {/* Kart Görseli ve Favori Butonu */}
      <header className="relative">
        <img src={card.image} alt={card.title} className="aspect-video h-50 w-full object-cover" />
        <ButtonFavorite contentId={card.id} className="right-2.25" />
      </header>

      {/* Kart İçeriği */}
      <div className="flex flex-1 flex-col gap-y-4 p-4">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-size-lg font-bold">{card.title}</h3>
          <p className="text-size text-gray-700">{card.subtitle}</p>
        </div>

        {/* Özellikler */}
        <ul className="flex flex-col gap-y-2 border-t border-gray-100 pt-4">
          <li className="flex items-center gap-x-2 text-size-sm">
            <Icon name="calendar" className="size-4 text-gray-500" />
            <span>{card.features.validity}</span>
          </li>
          <li className="flex items-center gap-x-2 text-size-sm">
            <Icon name="storage" className="size-4 text-gray-500" />
            <span>{card.features.data}</span>
          </li>
        </ul>
      </div>

      {/* Fiyat ve Satın Al Butonu */}
      <footer className="flex flex-col gap-y-2 px-4 pt-0 pb-4">
        <p className="text-size-xl font-bold">
          {currency.symbol}
          {price}
        </p>
        <button className="w-full rounded-xs bg-btn-primary px-4 py-2 text-size-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover">
          {t('global-card:actions.buy_now')}
        </button>
      </footer>
    </article>
  )
}
