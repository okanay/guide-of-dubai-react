import { useEffect } from 'react'
import { useHeader } from '../store'
import { Link } from 'src/i18n/router/link'
import { useTranslation } from 'react-i18next'
import { LinkProps } from '@tanstack/react-router'
import useClickOutside from '@/hooks/use-click-outside'

// Category data interface
export interface CategoryItem {
  id: string
  titleKey: string
  descriptionKey: string
  image: string
  href: LinkProps['to']
  detailLinkKey: string
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'dubai-visa',
    titleKey: 'categories.dubai_visa.title',
    descriptionKey: 'categories.dubai_visa.description',
    image: '/images/public/categories/visa.png',
    href: '/$lang/visa',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'safari-tour',
    titleKey: 'categories.safari_tour.title',
    descriptionKey: 'categories.safari_tour.description',
    image: '/images/public/categories/safari-tour.png',
    href: '/$lang/safari-tour',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'activities',
    titleKey: 'categories.activities.title',
    descriptionKey: 'categories.activities.description',
    image: '/images/public/categories/activities.png',
    href: '/$lang/activities',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'tours',
    titleKey: 'categories.tours.title',
    descriptionKey: 'categories.tours.description',
    image: '/images/public/categories/tours.png',
    href: '/$lang/tours',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'hotels',
    titleKey: 'categories.hotels.title',
    descriptionKey: 'categories.hotels.description',
    image: '/images/public/categories/hotels.png',
    href: '/$lang/hotels',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'rent-a-car',
    titleKey: 'categories.rent_a_car.title',
    descriptionKey: 'categories.rent_a_car.description',
    image: '/images/public/categories/rent-a-car.png',
    href: '/$lang/rent-a-car',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'sim-cards',
    titleKey: 'categories.sim_cards.title',
    descriptionKey: 'categories.sim_cards.description',
    image: '/images/public/categories/sim-cards.png',
    href: '/$lang/sim-cards',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'hospitals',
    titleKey: 'categories.hospitals.title',
    descriptionKey: 'categories.hospitals.description',
    image: '/images/public/categories/hospitals.png',
    href: '/$lang/hospitals',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'restaurants',
    titleKey: 'categories.restaurants.title',
    descriptionKey: 'categories.restaurants.description',
    image: '/images/public/categories/restaurants.png',
    href: '/$lang/restaurants',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'flights',
    titleKey: 'categories.flights.title',
    descriptionKey: 'categories.flights.description',
    image: '/images/public/categories/flights.png',
    href: '/$lang/flights',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'yacht',
    titleKey: 'categories.yachts.title',
    descriptionKey: 'categories.yachts.description',
    image: '/images/public/categories/yachts.png',
    href: '/$lang/yachts',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'transfer',
    titleKey: 'categories.transfer.title',
    descriptionKey: 'categories.transfer.description',
    image: '/images/public/categories/transfer.png',
    href: '/$lang/transfer',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'hospitals-unknow',
    titleKey: 'categories.hospitals_unknow.title',
    descriptionKey: 'categories.hospitals_unknow.description',
    image: '/images/public/categories/hospitals.png',
    href: '/$lang/hospitals',
    detailLinkKey: 'categories.detail_link',
  },
  {
    id: 'museums',
    titleKey: 'categories.museums.title',
    descriptionKey: 'categories.museums.description',
    image: '/images/public/categories/museums.png',
    href: '/$lang/museums',
    detailLinkKey: 'categories.detail_link',
  },
]

export function CategoriesDropdown() {
  const { isCategoriesOpen, closeCategories } = useHeader()

  const dropdownRef = useClickOutside<HTMLDivElement>(
    closeCategories,
    true,
    undefined,
    'categories-button',
  )

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCategoriesOpen) {
        closeCategories()
      }
    }

    if (isCategoriesOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isCategoriesOpen, closeCategories])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCategories}
        aria-hidden="true"
        data-status={isCategoriesOpen ? 'active' : 'closed'}
        data-theme="force-main"
        className="fixed inset-0 z-30 bg-black/50 transition-all duration-300 ease-in-out data-[status=active]:pointer-events-auto data-[status=active]:opacity-100 data-[status=closed]:pointer-events-none data-[status=closed]:opacity-0"
      />

      {/* Dropdown Container */}
      <div
        ref={dropdownRef}
        data-status={isCategoriesOpen ? 'active' : 'closed'}
        className="absolute top-0 left-0 z-40 max-h-[560px] w-full origin-top overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out data-[status=active]:pointer-events-auto data-[status=active]:translate-y-0 data-[status=active]:scale-y-100 data-[status=active]:opacity-100 data-[status=closed]:pointer-events-none data-[status=closed]:-translate-y-4 data-[status=closed]:scale-y-95 data-[status=closed]:opacity-0"
      >
        <div className="mt-16 max-h-[560px] w-full origin-top overflow-y-auto bg-white [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:hover:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
          <div
            data-status={isCategoriesOpen ? 'active' : 'closed'}
            className="mx-auto h-full max-w-8xl overflow-x-hidden overflow-y-auto scroll-smooth px-6 pb-20 transition-all duration-500 ease-out data-[status=active]:translate-y-0 data-[status=active]:opacity-100 data-[status=active]:delay-150 data-[status=closed]:translate-y-2 data-[status=closed]:opacity-0"
          >
            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {CATEGORIES.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  isOpen={isCategoriesOpen}
                  onClose={closeCategories}
                />
              ))}
            </div>

            {/* Gradient Bottom */}
            <div className="pointer-events-none sticky right-0 bottom-0 left-0 z-10 mt-4 h-4 bg-gradient-to-t from-white via-white to-transparent" />
          </div>
        </div>
      </div>
    </>
  )
}

// Category Card Component
interface CategoryCardProps {
  category: CategoryItem
  index: number
  isOpen: boolean
  onClose: () => void
}

function CategoryCard({ category, index, isOpen, onClose }: CategoryCardProps) {
  const { t } = useTranslation('layout-header')

  return (
    <Link
      to={category.href}
      data-status={isOpen ? 'active' : 'closed'}
      style={{
        transitionDelay: isOpen ? `${index * 20}ms` : '0ms',
      }}
      className="group flex cursor-pointer items-start gap-x-4 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 data-[status=active]:translate-y-0 data-[status=active]:opacity-100 data-[status=closed]:translate-y-4 data-[status=closed]:opacity-0"
      onClick={onClose}
    >
      {/* Category Image */}
      <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xs bg-primary-100 transition-all duration-200 group-hover:bg-primary-200">
        <img
          src={category.image}
          alt={t(category.titleKey)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Category Content */}
      <div className="flex h-full flex-col justify-between gap-y-4">
        <div className="text-start">
          <h3 className="text-size font-medium text-on-box-black transition-colors duration-200 group-hover:text-primary-700">
            {t(category.titleKey)}
          </h3>
          <p className="line-clamp-2 text-size-xs text-on-box-black transition-colors duration-200 group-hover:text-gray-700">
            {t(category.descriptionKey)}
          </p>
        </div>

        {/* Detail Link */}
        <span className="inline-flex items-center gap-1 text-size-xs text-btn-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary-600">
          {t(category.detailLinkKey)}
          <svg
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
