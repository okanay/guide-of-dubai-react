import { Link } from '@/i18n/router/link'
import { useTranslation } from 'react-i18next'

type Interest = {
  title: string
  image: string
}

export const Interests = () => {
  const { t } = useTranslation('page-index')

  // FAQ verilerini array olarak al
  const interests: Interest[] = t('interests.items', { returnObjects: true }) as Interest[]

  return (
    <section className="bg-box-surface pt-6 pb-10 text-on-box-black">
      <div className="mx-auto max-w-main px-4">
        <h2 className="mb-6 text-size-2xl font-bold md:text-size-3xl">{t('interests.title')}</h2>
        <div
          className="scrollbar-hide flex gap-x-4 overflow-x-auto sm:gap-x-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {interests.map((interest, index) => (
            <Link
              to="/$lang/not-found"
              key={index}
              className="group/interest relative h-[80px] w-[calc(12.5%_-0.25rem)] min-w-[120px] shrink-0 snap-start overflow-hidden rounded-xs"
            >
              <img
                src={interest.image}
                alt={t(interest.title)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[rgb(0,0,0,0.4)] transition-colors duration-300 group-hover/interest:bg-[rgb(0,0,0,0.6)]">
                <div className="flex h-full items-center justify-center px-2 text-center text-[#fff]">
                  <h3 className="font-bold">{interest.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
