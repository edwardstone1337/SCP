'use client'

import { CSSProperties, useEffect, useRef, useState } from 'react'

const AUTO_DISMISS_MS = 5000
const EXIT_ANIMATION_MS = 150 // matches --transition-fast

interface ToastProps {
  message: string
  onDismiss: () => void
}

const containerStyle: CSSProperties = {
  position: 'fixed',
  bottom: 'var(--spacing-4)',
  left: 0,
  right: 0,
  width: 'fit-content',
  marginInline: 'auto',
  zIndex: 'var(--z-toast)',
  animation: 'var(--animation-slide-up), var(--animation-fade-in)',
}

const containerExitStyle: CSSProperties = {
  ...containerStyle,
  animation: 'var(--animation-fade-out)',
}

const panelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-2)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  border: 'var(--border-width-normal) solid var(--color-surface-border)',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--spacing-2) var(--spacing-3)',
  boxShadow: 'var(--shadow-elevated)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
  fontFamily: 'var(--font-family-sans)',
  whiteSpace: 'nowrap',
}

const dismissStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 1,
  flexShrink: 0,
}

export function Toast({ message, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const startExit = () => {
    if (isExiting) return
    setIsExiting(true)
    setTimeout(onDismiss, EXIT_ANIMATION_MS)
  }

  useEffect(() => {
    timerRef.current = setTimeout(startExit, AUTO_DISMISS_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={isExiting ? containerExitStyle : containerStyle} role="status" aria-live="polite">
      <div style={panelStyle}>
        <span>{message}</span>
        <button
          type="button"
          onClick={startExit}
          style={dismissStyle}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
