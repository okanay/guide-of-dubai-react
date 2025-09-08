import React, { useState, useRef, useEffect } from 'react'
import { BaseInput } from './base-input'
import useClickOutside from 'src/hooks/use-click-outside'
import { twMerge } from 'tailwind-merge'

interface Option {
  value: string
  label: string
}

export interface SearchableSelectProps extends Omit<React.ComponentProps<'select'>, 'onChange'> {
  label?: string
  placeholder?: string
  options: Option[]
  value?: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export const SearchableSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  required,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false), true)

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  // Seçim değiştiğinde input'taki yazıyı güncelle
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label)
    }
  }, [selectedOption])

  return (
    <BaseInput htmlFor="searchable-select" label={label} error={error} required={required}>
      <div ref={containerRef} className="relative">
        <input
          type="text"
          value={isOpen ? searchTerm : selectedOption?.label || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={twMerge(
            'w-full appearance-none rounded-xs border bg-box-surface px-3 py-2 text-size transition-colors',
            'border-gray-300 text-on-box-black',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
            error && 'border-error-500',
          )}
        />
        {isOpen && (
          <div className="absolute z-999 mt-1 max-h-60 w-full overflow-auto rounded-xs bg-white py-1 text-base shadow-lg ring-1 ring-gray-200 focus:outline-none sm:text-sm">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="relative cursor-pointer py-2 pr-4 pl-4 select-none hover:bg-gray-100"
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">Sonuç bulunamadı.</div>
            )}
          </div>
        )}
      </div>
    </BaseInput>
  )
}
