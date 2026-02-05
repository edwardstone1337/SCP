'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/typography'
import { toggleReadStatus } from '@/app/scp/[id]/actions'

export interface ReadToggleButtonProps {
  scpId: string
  isRead: boolean
  userId: string | null
  size?: 'sm' | 'md'
  onToggle?: () => void
}

export function ReadToggleButton({
  scpId,
  isRead,
  userId,
  size = 'sm',
  onToggle,
}: ReadToggleButtonProps) {
  const router = useRouter()
  const [optimisticIsRead, setOptimisticIsRead] = useState(isRead)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (!isPending) {
      setOptimisticIsRead(isRead)
    }
  }, [isRead, isPending])

  const displayIsRead = isPending ? optimisticIsRead : isRead

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (userId === null) {
      const returnUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.pathname) : ''
      window.location.href = `/login?redirect=${returnUrl}`
      return
    }

    setError(null)
    setOptimisticIsRead(!isRead)
    setIsPending(true)

    try {
      const result = await toggleReadStatus(scpId, isRead)
      if (result.error) {
        setOptimisticIsRead(isRead)
        const friendlyError = result.error === 'Not authenticated'
          ? 'Sign in to track progress'
          : result.error
        setError(friendlyError)
        return
      }
      onToggle?.()
      router.refresh()
    } catch (err) {
      setOptimisticIsRead(isRead)
      const message = err instanceof Error ? err.message : 'Failed to update read status'
      const friendlyError = message === 'Not authenticated' ? 'Sign in to track progress' : message
      setError(friendlyError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-2)' }}>
      {error && (
        <div
          role="alert"
          style={{
            padding: 'var(--spacing-2)',
            backgroundColor: 'var(--color-red-2)',
            borderLeft: '4px solid var(--color-accent)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Text variant="secondary" size="sm" style={{ color: 'var(--color-accent)' }}>
            {error}
          </Text>
        </div>
      )}
      <Button
        variant={displayIsRead ? 'secondary' : 'primary'}
        size={size}
        onClick={handleClick}
        loading={isPending}
        aria-label={displayIsRead ? 'Mark as Unread' : 'Mark as Read'}
      >
        {displayIsRead ? 'Mark as Unread' : 'Mark as Read'}
      </Button>
    </div>
  )
}
