'use client'

import { CSSProperties, SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'style' | 'onChange'> {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  style?: CSSProperties
}

export function Select({ options, value, onChange, className, style, ...props }: SelectProps) {
  const selectStyle: CSSProperties = {
    width: '100%',
    minHeight: '44px',
    padding: '0.625rem var(--spacing-2)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-surface-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family-sans)',
    fontSize: 'var(--font-size-base)',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%238c8c8c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '40px',
    ...style,
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={selectStyle}
      className={className}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
