import { Link } from 'src/i18n/router/link'
import { LinkProps } from '@tanstack/react-router'
import { Route } from 'src/routes/$lang/_public/route'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import Icon from 'src/components/icon'
import { useTranslation } from 'react-i18next'
import { SearchButton } from '../../modals/search/button'

interface SlideConfig {
  path: string
  imageSrc: string
  imageSrcMobile: string
  imageAlt: string
  titleKey: string
  searchPlaceholderKey: string
}

interface ResponsivePictureProps {
  slide: SlideConfig
  priority?: boolean
}

const ResponsivePicture = ({ slide, priority = false }: ResponsivePictureProps) => {
  return (
    <picture className="absolute inset-0 h-full w-full">
      {/* Mobile için source - 512px altında */}
      <source media="(max-width: 512px)" srcSet={slide.imageSrcMobile} type="image/jpeg" />
      {/* Desktop için source - 512px üstünde */}
      <source media="(min-width: 513px)" srcSet={slide.imageSrc} type="image/jpeg" />
      {/* Fallback img elementi */}
      <img
        src={slide.imageSrc}
        alt={slide.imageAlt}
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  )
}

export const PublicHeaderBackground = () => {
  const { href } = Route.useLoaderData()
  const { t } = useTranslation('layout-header')

  // Slide konfigürasyonları i18n ile
  const slideConfigs: SlideConfig[] = useMemo(
    () => [
      {
        path: '',
        imageSrc: '/images/public/header/explore.jpg',
        imageSrcMobile: '/images/public/header/explore-mobile.jpg',
        imageAlt: t('slides.explore.alt'),
        titleKey: 'slides.explore.title',
        searchPlaceholderKey: 'slides.explore.placeholder',
      },
      {
        path: 'tours',
        imageSrc: '/images/public/header/tours.jpg',
        imageSrcMobile: '/images/public/header/tours-mobile.jpg',
        imageAlt: t('slides.tours.alt'),
        titleKey: 'slides.tours.title',
        searchPlaceholderKey: 'slides.tours.placeholder',
      },
      {
        path: 'tickets',
        imageSrc: '/images/public/header/tours.jpg',
        imageSrcMobile: '/images/public/header/tours-mobile.jpg',
        imageAlt: t('slides.tickets.alt'),
        titleKey: 'slides.tickets.title',
        searchPlaceholderKey: 'slides.tickets.placeholder',
      },
      {
        path: 'hotels',
        imageSrc: '/images/public/header/hotels.png',
        imageSrcMobile: '/images/public/header/hotels-mobile.png',
        imageAlt: t('slides.hotels.alt'),
        titleKey: 'slides.hotels.title',
        searchPlaceholderKey: 'slides.hotels.placeholder',
      },
      {
        path: 'safari-tour',
        imageSrc: '/images/public/header/safari.jpg',
        imageSrcMobile: '/images/public/header/safari-mobile.jpg',
        imageAlt: t('slides.safari_tour.alt'),
        titleKey: 'slides.safari_tour.title',
        searchPlaceholderKey: 'slides.safari_tour.placeholder',
      },
      {
        path: 'rent-a-car',
        imageSrc: '/images/public/header/rent-a-car.jpg',
        imageSrcMobile: '/images/public/header/rent-a-car-mobile.jpg',
        imageAlt: t('slides.rent_a_car.alt'),
        titleKey: 'slides.rent_a_car.title',
        searchPlaceholderKey: 'slides.rent_a_car.placeholder',
      },
      {
        path: 'transfer',
        imageSrc: '/images/public/header/transfer.jpg',
        imageSrcMobile: '/images/public/header/transfer-mobile.jpg',
        imageAlt: t('slides.transfer.alt'),
        titleKey: 'slides.transfer.title',
        searchPlaceholderKey: 'slides.transfer.placeholder',
      },
      {
        path: 'all',
        imageSrc: '/images/public/header/explore.jpg',
        imageSrcMobile: '/images/public/header/explore-mobile.jpg',
        imageAlt: t('slides.all.alt'),
        titleKey: 'slides.all.title',
        searchPlaceholderKey: 'slides.all.placeholder',
      },
    ],
    [t],
  )

  const activeSlideIndex = useMemo(() => getActiveSlideIndex(href), [href])
  const hasSlide = activeSlideIndex !== null

  const activeSlide = hasSlide ? slideConfigs[activeSlideIndex] : null

  return (
    <>
      {/* Layout Spacer */}
      <div
        className="transition-all duration-500 ease-in-out data-[slide=false]:h-[160px] data-[slide=true]:h-[540px]"
        data-slide={hasSlide}
      />

      {/* Main Container */}
      <div
        className="absolute top-0 left-0 w-full bg-black transition-all duration-500 ease-in-out data-[slide=false]:h-[220px] data-[slide=true]:h-[600px] dark:bg-white"
        data-slide={hasSlide}
      >
        <div className="relative h-full" data-slide={hasSlide}>
          {/* Slider Container */}
          <div
            className="absolute inset-0 z-30 overflow-hidden"
            style={{ opacity: hasSlide ? 1 : 0, transition: 'opacity 300ms ease-in-out' }}
          >
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{
                width: `${slideConfigs.length * 100}%`,
                transform: hasSlide
                  ? `translateX(-${(activeSlideIndex * 100) / slideConfigs.length}%)`
                  : 'translateX(-100%)',
              }}
            >
              {slideConfigs.map((slide, index) => (
                <div
                  key={slide.path}
                  className="relative h-full flex-shrink-0"
                  style={{ width: `${100 / slideConfigs.length}%` }}
                >
                  {/* Responsive Picture Component kullanımı */}
                  <ResponsivePicture
                    slide={slide}
                    priority={index === activeSlideIndex} // Aktif slide'a priority ver
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hero Content */}
          <div
            className="absolute inset-0 z-31 flex flex-col items-center justify-center gap-y-6 px-4 transition-opacity duration-500 data-[slide=false]:pointer-events-none data-[slide=false]:opacity-0"
            data-slide={hasSlide}
          >
            {activeSlide && (
              <>
                <h1 className="text-center text-size-3xl font-bold text-white transition-all duration-300 md:text-heading-2 dark:text-black">
                  {t(activeSlide.titleKey)}
                </h1>
                <SearchButton
                  variant="hero"
                  placeholder={t(activeSlide.searchPlaceholderKey)}
                  className="line-clamp-1 flex h-11 w-full max-w-[400px] items-center justify-start gap-x-2 rounded-full bg-white px-4 text-size-sm font-normal text-gray-600 shadow-lg sm:max-w-[560px] md:h-13 md:w-[560px] md:text-size dark:bg-black"
                />
              </>
            )}
          </div>

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 z-30 bg-gradient-to-b from-[#000] to-[#030712] opacity-50 transition-opacity duration-500 data-[slide=false]:opacity-0"
            data-slide={hasSlide}
          />

          {/* Navigation Tabs */}
          <div className="absolute -bottom-px left-0 z-32 w-full px-4">
            <nav className="mx-auto grid w-full max-w-main grid-cols-4 items-center justify-start overflow-x-auto text-size-sm font-semibold [scrollbar-width:none] sm:flex xl:grid xl:grid-cols-8 [&::-webkit-scrollbar]:hidden">
              <NavigationTab
                to="/$lang"
                icon="app/explore"
                labelKey="nav.explore"
                className="flex"
              />
              <NavigationTab
                to="/$lang/tours"
                icon="app/tours"
                labelKey="nav.tours"
                className="flex"
              />
              <NavigationTab
                to="/$lang/tickets"
                icon="app/tickets"
                labelKey="nav.activities"
                className="hidden sm:flex"
              />
              <NavigationTab
                to="/$lang/hotels"
                icon="app/hotels"
                labelKey="nav.hotels"
                className="flex"
              />
              <NavigationTab
                to="/$lang/safari-tour"
                icon="app/safari"
                labelKey="nav.safari_tour"
                className="hidden sm:flex"
              />
              <NavigationTab
                to="/$lang/rent-a-car"
                icon="app/car-rental"
                labelKey="nav.rent_a_car"
                className="hidden sm:flex"
              />
              <NavigationTab
                to="/$lang/transfer"
                icon="app/transfer"
                labelKey="nav.transfer"
                className="hidden sm:flex"
              />
              <NavigationTab to="/$lang/all" icon="app/all" labelKey="nav.all" className="flex" />
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

// Navigation Tab Component
interface NavigationTabProps {
  to: LinkProps['to']
  icon: string
  labelKey: string
  className?: string
}

function NavigationTab({ to, icon, labelKey, className }: NavigationTabProps) {
  const { t } = useTranslation('layout-header')

  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      preload={'render'}
      className={twMerge(
        'group flex w-full shrink-0 items-center justify-center gap-x-2 py-3 text-center font-bold text-white transition-colors duration-300 ease-in hover:bg-white/20 data-[status=active]:bg-white data-[status=active]:text-btn-primary sm:w-1/8 sm:min-w-[120px] xl:w-full dark:text-black data-[status=active]:dark:bg-black',
        className,
      )}
    >
      <Icon name={icon} className="text-[#F8F8F8] group-data-[status=active]:text-gray-700" />
      {t(labelKey)}
    </Link>
  )
}

const getActiveSlideIndex = (href: string): number | null => {
  try {
    const url = href.startsWith('http') ? new URL(href) : new URL(href, 'http://localhost')
    const pathSegments = url.pathname.split('/').filter((segment) => segment !== '')

    if (pathSegments.length >= 3) return null

    const targetPath = pathSegments.length === 1 ? '' : pathSegments[1]
    const slideConfigs = [
      { path: '' },
      { path: 'tours' },
      { path: 'tickets' },
      { path: 'hotels' },
      { path: 'safari-tour' },
      { path: 'rent-a-car' },
      { path: 'transfer' },
      { path: 'all' },
    ]
    const slideIndex = slideConfigs.findIndex((slide) => slide.path === targetPath)

    return slideIndex >= 0 ? slideIndex : null
  } catch {
    return null
  }
}
