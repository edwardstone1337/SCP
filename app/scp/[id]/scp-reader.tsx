'use client'

import { useScpContent } from '@/lib/hooks/use-scp-content'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
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
}

export function ScpReader({ scp }: ScpReaderProps) {
  const router = useRouter()
  const { data: content, isLoading, error } = useScpContent(scp.series, scp.scp_id)

  // Optimistic UI state
  const [isPending, startTransition] = useTransition()
  const [optimisticIsRead, setOptimisticIsRead] = useState(scp.is_read)

  const handleToggleRead = async () => {
    // Optimistically update UI
    setOptimisticIsRead(!optimisticIsRead)

    startTransition(async () => {
      const result = await toggleReadStatus(scp.id, optimisticIsRead)

      if (!result.success) {
        // Revert on error
        setOptimisticIsRead(optimisticIsRead)
        alert('Failed to update read status. Please try again.')
      } else {
        // Refresh to update progress indicators
        router.refresh()
      }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
          >
            ← Back
          </button>

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
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleRead}
                disabled={isPending}
                className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  optimisticIsRead
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {optimisticIsRead ? '✓ Read' : 'Mark as Read'}
              </button>
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

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">
              Failed to load content. Please try again.
            </p>
          </div>
        )}

        {content && (
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content.raw_content }}
          />
        )}
      </div>
    </main>
  )
}
