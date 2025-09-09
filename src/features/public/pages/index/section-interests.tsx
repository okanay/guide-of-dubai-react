import { Link } from '@/i18n/router/link'
import { useTranslation } from 'react-i18next'

// Bu kısım normalde API'dan veya mock datadan gelir.
// Şimdilik burada dummy data olarak oluşturdum.
const dummyInterests = [
  {
    titleKey: 'interests.items.luxury_lovers',
    image: 'https://picsum.photos/400/300?random=1',
  },
  {
    titleKey: 'interests.items.couples',
    image: 'https://picsum.photos/400/300?random=2',
  },
  {
    titleKey: 'interests.items.first_timers',
    image: 'https://picsum.photos/400/300?random=3',
  },
  {
    titleKey: 'interests.items.music_art_lovers',
    image: 'https://picsum.photos/400/300?random=4',
  },
  {
    titleKey: 'interests.items.foodies',
    image: 'https://picsum.photos/400/300?random=5',
  },
  {
    titleKey: 'interests.items.adventure_seekers',
    image: 'https://picsum.photos/400/300?random=6',
  },
  {
    titleKey: 'interests.items.shopping_lovers',
    image: 'https://picsum.photos/400/300?random=7',
  },
  {
    titleKey: 'interests.items.family_fun',
    image: 'https://picsum.photos/400/300?random=8',
  },
]

export const Interests = () => {
  const { t } = useTranslation('page-index')

  return (
    <section className="bg-box-surface py-8 text-on-box-black">
      <div className="mx-auto max-w-main px-4">
        <h2 className="mb-6 text-size-2xl font-bold md:text-size-3xl">{t('interests.title')}</h2>
        <div
          className="scrollbar-hide flex gap-x-1 overflow-x-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {dummyInterests.map((interest, index) => (
            <Link
              to="/$lang/not-found"
              key={index}
              className="group/interest relative h-[80px] w-[calc(12.5%_-0.25rem)] min-w-[120px] shrink-0 snap-start overflow-hidden rounded-xs"
            >
              <img
                src={interest.image}
                alt={t(interest.titleKey)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[rgb(0,0,0,0.4)] transition-colors duration-300 group-hover/interest:bg-[rgb(0,0,0,0.6)]">
                <div className="flex h-full items-center justify-center px-2 text-center text-[#fff]">
                  <h3 className="font-bold">{t(interest.titleKey)}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
