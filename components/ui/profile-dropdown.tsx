'use client'

import { useEffect, useRef } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { MenuItem } from '@/components/ui/menu-item'
import { Stack } from '@/components/ui/stack'

interface ProfileDropdownProps {
  email: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  signOut: () => void
}

const triggerButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  borderRadius: 'var(--radius-full)',
}

export function ProfileDropdown({
  email,
  isOpen,
  onToggle,
  onClose,
  signOut,
}: ProfileDropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const firstItemRef = useRef<HTMLAnchorElement>(null)

  // Click outside
  useEffect(() => {
    if (!isOpen) return
    const handleMouseDown = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen, onClose])

  // Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus first item when opening
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => firstItemRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        type="button"
        style={triggerButtonStyle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Account menu"
        onClick={onToggle}
      >
        <Avatar email={email} size="sm" />
      </button>

      {isOpen && (
        <Card
          variant="bordered"
          padding="sm"
          role="menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--spacing-1))',
            right: 0,
            zIndex: 'var(--z-nav-dropdown)',
            minWidth: 'var(--size-dropdown-min)',
            boxShadow: 'var(--shadow-dropdown)',
          }}
        >
          <Stack direction="vertical" gap="none">
            <MenuItem ref={firstItemRef} href="/settings" onClick={onClose}>
              Settings
            </MenuItem>
            <MenuItem formAction={signOut}>
              Sign Out
            </MenuItem>
          </Stack>
        </Card>
      )}
    </div>
  )
}
