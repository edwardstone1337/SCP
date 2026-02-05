'use client'

import { useQuery } from '@tanstack/react-query'

interface ScpContent {
  raw_content: string
  raw_source: string
}

interface ContentResponse {
  [scpId: string]: ScpContent
}

async function fetchScpContent(contentFile: string): Promise<ContentResponse> {
  const url = `https://scp-data.tedivm.com/data/scp/items/${contentFile}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.statusText}`)
  }

  return response.json()
}

export function useScpContent(contentFile: string | null, scpId: string) {
  return useQuery({
    queryKey: ['scp-content', contentFile],
    queryFn: () => fetchScpContent(contentFile!),
    enabled: Boolean(contentFile),
    staleTime: 60 * 60 * 1000, // 1 hour (content rarely changes)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    select: (data) => data[scpId] || null,
  })
}
