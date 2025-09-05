import { twMerge } from 'tailwind-merge'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  id?: string
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  options: SelectOption[]
  className?: string
  [key: string]: any
}

export function Select({
  id,
  label,
  placeholder,
  error,
  required,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={twMerge('space-y-2', className)}>
      {label && (
        <label htmlFor={id} className="block text-body font-medium text-on-box-black">
          {label}
          {required && <span className="ml-1 text-error-500">*</span>}
        </label>
      )}

      <select
        {...props}
        id={id}
        className={twMerge(
          'w-full rounded-xs border-2 px-3 py-2.5 text-body transition-colors',
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
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-body-sm text-error-500">{error}</p>}
    </div>
  )
}
