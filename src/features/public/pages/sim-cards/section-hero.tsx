import { useTranslation } from 'react-i18next'
import { useSystemSettings } from '@/features/modals/system-settings/store'
import { SimCard } from '../../components/cards/card-sim-card'
import { useSnapScroll } from '@/hooks/use-snap-scroll'

export const HeroSection = () => {
  const { t } = useTranslation(['page-sim-cards', 'global-card'])
  const { currency } = useSystemSettings()
  const cards = t('cards', { returnObjects: true }) as SimCard[]

  const { containerRef, cardRefs, btnLeftRef, btnRightRef, handleScrollLeft, handleScrollRight } =
    useSnapScroll({ updateOnMount: true })

  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    if (cardRefs.current) {
      cardRefs.current[index] = el
    }
  }

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-10">
        <header className="mb-4 flex items-start justify-between sm:items-end">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-size-2xl font-bold">{t('hero.title')}</h2>
            <p className="text-size-base text-gray-700">{t('hero.description')}</p>
          </div>
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
            {cards.map((card, index) => (
              <div
                key={card.id}
                ref={setCardRef(index)}
                className="w-[calc(25%_-_1rem)] min-w-[260px] shrink-0 snap-start md:w-full"
              >
                <SimCard card={card} currency={currency} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
