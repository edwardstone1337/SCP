'use client'

import { CSSProperties, forwardRef, useState } from 'react'
import NextLink from 'next/link'

const menuItemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  minHeight: '44px',
  padding: 'var(--spacing-2) var(--spacing-3)',
  color: 'var(--color-text-primary)',
  fontSize: 'var(--font-size-sm)',
  fontFamily: 'var(--font-family-sans)',
  textDecoration: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
}

export interface MenuItemProps {
  href?: string
  onClick?: () => void
  children: React.ReactNode
  type?: 'button' | 'submit'
  formAction?: () => void
}

export const MenuItem = forwardRef<HTMLAnchorElement | HTMLButtonElement, MenuItemProps>(
  function MenuItem(
    { href, onClick, children, type = 'button', formAction },
    ref
  ) {
    const [hover, setHover] = useState(false)
    const style: CSSProperties = {
      ...menuItemStyle,
      ...(hover
        ? {
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-grey-1)',
          }
        : {}),
    }

    if (href !== undefined) {
      return (
        <NextLink
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          onClick={onClick}
          style={style}
          role="menuitem"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {children}
        </NextLink>
      )
    }

    if (formAction !== undefined) {
      return (
        <form action={formAction} style={{ display: 'block' }}>
          <button
            ref={ref as React.Ref<HTMLButtonElement>}
            type="submit"
            onClick={onClick}
            style={style}
            role="menuitem"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {children}
          </button>
        </form>
      )
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        style={style}
        role="menuitem"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}
      </button>
    )
  }
)
