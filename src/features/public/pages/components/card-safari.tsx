import Icon from '@/components/icon'
import { Link } from '@/i18n/router/link'
import { useSystemSettings } from '@/features/modals/system-settings/store'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { ButtonFavorite } from './button-favorite'

// Multi-currency pricing data
const safariPricing = {
  morning: {
    aed: 715.52,
    usd: 194.96,
    eur: 184.25,
    gbp: 157.8,
  },
  night: {
    aed: 715.52,
    usd: 194.96,
    eur: 184.25,
    gbp: 157.8,
  },
}

const safariData = {
  morning: {
    id: 'safari-morning',
    images: ['/images/public/header/safari.jpg', '/images/public/header/safari-mobile.jpg'],
    rating: 4.0,
    reviewCount: 156,
    href: '/$lang/tour-safari/morning',
  },
  night: {
    id: 'safari-night',
    images: ['/images/public/header/rent-a-car.jpg', '/images/public/header/rent-a-car-mobile.jpg'],
    rating: 4.0,
    reviewCount: 156,
    href: '/$lang/tour-safari/night',
  },
}

interface SafariCardProps {
  type: 'morning' | 'night'
  className?: string
}

export const CardSafari: React.FC<SafariCardProps> = ({ type, className }) => {
  const { t } = useTranslation('global-card')
  const { currency } = useSystemSettings()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const data = safariData[type]
  const pricing = safariPricing[type]
  const currentPrice = pricing[currency.code as keyof typeof pricing]

  const formatPrice = useCallback(
    (price: number): string => {
      return `${currency.symbol}${price.toFixed(2)}`
    },
    [currency],
  )

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
        'group relative flex h-full w-full flex-col overflow-hidden rounded-xs border border-gray-200 bg-white',
        className,
      )}
      aria-labelledby={`safari-${type}-title`}
    >
      {/* Image Gallery Header */}
      <header className="relative h-[280px] shrink-0 overflow-hidden">
        <div
          ref={imageContainerRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto"
          onScroll={handleImageScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="region"
          aria-label="Safari tour images"
        >
          {data.images.map((image, idx) => (
            <img
              key={`${data.id}-image-${idx}`}
              src={image}
              alt={t('safari.image_alt', { title: t(`safari.${type}.title`), index: idx + 1 })}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading="lazy"
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        {data.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-3 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
              aria-label={t('safari.prev_image')}
            >
              <Icon name="chevron-left" className="size-4 text-black" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
              aria-label={t('safari.next_image')}
            >
              <Icon name="chevron-right" className="size-4 text-black" />
            </button>
          </>
        )}

        {/* Image Indicators - Görseldeki gibi altta */}
        {data.images.length > 1 && (
          <nav
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            aria-label="Image navigation"
          >
            {data.images.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => scrollToImage(idx)}
                className={twMerge(
                  'h-2 rounded-full transition-all duration-300',
                  idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/60',
                )}
                aria-label={t('safari.view_image', { index: idx + 1 })}
              />
            ))}
          </nav>
        )}

        {/* Favorite Button */}
        <ButtonFavorite contentId={data.id} className="right-2.25" />
      </header>

      {/* Content */}
      <Link to="/$lang/not-found" className="flex flex-1 flex-col gap-y-2 p-4">
        <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 text-start">
          {/* Title */}
          <h2 id={`safari-${type}-title`} className="text-size font-bold text-black">
            {t(`safari.${type}.title`)}
          </h2>

          {/* Rating - Title'ın altında, görseldeki gibi */}
          <div className="flex items-center gap-1.5 text-size-sm">
            <Icon name="star" className="size-4 text-primary-500" />
            <span className="font-medium text-black">{data.rating}</span>
            <span className="text-gray-700">({data.reviewCount})</span>
          </div>
        </div>

        {/* Features - Görseldeki 3 temel özellik */}
        <div className="mt-1 mb-2 flex flex-wrap gap-3">
          {/* 4 Kişilik */}
          <div className="flex items-center gap-3">
            <Icon name="person" className="size-3.5 text-gray-700" />
            <span className="text-size font-medium text-black">
              {t('safari.features.capacity', { count: 4 })}
            </span>
          </div>

          {/* Paylaşımlı Araç */}
          <div className="flex items-center gap-3">
            <Icon name="car" className="size-3.5 text-gray-700" />
            <span className="text-size font-medium text-black">
              {t('safari.features.sharedVehicle')}
            </span>
          </div>

          {/* Otelden Alım */}
          <div className="flex items-center gap-3">
            <Icon name="hotels-taken" className="size-4 text-gray-700" />
            <span className="text-size font-medium text-black">
              {t('safari.features.hotelPickup')}
            </span>
          </div>
        </div>

        {/* Night Safari için kamp seçenekleri */}
        {type === 'night' && <NightCampOptions />}

        <hr className="my-1 border-gray-200 md:hidden" aria-hidden="true" />

        {/* Price ve Button - En altta */}
        <div className="mt-auto flex w-full flex-col gap-y-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-black">{formatPrice(currentPrice)}</span>
            <span className="text-sm text-gray-700">{t('safari.labels.perPerson')}</span>
          </div>

          {/* Full width button, görseldeki gibi */}
          <div className="flex w-full items-center justify-center rounded-xs bg-btn-primary px-4 py-2 text-size-sm font-bold text-on-btn-primary md:w-fit">
            {t(`safari.${type}.button`)}
          </div>
        </div>
      </Link>
    </article>
  )
}

// Night Safari Kamp Seçenekleri - Görseldeki gibi
const NightCampOptions = () => {
  const { t } = useTranslation('global-card')
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 pb-4">
      <h4 className="text-size font-medium text-black">{t('safari.nightCampOptions')}</h4>
      <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
        <Icon name="safari/camp-silver" className="size-4.5" />
        <span className="text-xs font-medium text-black">{t('safari.camps.silver')}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
        <Icon name="safari/camp-plat" className="size-4.5" />
        <span className="text-xs font-medium text-black">{t('safari.camps.platinum')}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
        <Icon name="safari/camp-gold" className="size-4.5" />
        <span className="text-xs font-medium text-black">{t('safari.camps.gold')}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
        <Icon name="safari/camp-premium" className="size-4.5" />
        <span className="text-xs font-medium text-black">{t('safari.camps.premium')}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1">
        <Icon name="safari/camp-heritage" className="size-4.5" />
        <span className="text-xs font-medium text-black">{t('safari.camps.heritage')}</span>
      </div>
    </div>
  )
}
