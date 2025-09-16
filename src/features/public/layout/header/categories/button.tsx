import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import { useHeader } from '../store'
import { useTranslation } from 'react-i18next'

export function CategoriesButton() {
  const { toggleCategories, isCategoriesOpen } = useHeader()
  const { t } = useTranslation('layout-header')

  // Button referansını categories dropdown'a geçirmek için
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <button
      id="categories-button"
      ref={buttonRef}
      onClick={toggleCategories}
      data-state={isCategoriesOpen ? 'open' : 'closed'}
      className="group btn-default -mr-1 flex items-center rounded-full px-2 py-1 data-[state=open]:bg-white data-[state=open]:text-on-box-black"
      aria-label={t('buttons.all_categories')}
      aria-expanded={isCategoriesOpen}
    >
      <span>{t('buttons.all_categories')}</span>
      <ChevronDown
        className={`ml-2 rounded-full text-primary-500 transition-all duration-300 ease-in-out group-hover:bg-btn-primary group-hover:text-on-btn-primary group-focus:bg-btn-primary-focus group-focus:text-on-btn-primary hover:bg-btn-primary-hover ${
          isCategoriesOpen ? 'rotate-180' : 'rotate-0'
        }`}
        size={16}
      />
    </button>
  )
}
