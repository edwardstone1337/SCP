import { CSSProperties } from 'react'

interface AvatarProps {
  email: string
  size?: 'sm' | 'md'
}

const sizeStyles: Record<'sm' | 'md', CSSProperties> = {
  sm: {
    width: 'var(--spacing-4)',
    height: 'var(--spacing-4)',
    fontSize: 'var(--font-size-xs)',
  },
  md: {
    width: 'var(--spacing-5)',
    height: 'var(--spacing-5)',
    fontSize: 'var(--font-size-sm)',
  },
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-full)',
  backgroundColor: 'var(--color-grey-7)',
  color: 'var(--color-text-primary)',
  fontWeight: 600,
  fontFamily: 'var(--font-family-sans)',
  textTransform: 'uppercase',
  userSelect: 'none',
  flexShrink: 0,
}

export function Avatar({ email, size = 'sm' }: AvatarProps) {
  const letter = (email.trim()[0] ?? '?').toUpperCase()
  return (
    <span style={{ ...baseStyle, ...sizeStyles[size] }} aria-hidden="true">
      {letter}
    </span>
  )
}
