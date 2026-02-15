import { CSSProperties } from 'react'

const premiumBadgeStyle: CSSProperties = {
  display: 'inline-block',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-xs)',
  color: 'var(--color-accent)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

export function PremiumBadge() {
  return <span style={premiumBadgeStyle}>Premium</span>
}
