'use client'

import { useEffect, useRef } from 'react'
import { logger } from '@/lib/logger'

const TOOLTIP_ID = 'scp-footnote-tooltip'
const TOOLTIP_MAX_WIDTH = 360
const TOOLTIP_GAP = 8
const VIEWPORT_PADDING = 16

function getFootnoteText(container: HTMLElement): string {
  const text = container.textContent ?? ''
  // Strip leading "N. " (number + period + space) from footnote body
  return text.replace(/^\d+\.\s*/, '').trim()
}

function createTooltipElement(): HTMLDivElement {
  const el = document.createElement('div')
  el.id = TOOLTIP_ID
  el.setAttribute('role', 'tooltip')
  el.setAttribute('aria-live', 'polite')
  el.style.cssText = [
    'position: fixed',
    'z-index: var(--z-toast)',
    'max-width: ' + TOOLTIP_MAX_WIDTH + 'px',
    'background: var(--color-grey-9)',
    'border: 1px solid var(--color-grey-7)',
    'border-radius: var(--radius-sm)',
    'padding: var(--spacing-3) var(--spacing-4)',
    'font-size: var(--font-size-sm)',
    'color: var(--color-text-primary)',
    'box-shadow: var(--shadow-elevated)',
    'pointer-events: auto',
    'opacity: 0',
    'visibility: hidden',
    'transition: opacity var(--transition-fast), visibility var(--transition-fast)',
  ].join(';')
  return el
}

function showTooltip(
  tooltip: HTMLDivElement,
  refEl: HTMLAnchorElement,
  footnoteNum: number,
  footnoteBody: string,
  isAbove: boolean
): void {
  const refRect = refEl.getBoundingClientRect()
  tooltip.innerHTML = ''
  const strong = document.createElement('strong')
  strong.textContent = `${footnoteNum}. `
  strong.style.marginRight = '0.25em'
  tooltip.appendChild(strong)
  tooltip.appendChild(document.createTextNode(footnoteBody))

  if (!tooltip.parentNode) document.body.appendChild(tooltip)
  tooltip.style.visibility = 'hidden'
  tooltip.style.opacity = '0'
  const rect = tooltip.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  let left = refRect.left + refRect.width / 2 - rect.width / 2
  left = Math.max(VIEWPORT_PADDING, Math.min(vw - rect.width - VIEWPORT_PADDING, left))
  let top: number
  if (isAbove) {
    top = refRect.top - rect.height - TOOLTIP_GAP
  } else {
    top = refRect.bottom + TOOLTIP_GAP
  }
  top = Math.max(VIEWPORT_PADDING, Math.min(vh - rect.height - VIEWPORT_PADDING, top))
  tooltip.style.left = `${left}px`
  tooltip.style.top = `${top}px`

  const arrow = document.createElement('div')
  arrow.setAttribute('aria-hidden', 'true')
  const arrowLeft = refRect.left + refRect.width / 2 - left - 8
  arrow.style.cssText = [
    'position: absolute',
    'left: ' + arrowLeft + 'px',
    isAbove ? 'bottom: -6px' : 'top: -6px',
    'width: 0',
    'height: 0',
    'border-left: 8px solid transparent',
    'border-right: 8px solid transparent',
    isAbove
      ? 'border-top: 6px solid var(--color-grey-7)'
      : 'border-bottom: 6px solid var(--color-grey-7)',
  ].join(';')
  tooltip.appendChild(arrow)

  tooltip.style.visibility = 'visible'
  tooltip.style.opacity = '1'
}

/**
 * Hook that attaches footnote tooltip behavior to .scp-content.
 * Queries a[id^="footnoteref-"], adds click/keyboard handlers, and shows
 * a single tooltip at a time with dismiss on outside click or Escape.
 *
 * @param containerRef - Ref to the .scp-content element (or parent that contains it)
 * @param contentLoaded - When true, content is rendered and we can query refs
 */
