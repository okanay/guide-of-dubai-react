import { twMerge } from 'tailwind-merge'
import { BaseInput } from './base-input'

// =============================================================================
// TOGGLE SWITCH INDICATOR - Sadece tasarım
// =============================================================================

interface ToggleSwitchIndicatorProps {
  className?: string
}

export const ToggleSwitchIndicator = ({ className }: ToggleSwitchIndicatorProps) => {
  return (
    <div
      className={twMerge(
        'block h-6.5 w-11.5 cursor-pointer rounded-sm bg-gray-100 transition-colors group-data-[checked=true]/ts:bg-btn-primary peer-focus:ring-2 peer-focus:ring-primary-500/20',
        className,
      )}
    >
      <span className="block h-5 w-5 translate-x-0.75 translate-y-0.75 rounded-xs bg-gray-600 transition-transform group-data-[checked=true]/ts:translate-x-6 group-data-[checked=true]/ts:bg-on-btn-primary" />
    </div>
  )
}

// =============================================================================
// DEFAULT TOGGLE SWITCH - Indicator kullanarak
// =============================================================================

interface ToggleSwitchProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string
  error?: string
  className?: string
  ref?: React.RefObject<HTMLInputElement> | React.RefCallback<HTMLInputElement> | null
}

export const ToggleSwitch = ({ id, label, error, className, ref, ...props }: ToggleSwitchProps) => {
  return (
    <BaseInput error={error} className={className}>
      <div data-checked={props.checked} className="group/ts flex items-center gap-3">
        <div className="relative">
          <input {...props} ref={ref} type="checkbox" id={id} className="peer sr-only" />

          <label htmlFor={id}>
            <ToggleSwitchIndicator />
          </label>
        </div>

        {label && (
          <div className="flex-1">
            <label htmlFor={id} className="cursor-pointer text-body font-medium text-on-box-black">
              {label}
            </label>
          </div>
        )}
      </div>
    </BaseInput>
  )
}
