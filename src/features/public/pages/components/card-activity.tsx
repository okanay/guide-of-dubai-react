import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import Icon from '@/components/icon'
import { ButtonFavorite } from './button-favorite'

// Activity Card Interface
interface ActivityCard {
  id: string
  rank: number
  title: string
  description: string[]
  images: string[]
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  duration: string
  groupInfo: string
  features: string[]
  isPopular?: boolean
  purchaseCount: number
}

interface ActivityCardProps {
  activity: ActivityCard
  index: number
  className?: string
  onLikeToggle?: (activityId: string, isLiked: boolean) => void
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  index,
  className,
  onLikeToggle,
}) => {
  const { t } = useTranslation('page-index')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`
  }

  const scrollToImage = (imageIndex: number) => {
    if (!imageContainerRef.current) return

    const imageWidth = imageContainerRef.current.clientWidth
    imageContainerRef.current.scrollTo({
      left: imageIndex * imageWidth,
      behavior: 'smooth',
    })
  }

  const handleImageScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft
    const imageWidth = e.currentTarget.clientWidth
    const newIndex = Math.round(scrollLeft / imageWidth)

    if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < activity.images.length) {
      setCurrentImageIndex(newIndex)
    }
  }

  const handleLikeToggle = (activityId: string, isLiked: boolean) => {
    console.log(`Activity ${activityId} ${isLiked ? 'liked' : 'unliked'}`)
    onLikeToggle?.(activityId, isLiked)
  }

  return (
    <div
      className={twMerge(
        'group relative flex h-[540px] w-full flex-col overflow-hidden rounded-xs border border-gray-200 bg-box-surface transition-all duration-300 hover:shadow-lg',
        className,
      )}
    >
      {/* Image Section */}
      <section className="relative overflow-hidden">
        {/* Image Container */}
        <div
          ref={imageContainerRef}
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activity.images.map((image, imgIndex) => (
            <div
              key={`${activity.id}-image-${imgIndex}`}
              className="w-full flex-shrink-0 snap-start"
            >
              <img
                src={image}
                alt={`${activity.title} - Image ${imgIndex + 1}`}
                className="h-[220px] w-full object-cover"
                loading={imgIndex === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Image Indicators */}
        {activity.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {activity.images.map((_, imgIndex) => (
              <button
                key={`indicator-${imgIndex}`}
                onClick={() => scrollToImage(imgIndex)}
                aria-label={`View image ${imgIndex + 1}`}
                className={twMerge(
                  'h-1 rounded-full transition-all duration-300 hover:bg-white/80',
                  imgIndex === currentImageIndex ? 'w-6 bg-white' : 'w-3 bg-white/50',
                )}
              />
            ))}
          </div>
        )}

        {/* Favorite Button */}
        <ButtonFavorite contentId={activity.id} onToggle={handleLikeToggle} />
      </section>

      {/* Content Section */}
      <section className="flex flex-1 flex-col p-4">
        {/* Rank Badge */}
        <div className="mb-2 flex items-center gap-1">
          <Icon name="trophy-primary" className="size-4" />
          <span className="text-size-sm font-bold text-primary-500">{index + 1} Numara</span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-size font-bold text-on-box-black">
          {activity.title}
        </h3>

        {/* Rating and Purchase Info */}
        <div className="mb-2 flex items-center gap-2 text-size-xs">
          <Icon name="star-filled-primary" className="size-4" />
          <span className="font-medium text-on-box-black">{activity.rating.toFixed(1)}</span>
          <span className="text-gray-600">({activity.reviewCount})</span>
          <div className="rounded-xs bg-gray-100 px-2 py-1 text-body-xs text-gray-700">
            {activity.purchaseCount}+ satın alındı
          </div>
        </div>

        {/* Description */}
        <div className="mb-3 flex flex-wrap gap-1">
          {activity.description.map((item, descIndex) => (
            <React.Fragment key={`desc-${descIndex}`}>
              <span className="text-size-sm text-gray-600">{item}</span>
              {descIndex < activity.description.length - 1 && (
                <span className="text-gray-400">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Price and Booking */}
        <footer className="mt-auto space-y-2">
          {/* Price */}
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
              <span className="text-body-xs text-gray-500">/ kişi başı</span>
            </div>
          </div>

          {/* Book Button */}
          <button
            className="btn-default h-10 w-full rounded-xs bg-btn-primary text-body-sm font-medium text-on-btn-primary transition-all duration-200 hover:bg-btn-primary-hover active:scale-[0.98]"
            onClick={() => console.log(`Booking activity: ${activity.id}`)}
          >
            {t('iconic-places.button.book')}
          </button>
        </footer>
      </section>
    </div>
  )
}
