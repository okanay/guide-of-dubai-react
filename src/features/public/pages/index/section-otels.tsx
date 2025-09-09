import { useSnapScroll } from '@/hooks/use-snap-scroll'
import { MOCK_HOTELS } from '@/mockdata/hotel'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'
import { HotelCard } from '../components/card-hotel'
import { Link } from '@/i18n/router/link'

export const Otels = () => {
  const { t } = useTranslation('page-index')
  const { containerRef, cardRefs, btnLeftRef, btnRightRef, handleScrollLeft, handleScrollRight } =
    useSnapScroll({ updateOnMount: true })

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    if (cardRefs.current) {
      cardRefs.current[index] = el
    }
  }

  return (
    <section className="bg-card-surface text-on-box-white">
      <div className="mx-auto max-w-main px-4 py-10">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-size-2xl font-bold md:text-size-3xl">{t('hotels.title')}</h2>
          <Link
            to="/$lang/not-found"
            className="btn-default flex items-center gap-2 rounded-full px-2 py-2 text-size-sm font-semibold text-primary-500"
          >
            {t('hotels.view_all')}
            <Icon name="chevron-right" className="size-4" />
          </Link>
        </header>

        <div className="relative">
          <button
            ref={btnLeftRef}
            onClick={handleScrollLeft}
            className="absolute top-1/2 -left-4 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-xs border border-gray-700 bg-gray-800 text-white transition-opacity duration-200 aria-disabled:opacity-0 md:flex"
            aria-label="Previous hotels"
          >
            <Icon name="chevron-left" className="size-5" />
          </button>

          <button
            ref={btnRightRef}
            onClick={handleScrollRight}
            className="absolute top-1/2 -right-4 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-xs border border-gray-700 bg-gray-800 text-white transition-opacity duration-200 aria-disabled:opacity-0 md:flex"
            aria-label="Next hotels"
          >
            <Icon name="chevron-right" className="size-5" />
          </button>

          <div
            ref={containerRef as any}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {MOCK_HOTELS.map((hotel, index) => (
              <div
                key={hotel.id}
                ref={setCardRef(index)}
                className="w-[calc(25%_-_1rem)] min-w-[260px] shrink-0 snap-start"
              >
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
