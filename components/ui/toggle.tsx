import type { CSSProperties } from 'react'

export interface ToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  ariaLabel: string
  style?: CSSProperties
}

// Track: 44x24 rounded pill (internal geometry, not design tokens)
const TRACK_WIDTH = 44
const TRACK_HEIGHT = 24
const THUMB_SIZE = 20
const INSET = 2
// Checked position: track width - thumb size - inset = 44 - 20 - 2 = 22px from left
const THUMB_LEFT_CHECKED = TRACK_WIDTH - THUMB_SIZE - INSET

export function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  ariaLabel,
  style: styleProp,
}: ToggleProps) {
  const trackStyle: CSSProperties = {
    position: 'relative',
    width: `${TRACK_WIDTH}px`,
    height: `${TRACK_HEIGHT}px`,
    backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-grey-7)',
    borderRadius: 'var(--radius-lg)',
    cursor: disabled ? 'default' : 'pointer',
    transition: 'background-color var(--transition-base)',
    flexShrink: 0,
    border: 'none',
    padding: 0,
    opacity: disabled ? 0.5 : 1,
    ...styleProp,
  }

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: `${INSET}px`,
    left: checked ? `${THUMB_LEFT_CHECKED}px` : `${INSET}px`,
    width: `${THUMB_SIZE}px`,
    height: `${THUMB_SIZE}px`,
    backgroundColor: 'var(--color-text-primary)',
    borderRadius: 'var(--radius-full)',
    transition: 'left var(--transition-base)',
    pointerEvents: 'none',
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      style={trackStyle}
    >
      <span style={thumbStyle} />
    </button>
  )
}
