'use client'

import { useScpContent } from '@/lib/hooks/use-scp-content'
import { sanitizeHtml } from '@/lib/utils/sanitize'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/typography'
import { toggleReadStatus } from './actions'

interface ScpReaderProps {
  scp: {
    id: string
    scp_id: string
    scp_number: number
    title: string
    rating: number
    series: string
    url: string
    is_read: boolean
  }
  userId?: string
}

export function ScpReader({ scp, userId }: ScpReaderProps) {
  const router = useRouter()
  const { data: content, isLoading, error: contentError } = useScpContent(scp.series, scp.scp_id)

  // Optimistic UI state and error display
  const [optimisticIsRead, setOptimisticIsRead] = useState(scp.is_read)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleToggleRead = async () => {
    if (!userId) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      return
    }

    setError(null)
    const previousState = scp.is_read
    setOptimisticIsRead(!optimisticIsRead)
    setIsPending(true)

    try {
      const result = await toggleReadStatus(scp.id, previousState)
      if (!result.success) {
        throw new Error(result.error || 'Failed to update read status')
      }
      router.refresh()
    } catch (err) {
      setOptimisticIsRead(previousState)
      setError(err instanceof Error ? err.message : 'Failed to update read status')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{scp.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  ★ {scp.rating}
                </span>
                <span>•</span>
                <span className="font-mono">{scp.scp_id}</span>
              </div>
            </div>

            {/* Mark as Read Button */}
            <div className="flex flex-col gap-2">
              {error && (
                <div
                  style={{
                    padding: 'var(--spacing-2)',
                    marginBottom: 'var(--spacing-2)',
                    backgroundColor: 'var(--color-red-1)',
                    borderLeft: '4px solid var(--color-accent)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Text variant="secondary" size="sm" className="text-[var(--color-accent)]">
                    {error}
                  </Text>
                </div>
              )}
              <Button
                variant={optimisticIsRead ? 'success' : 'secondary'}
                size="sm"
                onClick={handleToggleRead}
                disabled={isPending}
              >
                {optimisticIsRead ? '✓ Read' : 'Mark as Read'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading content...</p>
          </div>
        )}

        {contentError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">
              Failed to load content. Please try again.
            </p>
          </div>
        )}

        {content && (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content.raw_content) }}
          />
        )}
      </div>
    </main>
  )
}
