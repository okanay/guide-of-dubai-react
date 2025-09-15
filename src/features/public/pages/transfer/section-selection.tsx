import { useTranslation } from 'react-i18next'

export const TransferSelection = () => {
  const { t } = useTranslation('page-transfer')

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-10 pb-4">
        <div className="mb-4 flex flex-col gap-y-1">
          <h2 className="text-size-2xl font-bold">{t('selection.title')}</h2>
          <p className="text-size-base text-gray-700"> {t('selection.description')}</p>
        </div>

        {/* Transfer Cards Grid */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2"></div>
      </div>
    </section>
  )
}
