import { useTranslation } from 'react-i18next'
import { Link } from '@/i18n/router/link'
import Icon from '@/components/icon'
import { ActivityCard } from '../components/card-activity'
import { MOCK_POPULAR_ACTIVITIES } from '@/mockdata/popular-activities'

export const WaterActivities = () => {
  const { t } = useTranslation('page-activities')

  const handleLikeToggle = (activityId: string, isLiked: boolean) => {
    console.log(`Popular Activity ${activityId} ${isLiked ? 'liked' : 'unliked'}`)
  }

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main py-10">
        {/* Header */}
        <header className="mb-4 flex items-start justify-between sm:items-end">
          <div className="flex flex-col gap-y-1">
            <h2 className="text-size-2xl font-bold md:text-size-3xl">
              {t('water-activities.title')}
            </h2>
            <p className="text-size-base text-on-box-black md:text-size-lg">
              {t('water-activities.description')}
            </p>
          </div>
          <Link
            to="/$lang/not-found"
            className="flex items-center gap-2 rounded-full text-size-sm font-semibold text-nowrap text-primary-500 hover:text-primary-500/80"
          >
            {t('water-activities.view_all')}

            <Icon name="chevron-right" className="size-4 shrink-0" />
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
