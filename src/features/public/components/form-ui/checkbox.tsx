import { twMerge } from 'tailwind-merge'

interface CheckboxIndicatorProps {
  className?: string
}

export const CheckboxIndicator = ({ className }: CheckboxIndicatorProps) => {
  return (
    <div
      className={twMerge(
        'flex h-5 w-5 cursor-pointer items-center justify-center rounded-xs border-2 border-gray-300 bg-white transition-all group-data-[checked=true]/cb:border-primary-500 group-data-[checked=true]/cb:bg-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20',
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 text-[#fff] opacity-0 transition-opacity group-data-[checked=true]/cb:opacity-100"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
  )
}

interface CheckboxProps {
  id?: string
  label?: string
  error?: string
  required?: boolean
  className?: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  [key: string]: any
}

export function Checkbox({
  id,
  label,
  error,
  required,
  className,
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <div data-checked={checked} className={twMerge('group/cb flex items-start gap-3', className)}>
      <div className="relative">
        <input
          {...props}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />

        <label htmlFor={id}>
          <CheckboxIndicator />
        </label>
      </div>

      {label && (
        <div className="-mt-1 flex-1">
          <label htmlFor={id} className="cursor-pointer text-size-sm font-medium text-on-box-black">
            {label}
            {required && <span className="ml-1 text-error-500">*</span>}
          </label>
          {error && <p className="text-size-xs text-error-500">{error}</p>}
        </div>
      )}
    </div>
  )
}
