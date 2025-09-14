import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'

type Box = {
  title: string
  description: string
  icon: string
}

type Additional = {
  title: string
  description: string
  button: string
}

export const Information = () => {
  const { t } = useTranslation('page-hotels')
  const boxes = t('informations.boxes', { returnObjects: true }) as Box[]
  const additional = t('informations.additional', { returnObjects: true }) as Additional

  return (
    <>
      <section className="bg-gray-50 px-4 pt-8 pb-8 text-on-box-black">
        <div className="mx-auto max-w-main">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {boxes.map((information) => (
              <div key={information.title} className="flex w-full flex-col rounded-xs bg-white p-4">
                <Icon name={information.icon} className="size-6 bg-white p-0.5 text-badge-green" />
                <h3 className="mt-2 mb-0.5 text-size font-bold">{information.title}</h3>
                <p className="text-size-sm font-normal text-gray-900">{information.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 pt-8 pb-4 text-on-box-black">
        <div className="mx-auto flex max-w-main flex-col items-center justify-between gap-4 bg-primary-50 p-8 md:flex-row">
          <div className="flex items-center gap-x-4 md:items-center">
            <img
              src="/images/public/hotels/black-van-car.png"
              alt="Black Van Car"
              width={136}
              height={52}
              className="h-[52px] w-[136px] shrink-0"
            />
            <div className="flex flex-col gap-y-0.5">
              <h3 className="text-size font-bold text-black md:text-size-lg">{additional.title}</h3>
              <p className="text-size-xs font-normal text-black md:text-size">
                {additional.description}
              </p>
            </div>
          </div>
          <button className="w-full shrink-0 rounded-xs bg-btn-primary px-6 py-3 text-size-sm font-bold text-on-btn-primary md:w-fit md:text-size">
            {additional.button}
          </button>
        </div>
      </section>
    </>
  )
}
