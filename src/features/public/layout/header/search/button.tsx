// src/features/public/layout/header/search/button.tsx
import { Search } from 'lucide-react'
import { useSearchModal } from './store'

interface SearchButtonProps {
  variant?: 'icon' | 'hero'
  placeholder?: string
  className?: string
}

export function SearchButton({
  variant = 'icon',
  placeholder = 'Ara...',
  className = '',
}: SearchButtonProps) {
  const { openModal } = useSearchModal()

  if (variant === 'hero') {
    return (
      <button
        onClick={() => openModal()}
        className={`flex items-center gap-x-2 ${className}`}
        aria-label="Arama yap"
      >
        <Search size={18} />
        <span>{placeholder}</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => openModal()}
      className="mr-2 rounded-full border border-[#ffffff] bg-transparent px-2 py-2 text-[#ffffff] transition-colors duration-300 ease-in-out hover:bg-btn-primary-hover hover:text-on-btn-primary focus:bg-btn-primary-focus focus:text-on-btn-primary"
      aria-label="Arama yap"
    >
      <Search size={18} />
    </button>
  )
}
