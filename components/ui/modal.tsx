'use client'

import { CSSProperties, ReactNode, useEffect, useRef } from 'react'

const SIZE_MAX_WIDTH: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'var(--container-xs)',
  md: 'var(--container-sm)',
  lg: 'var(--container-md)',
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  ariaLabel: string
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return []

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  )
}

export function Modal({
  isOpen,
  onClose,
  children,
  size = 'md',
  ariaLabel,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      const previous = previousFocusedRef.current
      if (previous && previous.isConnected) {
        previous.focus()
      }
      return
    }

    previousFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const timer = window.setTimeout(() => {
      const focusable = getFocusableElements(panelRef.current)
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        panelRef.current?.focus()
      }
    }, 0)

    return () => window.clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = getFocusableElements(panelRef.current)
      if (focusable.length === 0) {
        event.preventDefault()
        panelRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey) {
        if (active === first || active === panelRef.current) {
          event.preventDefault()
          last.focus()
        }
        return
      }

      if (active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const overlayAnimation = isOpen ? 'var(--animation-fade-in)' : 'var(--animation-fade-out)'
  const panelAnimation = isOpen
    ? 'var(--animation-slide-up), var(--animation-fade-in)'
    : 'var(--animation-slide-down), var(--animation-fade-out)'

  const rootStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 'var(--z-modal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: isOpen ? 'auto' : 'none',
  }

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'color-mix(in srgb, var(--color-background) 72%, transparent)',
    animation: overlayAnimation,
  }

  const panelStyle: CSSProperties = {
    position: 'relative',
    width: `min(${SIZE_MAX_WIDTH[size]}, calc(100% - (var(--spacing-page-padding) * 2)))`,
    maxHeight: 'calc(100vh - (var(--spacing-page-padding) * 2))',
    overflowY: 'auto',
    backgroundColor: 'var(--color-surface)',
    border: 'var(--border-width-normal) solid var(--color-surface-border)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'var(--shadow-elevated)',
    padding: 'var(--spacing-card-padding)',
    animation: panelAnimation,
  }

  return (
    <div style={rootStyle}>
      <div aria-hidden onClick={onClose} style={overlayStyle} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        style={panelStyle}
      >
        {children}
      </div>
    </div>
  )
}
