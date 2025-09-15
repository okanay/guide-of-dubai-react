import Icon from '@/components/icon'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'
import { useCallback, useRef, useState } from 'react'
import { ButtonFavorite } from './button-favorite'

interface Props {
  transfer: Transfer
  className?: string
}

export const TransferCard: React.FC<Props> = ({ transfer, className }) => {
  const { t } = useTranslation('global-card')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

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
      const prevIndex = (currentImageIndex - 1 + transfer.images.length) % transfer.images.length
      scrollToImage(prevIndex)
    },
    [currentImageIndex, transfer.images.length, scrollToImage],
  )

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const nextIndex = (currentImageIndex + 1) % transfer.images.length
      scrollToImage(nextIndex)
    },
    [currentImageIndex, transfer.images.length, scrollToImage],
  )

  // Özellikleri dinamik olarak oluşturmak için bir diziye dönüştürüyoruz
  const features = [
    {
      key: 'passengerCapacity',
      icon: 'person',
      text: t('transfer.features.pax', { capacity: transfer.features.passengerCapacity }),
      visible: true,
    },
    {
      key: 'baggageCapacity',
      icon: 'valise',
      text: t('transfer.features.baggage', { count: Number(transfer.features.baggageCapacity) }),
      visible: true,
    },
    {
      key: 'hasFoodAndBeverage',
      icon: 'include-food',
      text: t('transfer.features.food_and_beverage'),
      visible: transfer.features.hasFoodAndBeverage,
    },
    {
      key: 'hasFreeCancellation',
      icon: 'check',
      text: t('transfer.features.free_cancellation'),
      visible: transfer.features.hasFreeCancellation,
    },
  ]

  return (
    <article
      className={twMerge(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-xs border border-gray-100 bg-white',
        className,
      )}
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
          {transfer.images.map((image, idx) => (
            <img
              key={`${transfer.id}-image-${idx}`}
              src={image}
              alt={t('common.aria.image_alt', { title: transfer.title, index: idx + 1 })}
              className="h-full w-full shrink-0 snap-start object-cover"
              loading="lazy"
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        {transfer.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute top-1/2 left-3 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
              aria-label={t('common.aria.prev_image')}
            >
              <Icon name="chevron-left" className="size-4 text-black" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
              aria-label={t('common.aria.next_image')}
            >
              <Icon name="chevron-right" className="size-4 text-black" />
            </button>
          </>
        )}

        {/* Image Indicators - Görseldeki gibi altta */}
        {transfer.images.length > 1 && (
          <nav
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2"
            aria-label="Image navigation"
          >
            {transfer.images.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => scrollToImage(idx)}
                className={twMerge(
                  'h-2 rounded-full transition-all duration-300',
                  idx === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/60',
                )}
                aria-label={t('common.aria.view_image', { index: idx + 1 })}
              />
            ))}
          </nav>
        )}

        {/* Favorite Button */}
        <ButtonFavorite contentId={transfer.id} className="right-2.25" />
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col pt-2 md:p-4">
        <h2
          id={`transfer-${transfer.id}-title`}
          className="px-4 text-size font-bold text-black md:px-0"
        >
          {transfer.title}
        </h2>
        <p className="px-4 text-size-sm text-gray-800 md:px-0">{transfer.vehicle}</p>
        <div className="mt-6 flex flex-col items-end justify-between gap-x-4 gap-y-4 md:flex-row">
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(120px,auto))] gap-x-8 gap-y-2 px-4 md:px-0">
            {features
              .filter((feature) => feature.visible)
              .map((feature) => (
                <div key={feature.key} className="flex items-center gap-2">
                  <Icon
                    name={feature.icon}
                    className={`size-4 shrink-0 ${
                      feature.key.startsWith('has') ? 'font-medium text-badge-green' : 'text-black'
                    }`}
                  />
                  <span
                    className={`text-size-sm ${
                      feature.key.startsWith('has') ? 'font-medium text-badge-green' : 'text-black'
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
          </div>
          <div className="flex w-full shrink-0 items-center justify-center rounded-xs bg-btn-primary px-4 py-2 text-size-sm font-bold text-on-btn-primary md:w-fit">
            {t('common.buttons.transfer')}
          </div>
        </div>
      </div>
    </article>
  )
}
