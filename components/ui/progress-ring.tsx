'use client'

import { ReactNode, CSSProperties } from 'react'

const SIZE_MAP = {
  xs: 48,
  sm: 64,
  md: 96,
  lg: 128,
} as const

type SizeKey = keyof typeof SIZE_MAP

export interface ProgressRingProps {
  /** Progress value 0–100 */
  value: number
  /** Ring size */
  size?: SizeKey
  /** Stroke width in pixels (default 8) */
  strokeWidth?: number
  /** Centered content inside the ring */
  children?: ReactNode
  className?: string
  /** Accessible name for the progress bar (default: "Progress: X%") */
  ariaLabel?: string
}

export function ProgressRing({
  value,
  size = 'md',
  strokeWidth: strokeWidthPx = 8,
  children,
  className,
  ariaLabel,
}: ProgressRingProps) {
  const dimension = SIZE_MAP[size]
  const viewBoxSize = 100
  // Stroke in user units so it scales: 8px at dimension px → 8 * viewBoxSize / dimension
  const strokeWidthUser = (strokeWidthPx * viewBoxSize) / dimension
  const r = viewBoxSize / 2 - strokeWidthUser / 2
  const circumference = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, value))
  const strokeDashoffset = circumference * (1 - clamped / 100)
  const label = ariaLabel ?? `Progress: ${clamped}%`

  const trackColor = 'var(--color-grey-7)'
  const progressColor = clamped > 0 ? 'var(--color-accent)' : 'transparent'

  const wrapperStyle: CSSProperties = {
    position: 'relative',
    width: dimension,
    height: dimension,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const svgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    transform: 'rotate(-90deg)', // 12 o'clock start
  }

  return (
    <div
      className={className}
      style={wrapperStyle}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={svgStyle}
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidthUser}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={r}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidthUser}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset var(--transition-base)' }}
        />
      </svg>
      {children != null ? (
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      ) : null}
    </div>
  )
}
