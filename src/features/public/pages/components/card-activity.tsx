import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from './button-favorite'

interface Props {
  activity: ActivityCard
  className?: string
  onLikeToggle?: (activityId: string, isLiked: boolean) => void
}

export const ActivityCard: React.FC<Props> = ({ activity, className, onLikeToggle }) => {
  const { t } = useTranslation('page-index')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const formatPrice = useCallback(
    (price: number): string => {
      return `${activity.currency}${price.toFixed(2)}`
    },
    [activity.currency],
  )

  const scrollToImage = useCallback((imageIndex: number) => {
    if (!imageContainerRef.current) return
    const imageWidth = imageContainerRef.current.clientWidth
    imageContainerRef.current.scrollTo({
      left: imageIndex * imageWidth,
      behavior: 'smooth',
    })
  }, [])

  const handleImageScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const scrollLeft = e.currentTarget.scrollLeft
      const imageWidth = e.currentTarget.clientWidth
      const newIndex = Math.round(scrollLeft / imageWidth)

      if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < activity.images.length) {
        setCurrentImageIndex(newIndex)
      }
    },
    [currentImageIndex, activity.images.length],
  )

  const handleLikeToggle = useCallback(
    (activityId: string, isLiked: boolean) => {
      onLikeToggle?.(activityId, isLiked)
    },
    [onLikeToggle],
  )

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const prevIndex = currentImageIndex === 0 ? activity.images.length - 1 : currentImageIndex - 1
      setCurrentImageIndex(prevIndex)
      scrollToImage(prevIndex)
    },
    [currentImageIndex, activity.images.length, scrollToImage],
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const nextIndex = currentImageIndex === activity.images.length - 1 ? 0 : currentImageIndex + 1
      setCurrentImageIndex(nextIndex)
      scrollToImage(nextIndex)
    },
    [currentImageIndex, activity.images.length, scrollToImage],
  )

  const handleBookingClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(`Booking activity: ${activity.id}`)
    },
    [activity.id],
  )

  return (
    <article
      className={twMerge(
        'group relative flex w-full overflow-hidden rounded-xs border border-gray-200 bg-box-surface',
        className,
      )}
      aria-labelledby={`popular-activity-${activity.id}-title`}
    >
      {/* Image Gallery - Left Side */}
      <div className="relative w-[140px] shrink-0">
        {/* Image Container */}
        <div
          ref={imageContainerRef}
          className="scrollbar-hide flex h-[210px] snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            aspectRatio: '2/3',
          }}
          role="region"
          aria-label="Activity images"
        >
          {activity.images.map((image, imgIndex) => (
            <div key={`image-${imgIndex}`} className="w-full flex-shrink-0 snap-start">
              <img
                src={image}
                alt={`${activity.title} - View ${imgIndex + 1}`}
                className="h-full w-full object-cover"
                loading={imgIndex === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons - Only show on hover when multiple images */}
        {activity.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute top-1/2 left-1 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-75 hover:opacity-100"
              aria-label="Previous image"
            >
              <Icon name="chevron-left" className="size-3" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute top-1/2 right-1 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-75 hover:opacity-100"
              aria-label="Next image"
            >
              <Icon name="chevron-right" className="size-3" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {activity.images.length > 1 && (
          <nav
            className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1"
            aria-label="Image navigation"
          >
            {activity.images.map((_, imgIndex) => (
              <button
                key={`indicator-${imgIndex}`}
                type="button"
                onClick={() => scrollToImage(imgIndex)}
                aria-label={`View image ${imgIndex + 1}`}
                aria-current={imgIndex === currentImageIndex ? 'true' : 'false'}
                className={twMerge(
                  'h-1 rounded-full transition-all duration-300 hover:bg-white/80',
                  imgIndex === currentImageIndex ? 'w-4 bg-white' : 'w-2 bg-white/50',
                )}
              />
            ))}
          </nav>
        )}

        {/* Favorite Button */}
        <ButtonFavorite
          contentId={activity.id}
          onToggle={handleLikeToggle}
          className="absolute top-2 right-2"
        />
      </div>

      {/* Content - Right Side */}
      <Link
        to="/$lang/not-found"
        className="flex flex-1 flex-col justify-between p-3 transition-colors hover:bg-gray-50/50"
      >
        {/* Top Content */}
        <div className="flex flex-col gap-y-2">
          {/* Discount Badge */}
          {activity.hasDiscount && activity.discountPercentage && (
            <div className="w-fit rounded-xs bg-primary-500 px-2 py-1 text-size-xs font-bold text-white">
              Save {activity.discountPercentage}%
            </div>
          )}
          {/* Title */}
          <h2
            id={`popular-activity-${activity.id}-title`}
            className="line-clamp-2 text-size font-bold text-on-box-black"
          >
            {activity.title}
          </h2>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-1 text-size-xs">
            <Icon name="star" className="size-3 text-primary-500" aria-hidden="true" />
            <span className="font-medium text-on-box-black">{activity.rating.toFixed(1)}</span>
            <span className="text-gray-600">({activity.reviewCount})</span>
          </div>

          {/* Description */}
          <p className="text-size-sm text-gray-600">{activity.description}</p>
        </div>

        {/* Bottom Content */}
        <div className="mt-auto flex w-full flex-wrap items-center justify-between gap-2">
          {/* Pricing */}
          <div className="flex shrink-0 flex-col">
            {activity.originalPrice && (
              <span className="text-size-xs text-gray-500 line-through">
                {formatPrice(activity.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-size-lg font-bold text-on-box-black">
                {formatPrice(activity.price)}
              </span>
              <span className="text-size-xs text-gray-500">/ kişi başı</span>
            </div>
          </div>

          {/* Book Button */}
          <button
            type="button"
            onClick={handleBookingClick}
            className="h-8 w-fit rounded-xs bg-btn-primary px-2 text-size-xs font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus sm:px-6 sm:text-size-sm"
          >
            {t('activities.button.book')}
          </button>
        </div>
      </Link>
    </article>
  )
}
