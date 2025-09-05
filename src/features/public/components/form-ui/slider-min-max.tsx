import { useSystemSettings } from '../../layout/header/system-settings/store'
import { BaseInput } from './base-input'
import { useCallback } from 'react'

interface Props {
  label?: string
  error?: string
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  onChange?: (value: [number, number]) => void
  className?: string
  formatValue?: (value: number) => string
}

export const SliderMinMax = ({
  label,
  error,
  min = 0,
  max = 25000,
  step = 100,
  value = [0, 25000],
  onChange,
  className,
  formatValue,
}: Props) => {
  const {
    currency: { symbol },
  } = useSystemSettings()
  const [minValue, maxValue] = value

  const defaultFormatValue = (val: number) => {
    if (formatValue) return formatValue(val)
    return `${symbol}${val.toLocaleString()}`
  }

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Number(e.target.value)
      // Min değeri max'tan küçük olmalı
      if (newMin <= maxValue - step) {
        onChange?.([newMin, maxValue])
      }
    },
    [maxValue, step, onChange],
  )

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Number(e.target.value)
      // Max değeri min'den büyük olmalı
      if (newMax >= minValue + step) {
        onChange?.([minValue, newMax])
      }
    },
    [minValue, step, onChange],
  )

  const minPercentage = ((minValue - min) / (max - min)) * 100
  const maxPercentage = ((maxValue - min) / (max - min)) * 100

  return (
    <BaseInput label={label} error={error} className={className}>
      <div>
        {/* Value Display */}
        <div className="flex items-center justify-start gap-x-2 text-body-sm font-medium text-on-box-black">
          <span>{defaultFormatValue(minValue)}</span>
          <span className="text-gray-500">-</span>
          <span>{defaultFormatValue(maxValue)}</span>
        </div>

        {/* Slider Container */}
        <div className="relative h-2 py-5">
          {/* Track */}
          <div className="absolute top-4 h-2 w-full rounded-lg bg-gray-200">
            {/* Active Range */}
            <div
              className="absolute h-2 rounded-lg bg-primary-500"
              style={{
                left: `${minPercentage}%`,
                width: `${maxPercentage - minPercentage}%`,
              }}
            />
          </div>

          {/* Min Slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minValue}
            onChange={handleMinChange}
            className="pointer-events-none absolute top-4 h-2 w-full cursor-pointer appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-[5] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-[#fff] [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:border-primary-600 [&::-moz-range-thumb]:active:border-primary-700 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[5] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-[#fff] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:border-primary-600 [&::-webkit-slider-thumb]:active:border-primary-700"
          />

          {/* Max Slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxValue}
            onChange={handleMaxChange}
            className="pointer-events-none absolute top-4 h-2 w-full cursor-pointer appearance-none bg-transparent focus:outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:relative [&::-moz-range-thumb]:z-[4] [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:bg-[#fff] [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:hover:border-primary-600 [&::-moz-range-thumb]:active:border-primary-700 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-[4] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-[#fff] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:hover:border-primary-600 [&::-webkit-slider-thumb]:active:border-primary-700"
          />
        </div>

        {/* Min/Max Labels */}
        <div className="flex justify-between text-body-xs text-gray-500">
          <span>{defaultFormatValue(min)}</span>
          <span>{defaultFormatValue(max)}</span>
        </div>
      </div>
    </BaseInput>
  )
}
