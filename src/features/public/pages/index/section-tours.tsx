import { useTranslation } from 'react-i18next'
import { Link } from '@/i18n/router/link'
import Icon from '@/components/icon'
import { TourCard } from '@/features/public/components/cards/card-tour'
import { MOCK_TOURS } from '@/mockdata/tours'

export const Tours = () => {
  const { t } = useTranslation('page-index')

  const handleLikeToggle = (tourId: string, isLiked: boolean) => {
    console.log(`Tour ${tourId} ${isLiked ? 'liked' : 'unliked'}`)
  }

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between sm:items-center">
          <h2 className="text-size-2xl font-bold">{t('tours.title')}</h2>
          <Link
            to="/$lang/not-found"
            className="btn-default flex items-center gap-2 rounded-full py-1 text-size-sm font-semibold text-nowrap text-primary-500 hover:text-primary-500/80 sm:px-2 sm:py-2"
          >
            {t('tours.view_all')}
            <Icon name="chevron-right" className="size-4 shrink-0" />
          </Link>
        </header>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {MOCK_TOURS.map((tour) => (
            <TourCard key={tour.id} tour={tour} onLikeToggle={handleLikeToggle} />
          ))}
        </div>
      </div>
    </section>
  )
}
