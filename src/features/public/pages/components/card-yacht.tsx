import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from './button-favorite'

interface YachtCardProps {
  yacht: Yacht
  className?: string
  onLikeToggle?: (yachtId: string, isLiked: boolean) => void
}

export const YachtCard: React.FC<YachtCardProps> = ({ yacht, className, onLikeToggle }) => {
  const { t } = useTranslation('page-index')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const formatPrice = useCallback(
    (price: number): string => {
      return `${yacht.currency}${price.toFixed(2)}`
    },
    [yacht.currency],
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

      if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < yacht.images.length) {
        setCurrentImageIndex(newIndex)
      }
    },
    [currentImageIndex, yacht.images.length],
  )

  const handleLikeToggle = useCallback(
    (yachtId: string, isLiked: boolean) => {
      onLikeToggle?.(yachtId, isLiked)
    },
    [onLikeToggle],
  )

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const prevIndex = currentImageIndex === 0 ? yacht.images.length - 1 : currentImageIndex - 1
      setCurrentImageIndex(prevIndex)
      scrollToImage(prevIndex)
    },
    [currentImageIndex, yacht.images.length, scrollToImage],
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const nextIndex = currentImageIndex === yacht.images.length - 1 ? 0 : currentImageIndex + 1
      setCurrentImageIndex(nextIndex)
      scrollToImage(nextIndex)
    },
    [currentImageIndex, yacht.images.length, scrollToImage],
  )

  const handleBookingClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(`Booking yacht: ${yacht.id}`)
    },
    [yacht.id],
  )

  return (
    <article
      className={twMerge(
        'group relative flex h-full min-h-[480px] w-full flex-col overflow-hidden rounded-xs border border-gray-200 bg-box-surface transition-all duration-300 hover:shadow-lg',
        className,
      )}
      aria-labelledby={`yacht-${yacht.id}-title`}
    >
      {/* Image Gallery */}
      <header className="relative h-[220px] shrink-0">
        {/* Image Container */}
        <div
          ref={imageContainerRef}
          className="scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          role="region"
          aria-label="Yacht images"
        >
          {yacht.images.map((image, idx) => (
            <img
              key={`${yacht.id}-image-${idx}`}
              src={image}
              alt={`${yacht.name} - View ${idx + 1} of ${yacht.images.length}`}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Navigation Buttons - Show on hover when multiple images */}
        {yacht.images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white/70"
              aria-label="Previous yacht image"
            >
              <Icon name="chevron-left" className="h-4 w-4 text-black" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white/70"
              aria-label="Next yacht image"
            >
              <Icon name="chevron-right" className="h-4 w-4 text-black" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {yacht.images.length > 1 && (
          <nav
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1"
            aria-label="Image navigation"
          >
            {yacht.images.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => scrollToImage(idx)}
                className={twMerge(
                  'h-1 rounded-full transition-all duration-300 hover:bg-white/80',
                  idx === currentImageIndex ? 'w-4 bg-white' : 'w-2 bg-white/60',
                )}
                aria-label={`View image ${idx + 1}`}
                aria-current={idx === currentImageIndex ? 'true' : 'false'}
              />
            ))}
          </nav>
        )}

        {/* Favorite Button */}
        <ButtonFavorite contentId={yacht.id} onToggle={handleLikeToggle} />
      </header>

      {/* Content */}
      <Link
        to="/$lang/not-found"
        className="flex flex-1 flex-col p-4 transition-colors hover:bg-gray-50/50"
      >
        {/* Yacht Name */}
        <h2
          id={`yacht-${yacht.id}-title`}
          className="mb-2 text-size-lg font-bold text-on-box-black"
        >
          {yacht.name}
        </h2>

        {/* Rating and Reviews */}
        <div className="mb-3 flex items-center gap-1 text-size-xs">
          <Icon name="star" className="size-3 text-primary-500" aria-hidden="true" />
          <span className="font-medium text-on-box-black">{yacht.rating.toFixed(1)}</span>
          <span className="text-gray-600">({yacht.reviewCount})</span>
        </div>

        {/* Details */}
        <div className="mb-4 space-y-2 text-size-sm">
          {/* Location */}
          <div className="flex items-start gap-2">
            <Icon name="location-pin" className="mt-0.5 size-4" aria-hidden="true" />
            <span className="">
              {t('yachts.location')}: {yacht.location}
            </span>
          </div>

          {/* Rental Duration */}
          <div className="flex items-start gap-2">
            <Icon name="duration" className="mt-0.5 size-4" aria-hidden="true" />
            <span className="">
              {t('yachts.min_rental')}: {yacht.rentalDuration}
            </span>
          </div>

          {/* Capacity */}
          <div className="ml-0.5 flex items-start gap-2">
            <Icon name="person" className="mt-0.5 mr-0.5 size-3" aria-hidden="true" />
            <span className="">
              {yacht.capacity} {t('yachts.capacity')}
            </span>
          </div>
        </div>

        {/* Pricing and Booking */}
        <div className="mt-auto space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-size-xl font-bold text-on-box-black">
              {formatPrice(yacht.price)}
            </span>
            <span className="text-size-xs text-gray-500">{yacht.priceNote}</span>
          </div>

          <button
            type="button"
            onClick={handleBookingClick}
            className="h-10 w-full rounded-xs bg-btn-primary text-size-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus"
          >
            {t('yachts.button.book')}
          </button>
        </div>
      </Link>
    </article>
  )
}
