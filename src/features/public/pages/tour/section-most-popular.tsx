import Icon from '@/components/icon'
import { useSnapScroll } from '@/hooks/use-snap-scroll'
import { Link } from '@/i18n/router/link'
import { ICONIC_PLACES } from '@/mockdata/iconic-places'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PopularCard } from '../components/card-popular'

export const MostPopular = () => {
  const { t } = useTranslation('page-tours')

  const {
    containerRef,
    cardRefs,
    btnLeftRef,
    btnRightRef,
    handleScrollLeft,
    handleScrollRight,
    updateButtonState,
  } = useSnapScroll({
    gap: 16,
    behavior: 'smooth',
    updateOnMount: true,
  })

  // Kart ref'lerini ayarla
  const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
    if (cardRefs.current) {
      cardRefs.current[index] = el
    }
  }

  // Component mount edildiğinde button state'ini güncelle
  useEffect(() => {
    const timer = setTimeout(() => {
      updateButtonState()
    }, 100)
    return () => clearTimeout(timer)
  }, [updateButtonState])

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-10">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between sm:items-end">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-size-2xl font-bold md:text-size-3xl">{t('most-popular.title')}</h2>
            <p className="text-size-base text-on-box-black md:text-size-lg">
              {t('most-popular.description')}
            </p>
          </div>
          <Link
            to="/$lang/not-found"
            className="flex items-center gap-2 rounded-full text-size-sm font-semibold text-nowrap text-primary-500 hover:text-primary-500/80"
          >
            {t('most-popular.view_all')}

            <Icon name="chevron-right" className="size-4 shrink-0" />
          </Link>
        </header>

        {/* Cards Container with Navigation */}
        <div className="relative">
          {/* Left Navigation Button - Desktop Only */}
          <button
            ref={btnLeftRef}
            onClick={handleScrollLeft}
            className="absolute top-1/2 -left-4 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-xs border border-gray-200 bg-white transition-opacity duration-200 aria-disabled:opacity-0 md:flex"
            aria-label="Previous activities"
          >
            <Icon name="chevron-left" className="h-5 w-5 text-gray-700" />
          </button>

          {/* Right Navigation Button - Desktop Only */}
          <button
            ref={btnRightRef}
            onClick={handleScrollRight}
            className="absolute top-1/2 -right-4 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-xs border border-gray-200 bg-white transition-opacity duration-200 aria-disabled:opacity-0 md:flex"
            aria-label="Next activities"
          >
            <Icon name="chevron-right" className="h-5 w-5 text-gray-700" />
          </button>

          {/* Cards Container */}
          <div
            ref={containerRef as any}
            className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {ICONIC_PLACES.map((activity, index) => (
              <div
                key={activity.id}
                ref={setCardRef(index)}
                className="w-[calc(25%_-_1rem)] min-w-[260px] shrink-0 snap-start"
              >
                <PopularCard activity={activity} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
