import { useBasketModal } from './store'
import { useTranslation } from 'react-i18next'

export function BasketButton() {
  const { openModal } = useBasketModal()
  const { t } = useTranslation('layout-header')

  return (
    <button
      onClick={() => openModal()}
      className="btn-default flex items-center gap-1 rounded-full px-2 py-1"
      aria-label={t('buttons.basket')}
    >
      {t('buttons.basket')}
    </button>
  )
}
