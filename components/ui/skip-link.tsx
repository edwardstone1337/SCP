'use client'

import { CSSProperties } from 'react'

export function SkipLink() {
  const style: CSSProperties = {
    position: 'absolute',
    top: '-9999px',
    left: 'var(--spacing-4)',
    padding: 'var(--spacing-2) var(--spacing-4)',
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    borderRadius: 'var(--radius-md)',
    zIndex: 9999,
    transition: 'top 0.2s',
  }

  const focusStyle = `
    .skip-link:focus {
      top: var(--spacing-4);
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
