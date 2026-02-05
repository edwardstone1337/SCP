'use client'

import { CSSProperties } from 'react'

export function SkipLink() {
  const style: CSSProperties = {
    position: 'absolute',
    top: '-100px',
    left: '16px',
    padding: '8px 16px',
    backgroundColor: 'var(--color-accent)',
    color: 'var(--color-text-primary)',
    fontWeight: 700,
    borderRadius: 'var(--radius-md)',
    zIndex: 9999,
    transition: 'top 0.2s',
  }

  const focusStyle = `
    .skip-link:focus {
      top: 16px;
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
