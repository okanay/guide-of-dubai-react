import { useTranslation } from 'react-i18next'
import { CardSafari } from '../components/card-safari'

export const SafariSelection = () => {
  const { t } = useTranslation('page-safari')

  const handleLikeToggle = (tourType: 'morning' | 'night', isLiked: boolean) => {
    console.log(`Safari ${tourType} ${isLiked ? 'liked' : 'unliked'}`)
  }

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-10 pb-4">
        <div className="mb-4 flex flex-col gap-y-1">
          <h2 className="text-size-2xl font-bold">{t('selection.title')}</h2>
          <p className="text-size-base text-gray-700"> {t('selection.description')}</p>
        </div>

        {/* Safari Cards Grid */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2">
          <CardSafari type="morning" onLikeToggle={handleLikeToggle} />
          <CardSafari type="night" onLikeToggle={handleLikeToggle} />
        </div>
      </div>
    </section>
  )
}
