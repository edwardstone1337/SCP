import { CSSProperties, type ReactNode } from 'react'

export type IconName =
  | 'check'
  | 'check-circle'
  | 'eye'
  | 'star'
  | 'arrow-back'
  | 'arrow-up'
  | 'bookmark'
  | 'bookmark-filled'

interface IconProps {
  name: IconName
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
}

const BOOKMARK_SVG = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const BOOKMARK_FILLED_SVG = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const CHECK_CIRCLE_SVG = (
  <svg width="1em" height="1em" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="M7 13l3 3 7-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ARROW_UP_SVG = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const icons: Record<IconName, string | ReactNode> = {
  check: '✓',
  'check-circle': CHECK_CIRCLE_SVG,
  eye: '👁️',
  star: '★',
  'arrow-back': '←',
  'arrow-up': ARROW_UP_SVG,
  bookmark: BOOKMARK_SVG,
  'bookmark-filled': BOOKMARK_FILLED_SVG,
}

export function Icon({ name, size = 'md', className, style: styleProp }: IconProps) {
  const sizes = {
    sm: 'var(--spacing-2)',
    md: 'var(--spacing-3)',
    lg: 'var(--spacing-4)',
  }

  const style: CSSProperties = {
    width: sizes[size],
    height: sizes[size],
    fontSize: sizes[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    lineHeight: 0,
    ...styleProp,
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
