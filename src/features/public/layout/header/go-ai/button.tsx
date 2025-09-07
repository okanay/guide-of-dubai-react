import { useGoAiModal } from './store'
import { useTranslation } from 'react-i18next'

export function GoAiButton() {
  const { openModal } = useGoAiModal()
  const { t } = useTranslation('public-header')

  return (
    <button
      onClick={() => openModal()}
      className="btn-default rounded-full px-2 py-1"
      aria-label={t('buttons.go_ai')}
    >
      {t('buttons.go_ai')}
    </button>
  )
}
