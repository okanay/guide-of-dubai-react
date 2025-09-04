import { useRef } from 'react'
import { useHeader } from '../store'
import { Link } from 'src/i18n/router/link'

export function CategoriesDropdown() {
  const { isCategoriesOpen, closeCategories } = useHeader()
  const dropdownRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        onClick={closeCategories}
        aria-hidden="true"
        data-status={isCategoriesOpen ? 'active' : 'closed'}
        className="fixed inset-0 z-30 bg-black/50 transition-all duration-300 ease-in-out data-[status=active]:pointer-events-auto data-[status=active]:opacity-100 data-[status=closed]:pointer-events-none data-[status=closed]:opacity-0"
      />

      <div
        data-status={isCategoriesOpen ? 'active' : 'closed'}
        ref={dropdownRef}
        className="absolute top-0 left-0 z-40 max-h-[560px] w-full origin-top overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out data-[status=active]:pointer-events-auto data-[status=active]:translate-y-0 data-[status=active]:scale-y-100 data-[status=active]:opacity-100 data-[status=closed]:pointer-events-none data-[status=closed]:-translate-y-4 data-[status=closed]:scale-y-95 data-[status=closed]:opacity-0"
      >
        <div className="mt-16 max-h-[560px] w-full origin-top overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:hover:bg-gray-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
          <div
            data-status={isCategoriesOpen ? 'active' : 'closed'}
            className="mx-auto h-full max-w-8xl overflow-x-hidden overflow-y-auto scroll-smooth px-6 pb-20 transition-all duration-500 ease-out data-[status=active]:translate-y-0 data-[status=active]:opacity-100 data-[status=active]:delay-150 data-[status=closed]:translate-y-2 data-[status=closed]:opacity-0"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
              {Array.from({ length: 14 }).map((_, index) => (
                <Link
                  to={'/$lang/not-found'}
                  key={index}
                  data-status={isCategoriesOpen ? 'active' : 'closed'}
                  style={{
                    transitionDelay: isCategoriesOpen ? `${index * 30}ms` : '0ms',
                  }}
                  className="group flex cursor-pointer items-start gap-x-4 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 data-[status=active]:translate-y-0 data-[status=active]:opacity-100 data-[status=closed]:translate-y-4 data-[status=closed]:opacity-0"
                >
                  <div className="flex h-24 w-20 shrink-0 items-center justify-center bg-primary-100 transition-all duration-200 group-hover:bg-primary-200" />

                  <div className="flex h-full flex-col justify-between gap-y-4">
                    <div className="text-start">
                      <h3 className="text-size font-medium text-on-box-black transition-colors duration-200 group-hover:text-primary-700">
                        Kategori {index + 1}
                      </h3>
                      <p className="line-clamp-2 text-size-xs text-on-box-black transition-colors duration-200 group-hover:text-gray-700">
                        Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-size-xs text-btn-primary transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary-600">
                      Detaya Git
                      <svg
                        className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="pointer-events-none sticky right-0 bottom-0 left-0 z-10 mt-4 h-4 bg-gradient-to-t from-white via-white to-transparent" />
          </div>
        </div>
      </div>
    </>
  )
}
