import { BaseInput } from './base-input'

interface Props extends Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> {
  label?: string
  error?: string
  min?: number
  max?: number
  step?: number
  value?: number
  onChange?: (value: number) => void
  className?: string
  formatValue?: (value: number) => string
  showValue?: boolean
  ref?: React.RefObject<HTMLInputElement> | React.RefCallback<HTMLInputElement> | null
}

export const Slider = ({
  id,
  label,
  error,
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onChange,
  className,
  formatValue,
  showValue = true,
  ref,
  ...props
}: Props) => {
  const defaultFormatValue = (val: number) => {
    if (formatValue) return formatValue(val)
    return val.toString()
  }

  return (
    <BaseInput htmlFor={id} label={label} error={error} className={className}>
      <div className="space-y-2">
        {showValue && (
          <div className="flex justify-between text-body-sm">
            <span className="text-gray-500">Değer:</span>
            <span className="font-medium text-on-box-black">{defaultFormatValue(value)}</span>
          </div>
        )}

        <input
          {...props}
          ref={ref}
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 focus:ring-2 focus:ring-primary-500/20 focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-[5] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:border-primary-600 [&::-moz-range-thumb]:active:border-primary-700 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[5] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:border-primary-600 [&::-webkit-slider-thumb]:active:border-primary-700"
        />

        <div className="flex justify-between text-body-xs text-gray-500">
          <span>{defaultFormatValue(min)}</span>
          <span>{defaultFormatValue(max)}</span>
        </div>
      </div>
    </BaseInput>
  )
}
