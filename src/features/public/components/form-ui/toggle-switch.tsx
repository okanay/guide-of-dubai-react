import { twMerge } from 'tailwind-merge'

interface ToggleSwitchProps {
  id?: string
  label?: string
  error?: string
  className?: string
  [key: string]: any
}

export function ToggleSwitch({ id, label, error, className, ...props }: ToggleSwitchProps) {
  return (
    <div
      data-checked={props.checked}
      className={twMerge('group/ts flex items-center gap-3', className)}
    >
      <div className="relative">
        <input {...props} type="checkbox" id={id} className="peer sr-only" />
        <label
          htmlFor={id}
          className="block h-6.5 w-11.5 cursor-pointer rounded-sm bg-gray-100 transition-colors group-data-[checked=true]/ts:bg-btn-primary peer-focus:ring-2 peer-focus:ring-primary-500/20"
        >
          <span className="block h-5 w-5 translate-x-0.75 translate-y-0.75 rounded-xs bg-gray-600 transition-transform group-data-[checked=true]/ts:translate-x-6 group-data-[checked=true]/ts:bg-on-btn-primary" />
        </label>
      </div>

      {label && (
        <div className="flex-1">
          <label htmlFor={id} className="cursor-pointer text-body font-medium text-on-box-black">
            {label}
          </label>
          {error && <p className="mt-1 text-body-sm text-error-500">{error}</p>}
        </div>
      )}
    </div>
  )
}
