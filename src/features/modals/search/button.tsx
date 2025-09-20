import React from 'react'
import Icon from 'src/components/icon'
import { useTranslation } from 'react-i18next'
import { useGlobalModalStore, useSearchModalGlobal } from '@/features/modals/global/store'

interface SearchButtonProps {
  variant?: 'icon' | 'hero'
  placeholder?: string
  className?: string
}

export function SearchButton({ variant = 'icon', placeholder, className = '' }: SearchButtonProps) {
  const { open } = useGlobalModalStore()
  const { t } = useTranslation('layout-header')

  const defaultPlaceholder = placeholder || t('buttons.search')

  const handleOpenSearch = () => {
    open('search', { replace: false })
  }

  if (variant === 'hero') {
    return (
      <button
        onClick={handleOpenSearch}
        className={`line-clamp-1 flex items-center gap-x-2 text-start ${className}`}
        aria-label={t('buttons.search')}
      >
        <Icon name="search" className="size-6" />
        <span className="line-clamp-1">{defaultPlaceholder}</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleOpenSearch}
      className="mr-2 rounded-full border border-[#ffffff] bg-transparent px-2 py-2 text-[#ffffff] transition-colors duration-300 ease-in-out group-data-[color=invert]/h:border-[#000] group-data-[color=invert]/h:text-[#000] hover:bg-btn-primary-hover hover:text-on-btn-primary focus:bg-btn-primary-focus focus:text-on-btn-primary group-data-[color=invert]/h:dark:border-[#fff] group-data-[color=invert]/h:dark:text-[#fff]"
      aria-label={t('buttons.search')}
    >
      <Icon name="search" className="size-4.5" />
    </button>
  )
}
