import { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils/cn'

type StackDirection = 'vertical' | 'horizontal'
type StackGap = 'none' | 'tight' | 'normal' | 'loose' | 'section'
type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type JustifyContent =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'

const gapToToken: Record<StackGap, string> = {
  none: '0',
  tight: 'var(--spacing-1)', // 8px
  normal: 'var(--spacing-2)', // 16px
  loose: 'var(--spacing-4)', // 32px
  section: 'var(--spacing-8)', // 64px
}

const alignToFlex: Record<AlignItems, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
}

const justifyToFlex: Record<JustifyContent, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
}

interface StackProps {
  children: ReactNode
  direction?: StackDirection
  gap?: StackGap
  align?: AlignItems
  justify?: JustifyContent
  className?: string
  style?: CSSProperties
}

export function Stack({
  children,
  direction = 'vertical',
  gap = 'normal',
  align,
  justify,
  className,
  style,
}: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: gapToToken[gap],
        alignItems: align ? alignToFlex[align] : undefined,
        justifyContent: justify ? justifyToFlex[justify] : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
