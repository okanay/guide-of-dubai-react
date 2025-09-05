import { twMerge } from 'tailwind-merge'
import { ChevronDown } from 'lucide-react'
import { BaseInput } from './base-input'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface Props extends Omit<React.ComponentProps<'select'>, 'onChange'> {
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  ref?: React.RefObject<HTMLSelectElement> | React.RefCallback<HTMLSelectElement> | null
}

export const Select = ({
  id,
  label,
  placeholder,
  error,
  required,
  options,
  value,
  onChange,
  className,
  ref,
  ...props
}: Props) => {
  return (
    <BaseInput htmlFor={id} label={label} error={error} required={required} className={className}>
      <div className="relative">
        <select
          {...props}
          ref={ref}
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={twMerge(
            'w-full appearance-none rounded-xs border-2 px-3 py-1.5 pr-10 text-body transition-colors',
            'border-gray-300 bg-white text-on-box-black',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
            'disabled:bg-gray-100 disabled:opacity-50',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Down Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDown
            className={twMerge(
              'h-4 w-4 text-gray-400 transition-colors',
              error && 'text-error-400',
            )}
          />
        </div>
      </div>
    </BaseInput>
  )
}
