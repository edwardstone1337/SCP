'use client'

import { useQuery } from '@tanstack/react-query'
import { getContentFilename } from '@/lib/utils/series'

interface ScpContent {
  raw_content: string
  raw_source: string
}

interface ContentResponse {
  [scpId: string]: ScpContent
}

async function fetchSeriesContent(series: string): Promise<ContentResponse> {
  const filename = getContentFilename(series)
  const url = `https://scp-data.tedivm.com/data/scp/items/${filename}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.statusText}`)
  }

  return response.json()
}

export function useScpContent(series: string, scpId: string) {
  return useQuery({
    queryKey: ['scp-content', series],
    queryFn: () => fetchSeriesContent(series),
    staleTime: 60 * 60 * 1000, // 1 hour (content rarely changes)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    select: (data) => data[scpId] || null,
  })
}
