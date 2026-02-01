import { CSSProperties } from 'react'

interface IconProps {
  name: 'check' | 'eye' | 'star' | 'arrow-back'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Icon({ name, size = 'md', className }: IconProps) {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '32px',
  }

  const style: CSSProperties = {
    width: sizes[size],
    height: sizes[size],
    display: 'inline-block',
    lineHeight: 1,
  }

  const icons = {
    check: '✓',
    eye: '👁️',
    star: '★',
    'arrow-back': '←',
  }

  return (
    <span
      className={className}
      style={style}
      aria-hidden="true"
    >
      {icons[name]}
    </span>
  )
}
