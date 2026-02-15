import { ReactNode, CSSProperties, useId } from 'react'

type StackDirection = 'vertical' | 'horizontal'
type StackGap = 'none' | 'tight' | 'normal' | 'relaxed' | 'loose' | 'section'
type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type JustifyContent =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly'

type Responsive<T> = T | { base?: T; md?: T; lg?: T }

const gapToToken: Record<StackGap, string> = {
  none: '0',
  tight: 'var(--spacing-1)', // 8px
  normal: 'var(--spacing-2)', // 16px
  relaxed: 'var(--spacing-3)', // 24px
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

function isResponsive<T>(value: Responsive<T> | undefined): value is { base?: T; md?: T; lg?: T } {
  return typeof value === 'object' && value !== null && ('base' in value || 'md' in value || 'lg' in value)
}

function directionToCSS(value: StackDirection): string {
  return value === 'vertical' ? 'column' : 'row'
}

function buildCSSRules(
  direction?: StackDirection,
  gap?: StackGap,
  align?: AlignItems,
  justify?: JustifyContent,
): string {
  const rules: string[] = []
  if (direction !== undefined) rules.push(`flex-direction: ${directionToCSS(direction)};`)
  if (gap !== undefined) rules.push(`gap: ${gapToToken[gap]};`)
  if (align !== undefined) rules.push(`align-items: ${alignToFlex[align]};`)
  if (justify !== undefined) rules.push(`justify-content: ${justifyToFlex[justify]};`)
  return rules.join(' ')
}

interface StackProps {
  children: ReactNode
  direction?: Responsive<StackDirection>
  gap?: Responsive<StackGap>
  align?: Responsive<AlignItems>
  justify?: Responsive<JustifyContent>
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
  const rawId = useId()
  const hasResponsive =
    isResponsive(direction) || isResponsive(gap) || isResponsive(align) || isResponsive(justify)

  // Non-responsive path: identical to original implementation (no <style> tag, pure inline)
  if (!hasResponsive) {
    const simpleDirection = direction as StackDirection
    const simpleGap = gap as StackGap
    const simpleAlign = align as AlignItems | undefined
    const simpleJustify = justify as JustifyContent | undefined

    return (
      <div
        className={className}
        style={{
          display: 'flex',
          flexDirection: simpleDirection === 'vertical' ? 'column' : 'row',
          gap: gapToToken[simpleGap],
          alignItems: simpleAlign ? alignToFlex[simpleAlign] : undefined,
          justifyContent: simpleJustify ? justifyToFlex[simpleJustify] : undefined,
          ...style,
        }}
      >
        {children}
      </div>
    )
  }

  // Responsive path: generate scoped <style> tag
  const scopedClass = `stack${rawId.replace(/:/g, '-')}`

  // Extract base/md/lg values from each prop, applying defaults only to base
  const dirObj = isResponsive(direction) ? direction : { base: direction as StackDirection }
  const gapObj = isResponsive(gap) ? gap : { base: gap as StackGap }
  const alignObj = isResponsive(align) ? align : (align ? { base: align as AlignItems } : {})
  const justifyObj = isResponsive(justify) ? justify : (justify ? { base: justify as JustifyContent } : {})

  // Apply defaults to base when responsive objects don't specify base
  const baseDirection = dirObj.base ?? 'vertical'
  const baseGap = gapObj.base ?? 'normal'

  // Build CSS for each breakpoint
  const baseRules = buildCSSRules(
    baseDirection,
    baseGap,
    alignObj.base,
    justifyObj.base,
  )

  const mdRules = buildCSSRules(
    dirObj.md,
    gapObj.md,
    alignObj.md,
    justifyObj.md,
  )

  const lgRules = buildCSSRules(
    dirObj.lg,
    gapObj.lg,
    alignObj.lg,
    justifyObj.lg,
  )

  let cssText = `.${scopedClass} { display: flex; ${baseRules} }`
  if (mdRules) cssText += ` @media (min-width: 768px) { .${scopedClass} { ${mdRules} } }`
  if (lgRules) cssText += ` @media (min-width: 1024px) { .${scopedClass} { ${lgRules} } }`

  const combinedClassName = className ? `${scopedClass} ${className}` : scopedClass

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
      <div className={combinedClassName} style={style}>
        {children}
      </div>
    </>
  )
}
