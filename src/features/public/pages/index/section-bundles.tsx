import { Link } from '@/i18n/router/link'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

// Kart verileri için bir arayüz tanımlayalım
interface BundleItem {
  super_title: string
  title: string
}

// Kartların arka plan ve görsel bilgileri
const bundleCardsStyle = [
  {
    bgImage: '/images/public/index/bundle/background-1.png',
    image: '/images/public/index/bundle/image-1.png',
    buttonClass: 'bg-btn-primary text-on-btn-primary hover:bg-btn-primary-hover',
    textColor: 'text-on-box-black dark:text-on-box-white',
  },
  {
    bgImage: '/images/public/index/bundle/background-2.png',
    image: '/images/public/index/bundle/image-2.png',
    buttonClass: 'bg-btn-primary text-on-btn-primary hover:bg-btn-primary-hover',
    textColor: 'text-on-box-white dark:text-on-box-black',
  },
  {
    bgImage: '/images/public/index/bundle/background-3.png',
    image: '/images/public/index/bundle/image-3.png',
    buttonClass: 'bg-btn-white text-on-btn-white hover:bg-btn-white-hover',
    textColor: 'text-on-box-white dark:text-on-box-black',
  },
]

export const Bundles = () => {
  const { t } = useTranslation('page-index')
  const bundleItems: BundleItem[] = t('bundles.items', { returnObjects: true }) as BundleItem[]

  return (
    <section className="bg-box-surface py-10 text-on-box-black">
      <div className="mx-auto max-w-main px-4">
        {/* Başlık ve Tümü Linki */}
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-size-2xl font-bold md:text-size-3xl">{t('bundles.title')}</h2>
          <Link
            to="/$lang/not-found"
            className="btn-default flex items-center gap-2 rounded-full px-2 py-2 text-size-sm font-semibold text-primary-500"
          >
            {t('bundles.view_all')}
            <Icon name="chevron-right" className="size-4" />
          </Link>
        </header>

        {/* Kartlar */}
        <div className="flex gap-x-4">
          {bundleItems.map((item, index) => (
            <Link
              to="/$lang/not-found"
              key={index}
              className="group relative flex h-[180px] w-1/3 flex-col justify-between overflow-hidden rounded-xs p-3"
              style={{
                background: `url(${bundleCardsStyle[index].bgImage}) lightgray 50% / cover no-repeat`,
              }}
            >
              <div
                className={twMerge(
                  'relative z-10 flex flex-col gap-y-1 font-bold',
                  bundleCardsStyle[index].textColor,
                )}
              >
                <p className="size-xs sm:text-size">{item.super_title}</p>
                <h3 className="text-size-xl sm:text-size-2xl">{item.title}</h3>
                <button
                  className={twMerge(
                    'mt-2 hidden w-fit rounded-xs px-3 py-2 text-size-sm font-semibold transition-colors sm:block sm:px-6 sm:py-2.5',
                    bundleCardsStyle[index].buttonClass,
                  )}
                >
                  {t('bundles.book_now')}
                </button>
              </div>

              <img
                src={bundleCardsStyle[index].image}
                alt={item.title}
                className="absolute -right-5 -bottom-5 z-0 scale-75 object-contain sm:right-0 sm:bottom-0 sm:scale-100"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
