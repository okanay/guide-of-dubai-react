import { twMerge } from 'tailwind-merge'

// =============================================================================
// CHECKBOX COMPONENT
// =============================================================================
interface CheckboxProps {
  id?: string
  label?: string
  error?: string
  required?: boolean
  className?: string
  [key: string]: any
}

export function Checkbox({ id, label, error, required, className, ...props }: CheckboxProps) {
  return (
    <div
      data-checked={props.checked}
      className={twMerge('group/cb flex items-start gap-3', className)}
    >
      <div className="relative">
        <input {...props} type="checkbox" id={id} className="peer sr-only" />
        <label
          htmlFor={id}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-xs border-2 border-gray-300 bg-white transition-all group-data-[checked=true]/cb:border-primary-500 group-data-[checked=true]/cb:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20"
        >
          <svg
            className="size-4 text-white opacity-0 transition-opacity group-data-[checked=true]/cb:opacity-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </label>
      </div>

      {label && (
        <div className="flex-1">
          <label htmlFor={id} className="cursor-pointer text-body font-medium text-on-box-black">
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
          {error && <p className="mt-1 text-body-sm text-error-500">{error}</p>}
        </div>
      )}
    </div>
  )
}
