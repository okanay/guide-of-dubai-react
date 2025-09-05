import { Link } from 'src/i18n/router/link'
import { SearchButton } from '../search/button'
import { LinkProps } from '@tanstack/react-router'
import { Route } from 'src/routes/$lang/_public/route'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

interface SlideConfig {
  path: string
  imageSrc: string
  imageAlt: string
  title: string
  searchPlaceholder: string
}

const slideConfigs: SlideConfig[] = [
  {
    path: '',
    imageSrc: '/images/public/header/explore.jpg',
    imageAlt: 'Dubai Frame manzarası',
    title: "Dubai'de Dubai Frame'i keşfet",
    searchPlaceholder: 'Keşif yapmak istediğiniz yer veya aktiviteyi arayın...',
  },
  {
    path: 'tours',
    imageSrc: '/images/public/header/tours.jpg',
    imageAlt: 'Dubai Turları manzarası',
    title: 'Dubai Turlarını Keşfedin',
    searchPlaceholder: 'Keşfetmek istediğiniz turu veya etkinliği arayın...',
  },
  {
    path: 'tickets',
    imageSrc: '/images/public/header/tours.jpg',
    imageAlt: 'Dubai Biletleri manzarası',
    title: 'Dubai Biletlerini Keşfedin',
    searchPlaceholder: 'Bilet almak istediğiniz yer veya etkinliği arayın...',
  },
  {
    path: 'hotels',
    imageSrc: '/images/public/header/hotels.png',
    imageAlt: 'Dubai Otelleri manzarası',
    title: 'Dubai Otellerini Keşfedin',
    searchPlaceholder: 'Konaklama yapmak istediğiniz oteli arayın...',
  },
  {
    path: 'safari-tour',
    imageSrc: '/images/public/header/safari.jpg',
    imageAlt: 'Dubai Safari Turu manzarası',
    title: 'Dubai Safari Turlarını Keşfedin',
    searchPlaceholder: 'Katılmak istediğiniz safari turunu arayın...',
  },
  {
    path: 'rent-a-car',
    imageSrc: '/images/public/header/rent-a-car.jpg',
    imageAlt: 'Dubai Araç Kiralama manzarası',
    title: 'Dubai’de Araç Kiralayın',
    searchPlaceholder: 'Kiralık araç seçeneklerini arayın...',
  },
  {
    path: 'transfer',
    imageSrc: '/images/public/header/transfer.jpg',
    imageAlt: 'Dubai Transfer Hizmetleri manzarası',
    title: 'Dubai Transferlerini Keşfedin',
    searchPlaceholder: 'Transfer seçeneklerini arayın...',
  },
  {
    path: 'all',
    imageSrc: '/images/public/header/explore.jpg',
    imageAlt: 'Dubai Genel manzarası',
    title: 'Dubai’de Her Şeyi Keşfedin',
    searchPlaceholder: 'Herhangi bir yer veya aktiviteyi arayın...',
  },
]

