import { Metadata } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { notFound } from 'next/navigation'
import { ScpContent } from './scp-content'

async function getAdjacentScps(
  supabase: ReturnType<typeof createStaticClient>,
  series: string,
  scpNumber: number
) {
  const { data: prev } = await supabase
    .from('scps')
    .select('scp_id, title')
    .eq('series', series)
    .lt('scp_number', scpNumber)
    .order('scp_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: next } = await supabase
    .from('scps')
    .select('scp_id, title')
    .eq('series', series)
    .gt('scp_number', scpNumber)
    .order('scp_number', { ascending: true })
    .limit(1)
    .maybeSingle()

  return { prev, next }
}

async function getScpData(scpId: string) {
  const supabase = createStaticClient()

  const { data: scp } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating, series, url, content_file')
    .eq('scp_id', scpId)
    .single()

  if (!scp) return null

  return {
    ...scp,
    rating: scp.rating ?? 0,
    is_read: false,
    is_bookmarked: false,
  }
}

async function getScpContentText(contentFile: string, scpId: string): Promise<string | null> {
  try {
    const url = `https://scp-data.tedivm.com/data/scp/items/${encodeURIComponent(contentFile)}`
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) return null

    const data = await response.json()
    const entry = data[scpId]

    if (!entry?.raw_content) return null

    // Strip HTML tags and extract plain text
    const textOnly = entry.raw_content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    return textOnly
  } catch {
    return null
  }
}

export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const scpData = await getScpData(id)

  if (!scpData) {
    return {
      title: 'SCP Not Found — SCP Reader',
      description: 'Track your reading progress through the SCP Foundation database.',
    }
  }

  // Try to get a description from the content
  let description = `Read ${scpData.scp_id} on SCP Reader. Track your reading progress through the SCP Foundation database.`

  if (scpData.content_file) {
    const contentText = await getScpContentText(scpData.content_file, scpData.scp_id)
    if (contentText && contentText.length > 0) {
      // Take first 155 characters
      description = contentText.substring(0, 155)
      if (contentText.length > 155) {
        description += '...'
      }
    }
  }

  return {
    title: `${scpData.scp_id} — SCP Reader`,
    description,
  }
}

export default async function ScpPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const scpData = await getScpData(id)

  if (!scpData) {
    notFound()
  }

  const supabase = createStaticClient()
  const { prev, next } = await getAdjacentScps(
    supabase,
    scpData.series,
    scpData.scp_number
  )

  return (
    <ScpContent scp={scpData} prev={prev} next={next} />
  )
}
