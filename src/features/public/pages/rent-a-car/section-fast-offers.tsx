import { useSnapScroll } from '@/hooks/use-snap-scroll'
import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'
import { Link } from '@/i18n/router/link'
import { MOCK_RENT_A_CAR } from '@/mockdata/rent-a-car'
import { RentACarCard } from '@/features/public/components/cards/card-rent-a-car'

export const FastOffers = () => {
  const { t } = useTranslation('page-rent-a-car')
  const { containerRef, cardRefs, btnLeftRef, btnRightRef, handleScrollLeft, handleScrollRight } =
    useSnapScroll({ updateOnMount: true })

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    if (cardRefs.current) {
      cardRefs.current[index] = el
    }
  }

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-6 pb-10">
        <header className="mb-4 flex items-start justify-between sm:items-center">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-size-2xl font-bold">{t('fast-offers.title')}</h2>
            <p className="text-size-base text-gray-700"> {t('fast-offers.description')}</p>
          </div>
          <Link
            to="/$lang/not-found"
            className="btn-default flex items-center gap-2 rounded-full py-1 text-size-sm font-semibold text-nowrap text-white hover:text-white/80 sm:px-2 sm:py-2 dark:text-primary-500"
          >
            {t('fast-offers.view_all')}

            <Icon name="chevron-right" className="size-4 shrink-0" />
          </Link>
        </header>

        <div className="relative">
          <div
            ref={containerRef as any}
            className="scrollbar-hide flex snap-x snap-mandatory gap-x-4 gap-y-8 overflow-x-auto pb-4 md:grid md:snap-none md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] md:gap-x-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {MOCK_RENT_A_CAR.map((car, index) => (
              <div
                key={car.id}
                ref={setCardRef(index)}
                className="w-[calc(25%_-_1rem)] min-w-[260px] shrink-0 snap-start md:w-full"
              >
                <RentACarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
