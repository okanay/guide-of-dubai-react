import { LinkProps, useLocation } from '@tanstack/react-router'
import { useMemo, useState, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { useTranslation } from 'react-i18next'

import { Route } from 'src/routes/$lang/_public/route'
import Icon from 'src/components/icon'
import { SearchButton } from '@/features/modals/search/button'
import { Link } from '@/i18n/router/link'

interface SlideConfig {
  index: number
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

// Navigation tab configuration
interface NavTab {
  path: string
  icon: string
  labelKey: string
  to: LinkProps['to']
  preload: false | 'viewport' | 'render' | 'intent' | undefined
  exact?: boolean
  extended?: boolean
  mobileExtend?: boolean
}

const ResponsivePicture = ({ slide, priority = false }: ResponsivePictureProps) => (
  <picture className="absolute inset-0 h-full w-full">
    <source media="(max-width: 512px)" srcSet={slide.imageSrcMobile} type="image/jpeg" />
    <source media="(min-width: 513px)" srcSet={slide.imageSrc} type="image/jpeg" />
    <img
      src={slide.imageSrc}
      alt={slide.imageAlt}
      className="absolute inset-0 h-full w-full object-cover"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  </picture>
)

export const PublicHeaderBackground = () => {
  const location = useLocation()
  const { href } = Route.useLoaderData()
  const { t } = useTranslation('layout-header')

  const slideConfigs: SlideConfig[] = useMemo(
    () => [
      {
        index: 0,
        path: '',
        imageSrc: '/images/public/header/explore.jpg',
        imageSrcMobile: '/images/public/header/explore-mobile.jpg',
        imageAlt: t('slides.explore.alt'),
        titleKey: 'slides.explore.title',
        searchPlaceholderKey: 'slides.explore.placeholder',
      },
      {
        index: 1,
        path: 'tours',
        imageSrc: '/images/public/header/tours.jpg',
        imageSrcMobile: '/images/public/header/tours-mobile.jpg',
        imageAlt: t('slides.tours.alt'),
        titleKey: 'slides.tours.title',
        searchPlaceholderKey: 'slides.tours.placeholder',
      },
      {
        index: 2,
        path: 'activities',
        imageSrc: '/images/public/header/activities.jpg',
        imageSrcMobile: '/images/public/header/activities-mobile.jpg',
        imageAlt: t('slides.activities.alt'),
        titleKey: 'slides.activities.title',
        searchPlaceholderKey: 'slides.activities.placeholder',
      },
      {
        index: 3,
        path: 'hotels',
        imageSrc: '/images/public/header/hotels.jpg',
        imageSrcMobile: '/images/public/header/hotels-mobile.jpg',
        imageAlt: t('slides.hotels.alt'),
        titleKey: 'slides.hotels.title',
        searchPlaceholderKey: 'slides.hotels.placeholder',
      },
      {
        index: 4,
        path: 'safari-tour',
        imageSrc: '/images/public/header/safari.jpg',
        imageSrcMobile: '/images/public/header/safari-mobile.jpg',
        imageAlt: t('slides.safari_tour.alt'),
        titleKey: 'slides.safari_tour.title',
        searchPlaceholderKey: 'slides.safari_tour.placeholder',
      },
      {
        index: 5,
        path: 'rent-a-car',
        imageSrc: '/images/public/header/rent-a-car.jpg',
        imageSrcMobile: '/images/public/header/rent-a-car-mobile.jpg',
        imageAlt: t('slides.rent_a_car.alt'),
        titleKey: 'slides.rent_a_car.title',
        searchPlaceholderKey: 'slides.rent_a_car.placeholder',
      },
      {
        index: 6,
        path: 'transfer',
        imageSrc: '/images/public/header/transfer.jpg',
        imageSrcMobile: '/images/public/header/transfer-mobile.jpg',
        imageAlt: t('slides.transfer.alt'),
        titleKey: 'slides.transfer.title',
        searchPlaceholderKey: 'slides.transfer.placeholder',
      },
      {
        index: 7,
        path: 'flights',
        imageSrc: '/images/public/header/flights.jpg',
        imageSrcMobile: '/images/public/header/flights-mobile.jpg',
        imageAlt: t('slides.all.alt'),
        titleKey: 'slides.all.title',
        searchPlaceholderKey: 'slides.all.placeholder',
      },
      {
        index: 8,
        path: 'guide',
        imageSrc: '/images/public/header/explore.jpg',
        imageSrcMobile: '/images/public/header/explore-mobile.jpg',
        imageAlt: t('slides.all.alt'),
        titleKey: 'slides.all.title',
        searchPlaceholderKey: 'slides.all.placeholder',
      },
    ],
    [t],
  )

  const activeSlideIndexFromUrl = useMemo(
    () => getActiveSlideIndex(href, slideConfigs),
    [location.href, slideConfigs, href],
  )

  const [initialized, setInitialized] = useState(false)
  const [slideState, setSlideState] = useState(() => ({
    current: activeSlideIndexFromUrl,
    previous: activeSlideIndexFromUrl,
    direction: 'none' as 'left' | 'right' | 'none',
  }))

  useEffect(() => {
    // İlk render için animasyon engelleme
    if (!initialized) {
      setSlideState({
        current: activeSlideIndexFromUrl,
        previous: activeSlideIndexFromUrl,
        direction: 'none',
      })
      setInitialized(true)
      return
    }

    function getDirection(prev: number | null, next: number | null): 'left' | 'right' {
      if (prev === null || next === null) return 'left'
      if (prev === next) return 'left'
      return next > prev ? 'right' : 'left'
    }

    setSlideState((prev) => {
      // Sadece gerçekten değişiklik varsa güncelle
      if (prev.current === activeSlideIndexFromUrl) return prev

      const direction = getDirection(prev.current, activeSlideIndexFromUrl)

      return {
        current: activeSlideIndexFromUrl,
        previous: prev.current,
        direction,
      }
    })
  }, [activeSlideIndexFromUrl, initialized, href])

  const hasSlide = slideState.current !== null
  const activeSlide = hasSlide ? slideConfigs[slideState.current || 0] : null

  // Fonksiyona 'index' ve 'currentIndex' parametrelerini ekliyoruz
  const getTransformClass = (
    position: 'active' | 'exiting' | 'hidden',
    index: number,
    currentIndex: number | null,
  ): string => {
    if (currentIndex === null || slideState.previous === null) {
      switch (position) {
        case 'active':
          return 'opacity-100 scale-100'
        case 'exiting':
          return 'opacity-0 scale-95'
        default:
          return 'opacity-0'
      }
    }

    switch (position) {
      case 'active':
        return 'translate-x-0 opacity-100'
      case 'exiting':
        return slideState.direction === 'right'
          ? '-translate-x-full opacity-0'
          : 'translate-x-full opacity-0'
      default:
        return index > currentIndex ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'
    }
  }

  return (
    <>
      <div
        className="transition-all duration-500 ease-in-out data-[slide=false]:h-[160px] data-[slide=true]:h-[540px]"
        data-slide={hasSlide}
      />

      <div
        className="absolute top-0 left-0 w-full bg-black transition-all duration-500 ease-in-out data-[slide=false]:h-[220px] data-[slide=true]:h-[600px] dark:bg-white"
        data-slide={hasSlide}
      >
        <div className="relative h-full" data-slide={hasSlide}>
          <div className="absolute inset-0 z-30 overflow-hidden">
            {slideConfigs.map((slide, index) => {
              let position: 'active' | 'exiting' | 'hidden' = 'hidden'
              if (index === slideState.current) position = 'active'
              else if (index === slideState.previous) position = 'exiting'

              return (
                <div
                  key={slide.path}
                  className={twMerge(
                    'absolute inset-0 h-full w-full transform transition-all duration-700 ease-in-out',
                    getTransformClass(position, index, slideState.current),
                  )}
                  style={{ zIndex: position === 'active' ? 40 : 30 }}
                >
                  <ResponsivePicture slide={slide} priority={index === slideState.current} />
                </div>
              )
            })}
          </div>

          <div
            className="absolute inset-0 z-31 flex flex-col items-center justify-center gap-y-6 px-4 transition-opacity duration-500"
            style={{ opacity: hasSlide ? 1 : 1, pointerEvents: hasSlide ? 'auto' : 'none' }}
          >
            {activeSlide && (
              <div key={activeSlide.path} className="flex flex-col items-center gap-y-6">
                <h1 className="text-center text-size-3xl font-bold text-white transition-all duration-300 md:text-heading-2 dark:text-black">
                  {t(activeSlide.titleKey)}
                </h1>
                <SearchButton
                  variant="hero"
                  placeholder={t(activeSlide.searchPlaceholderKey)}
                  className="line-clamp-1 flex h-11 w-full max-w-[400px] items-center justify-start gap-x-2 rounded-full bg-white px-4 text-size-sm font-normal text-gray-600 shadow-lg sm:max-w-[560px] md:h-13 md:w-[560px] md:text-size dark:bg-black"
                />
              </div>
            )}
          </div>

          <div
            className="absolute inset-0 z-30 bg-gradient-to-b from-[#000] to-[#030712] transition-opacity duration-500"
            style={{ opacity: hasSlide ? 0.5 : 1 }}
          />

          <div
            className="absolute bottom-0 left-0 z-32 w-full px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <ExtendedNavigationTabs />
          </div>
        </div>
      </div>
    </>
  )
}

// Extended Navigation Component
function ExtendedNavigationTabs() {
  const { href } = Route.useLoaderData()
  const { t } = useTranslation('layout-header')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const navigationTabs: NavTab[] = useMemo(
    () => [
      {
        path: '',
        icon: 'app/explore',
        labelKey: 'nav.explore',
        to: '/$lang',
        exact: true,
        preload: 'viewport',
      },
      {
        path: 'tours',
        icon: 'app/tours',
        labelKey: 'nav.tours',
        to: '/$lang/tours',
        preload: 'viewport',
      },
      {
        path: 'activities',
        icon: 'app/tickets',
        labelKey: 'nav.activities',
        to: '/$lang/activities',
        preload: 'viewport',
        mobileExtend: true,
      },
      {
        path: 'hotels',
        icon: 'app/hotels',
        labelKey: 'nav.hotels',
        to: '/$lang/hotels',
        preload: 'viewport',
      },
      {
        path: 'safari-tour',
        icon: 'app/safari',
        labelKey: 'nav.safari_tour',
        to: '/$lang/safari-tour',
        preload: 'viewport',
        mobileExtend: true,
      },
      {
        path: 'rent-a-car',
        icon: 'app/car-rental',
        labelKey: 'nav.rent_a_car',
        to: '/$lang/rent-a-car',
        preload: 'viewport',
        mobileExtend: true,
      },
      {
        path: 'transfer',
        icon: 'app/transfer',
        labelKey: 'nav.transfer',
        to: '/$lang/transfer',
        preload: 'viewport',
        mobileExtend: true,
      },
      {
        path: 'flights',
        icon: 'app/flight',
        labelKey: 'nav.flight',
        to: '/$lang/flights',
        preload: 'viewport',
        mobileExtend: true,
      },
      // Extended tabs - sadece ilgili sayfalarda görünür
      {
        path: 'yacht',
        icon: 'app/yacht',
        labelKey: 'nav.yacht',
        to: '/$lang/yacht',
        preload: false,
        extended: true,
      },
      {
        path: 'guide/visa',
        icon: 'app/visa',
        labelKey: 'nav.visa',
        to: '/$lang/guide/visa',
        preload: false,
        extended: true,
      },
      {
        path: 'guide/sim-card',
        icon: 'app/sim-card',
        labelKey: 'nav.sim_card',
        to: '/$lang/guide/sim-card',
        preload: false,
        extended: true,
      },
      {
        path: 'guide/restaurants',
        icon: 'app/restaurant',
        labelKey: 'nav.restaurants',
        to: '/$lang/guide/restaurants',
        preload: false,
        extended: true,
      },
      {
        path: 'guide/hospitals',
        icon: 'app/hospital',
        labelKey: 'nav.hospitals',
        to: '/$lang/guide/hospitals',
        preload: false,
        extended: true,
      },
      {
        path: 'guide/museums',
        icon: 'app/museum',
        labelKey: 'nav.museums',
        to: '/$lang/guide/museums',
        preload: false,
        extended: true,
      },
      {
        path: 'guide/bundles',
        icon: 'app/bundles',
        labelKey: 'nav.bundles',
        to: '/$lang/guide/bundles',
        preload: false,
        extended: true,
      },
    ],
    [],
  )

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const activeLink = scrollContainer.querySelector<HTMLElement>('[data-status="active"]')

    if (activeLink) {
      activeLink.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [href])

  return (
    <nav
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      className="mx-auto flex h-full w-full max-w-main"
      data-theme="force-main"
    >
      <div
        ref={scrollContainerRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="scrollbar-hide flex h-full snap-x snap-mandatory items-center justify-start overflow-x-auto text-size-sm font-semibold"
      >
        {navigationTabs.map((tab) => {
          const isVisible = !tab.extended || (tab.extended && href.includes(tab.path))

          return (
            <Link
              key={tab.to as string}
              to={tab.to}
              activeOptions={{ exact: tab.exact }}
              preload={'viewport'}
              resetScroll={false}
              data-visible={isVisible}
              className={twMerge(
                'group hidden h-12 w-fit items-center justify-center gap-x-2 px-4 py-3 text-center font-bold text-nowrap text-white transition-colors duration-300 ease-in hover:bg-white/20 data-[status=active]:bg-white data-[status=active]:text-btn-primary data-[visible=true]:flex sm:min-w-[calc(1120px/9)]',
              )}
            >
              <Icon
                name={tab.icon}
                className="size-5 shrink-0 text-on-box-white group-data-[status=active]:text-gray-700"
              />
              {t(tab.labelKey)}
            </Link>
          )
        })}
      </div>

      {/* Her Zaman Görünür Olan "All" Butonu */}
      <Link
        to="/$lang/guide"
        activeOptions={{ exact: true }}
        preload={'render'}
        resetScroll={false}
        className="group flex h-12 w-fit flex-shrink-0 items-center justify-center gap-x-2 px-4 text-center font-bold text-nowrap text-white transition-colors duration-300 ease-in hover:bg-white/20 data-[status=active]:bg-white data-[status=active]:text-btn-primary sm:min-w-[calc(1120px/9)]"
      >
        <Icon
          name="app/all"
          className="size-4 shrink-0 text-on-box-white group-data-[status=active]:text-gray-700"
        />
        {t('nav.all')}
      </Link>
    </nav>
  )
}

const getActiveSlideIndex = (href: string, configs: SlideConfig[]): number | null => {
  try {
    const url = href.startsWith('http') ? new URL(href) : new URL(href, 'http://localhost')
    const pathSegments = url.pathname
      .split('/')
      .filter((segment) => segment !== '' && segment.length > 2)
    if (pathSegments.length > 1) return null
    const targetPath = pathSegments.length === 0 ? '' : pathSegments[0]
    const match = configs.find((slide) => slide.path === targetPath)
    return match ? match.index : null
  } catch {
    return null
  }
}
