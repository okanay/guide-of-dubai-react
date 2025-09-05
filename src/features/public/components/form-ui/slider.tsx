import { twMerge } from 'tailwind-merge'

// =============================================================================
interface SliderProps {
  id?: string
  label?: string
  error?: string
  min?: number
  max?: number
  step?: number
  className?: string
  [key: string]: any
}

export function Slider({
  id,
  label,
  error,
  min = 0,
  max = 100,
  step = 1,
  className,
  ...props
}: SliderProps) {
  return (
    <div className={twMerge('space-y-2', className)}>
      {label && (
        <label htmlFor={id} className="block text-body font-medium text-on-box-black">
          {label}
        </label>
      )}

      <input
        {...props}
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-primary-600"
      />

      {error && <p className="text-body-sm text-error-500">{error}</p>}
    </div>
  )
}
