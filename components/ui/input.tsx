'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps {
  id: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  style?: React.CSSProperties
  tabIndex?: number
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    className,
    style,
    tabIndex,
  },
  ref
) {
  return (
    <input
      ref={ref}
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={cn('input-design-tokens', className)}
      style={style}
      aria-invalid={required && !value}
      tabIndex={tabIndex}
    />
  )
})
