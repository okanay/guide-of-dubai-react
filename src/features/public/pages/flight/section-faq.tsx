import { useTranslation } from 'react-i18next'

export const FAQFlights = () => {
  const { t } = useTranslation('page-flights')

  return (
    <section className="text-on-box min-h-40 bg-box-surface px-4">
      <div className="mx-auto max-w-main">FAQ</div>
    </section>
  )
}
