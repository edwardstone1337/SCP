'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useModal } from '@/components/ui/modal-provider'
import { SignInPanel } from '@/components/ui/sign-in-panel'
import { toggleBookmarkStatus } from '@/app/scp/[id]/actions'
import { trackSignInModalOpen } from '@/lib/analytics'
import { logger } from '@/lib/logger'

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
  const { openModal } = useModal()
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
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}${window.location.hash}`
          : '/'
      trackSignInModalOpen('bookmark')
      openModal(
        <SignInPanel context="modal" redirectTo={redirectTo} triggerSource="bookmark" />,
        'Request Archive Access'
      )
      return
    }

    setError(null)
    setOptimisticBookmarked(!isBookmarked)
    setIsPending(true)

    try {
      const result = await toggleBookmarkStatus(scpId, isBookmarked, scpRouteId)
      if (result.error) {
        setOptimisticBookmarked(isBookmarked)
        const friendlyError = result.error === 'Not authenticated'
          ? 'Sign in to save articles'
          : result.error
        setError(friendlyError)
        return
      }
      router.refresh()
      onToggle?.()
    } catch (err) {
      setOptimisticBookmarked(isBookmarked)
      const message = err instanceof Error ? err.message : 'Failed to update bookmark'
      logger.error('Bookmark toggle failed', { error: message, scpId })
      const friendlyError = message === 'Not authenticated' ? 'Sign in to save articles' : message
      setError(friendlyError)
    } finally {
      setIsPending(false)
    }
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
          <span className="button-label">
            {displayIsBookmarked ? 'Saved' : 'Save'}
          </span>
        </span>
      </Button>
    </div>
  )
}
