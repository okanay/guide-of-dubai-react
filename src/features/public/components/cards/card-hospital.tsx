import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from '../buttons/button-favorite'
import { Hotel } from 'lucide-react'
import { useLeafletModalStore } from '@/features/modals/leaflet-map/store'

interface HospitalCardProps {
  hospital: Hospital
  className?: string
  onLikeToggle?: (hospitalId: string, isLiked: boolean) => void
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  className,
  onLikeToggle,
}) => {
  const { t } = useTranslation('global-card')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const { openModal } = useLeafletModalStore()
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

      if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < hospital.images.length) {
        setCurrentImageIndex(newIndex)
      }
    },
    [currentImageIndex, hospital.images.length],
  )

  const handleLikeToggle = useCallback(
    (hospitalId: string, isLiked: boolean) => {
      onLikeToggle?.(hospitalId, isLiked)
    },
    [onLikeToggle],
  )

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const prevIndex = currentImageIndex === 0 ? hospital.images.length - 1 : currentImageIndex - 1
      setCurrentImageIndex(prevIndex)
      scrollToImage(prevIndex)
    },
    [currentImageIndex, hospital.images.length, scrollToImage],
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const nextIndex = currentImageIndex === hospital.images.length - 1 ? 0 : currentImageIndex + 1
      setCurrentImageIndex(nextIndex)
      scrollToImage(nextIndex)
    },
    [currentImageIndex, hospital.images.length, scrollToImage],
  )

  const handleOpenMap = useCallback(() => {
    openModal({ mode: 'pin', data: { coords: hospital.coords } })
  }, [])

  return (
    <article
      className={twMerge(
        'group relative flex h-full min-h-[480px] w-full flex-col overflow-hidden rounded-xs border border-gray-100 bg-box-surface dark:bg-gray-950',
        className,
      )}
      aria-labelledby={`hospital-${hospital.id}-title`}
    >
      <header className="relative h-[220px] shrink-0">
        <div
          ref={imageContainerRef}
          className="scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          role="region"
          aria-label={t('accessibility.image_alt', {
            title: hospital.name,
            index: currentImageIndex + 1,
          })}
        >
          {hospital.images.map((image, idx) => (
            <img
              key={`${hospital.id}-image-${idx}`}
              src={image}
              alt={t('accessibility.image_alt', { title: hospital.name, index: idx + 1 })}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading={'lazy'}
              fetchPriority="low"
            />
          ))}
        </div>

        {hospital.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label={t('accessibility.prev_image')}
            >
              <Icon name="chevron-left" className="h-4 w-4 text-black" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label={t('accessibility.next_image')}
            >
              <Icon name="chevron-right" className="h-4 w-4 text-black" />
            </button>
          </>
        )}

        {hospital.images.length > 1 && (
          <nav
            className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1"
            aria-label="Image navigation"
          >
            {hospital.images.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => scrollToImage(idx)}
                className={twMerge(
                  'h-1 rounded-full transition-all duration-300 hover:bg-white/80',
                  idx === currentImageIndex ? 'w-4 bg-white' : 'w-2 bg-white/60',
                )}
                aria-label={t('accessibility.view_image', { index: idx + 1 })}
                aria-current={idx === currentImageIndex ? 'true' : 'false'}
              />
            ))}
          </nav>
        )}
        <ButtonFavorite contentId={hospital.id} onToggle={handleLikeToggle} />
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 transition-colors hover:bg-gray-50/50">
        {/* Hospital Title */}
        <h2
          id={`hospital-${hospital.id}-title`}
          className="mb-2 line-clamp-2 text-size font-bold text-on-box-black"
        >
          {hospital.name}
        </h2>

        {/* Rating and Reviews */}
        <div className="mb-2 flex items-center gap-1 text-size-sm">
          <Icon name="star" className="size-4 text-primary-500" aria-hidden="true" />
          <span className="font-bold text-on-box-black">{hospital.rating.toFixed(1)}</span>
          <span className="text-gray-600">
            ({hospital.reviewCount}{' '}
            {hospital.reviewCount === 1 ? t('labels.review') : t('labels.reviews')})
          </span>
        </div>

        {/* Hospital Information */}
        <div className="mb-3 flex flex-col items-start gap-3 text-size-sm text-on-box-black">
          {/* Location */}
          {hospital.coords && (
            <div className="flex items-center gap-1">
              <Icon name="location-pin" className="size-4" aria-hidden="true" />
              <span className="font-bold text-on-box-black">{t('labels.location')}:</span>
              <span className="text-size-sm">Abu Dhabi - UAE</span>
            </div>
          )}

          {/* Phone */}
          {hospital.phone && (
            <div className="flex items-center gap-1">
              <Icon name="phone" className="size-4" aria-hidden="true" />
              <span className="font-bold text-on-box-black">{t('labels.phone')}:</span>
              <span className="text-size-sm">{hospital.phone}</span>
            </div>
          )}

          {/* Open Status */}
          {hospital.openStatus && (
            <div className="flex items-center gap-1 text-badge-green">
              <Icon name="clock-dotted" className="size-4" aria-hidden="true" />
              <span className="text-size-sm">{t('labels.open_now')}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center gap-x-2 text-size-sm font-bold">
          <button className="h-10 flex-1 bg-btn-primary text-on-btn-primary">
            {t('actions.more_info')}
          </button>
          <button
            onClick={handleOpenMap}
            className="h-10 flex-1 border border-btn-white-hover bg-btn-white text-on-btn-white"
          >
            {t('actions.view_on_map')}
          </button>
        </div>
      </div>
    </article>
  )
}
