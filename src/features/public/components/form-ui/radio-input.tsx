import { twMerge } from 'tailwind-merge'
import { BaseInput } from './base-input'

// =============================================================================
// DEFAULT RADIO GROUP - Indicator kullanarak
// =============================================================================

interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps {
  label?: string
  error?: string
  required?: boolean
  options: RadioOption[]
  name: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export const RadioGroup = ({
  label,
  error,
  required,
  options,
  name,
  value,
  onChange,
  className,
}: RadioGroupProps) => {
  return (
    <BaseInput label={label} error={error} required={required}>
      <div className={twMerge('space-y-2', className)}>
        {options.map((option) => {
          const radioId = `${name}-${option.value}`
          const isChecked = option.value === value
          return (
            <div
              data-checked={isChecked}
              key={option.value}
              className="group/ri flex items-center gap-3"
            >
              <input
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                checked={isChecked}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className="peer sr-only"
              />

              <label htmlFor={radioId}>
                <RadioIndicator
                  className={option.disabled ? 'cursor-not-allowed opacity-50' : ''}
                />
              </label>

              <label
                htmlFor={radioId}
                className={twMerge(
                  'cursor-pointer text-body text-on-box-black',
                  option.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {option.label}
              </label>
            </div>
          )
        })}
      </div>
    </BaseInput>
  )
}

interface RadioIndicatorProps {
  className?: string
}

export const RadioIndicator = ({ className }: RadioIndicatorProps) => {
  return (
    <div
      className={twMerge(
        'flex size-5 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 p-px transition-all group-data-[checked=true]/ri:border-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20',
        className,
      )}
    >
      <span className="size-full rounded-full bg-primary-500 opacity-0 transition-opacity group-data-[checked=true]/ri:opacity-100" />
    </div>
  )
}
