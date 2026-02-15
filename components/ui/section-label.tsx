import { ReactNode, CSSProperties } from 'react'

interface SectionLabelProps {
  children: ReactNode
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
  style?: CSSProperties
  id?: string
}

export function SectionLabel({ children, as: Component = 'h2', style, id }: SectionLabelProps) {
  const labelStyle: CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 400,
    fontFamily: 'var(--font-family-sans)',
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    lineHeight: 'var(--line-height-sm)',
    margin: 0,
    ...style,
  }

  return (
    <Component id={id} style={labelStyle}>
      {children}
    </Component>
  )
}
