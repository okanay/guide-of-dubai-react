import React, { useState, useRef, useEffect } from 'react'
import { BaseInput } from './base-input'
import { DropdownPortal } from './dropdown-portal'
import { twMerge } from 'tailwind-merge'
import { ChevronDown } from 'lucide-react'

interface Option {
  value: string
  label: string
}

export interface SearchableSelectProps
  extends Omit<React.ComponentProps<'input'>, 'onChange' | 'type' | 'value'> {
  label?: string
  placeholder?: string
  options: Option[]
  value?: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  className?: string
  dropdownClassName?: string
  noResultsText?: string
}

export const SearchableSelect = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  required,
  className,
  dropdownClassName,
  noResultsText = 'Sonuç bulunamadı.',
  id,
  ...inputProps
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleDropdownClose = () => {
    setIsOpen(false)
    setSearchTerm('')
  }

  // Seçim değiştiğinde input'taki yazıyı güncelle
  useEffect(() => {
    if (selectedOption && !isOpen) {
      setSearchTerm(selectedOption.label)
    }
  }, [selectedOption, isOpen])

  // Input açık değilken seçili değeri göster
  const displayValue = isOpen ? searchTerm : selectedOption?.label || ''

  return (
    <BaseInput htmlFor={id} label={label} error={error} required={required} className={className}>
      <div className="relative">
        <input
          {...inputProps}
          id={id}
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={twMerge(
            'w-full appearance-none rounded-xs border bg-box-surface px-3 py-2 pr-10 text-size transition-colors',
            'border-gray-300 text-on-box-black',
            'placeholder:text-gray-500',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
            error && 'border-error-500',
          )}
        />

        {/* Chevron Down Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown
            className={twMerge(
              'h-4 w-4 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180',
              error && 'text-error-400',
            )}
          />
        </div>

        <DropdownPortal
          isOpen={isOpen}
          triggerRef={inputRef}
          onClose={handleDropdownClose}
          placement="bottom-start"
          className={twMerge(
            'z-50 max-h-60 w-full overflow-auto rounded-xs bg-box-surface py-1 shadow-lg ring-1 ring-gray-200 focus:outline-none',
            dropdownClassName,
          )}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={twMerge(
                  'relative w-full cursor-pointer py-2 pr-4 pl-4 text-left transition-colors select-none',
                  'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                  option.value === value && 'bg-primary-50 text-primary-600',
                )}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">{noResultsText}</div>
          )}
        </DropdownPortal>
      </div>
    </BaseInput>
  )
}

SearchableSelect.displayName = 'SearchableSelect'
