import { useTranslation } from 'react-i18next'
import { useGlobalModalStore } from '@/features/modals/global/store'
import { BasketModalComponent } from './modal'

export function BasketButton() {
  const { open: openGlobalModal } = useGlobalModalStore()
  const { t } = useTranslation('layout-header')

  const openBasketModal = async () => {
    await openGlobalModal(BasketModalComponent, {})
  }

  return (
    <button
      onClick={openBasketModal}
      className="btn-default flex items-center gap-1 rounded-full px-2 py-1"
      aria-label={t('buttons.basket')}
    >
      {t('buttons.basket')}
    </button>
  )
}
