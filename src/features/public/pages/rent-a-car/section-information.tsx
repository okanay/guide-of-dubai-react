import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useTranslation } from 'react-i18next'

type Box = {
  title: string
  description: string
  icon: string
}

export const Information = () => {
  const { t } = useTranslation('page-rent-a-car')
  const boxes = t('informations.boxes', { returnObjects: true }) as Box[]

  return (
    <section className="bg-gray-50 px-4 pt-8 pb-8 text-on-box-black">
      <div className="mx-auto max-w-main">
        <div className="mb-4 flex flex-col items-start gap-y-1 text-start sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-size-2xl font-bold">{t('informations.title')}</h2>
          <Link className="underline" to={'/$lang/not-found'}>
            {t('informations.link')}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {boxes.map((information, index) => (
            <div key={information.title} className="flex w-full flex-col rounded-xs bg-white p-4">
              <Icon name={information.icon} className="size-6 p-0.5 text-badge-green" />
              <h3 className="mt-2 mb-0.5 text-size font-bold">{information.title}</h3>
              <p className="text-size font-normal text-gray-900">{information.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
