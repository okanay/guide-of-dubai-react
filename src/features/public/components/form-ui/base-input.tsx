import React from 'react'
import { twMerge } from 'tailwind-merge'

// ==================================
// BaseInput Component
// ==================================
interface BaseInputProps {
  htmlFor?: string
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  description?: string
}

export const BaseInput: React.FC<BaseInputProps> = ({
  htmlFor,
  label,
  error,
  required = false,
  children,
  className,
  description,
}) => {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-body-sm font-medium text-on-box-black">
          {label}
          {required && <span className="ml-1 text-error-500">*</span>}
        </label>
      )}
      {children}
      {description && <p className="text-body-xs text-gray-600">{description}</p>}
      {error && <p className="text-body-xs text-error-500">{error}</p>}
    </div>
  )
}