export const PublicHeaderBackground = () => {
  const { href } = Route.useLoaderData()

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
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={'eager'}
                    fetchPriority={'high'}
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
                  {activeSlide.title}
                </h1>
                <SearchButton
                  variant="hero"
                  placeholder={activeSlide.searchPlaceholder}
                  className="flex h-11 w-[366px] items-center justify-start gap-x-2 rounded-full bg-white px-4 text-size-sm font-normal text-gray-600 shadow-lg md:h-13 md:w-[560px] md:text-size dark:bg-black"
                />
              </>
            )}
          </div>

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 z-30 bg-gradient-to-b from-black to-gray-950 opacity-50 transition-opacity duration-500 data-[slide=false]:opacity-0"
            data-slide={hasSlide}
          />

          {/* Navigation Tabs */}
          <div className="absolute -bottom-px left-0 z-32 w-full">
            <nav className="mx-auto flex w-full max-w-7xl items-center justify-start overflow-x-auto text-size-sm font-semibold [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden">
              <NavigationTab to="/$lang" icon={ExploreIcon} label="Keşfet" className="flex" />
              <NavigationTab to="/$lang/tours" icon={ToursIcon} label="Turlar" className="flex" />
              <NavigationTab
                to="/$lang/tickets"
                icon={TicketsIcon}
                label="Aktiviteler"
                className="hidden sm:flex"
              />
              <NavigationTab
                to="/$lang/hotels"
                icon={HotelsIcon}
                label="Oteller"
                className="flex"
              />
              <NavigationTab
                to="/$lang/safari-tour"
                icon={SafariIcon}
                label="Safari Turu"
                className="hidden sm:flex"
              />
              <NavigationTab
                to="/$lang/rent-a-car"
                icon={CarRentalIcon}
                label="Araç Kirala"
                className="hidden sm:flex"
              />
              <NavigationTab
                to="/$lang/hotels"
                icon={AccommodationIcon}
                label="Konaklama"
                className="hidden sm:flex"
              />
              <NavigationTab
                to="/$lang/transfer"
                icon={TransferIcon}
                label="Transfer"
                className="hidden sm:flex"
              />
              <NavigationTab to="/$lang/all" icon={AllIcon} label="Tümü" className="flex" />
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
  icon: React.FC<{ className?: string }>
  label: string
  className?: string
}

function NavigationTab({ to, icon: Icon, label, className }: NavigationTabProps) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      preload={'render'}
      className={twMerge(
        'group shrink-0 items-center gap-x-2 px-6 py-3 text-white transition-colors duration-300 ease-in hover:bg-white/20 data-[status=active]:bg-white data-[status=active]:text-btn-primary sm:min-w-[132px] dark:text-black data-[status=active]:dark:bg-black',
        className,
      )}
    >
      <Icon className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700" />
      {label}
    </Link>
  )
}

const getActiveSlideIndex = (href: string): number | null => {
  try {
    const url = href.startsWith('http') ? new URL(href) : new URL(href, 'http://localhost')
    const pathSegments = url.pathname.split('/').filter((segment) => segment !== '')

    if (pathSegments.length >= 3) return null

    const targetPath = pathSegments.length === 1 ? '' : pathSegments[1]
    const slideIndex = slideConfigs.findIndex((slide) => slide.path === targetPath)

    return slideIndex >= 0 ? slideIndex : null
  } catch {
    return null
  }
}

// Icon Components (basitleştirilmiş)
const ExploreIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
    <path
      d="M3.86084 13.5837L10.1108 10.667L13.0275 4.41699L6.77751 7.33366L3.86084 13.5837ZM8.44417 9.83366C8.20806 9.83366 8.01015 9.7538 7.85042 9.59408C7.6907 9.43435 7.61084 9.23644 7.61084 9.00033C7.61084 8.76422 7.6907 8.5663 7.85042 8.40658C8.01015 8.24685 8.20806 8.16699 8.44417 8.16699C8.68029 8.16699 8.8782 8.24685 9.03792 8.40658C9.19765 8.5663 9.27751 8.76422 9.27751 9.00033C9.27751 9.23644 9.19765 9.43435 9.03792 9.59408C8.8782 9.7538 8.68029 9.83366 8.44417 9.83366ZM8.44417 17.3337C7.2914 17.3337 6.20806 17.1149 5.19417 16.6774C4.18028 16.2399 3.29834 15.6462 2.54834 14.8962C1.79834 14.1462 1.20459 13.2642 0.76709 12.2503C0.32959 11.2364 0.11084 10.1531 0.11084 9.00033C0.11084 7.84755 0.32959 6.76421 0.76709 5.75033C1.20459 4.73644 1.79834 3.85449 2.54834 3.10449C3.29834 2.35449 4.18028 1.76074 5.19417 1.32324C6.20806 0.885742 7.2914 0.666992 8.44417 0.666992C9.59695 0.666992 10.6803 0.885742 11.6942 1.32324C12.7081 1.76074 13.59 2.35449 14.34 3.10449C15.09 3.85449 15.6838 4.73644 16.1213 5.75033C16.5588 6.76421 16.7775 7.84755 16.7775 9.00033C16.7775 10.1531 16.5588 11.2364 16.1213 12.2503C15.6838 13.2642 15.09 14.1462 14.34 14.8962C13.59 15.6462 12.7081 16.2399 11.6942 16.6774C10.6803 17.1149 9.59695 17.3337 8.44417 17.3337Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)

const ToursIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
    <path
      d="M4.99951 18.3337V1.66699H6.66618V3.33366H18.3328L16.6662 7.50033L18.3328 11.667H6.66618V18.3337H4.99951ZM11.2495 9.16699C11.7078 9.16699 12.1002 9.0038 12.4266 8.67741C12.753 8.35102 12.9162 7.95866 12.9162 7.50033C12.9162 7.04199 12.753 6.64963 12.4266 6.32324C12.1002 5.99685 11.7078 5.83366 11.2495 5.83366C10.7912 5.83366 10.3988 5.99685 10.0724 6.32324C9.74604 6.64963 9.58285 7.04199 9.58285 7.50033C9.58285 7.95866 9.74604 8.35102 10.0724 8.67741C10.3988 9.0038 10.7912 9.16699 11.2495 9.16699Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)

const TicketsIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
    <path
      d="M6.88867 10.333L9.22201 8.58301L11.5137 10.333L10.6387 7.49967L12.972 5.66634H10.1387L9.22201 2.83301L8.30534 5.66634H5.47201L7.76367 7.49967L6.88867 10.333ZM0.888672 13.6663V8.66634C1.34701 8.66634 1.73937 8.50315 2.06576 8.17676C2.39214 7.85037 2.55534 7.45801 2.55534 6.99967C2.55534 6.54134 2.39214 6.14898 2.06576 5.82259C1.73937 5.4962 1.34701 5.33301 0.888672 5.33301V0.333008H17.5553V5.33301C17.097 5.33301 16.7046 5.4962 16.3783 5.82259C16.0519 6.14898 15.8887 6.54134 15.8887 6.99967C15.8887 7.45801 16.0519 7.85037 16.3783 8.17676C16.7046 8.50315 17.097 8.66634 17.5553 8.66634V13.6663H0.888672Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)

const HotelsIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
    <g clipPath="url(#clip0_122_18289)">
      <path
        d="M14.0273 12.0837L17.194 9.37533L19.694 9.58366L16.0273 12.7712L17.1107 17.5003L14.9857 16.2087L14.0273 12.0837ZM12.069 6.00033L11.194 3.95866L12.1523 1.66699L14.069 6.18783L12.069 6.00033ZM3.71484 17.5003L5.06901 11.6462L0.527344 7.70866L6.52734 7.18783L8.86068 1.66699L11.194 7.18783L17.194 7.70866L12.6523 11.6462L14.0065 17.5003L8.86068 14.3962L3.71484 17.5003Z"
        className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
      />
    </g>
    <defs>
      <clipPath id="clip0_122_18289">
        <rect
          width="20"
          height="20"
          className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
          transform="translate(0.11084)"
        />
      </clipPath>
    </defs>
  </svg>
)

const SafariIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.3637 11.8931L16 12.1653V16H0V12.5056C1.53437 12.2539 3.08512 12.0921 4.63632 11.9835C4.63632 11.9835 9.46472 11.6059 13.3637 11.8927V11.8931Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M13.4661 6.10355L11.5571 2.81321H8V0.964244L8.03414 0.930164H8.93173V0H3.2954V0.930164H4.19299L4.22713 0.964244V2.81321H1.88621V5.1393L1.85207 5.17293H0V8.91676H1.85207L1.88621 8.95084V10.8003H3.80701C3.91534 11.0965 4.04734 11.3805 4.264 11.6141C4.36777 11.7259 4.46882 11.8322 4.59809 11.8936C5.66955 12.4011 6.81839 11.8209 6.81839 11.8209C7.01047 11.6391 7.20164 11.4419 7.32226 11.2015C7.35503 11.1356 7.45926 10.8143 7.49158 10.8034H10.406C10.4961 11.1206 10.655 11.396 10.8748 11.64L11 11.7531C11 11.7531 11.8311 12.3793 13.3637 11.8663L13.7233 11.4882C13.8826 11.2806 13.9791 11.0397 14.0797 10.8003H16V6.10355H13.4661ZM9.40919 3.76655H11.0114L12.3409 6.10355H9.40919V3.76655ZM2.81839 3.76655H5.62494L5.65908 3.80018V6.06947L5.62494 6.10355H2.81839V3.76655ZM5.88712 11.2433C4.53664 11.5714 4.26081 9.47159 5.58671 9.39979C6.74647 9.33754 6.94811 10.9857 5.88712 11.2433ZM8.47747 6.06947L8.44333 6.10355H6.59081V3.76655H8.44333M12.4779 11.2433C11.1552 11.5646 10.832 9.52475 12.1543 9.40024C13.294 9.293 13.5671 10.9788 12.4779 11.2433Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)

const CarRentalIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
    <path
      d="M5.88867 14.9997V16.6663H3.38867V9.16634L5.43034 3.33301H16.347L18.3887 9.16634V16.6663H15.8887V14.9997H5.88867ZM5.72201 7.49967H16.0553L15.1803 4.99967H6.59701L5.72201 7.49967ZM7.13867 12.4997C7.48589 12.4997 7.78103 12.3781 8.02409 12.1351C8.26714 11.892 8.38867 11.5969 8.38867 11.2497C8.38867 10.9025 8.26714 10.6073 8.02409 10.3643C7.78103 10.1212 7.48589 9.99967 7.13867 9.99967C6.79145 9.99967 6.49631 10.1212 6.25326 10.3643C6.0102 10.6073 5.88867 10.9025 5.88867 11.2497C5.88867 11.5969 6.0102 11.892 6.25326 12.1351C6.49631 12.3781 6.79145 12.4997 7.13867 12.4997ZM14.6387 12.4997C14.9859 12.4997 15.281 12.3781 15.5241 12.1351C15.7671 11.892 15.8887 11.5969 15.8887 11.2497C15.8887 10.9025 15.7671 10.6073 15.5241 10.3643C15.281 10.1212 14.9859 9.99967 14.6387 9.99967C14.2914 9.99967 13.9963 10.1212 13.7533 10.3643C13.5102 10.6073 13.3887 10.9025 13.3887 11.2497C13.3887 11.5969 13.5102 11.892 13.7533 12.1351C13.9963 12.3781 14.2914 12.4997 14.6387 12.4997Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)

const AccommodationIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 19 13" fill="none">
    <path
      d="M0.610352 12.833V0.333008H2.27702V8.66634H8.94368V1.99967H18.9437V12.833H17.277V10.333H2.27702V12.833H0.610352ZM5.61035 7.83301C4.91591 7.83301 4.32563 7.58995 3.83952 7.10384C3.35341 6.61773 3.11035 6.02745 3.11035 5.33301C3.11035 4.63856 3.35341 4.04829 3.83952 3.56217C4.32563 3.07606 4.91591 2.83301 5.61035 2.83301C6.3048 2.83301 6.89507 3.07606 7.38118 3.56217C7.8673 4.04829 8.11035 4.63856 8.11035 5.33301C8.11035 6.02745 7.8673 6.61773 7.38118 7.10384C6.89507 7.58995 6.3048 7.83301 5.61035 7.83301ZM5.61035 6.16634C5.84646 6.16634 6.04438 6.08648 6.2041 5.92676C6.36382 5.76704 6.44368 5.56912 6.44368 5.33301C6.44368 5.0969 6.36382 4.89898 6.2041 4.73926C6.04438 4.57954 5.84646 4.49967 5.61035 4.49967C5.37424 4.49967 5.17632 4.57954 5.0166 4.73926C4.85688 4.89898 4.77702 5.0969 4.77702 5.33301C4.77702 5.56912 4.85688 5.76704 5.0166 5.92676C5.17632 6.08648 5.37424 6.16634 5.61035 6.16634ZM5.61035 6.16634C5.37424 6.16634 5.17632 6.08648 5.0166 5.92676C4.85688 5.76704 4.77702 5.56912 4.77702 5.33301C4.77702 5.0969 4.85688 4.89898 5.0166 4.73926C5.17632 4.57954 5.37424 4.49967 5.61035 4.49967C5.84646 4.49967 6.04438 4.57954 6.2041 4.73926C6.36382 4.89898 6.44368 5.0969 6.44368 5.33301C6.44368 5.56912 6.36382 5.76704 6.2041 5.92676C6.04438 6.08648 5.84646 6.16634 5.61035 6.16634Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)

const TransferIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
    <path
      d="M7.33333 17.5003H4.83333V14.9587C4.58333 14.6809 4.38194 14.3719 4.22917 14.0316C4.07639 13.6913 4 13.3198 4 12.917V5.00033C4 3.84755 4.53472 3.0038 5.60417 2.46908C6.67361 1.93435 8.36111 1.66699 10.6667 1.66699C13.0556 1.66699 14.7639 1.92394 15.7917 2.43783C16.8194 2.95171 17.3333 3.80588 17.3333 5.00033V12.917C17.3333 13.3198 17.2569 13.6913 17.1042 14.0316C16.9514 14.3719 16.75 14.6809 16.5 14.9587V17.5003H14V15.8337H7.33333V17.5003ZM5.66667 8.33366H15.6667V5.83366H5.66667V8.33366ZM7.75 13.3337C8.09722 13.3337 8.39236 13.2121 8.63542 12.9691C8.87847 12.726 9 12.4309 9 12.0837C9 11.7364 8.87847 11.4413 8.63542 11.1982C8.39236 10.9552 8.09722 10.8337 7.75 10.8337C7.40278 10.8337 7.10764 10.9552 6.86458 11.1982C6.62153 11.4413 6.5 11.7364 6.5 12.0837C6.5 12.4309 6.62153 12.726 6.86458 12.9691C7.10764 13.2121 7.40278 13.3337 7.75 13.3337ZM13.5833 13.3337C13.9306 13.3337 14.2257 13.2121 14.4687 12.9691C14.7118 12.726 14.8333 12.4309 14.8333 12.0837C14.8333 11.7364 14.7118 11.4413 14.4687 11.1982C14.2257 10.9552 13.9306 10.8337 13.5833 10.8337C13.2361 10.8337 12.941 10.9552 12.6979 11.1982C12.4549 11.4413 12.3333 11.7364 12.3333 12.0837C12.3333 12.4309 12.4549 12.726 12.6979 12.9691C12.941 13.2121 13.2361 13.3337 13.5833 13.3337Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)

const AllIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M4.48715 0.666992V8.1481C4.48289 8.1481 4.45065 8.17323 4.40703 8.1737C3.17906 8.17892 1.95062 8.16611 0.722656 8.1718V0.666992C1.97765 0.666992 3.23311 0.666992 4.48715 0.666992Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M4.4873 0.666992C5.73376 0.666992 6.98164 0.666992 8.22809 0.666992V8.1481C6.98164 8.15284 5.73376 8.14193 4.48778 8.1481V0.666992H4.4873Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M13.6485 0.666992H9.9082V8.1481H13.6485V0.666992Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M17.3897 0.666992H13.6494V8.1481H17.3897V0.666992Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M4.48668 9.85208V17.3332C3.23216 17.3332 1.9767 17.3332 0.722656 17.3332V9.82837C1.95015 9.83406 3.17859 9.82126 4.40703 9.82647C4.45065 9.82647 4.48289 9.85208 4.48715 9.85208H4.48668Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M4.4873 9.85182C5.73376 9.85798 6.98164 9.84708 8.22762 9.85182V17.3329C6.98116 17.3329 5.73376 17.3329 4.4873 17.3329V9.85182Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M13.6485 9.85156H9.9082V17.3327H13.6485V9.85156Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
    <path
      d="M17.3897 9.85156H13.6494V17.3327H17.3897V9.85156Z"
      className="fill-[#F8F8F8] group-data-[status=active]:fill-gray-700"
    />
  </svg>
)
