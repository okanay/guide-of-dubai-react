import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from './button-favorite'

interface HotelCardProps {
  hotel: Hotel
  className?: string
  onLikeToggle?: (hotelId: string, isLiked: boolean) => void
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, className, onLikeToggle }) => {
  const { t } = useTranslation('page-index')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

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

    if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < hotel.images.length) {
      setCurrentImageIndex(newIndex)
    }
  }

  const handleLikeToggle = (hotelId: string, isLiked: boolean) => {
    console.log(`Hotel ${hotelId} ${isLiked ? 'liked' : 'unliked'}`)
    onLikeToggle?.(hotelId, isLiked)
  }

  // Navigation handlers for circular browsing
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const prevIndex = currentImageIndex === 0 ? hotel.images.length - 1 : currentImageIndex - 1
    setCurrentImageIndex(prevIndex)
    scrollToImage(prevIndex)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextIndex = currentImageIndex === hotel.images.length - 1 ? 0 : currentImageIndex + 1
    setCurrentImageIndex(nextIndex)
    scrollToImage(nextIndex)
  }

  return (
    <article
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-xs bg-on-box-black"
      aria-labelledby={`hotel-${hotel.id}-title`}
    >
      {/* Hotel Image Gallery */}
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
          aria-label="Hotel images"
        >
          {hotel.images.map((image, idx) => (
            <img
              key={`${hotel.id}-image-${idx}`}
              src={image}
              alt={`${hotel.name} - View ${idx + 1} of ${hotel.images.length}`}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading={'lazy'}
              fetchPriority="low"
            />
          ))}
        </div>

        {/* Navigation Buttons - Show on hover when multiple images */}
        {hotel.images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Previous hotel image"
            >
              <Icon name="chevron-left" className="h-4 w-4 text-white" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Next hotel image"
            >
              <Icon name="chevron-right" className="h-4 w-4 text-white" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {hotel.images.length > 1 && (
          <nav
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1"
            aria-label="Image navigation"
          >
            {hotel.images.map((_, idx) => (
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
        <ButtonFavorite contentId={hotel.id} onToggle={handleLikeToggle} />
      </header>

      {/* Hotel Information */}
      <section className="flex flex-1 flex-col gap-y-2 p-4 text-on-box-white">
        {/* Hotel Name */}
        <h2 id={`hotel-${hotel.id}-title`} className="text-size-lg font-bold">
          {hotel.name}
        </h2>

        {/* Star Rating */}
        <div className="flex items-center gap-2 text-size-sm">
          <div className="flex gap-0.5">
            {Array.from({ length: hotel.starRating }, (_, i) => (
              <Icon
                key={hotel.id + 'start' + i}
                name="star"
                className="size-4 text-badge-yellow"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Room Type */}
        <p className="-mt-0.5 text-size-sm font-semibold">{hotel.roomType}</p>

        {/* Reviews and Map Link */}
        <div className="-mt-0.5 flex items-center gap-2 text-size-sm">
          <Icon name="thumbs-up" className="size-4 text-badge-green" aria-hidden="true" />
          <span>
            <span className="sr-only">Rating:</span>
            {hotel.reviewRating.toFixed(1)}
            <span className="sr-only">out of 5, based on</span>({hotel.reviewCount}{' '}
            <span className="sr-only">reviews</span>)
          </span>
          <Link
            to="/$lang/not-found"
            className="font-semibold text-primary-500 underline transition-colors hover:text-primary-400"
          >
            {t('hotels.map_view')}
          </Link>
        </div>

        {/* Divider */}
        <hr className="my-1 border-card-surface" aria-hidden="true" />

        {/* Hotel Features */}
        <section aria-labelledby={`hotel-${hotel.id}-features`}>
          <h3 id={`hotel-${hotel.id}-features`} className="sr-only">
            Hotel features
          </h3>
          <ul className="space-y-2 text-size-sm">
            {/* Distance to Center */}
            <li className="flex items-center gap-2">
              <Icon name="location-pin" className="size-3" aria-hidden="true" />
              <span>
                <strong>{t('hotels.distance_to_center')}:</strong>{' '}
                <span className="font-medium">{hotel.distanceToCenter}</span>
              </span>
            </li>

            {/* Breakfast Feature */}
            {hotel.features.breakfast && (
              <li className="flex items-center gap-2">
                <Icon name="hotel/breakfast" className="size-3" aria-hidden="true" />
                <span>
                  <strong>{t(`hotels.features.breakfast.label`)}:</strong>{' '}
                  <span className="font-medium">{t(`hotels.features.breakfast.value`)}</span>
                </span>
              </li>
            )}

            {/* For Two People Feature */}
            {hotel.features.forTwoPeople && (
              <li className="flex items-center gap-2">
                <Icon name="person" className="size-3" aria-hidden="true" />
                <span>
                  <strong>{t(`hotels.features.forTwoPeople.label`)}:</strong>{' '}
                  <span className="font-medium">{t(`hotels.features.forTwoPeople.value`)}</span>
                </span>
              </li>
            )}

            {/* Free Cancellation Feature */}
            {hotel.features.freeCancellation && (
              <li className="flex items-center gap-2">
                <Icon name="check" className="size-3 text-badge-green" aria-hidden="true" />
                <span>
                  <strong>{t(`hotels.features.freeCancellation.label`)}:</strong>{' '}
                  <span className="font-medium">{t(`hotels.features.freeCancellation.value`)}</span>
                </span>
              </li>
            )}
          </ul>
        </section>

        {/* Divider */}
        <hr className="my-1 mt-auto border-card-surface" aria-hidden="true" />

        {/* Pricing and Booking */}
        <footer className="flex flex-col gap-y-1.5">
          <p className="text-size-xs">
            {t('hotels.per_night', { count: hotel.nightCount, adults: hotel.adultCount })}
          </p>
          <div
            className="text-size-xl font-bold"
            aria-label={`Price: ${hotel.currency}${hotel.price.toFixed(2)}`}
          >
            {hotel.currency}
            {hotel.price.toFixed(2)}
          </div>
          <Link
            to="/$lang/not-found"
            className="w-full rounded-xs bg-btn-primary px-4 py-2 text-center text-size-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus active:scale-[0.98]"
            role="button"
          >
            {t('hotels.book_now')}
          </Link>
        </footer>
      </section>
    </article>
  )
}
