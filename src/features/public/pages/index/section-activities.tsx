import { useTranslation } from 'react-i18next'
import { Link } from '@/i18n/router/link'
import Icon from '@/components/icon'
import { ActivityCard } from '../components/card-activity'
import { MOCK_POPULAR_ACTIVITIES } from '@/mockdata/popular-activities'

export const Activities = () => {
  const { t } = useTranslation('page-index')

  const handleLikeToggle = (activityId: string, isLiked: boolean) => {
    console.log(`Popular Activity ${activityId} ${isLiked ? 'liked' : 'unliked'}`)
  }

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main py-10">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between sm:items-center">
          <h2 className="text-size-2xl font-bold">{t('activities.title')}</h2>
          <Link
            to="/$lang/not-found"
            className="btn-default flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-size-sm font-semibold text-primary-500 sm:py-2"
          >
            {t('activities.view_all')}
            <Icon name="chevron-right" className="size-4" />
          </Link>
        </header>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {MOCK_POPULAR_ACTIVITIES.slice(0, 6).map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onLikeToggle={handleLikeToggle} />
          ))}
        </div>
      </div>
    </section>
  )
}
