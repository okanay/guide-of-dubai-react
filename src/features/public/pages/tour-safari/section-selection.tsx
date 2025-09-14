import { useTranslation } from 'react-i18next'

export const SafariSelection = () => {
  const { t } = useTranslation('page-safari')

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-10">
        <header className="mb-4 flex items-start justify-between sm:items-end">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-size-2xl font-bold md:text-size-3xl">{t('selection.title')}</h2>
            <p className="text-size-base text-on-box-black md:text-size-lg">
              {t('selection.description')}
            </p>
          </div>
        </header>
      </div>
    </section>
  )
}