export function useFootnotes(
  containerRef: React.RefObject<HTMLElement | null>,
  contentLoaded: boolean
): void {
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const activeRefId = useRef<string | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const activeRefElementRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    // DEBUG: Log whether the effect runs and its dependency values
    console.log('[useFootnotes] effect running', {
      contentLoaded,
      hasContainer: !!containerRef.current,
      containerTag: containerRef.current?.tagName,
      containerChildCount: containerRef.current?.childNodes.length,
      containerInnerHTMLLength: containerRef.current?.innerHTML.length,
    })

    if (!contentLoaded || !containerRef.current) {
      console.log('[useFootnotes] EARLY RETURN — contentLoaded:', contentLoaded, 'container:', containerRef.current)
      return
    }

    const container = containerRef.current
    const refLinks = container.querySelectorAll<HTMLAnchorElement>('a[id^="footnoteref-"]')
    // DEBUG: Log query results
    console.log('[useFootnotes] querySelectorAll result:', {
      refLinksCount: refLinks.length,
      containerElement: container,
      allAnchors: container.querySelectorAll('a').length,
      allSups: container.querySelectorAll('sup').length,
      // Check if footnotes exist with different selectors
      byClass: container.querySelectorAll('a.footnoteref').length,
      byIdPrefix: container.querySelectorAll('[id^="footnoteref"]').length,
      sampleHTML: container.innerHTML.substring(0, 500),
    })
    if (refLinks.length === 0) return

    let tooltipEl = tooltipRef.current
    if (!tooltipEl) {
      tooltipEl = createTooltipElement()
      tooltipRef.current = tooltipEl
    }

    function dismiss(): void {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      if (activeRefElementRef.current) {
        activeRefElementRef.current.removeEventListener('focusout', handleFocusOut)
      }
      if (tooltipEl && tooltipEl.parentNode) {
        tooltipEl.style.opacity = '0'
        tooltipEl.style.visibility = 'hidden'
        tooltipEl.parentNode.removeChild(tooltipEl)
      }
      activeRefId.current = null
      activeRefElementRef.current = null
      refLinks.forEach((a) => a.removeAttribute('aria-describedby'))
    }

    function handleClickOutside(e: MouseEvent): void {
      const target = e.target as Node
      if (tooltipEl?.contains(target)) return
      const anchor = (target as Element).closest?.('a[id^="footnoteref-"]')
      if (anchor && container.contains(anchor)) return
      dismiss()
    }

    function handleEscape(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        dismiss()
        document.removeEventListener('keydown', handleEscape)
      }
    }

    function handleFocusOut(e: FocusEvent): void {
      // Use requestAnimationFrame to ensure relatedTarget is set
      requestAnimationFrame(() => {
        const newFocus = e.relatedTarget as Node | null
        // Dismiss only if focus has left both the tooltip and the active reference
        if (!tooltipEl || !activeRefElementRef.current) return

        const focusInTooltip = tooltipEl.contains(newFocus)
        const focusInRef = activeRefElementRef.current === newFocus || activeRefElementRef.current.contains(newFocus)

        if (!focusInTooltip && !focusInRef) {
          dismiss()
        }
      })
    }

    function openTooltip(refEl: HTMLAnchorElement, num: number): void {
      const footnoteEl = container.querySelector<HTMLElement>(`#footnote-${num}`)
      if (!footnoteEl) {
        logger.warn('Footnote target not found', { num, refId: refEl.id })
        return
      }

      dismiss()
      const bodyText = getFootnoteText(footnoteEl)
      const refRect = refEl.getBoundingClientRect()
      const placeAbove = refRect.bottom + 120 > window.innerHeight - VIEWPORT_PADDING

      showTooltip(tooltipEl!, refEl, num, bodyText, placeAbove)
      activeRefId.current = refEl.id
      activeRefElementRef.current = refEl
      refEl.setAttribute('aria-describedby', TOOLTIP_ID)

      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        refEl.addEventListener('focusout', handleFocusOut)
      }, 0)
    }

    const teardowns: Array<() => void> = []

    console.log('[useFootnotes] attaching handlers to', refLinks.length, 'refs')
    refLinks.forEach((refEl) => {
      const match = refEl.id.match(/^footnoteref-(\d+)$/)
      const num = match ? parseInt(match[1], 10) : 0
      if (!num) return

      refEl.style.cursor = 'pointer'
      refEl.setAttribute('tabindex', '0')
      refEl.setAttribute('role', 'button')
      refEl.setAttribute('aria-label', `Footnote ${num}`)
      console.log('[useFootnotes] handler attached to', refEl.id, refEl)

      const onClick = (e: MouseEvent): void => {
        console.log('[useFootnotes] CLICK HANDLER FIRED', refEl.id)
        e.preventDefault()
        e.stopPropagation()
        openTooltip(refEl, num)
      }

      const onKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openTooltip(refEl, num)
        }
      }

      refEl.addEventListener('click', onClick)
      refEl.addEventListener('keydown', onKeyDown)
      teardowns.push(() => {
        refEl.removeEventListener('click', onClick)
        refEl.removeEventListener('keydown', onKeyDown)
      })
    })

    cleanupRef.current = () => {
      teardowns.forEach((f) => f())
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      dismiss()
    }

    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [contentLoaded, containerRef])
}
