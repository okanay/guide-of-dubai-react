import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from './button-favorite'

interface RentACarCardProps {
  car: RentACar
  className?: string
  onLikeToggle?: (carId: string, isLiked: boolean) => void
}

export const RentACarCard: React.FC<RentACarCardProps> = ({ car, className, onLikeToggle }) => {
  const { t } = useTranslation('global-card') // global-card namespace kullan
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const formatPrice = useCallback(
    (price: number): string => {
      return `${car.currency}${price.toFixed(2)}`
    },
    [car.currency],
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

      if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < car.images.length) {
        setCurrentImageIndex(newIndex)
      }
    },
    [currentImageIndex, car.images.length],
  )

  const handleLikeToggle = useCallback(
    (carId: string, isLiked: boolean) => {
      onLikeToggle?.(carId, isLiked)
    },
    [onLikeToggle],
  )

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const prevIndex = currentImageIndex === 0 ? car.images.length - 1 : currentImageIndex - 1
      setCurrentImageIndex(prevIndex)
      scrollToImage(prevIndex)
    },
    [currentImageIndex, car.images.length, scrollToImage],
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const nextIndex = currentImageIndex === car.images.length - 1 ? 0 : currentImageIndex + 1
      setCurrentImageIndex(nextIndex)
      scrollToImage(nextIndex)
    },
    [currentImageIndex, car.images.length, scrollToImage],
  )

  const handleBookingClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      console.log(`Booking car: ${car.id}`)
    },
    [car.id],
  )

  return (
    <article
      className={twMerge(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-xs border border-gray-200 bg-box-surface',
        className,
      )}
      aria-labelledby={`car-${car.id}-title`}
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
          aria-label="Car images"
        >
          {car.images.map((image, idx) => (
            <img
              key={`${car.id}-image-${idx}`}
              src={image}
              alt={`${car.brand} ${car.model} - View ${idx + 1} of ${car.images.length}`}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading={'lazy'}
              fetchPriority="low"
            />
          ))}
        </div>

        {/* Navigation Buttons - Show on hover when multiple images */}
        {car.images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Previous car image"
            >
              <Icon name="chevron-left" className="h-4 w-4 text-black" />
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Next car image"
            >
              <Icon name="chevron-right" className="h-4 w-4 text-black" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {car.images.length > 1 && (
          <nav
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1"
            aria-label="Image navigation"
          >
            {car.images.map((_, idx) => (
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
        <ButtonFavorite contentId={car.id} onToggle={handleLikeToggle} />
      </header>

      {/* Content */}
      <Link
        to="/$lang/not-found"
        className="flex flex-1 flex-col p-4 transition-colors hover:bg-gray-50/50"
      >
        {/* Car Title */}
        <h2
          id={`car-${car.id}-title`}
          className="mb-2 line-clamp-2 text-size font-bold text-on-box-black"
        >
          {car.brand} {car.model}
        </h2>

        {/* Rating and Reviews */}
        <div className="mb-2 flex items-center gap-2 text-size-xs">
          <Icon name="star" className="size-4 text-primary-500" aria-hidden="true" />
          <span className="font-medium text-on-box-black">{car.rating.toFixed(1)}</span>
          <span className="text-gray-600">({car.reviewCount})</span>
        </div>

        {/* Car Features */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-on-box-black">
          {/* Passenger Count */}
          <div className="flex items-center gap-1">
            <Icon name="person" className="size-3" aria-hidden="true" />
            <span className="text-size-sm">{t('rent_a_car.features.passengers')}</span>
          </div>

          {/* Seats */}
          {car.features.seats && (
            <div className="flex items-center gap-1">
              <Icon name="rent-a-car/seat" className="size-4" aria-hidden="true" />
              <span className="text-size-sm">{car.features.seats}</span>
            </div>
          )}

          {/* Transmission */}
          {car.features.automaticTransmission !== undefined && (
            <div className="flex items-center gap-1">
              <Icon name="rent-a-car/gear" className="size-4" aria-hidden="true" />
              <span className="text-size-sm">
                {t(
                  `rent_a_car.features.transmission.${car.features.automaticTransmission ? 'automatic' : 'manual'}`,
                )}
              </span>
            </div>
          )}

          {/* Air Conditioning */}
          {car.features.airConditioning && (
            <div className="flex items-center gap-1">
              <Icon name="rent-a-car/air-conditioning" className="size-4" aria-hidden="true" />
              <span className="text-size-sm">{t('rent_a_car.features.air_conditioning')}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="mb-2 flex items-start gap-1.5 text-gray-700">
          <Icon name="building" className="size-4 text-on-box-black" aria-hidden="true" />
          <div className="flex flex-col gap-y-1.5">
            <span className="text-size-sm text-on-box-black">{car.location}</span>
            <span className="text-size-xs">
              {t('rent_a_car.labels.distance_to_center')} {car.distanceFromCenter}
            </span>
          </div>
        </div>

        <hr className="my-2 border-btn-white" aria-hidden="true" />

        {/* Important Info */}
        <div className="mb-3 flex items-center gap-1.5">
          <span className="text-size-xs text-gray-600">
            {t('rent_a_car.labels.important_info')}
          </span>
          <Icon name="info-bg" className="mt-0.5 size-4 text-gray-900" aria-hidden="true" />
        </div>

        {/* Pricing */}
        <div className="mt-auto space-y-2">
          <div className="flex flex-col">
            <span className="text-body-xs text-gray-500">
              {t('rent_a_car.labels.price_per_days', { days: 3 })}
            </span>

            <div className="flex items-baseline gap-1">
              <span className="text-body-xl font-bold text-on-box-black">
                {formatPrice(car.pricePerDay)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookingClick}
            className="h-10 w-full rounded-xs border border-btn-primary bg-btn-primary text-body-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover focus:bg-btn-primary-focus"
          >
            {t('common.buttons.book_now')}
          </button>
        </div>
      </Link>
    </article>
  )
}
