import { useTranslation } from 'react-i18next'
import { useGlobalModalStore } from '@/features/modals/global/store'
import { GoAiModalComponent } from './modal'

export function GoAiButton() {
  const { open: openGlobalModal } = useGlobalModalStore()
  const { t } = useTranslation('layout-header')

  const openGoAiModal = async () => {
    await openGlobalModal(GoAiModalComponent, {})
  }

  return (
    <button
      onClick={openGoAiModal}
      className="btn-default rounded-full px-2 py-1"
      aria-label={t('buttons.go_ai')}
    >
      {t('buttons.go_ai')}
    </button>
  )
}
