import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from './button-favorite'

const safariData = {
  morning: {
    id: 'safari-morning',
    images: ['/images/public/header/safari.jpg', '/images/public/header/safari-mobile.jpg'],
    rating: 4.0,
    reviewCount: 156,
    price: 194.96,
    currency: '$',
    href: '/$lang/tour-safari/morning',
  },
  night: {
    id: 'safari-night',
    images: ['/images/public/header/rent-a-car.jpg', '/images/public/header/rent-a-car-mobile.jpg'],
    rating: 4.0,
    reviewCount: 156,
    price: 194.96,
    currency: '$',
    href: '/$lang/tour-safari/night',
  },
}

// Main Card Component - This remains the same
interface SafariCardProps {
  type: 'morning' | 'night'
  className?: string
  onLikeToggle?: (tourType: 'morning' | 'night', isLiked: boolean) => void
}

export const CardSafari: React.FC<SafariCardProps> = ({ type, className, onLikeToggle }) => {
  const { t } = useTranslation('global-card')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const data = safariData[type]

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

  const handleLikeToggle = useCallback(
    (_id: string, isLiked: boolean) => onLikeToggle?.(type, isLiked),
    [onLikeToggle, type],
  )

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const prevIndex = (currentImageIndex - 1 + data.images.length) % data.images.length
      scrollToImage(prevIndex)
    },
    [currentImageIndex, data.images.length, scrollToImage],
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const nextIndex = (currentImageIndex + 1) % data.images.length
      scrollToImage(nextIndex)
    },
    [currentImageIndex, data.images.length, scrollToImage],
  )

  return (
    <article
      className={twMerge(
        'group relative flex h-full min-h-[480px] w-full flex-col overflow-hidden rounded-xs border border-gray-200 bg-box-surface dark:bg-gray-950',
        className,
      )}
      aria-labelledby={`safari-${type}-title`}
    >
      <header className="relative h-[220px] shrink-0">
        <div
          ref={imageContainerRef}
          className="scrollbar-hide flex h-full snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
        >
          {data.images.map((image, idx) => (
            <img
              key={`${data.id}-image-${idx}`}
              src={image}
              alt={`${t(`safari.${type}.title`)} - View ${idx + 1}`}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading="lazy"
            />
          ))}
        </div>
        {data.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Previous image"
            >
              <Icon name="chevron-left" className="size-4 text-black" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-70 hover:opacity-100"
              aria-label="Next image"
            >
              <Icon name="chevron-right" className="size-4 text-black" />
            </button>
            <nav className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
              {data.images.map((_, idx) => (
                <button
                  key={`indicator-${idx}`}
                  onClick={() => scrollToImage(idx)}
                  className={twMerge(
                    'h-1 rounded-full transition-all duration-300 hover:bg-white/80',
                    idx === currentImageIndex ? 'w-4 bg-white' : 'w-2 bg-white/60',
                  )}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </nav>
          </>
        )}
        <ButtonFavorite contentId={data.id} onToggle={handleLikeToggle} />
      </header>

      {type === 'morning' ? <MorningContent /> : <NightContent />}
    </article>
  )
}

// Internal Component for Morning Tour - No 'data' prop needed
const MorningContent = () => {
  const { t } = useTranslation('global-card')

  const data = safariData.morning
  const features = t('safari.morning.features', { returnObjects: true }) as string[]
  const formattedPrice = `${data.currency}${data.price.toFixed(2)}`

  return (
    <div className="flex flex-1 flex-col p-4">
      <h2 id="safari-morning-title" className="mb-2 text-size-lg font-bold text-on-box-black">
        {t('safari.morning.title')}
      </h2>
      <div className="mb-3 flex items-center gap-1 text-size-xs">
        <Icon name="star" className="size-3 text-primary-500" />
        <span className="font-medium text-on-box-black">{data.rating.toFixed(1)}</span>
        <span className="text-gray-600">({data.reviewCount})</span>
      </div>
      <div className="mb-4 space-y-2 text-size-sm">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <Icon name="check" className="size-4 text-green-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-size-xl font-bold text-on-box-black">{formattedPrice}</span>
          <span className="text-size-xs text-gray-500">{t('safari.priceNote')}</span>
        </div>
        <Link
          to={data.href as any}
          className="flex h-10 w-full items-center justify-center rounded-xs bg-btn-primary text-size-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover"
        >
          {t('safari.morning.buttonText')}
        </Link>
      </div>
    </div>
  )
}

// Internal Component for Night Tour - No 'data' prop needed
const NightContent = () => {
  const { t } = useTranslation('global-card')

  const data = safariData.night
  const features = t('safari.night.features', { returnObjects: true }) as string[]
  const camps = t('safari.night.camps', { returnObjects: true }) as string[]
  const formattedPrice = `${data.currency}${data.price.toFixed(2)}`

  return (
    <div className="flex flex-1 flex-col p-4">
      <h2 id="safari-night-title" className="mb-2 text-size-lg font-bold text-on-box-black">
        {t('safari.night.title')}
      </h2>
      <div className="mb-3 flex items-center gap-1 text-size-xs">
        <Icon name="star" className="size-3 text-primary-500" />
        <span className="font-medium text-on-box-black">{data.rating.toFixed(1)}</span>
        <span className="text-gray-600">({data.reviewCount})</span>
      </div>
      <div className="mb-4 space-y-2 text-size-sm">
        {features.map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <Icon name="check" className="size-4 text-green-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="mb-2 font-semibold text-on-box-black">{t('safari.night.campOptions')}</h3>
        <div className="flex flex-wrap gap-2">
          {camps.map((camp, i) => (
            <span key={i} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
              {camp}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-size-xl font-bold text-on-box-black">{formattedPrice}</span>
          <span className="text-size-xs text-gray-500">{t('safari.priceNote')}</span>
        </div>
        <Link
          to={data.href as any}
          className="flex h-10 w-full items-center justify-center rounded-xs bg-btn-primary text-size-sm font-bold text-on-btn-primary transition-colors hover:bg-btn-primary-hover"
        >
          {t('safari.night.buttonText')}
        </Link>
      </div>
    </div>
  )
}
