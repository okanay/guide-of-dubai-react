import { useTranslation } from 'react-i18next'
import { Link } from '@/i18n/router/link'
import Icon from '@/components/icon'
import { TourCard } from '../components/card-tour'
import { MOCK_TOURS } from '@/mockdata/tours'

export const Tours = () => {
  const { t } = useTranslation('page-index')

  const handleLikeToggle = (tourId: string, isLiked: boolean) => {
    console.log(`Tour ${tourId} ${isLiked ? 'liked' : 'unliked'}`)
  }

  return (
    <section className="bg-box-surface text-on-box-black">
      <div className="mx-auto max-w-main px-4">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-size-2xl font-bold md:text-size-3xl">{t('tours.title')}</h2>
          <Link
            to="/$lang/not-found"
            className="btn-default flex items-center gap-1 rounded-full px-2 py-2 text-size-sm font-semibold text-primary-500"
          >
            {t('tours.view_all')}
            <Icon name="chevron-right" className="size-4" />
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
