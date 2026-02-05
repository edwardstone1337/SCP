'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { toggleBookmarkStatus } from '@/app/scp/[id]/actions'

interface BookmarkButtonProps {
  scpId: string          // Database UUID for bookmark operations
  scpRouteId: string     // Text identifier for route/revalidation (e.g., "SCP-173")
  isBookmarked: boolean
  userId: string | null
  size?: 'sm' | 'md'
  onToggle?: () => void
}

export function BookmarkButton({
  scpId,
  scpRouteId,
  isBookmarked,
  userId,
  size = 'md',
  onToggle,
}: BookmarkButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(isBookmarked)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isPending) {
      setOptimisticBookmarked(isBookmarked)
    }
  }, [isBookmarked, isPending])

  const displayIsBookmarked = optimisticBookmarked

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!userId) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    setError(null)
    setOptimisticBookmarked(!isBookmarked)
    setIsPending(true)

    const result = await toggleBookmarkStatus(scpId, isBookmarked, scpRouteId)

    if (result.error) {
      setOptimisticBookmarked(isBookmarked)
      const friendlyError = result.error === 'Not authenticated'
        ? 'Sign in to save articles'
        : result.error
      setError(friendlyError)
    } else {
      router.refresh()
      onToggle?.()
    }

    setIsPending(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--spacing-2)' }}>
      {error && (
        <div
          role="alert"
          style={{
            color: 'var(--color-accent)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: 'var(--spacing-1)',
          }}
        >
          {error}
        </div>
      )}
      <Button
        variant={displayIsBookmarked ? 'primary' : 'secondary'}
        size={size}
        onClick={handleToggle}
        loading={isPending}
        aria-label={displayIsBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <Icon name={displayIsBookmarked ? 'bookmark-filled' : 'bookmark'} size="sm" />
          {displayIsBookmarked ? 'Saved' : 'Save'}
        </span>
      </Button>
    </div>
  )
}
