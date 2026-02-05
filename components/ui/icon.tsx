import { CSSProperties, type ReactNode } from 'react'

export type IconName =
  | 'check'
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

const ARROW_UP_SVG = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
)

const icons: Record<IconName, string | ReactNode> = {
  check: '✓',
  eye: '👁️',
  star: '★',
  'arrow-back': '←',
  'arrow-up': ARROW_UP_SVG,
  bookmark: BOOKMARK_SVG,
  'bookmark-filled': BOOKMARK_FILLED_SVG,
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
    fontSize: sizes[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    lineHeight: 0,
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
