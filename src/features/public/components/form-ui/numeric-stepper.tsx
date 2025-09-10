import { twMerge } from 'tailwind-merge'
import { Minus, Plus } from 'lucide-react'
import { BaseInput } from './base-input'
import { useTranslation } from 'react-i18next'

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface NumericStepperProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  error?: string
  description?: string
  className?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const NumericStepper = ({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  error,
  description,
  className,
  id,
  required,
  disabled = false,
}: NumericStepperProps) => {
  const { t } = useTranslation('global-components')

  const handleDecrement = () => {
    if (disabled) return
    const newValue = Math.max(min, value - step)
    onChange(newValue)
  }

  const handleIncrement = () => {
    if (disabled) return
    const newValue = Math.min(max, value + step)
    onChange(newValue)
  }

  const isMinDisabled = disabled || value <= min
  const isMaxDisabled = disabled || value >= max

  return (
    <BaseInput
      htmlFor={id}
      label={label}
      error={error}
      required={required}
      className={className}
      description={description}
    >
      <div
        className={twMerge(
          'flex h-11 w-full max-w-[150px] items-center justify-between rounded-xs border border-gray-300 bg-box-surface px-3',
          disabled && 'cursor-not-allowed bg-gray-100 opacity-50',
          error && 'border-error-500',
        )}
      >
        <button
          type="button"
          onClick={handleDecrement}
          disabled={isMinDisabled}
          className="rounded-full p-1 text-on-box-black transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
          aria-label={t('form.numeric_stepper.decrement')}
        >
          <Minus className="size-5" />
        </button>

        <span
          className={twMerge(
            'text-body-xl font-semibold text-on-box-black select-none',
            disabled && 'text-gray-500',
          )}
        >
          {value}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={isMaxDisabled}
          className="rounded-full p-1 text-on-box-black transition-colors duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
          aria-label={t('form.numeric_stepper.increment')}
        >
          <Plus className="size-5" />
        </button>
      </div>
    </BaseInput>
  )
}

NumericStepper.displayName = 'NumericStepper'
