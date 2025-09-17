import { useTranslation } from 'react-i18next'
import { CATEGORIES, CategoryItem } from '../../layout/header/categories/dropdown'
import { Link } from '@/i18n/router/link'
import Icon from '@/components/icon'

export const AllCategories = () => {
  const { t } = useTranslation('page-guides')

  return (
    <section className="bg-box-surface px-4 text-on-box-black">
      <div className="mx-auto max-w-main pt-6 pb-10">
        <header className="mb-4 flex items-start justify-between sm:items-center">
          <h2 className="text-size-2xl font-bold">{t('index.categories.title')}</h2>
        </header>

        <div className="relative">
          <div className="scrollbar-hide grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-x-4 gap-y-8 pb-4">
            {CATEGORIES.map((category, index) => (
              <div key={'guide' + category.titleKey} className="w-full min-w-[270px] shrink-0">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CategoryCard({ category }: { category: CategoryItem }) {
  const { t } = useTranslation('layout-header')

  return (
    <Link
      to={category.href}
      resetScroll={false}
      preload="intent"
      className="group flex h-full cursor-pointer items-start gap-x-4 rounded-xs border border-gray-50 pr-3 shadow-xs"
    >
      {/* Category Image */}
      <div className="flex h-full w-22 shrink-0 items-center justify-center overflow-hidden rounded-xs">
        <img
          src={category.image}
          alt={t(category.titleKey)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Category Content */}
      <div className="flex h-full flex-col justify-between gap-y-4 py-2">
        <div className="text-start">
          <h3 className="text-size font-medium text-on-box-black">{t(category.titleKey)}</h3>
          <p className="line-clamp-2 text-size-xs text-on-box-black">
            {t(category.descriptionKey)}
          </p>
        </div>

        {/* Detail Link */}
        <span className="mt-auto inline-flex items-center gap-1 text-size-xs text-btn-primary">
          {t(category.detailLinkKey)}
          <Icon
            name="chevron-right"
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  )
}
