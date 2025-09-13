import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

type Box = {
  title: string
  description: string
  icon: string
}

export const Information = () => {
  const { t } = useTranslation('page-hotels')
  const boxes = t('informations.boxes', { returnObjects: true }) as Box[]

  return (
    <section className="bg-gray-50 px-4 pt-6 pb-10 text-on-box-black">
      <div className="mx-auto max-w-main">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {boxes.map((information, index) => (
            <div key={information.title} className="flex w-full flex-col rounded-xs bg-white p-4">
              <Icon name={information.icon} className="size-6 bg-white p-0.5 text-badge-green" />
              <h3 className="mt-2 mb-0.5 text-size font-bold">{information.title}</h3>
              <p className="text-size-sm font-normal text-gray-900">{information.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
