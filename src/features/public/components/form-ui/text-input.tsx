import React, { useState } from 'react'
import { BaseInput } from './base-input'
import { twMerge } from 'tailwind-merge'
import { Eye, EyeOff } from 'lucide-react'

interface Props extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  label?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  maxLength?: number
  description?: string
  ref?: React.RefObject<HTMLInputElement> | React.RefCallback<HTMLInputElement> | null
}

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  maxLength,
  className,
  description,
  type = 'text',
  ...props
}: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev)
  }

  const inputType = type === 'password' && isPasswordVisible ? 'text' : type

  return (
    <BaseInput
      htmlFor={props.id}
      label={label}
      error={error}
      required={required}
      className={className}
      description={description}
    >
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={twMerge(
            'h-11 w-full rounded-xs border px-3 py-2 text-size transition-colors',
            'border-gray-300 bg-box-surface text-on-box-black',
            'placeholder:text-gray-500',
            'focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-50',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
            type === 'password' && 'pr-10', // ikona yer açmak için
            className,
          )}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            aria-label={isPasswordVisible ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {isPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
    </BaseInput>
  )
}

TextInput.displayName = 'TextInput'
