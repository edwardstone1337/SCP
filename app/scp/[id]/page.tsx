import { Metadata } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { getSiteUrl } from '@/lib/utils/site-url'
import { seriesToRoman } from '@/lib/utils/series'
import { notFound } from 'next/navigation'
import { ScpContent } from './scp-content'
import { generateCreativeWorkJsonLd, generateBreadcrumbJsonLd } from '@/lib/utils/json-ld'
import { SITE_NAME } from '@/lib/constants'
import { recoverWikidotImages } from '@/lib/utils/recover-wikidot-images'
import { sanitizeHtmlServer } from '@/lib/utils/sanitize-server'
import { logger } from '@/lib/logger'

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

interface ScpContentEntry {
  raw_content: string
  raw_source: string
  creator?: string
  url?: string
}

/**
 * Shared fetch for SCP article data from SCP-Data API.
 * Next.js deduplicates calls with the same URL + revalidate within a single render.
 */
async function fetchScpContentData(contentFile: string, scpId: string): Promise<ScpContentEntry | null> {
  try {
    const url = `https://scp-data.tedivm.com/data/scp/items/${encodeURIComponent(contentFile)}`
    const response = await fetch(url, {
      next: { revalidate: 86400 },
    })

    if (!response.ok) return null

    const data = await response.json()
    const entry = data[scpId]

    if (!entry?.raw_content) return null

    return {
      raw_content: entry.raw_content,
      raw_source: entry.raw_source ?? '',
      creator: entry.creator,
      url: entry.url,
    }
  } catch {
    return null
  }
}

/** Extract plain text for metadata descriptions. */
async function getScpContentText(contentFile: string, scpId: string): Promise<string | null> {
  const entry = await fetchScpContentData(contentFile, scpId)
  if (!entry) return null

  return entry.raw_content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Fetch, recover images, sanitize — returns HTML ready for server rendering. */
async function getScpContentHtml(contentFile: string, scpId: string): Promise<{
  html: string
  creator?: string
  url?: string
} | null> {
  try {
    const entry = await fetchScpContentData(contentFile, scpId)
    if (!entry) return null

    const recovered = recoverWikidotImages(entry.raw_content, entry.raw_source, scpId)
    const html = await sanitizeHtmlServer(recovered)
    return { html, creator: entry.creator, url: entry.url }
  } catch (error) {
    logger.error('Failed to process SCP content server-side', { error, scpId })
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
      title: 'SCP Not Found',
      description: 'Track your reading progress through the SCP Foundation database.',
    }
  }

  const hasDescriptiveTitle = scpData.title && scpData.title !== scpData.scp_id

  // Try to get a description from the content
  let description = hasDescriptiveTitle
    ? `Read ${scpData.scp_id} (${scpData.title}) on SCP Reader. Track your reading progress through the SCP Foundation database.`
    : `Read ${scpData.scp_id} on SCP Reader. Track your reading progress through the SCP Foundation database.`

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

  const canonicalUrl = `${getSiteUrl()}/scp/${id}`
  const title = hasDescriptiveTitle
    ? `${scpData.title} | ${scpData.scp_id}`
    : scpData.scp_id

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      siteName: 'SCP Reader',
      type: 'article',
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
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
  const [{ prev, next }, serverContent] = await Promise.all([
    getAdjacentScps(supabase, scpData.series, scpData.scp_number),
    scpData.content_file
      ? getScpContentHtml(scpData.content_file, scpData.scp_id)
      : Promise.resolve(null),
  ])

  // Generate JSON-LD structured data
  const siteUrl = getSiteUrl()
  const canonicalUrl = `${siteUrl}/scp/${id}`
  const seriesRoman = seriesToRoman(scpData.series)
  const seriesTitle = seriesRoman ? `Series ${seriesRoman}` : scpData.series
  const seriesUrl = `${siteUrl}/series/${scpData.series}`

  const creativeWorkSchema = generateCreativeWorkJsonLd({
    scp_id: scpData.scp_id,
    title: scpData.title,
    description: `Read ${scpData.scp_id} on SCP Reader. Track your reading progress through the SCP Foundation database.`,
    url: canonicalUrl,
    isBasedOn: scpData.url,
    isPartOf: {
      name: seriesTitle,
      url: seriesUrl,
    },
  })

  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: SITE_NAME, url: siteUrl },
    { name: seriesTitle, url: seriesUrl },
    { name: `${scpData.scp_id} — ${scpData.title}`, url: canonicalUrl },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ScpContent scp={scpData} prev={prev} next={next} serverContent={serverContent} />
    </>
  )
}
