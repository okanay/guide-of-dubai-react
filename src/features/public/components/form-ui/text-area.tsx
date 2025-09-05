import { twMerge } from 'tailwind-merge'
import { BaseInput } from './base-input'

interface TextAreaProps extends Omit<React.ComponentProps<'textarea'>, 'onChange'> {
  label?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  maxLength?: number
  description?: string
  rows?: number
  ref?: React.RefObject<HTMLTextAreaElement> | React.RefCallback<HTMLTextAreaElement> | null
}

export const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  maxLength,
  className,
  description,
  rows = 3,
  ref,
  ...props
}: TextAreaProps) => {
  return (
    <BaseInput
      htmlFor={props.id}
      label={label}
      error={error}
      required={required}
      className={className}
      description={description}
    >
      <div className="relative">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={twMerge(
            'w-full resize-y rounded-xs border px-3 py-2 text-sm transition-colors',
            'border-gray-300 bg-box-surface text-on-box-black',
            'placeholder:text-gray-500',
            'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
          )}
          {...props}
        />
        {maxLength && (
          <div className="absolute right-2 bottom-2 text-xs text-gray-500">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </BaseInput>
  )
}
