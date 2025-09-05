import { twMerge } from 'tailwind-merge'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  label?: string
  error?: string
  required?: boolean
  options: RadioOption[]
  name: string
  className?: string
  [key: string]: any
}

export function RadioGroup({
  label,
  error,
  required,
  options,
  name,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <div className={twMerge('space-y-3', className)}>
      {label && (
        <div className="text-body font-medium text-on-box-black">
          {label}
          {required && <span className="ml-1 text-error-500">*</span>}
        </div>
      )}

      <div className="space-y-2">
        {options.map((option) => {
          const radioId = `${name}-${option.value}`
          return (
            <div
              data-checked={option.value === props.value}
              key={option.value}
              className="group/ri flex items-center gap-3"
            >
              <input
                {...props}
                type="radio"
                id={radioId}
                name={name}
                value={option.value}
                className="peer sr-only"
              />
              <label
                htmlFor={radioId}
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 transition-all group-data-[checked=true]/ri:border-primary-500 peer-focus:ring-2 peer-focus:ring-primary-500/20"
              >
                <span className="size-[95%] rounded-full bg-primary-500 opacity-0 transition-opacity group-data-[checked=true]/ri:opacity-100" />
              </label>
              <label htmlFor={radioId} className="cursor-pointer text-body text-on-box-black">
                {option.label}
              </label>
            </div>
          )
        })}
      </div>

      {error && <p className="text-body-sm text-error-500">{error}</p>}
    </div>
  )
}
