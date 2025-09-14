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
    <section
      data-theme="force-main"
      className="bg-card-surface px-4 text-on-box-white dark:bg-gray-950"
    >
      <div className="mx-auto max-w-main py-10">
        <header className="mb-4 flex items-start justify-between sm:items-center">
          <h2 className="text-size-2xl font-bold">{t('hotels.title')}</h2>
          <Link
            to="/$lang/not-found"
            className="btn-default flex items-center gap-2 rounded-full py-1 text-size-sm font-semibold text-nowrap text-white hover:text-white/80 sm:px-2 sm:py-2 dark:text-primary-500"
          >
            {t('hotels.view_all')}

            <Icon name="chevron-right" className="size-4 shrink-0" />
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
