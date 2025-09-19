import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useSystemSettings } from '@/features/modals/system-settings/store'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from '../buttons/button-favorite'

interface SafariCardProps {
  tour: SafariTour
  className?: string
}

export const CardSafari: React.FC<SafariCardProps> = ({ tour, className }) => {
  const { t } = useTranslation('global-card')
  const { currency } = useSystemSettings()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const pricing = tour.prices
  const currentPrice = pricing[currency.code]

  const scrollToImage = useCallback((imageIndex: number) => {
    if (!imageContainerRef.current) return
    const imageWidth = imageContainerRef.current.clientWidth
    imageContainerRef.current.scrollTo({ left: imageIndex * imageWidth, behavior: 'smooth' })
  }, [])

  const handleImageScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollLeft, clientWidth } = e.currentTarget
      const newIndex = Math.round(scrollLeft / clientWidth)
      if (newIndex !== currentImageIndex) setCurrentImageIndex(newIndex)
    },
    [currentImageIndex],
  )

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const prevIndex = (currentImageIndex - 1 + tour.images.length) % tour.images.length
      scrollToImage(prevIndex)
    },
    [currentImageIndex, tour.images.length, scrollToImage],
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const nextIndex = (currentImageIndex + 1) % tour.images.length
      scrollToImage(nextIndex)
    },
    [currentImageIndex, tour.images.length, scrollToImage],
  )

  return (
    <article
      className={twMerge(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-xs border border-gray-100 bg-white',
        className,
      )}
      aria-labelledby={`safari-${tour.type}-title`}
    >
      {/* Image Gallery Header */}
      <header className="relative h-[280px] shrink-0 overflow-hidden">
        <div
          ref={imageContainerRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="region"
          aria-label={t('accessibility.image_alt', { title: tour.title })}
        >
          {tour.images.map((image, idx) => (
            <img
              key={`${tour.id}-image-${idx}`}
              src={image}
              alt={t('accessibility.image_alt', {
                title: tour.title,
                index: idx + 1,
              })}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading="lazy"
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        {tour.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-3 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
              aria-label={t('accessibility.prev_image')}
            >
              <Icon name="chevron-left" className="size-4 text-black" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
              aria-label={t('accessibility.next_image')}
            >
              <Icon name="chevron-right" className="size-4 text-black" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {tour.images.length > 1 && (
          <nav
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            aria-label="Image navigation"
          >
            {tour.images.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => scrollToImage(idx)}
                className={twMerge(
                  'h-2 rounded-full transition-all duration-300',
                  idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/60',
                )}
                aria-label={t('accessibility.view_image', { index: idx + 1 })}
              />
            ))}
          </nav>
        )}

        {/* Favorite Button */}
        <ButtonFavorite contentId={tour.id} className="right-2.25" />
      </header>

      {/* Content */}
      <Link to={'/$lang/not-found'} className="flex flex-1 flex-col gap-y-2 p-4">
        <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-start">
          {/* Title */}
          <h2 id={`safari-${tour.type}-title`} className="text-size font-bold text-black">
            {tour.title}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-size-sm">
            <Icon name="star" className="size-4 text-primary-500" />
            <span className="font-medium text-black">{tour.rating}</span>
            <span className="text-gray-700">
              ({tour.reviewCount} {tour.reviewCount > 1 ? t('labels.reviews') : t('labels.review')})
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="mt-1 mb-2 flex flex-wrap gap-3">
          {/* Capacity */}
          <div className="flex items-center gap-3">
            <Icon name="person" className="size-3.5 text-gray-700" />
            <span className="text-size font-medium text-black">
              {t('safari.capacity', { capacity: '1-4' })}
            </span>
          </div>

          {/* Shared Vehicle */}
          <div className="flex items-center gap-3">
            <Icon name="car" className="size-3.5 text-gray-700" />
            <span className="text-size font-medium text-black">{t('features.shared_vehicle')}</span>
          </div>

          {/* Hotel Pickup */}
          <div className="flex items-center gap-3">
            <Icon name="hotels-taken" className="size-4 text-gray-700" />
            <span className="text-size font-medium text-black">{t('features.hotel_pickup')}</span>
          </div>
        </div>

        {/* Night Safari Camp Options */}
        {tour.camps && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 pb-4">
            <h4 className="text-size font-medium text-black">{tour.camps.title}</h4>
            {tour.camps.options.map((camp) => (
              <div
                key={camp.key}
                className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1"
              >
                <Icon name={camp.icon} className="size-4.5" />
                <span className="text-xs font-medium text-black">
                  {t(`safari.camps.${camp.key}`)}
                </span>
              </div>
            ))}
          </div>
        )}

        <hr className="my-1 border-gray-100 md:hidden" aria-hidden="true" />

        {/* Price ve Button */}
        <div className="mt-auto flex w-full flex-col gap-y-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-black">{currentPrice}</span>
            <span className="text-sm text-gray-700">{t('labels.per_person')}</span>
          </div>

          <div className="flex w-full items-center justify-center rounded-xs bg-btn-primary px-4 py-2 text-size-sm font-bold text-on-btn-primary md:w-fit">
            {tour.cta}
          </div>
        </div>
      </Link>
    </article>
  )
}
