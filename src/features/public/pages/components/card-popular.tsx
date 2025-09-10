import React, { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { Link } from '@/i18n/router/link'
import Icon from '@/components/icon'
import { ButtonFavorite } from './button-favorite'

interface Props {
  activity: PopularCard
  index: number
  className?: string
  onLikeToggle?: (activityId: string, isLiked: boolean) => void
}

export const PopularCard: React.FC<Props> = ({ activity, index, className, onLikeToggle }) => {
  const { t } = useTranslation('global-card') // global-card namespace kullan
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const formatPrice = useCallback((price: number): string => {
    return `$${price.toFixed(2)}`
  }, [])

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
        'group relative flex h-[540px] w-full flex-col overflow-hidden rounded-xs border border-gray-200 bg-box-surface dark:bg-gray-950',
        className,
      )}
      aria-labelledby={`activity-${activity.id}-title`}
    >
      {/* Image Gallery */}
      <header className="relative overflow-hidden">
        <div
          ref={imageContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          role="region"
          aria-label="Activity images"
        >
          {activity.images.map((image, imgIndex) => (
            <div key={`image-${imgIndex}`} className="w-full flex-shrink-0 snap-start">
              <img
                src={image}
                alt={`${activity.title} - View ${imgIndex + 1}`}
                className="h-[220px] w-full object-cover"
                loading={imgIndex === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {activity.images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute top-1/2 left-3 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-btn-white text-on-btn-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Previous image"
            >
              <Icon name="chevron-left" className="size-5" />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-btn-white text-on-btn-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Next image"
            >
              <Icon name="chevron-right" className="size-5" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {activity.images.length > 1 && (
          <nav
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1"
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
                  imgIndex === currentImageIndex ? 'w-6 bg-white' : 'w-3 bg-white/50',
                )}
              />
            ))}
          </nav>
        )}

        <ButtonFavorite contentId={activity.id} onToggle={handleLikeToggle} />
      </header>

      {/* Content */}
      <Link
        to="/$lang/not-found"
        className="flex flex-1 flex-col p-4 transition-colors hover:bg-gray-50/50"
      >
        {/* Rank Badge */}
        <div className="mb-2 flex items-center gap-1">
          <Icon name="trophy-primary" className="size-4" aria-hidden="true" />
          <span className="text-size-sm font-bold text-primary-500">
            {t('popular.labels.rank', { rank: index + 1 })}
          </span>
        </div>

        {/* Title */}
        <h2
          id={`activity-${activity.id}-title`}
          className="mb-2 line-clamp-2 text-size font-bold text-on-box-black"
        >
          {activity.title}
        </h2>

        {/* Rating and Reviews */}
        <div className="mb-2 flex items-center gap-1 text-size-sm">
          <Icon name="star" className="size-4 text-primary-500" aria-hidden="true" />
          <span className="font-medium text-on-box-black">{activity.rating.toFixed(1)}</span>
          <span className="text-gray-600">({activity.reviewCount})</span>
          <div className="ml-1 rounded-xs bg-gray-100 px-2 py-1 text-body-xs text-gray-700">
            {t('popular.labels.purchased_count', { count: activity.purchaseCount })}
          </div>
        </div>

        {/* Description */}
        <ul className="mb-3 flex flex-wrap items-center gap-1.5">
          {activity.description.map((item, descIndex) => (
            <li key={descIndex} className="inline-flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-gray-600" aria-hidden="true" />
              <span className="text-size-sm whitespace-nowrap text-gray-600">{item}</span>
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="mt-auto space-y-2">
          <div className="flex flex-col">
            {activity.originalPrice && (
              <span className="text-body-xs text-gray-500 line-through">
                {formatPrice(activity.originalPrice)}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-body-xl font-bold text-on-box-black">
                {formatPrice(activity.price)}
              </span>
              <span className="text-body-xs text-gray-500">{t('common.labels.per_person')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookingClick}
            className="h-10 w-full rounded-xs border border-btn-primary bg-btn-primary text-body-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus sm:bg-transparent sm:text-btn-primary sm:hover:bg-primary-50 sm:focus:bg-primary-50"
          >
            {t('common.buttons.book_now')}
          </button>
        </div>
      </Link>
    </article>
  )
}
