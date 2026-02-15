'use client'

import { useQuery } from '@tanstack/react-query'
import { recoverWikidotImages } from '@/lib/utils/recover-wikidot-images'

interface ScpContent {
  raw_content: string
  raw_source: string
  creator?: string
  url?: string
}

interface ContentResponse {
  [scpId: string]: ScpContent
}

interface QueryError extends Error {
  status?: number
}

async function fetchScpContent(contentFile: string): Promise<ContentResponse> {
  const url = `https://scp-data.tedivm.com/data/scp/items/${encodeURIComponent(contentFile)}`

  const response = await fetch(url)
  if (!response.ok) {
    let message = `Failed to fetch content (${response.status})`
    try {
      const payload = await response.json()
      if (payload?.error) {
        message = payload.error
      }
    } catch {
      // Ignore parse failures and use fallback message.
    }
    const error = new Error(message) as QueryError
    error.status = response.status
    throw error
  }

  return response.json()
}

export function useScpContent(contentFile: string | null, scpId: string) {
  return useQuery({
    queryKey: ['scp-content', contentFile],
    queryFn: () => fetchScpContent(contentFile!),
    enabled: Boolean(contentFile),
    retry: (failureCount, error) => {
      const status = (error as QueryError).status
      if (status && status < 500 && status !== 429) {
        return false
      }
      return failureCount < 2
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    staleTime: 60 * 60 * 1000, // 1 hour (content rarely changes)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    select: (data) => {
      const entry = data[scpId]
      if (!entry) return null

      const recoveredContent = recoverWikidotImages(
        entry.raw_content ?? '',
        entry.raw_source ?? '',
        scpId
      )
      return {
        raw_content: recoveredContent,
        raw_source: entry.raw_source,
        creator: entry.creator,
        url: entry.url,
      }
    },
  })
}
