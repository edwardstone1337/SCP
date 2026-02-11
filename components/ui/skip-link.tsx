'use client'

import { CSSProperties } from 'react'

export function SkipLink() {
  const style: CSSProperties = {
    position: 'absolute',
    clip: 'rect(0, 0, 0, 0)',
    clipPath: 'inset(50%)',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    left: 'var(--spacing-4)',
    top: 'var(--spacing-4)',
    padding: 'var(--spacing-2) var(--spacing-4)',
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    borderRadius: 'var(--radius-md)',
    zIndex: 'var(--z-skip-link)',
  }

  const focusStyle = `
    .skip-link:focus,
    .skip-link:focus-visible {
      clip: auto;
      clip-path: none;
      width: auto;
      height: auto;
      overflow: visible;
    }
  `

  return (
    <>
      <style>{focusStyle}</style>
      <a href="#main" className="skip-link" style={style}>
        Skip to main content
      </a>
    </>
  )
}
