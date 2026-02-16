import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { getRange } from '@/lib/utils/series'

export const revalidate = 86400 // 24 hours

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scp-reader.co'

interface ScpRow {
  scp_id: string
  series: string
  scp_number: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient()

  // Fetch all SCPs from database
  const { data: scps } = await supabase
    .from('scps')
    .select('scp_id, series, scp_number')
    .order('scp_number', { ascending: true })

  const scpRows: ScpRow[] = scps || []

  // Build SCP page URLs
  const scpUrls: MetadataRoute.Sitemap = scpRows.map((scp) => ({
    url: `${baseUrl}/scp/${scp.scp_id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Build series pages (series-1 through series-10 = I through X)
  const seriesSet = new Set<string>()
  const rangesPerSeries = new Map<string, Set<number>>()

  scpRows.forEach((scp) => {
    seriesSet.add(scp.series)

    if (!rangesPerSeries.has(scp.series)) {
      rangesPerSeries.set(scp.series, new Set())
    }
    const range = getRange(scp.scp_number)
    rangesPerSeries.get(scp.series)!.add(range)
  })

  const seriesUrls: MetadataRoute.Sitemap = Array.from(seriesSet).map((series) => ({
    url: `${baseUrl}/series/${series}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Build series range pages
  const rangeUrls: MetadataRoute.Sitemap = []
  rangesPerSeries.forEach((ranges, series) => {
    ranges.forEach((rangeStart) => {
      rangeUrls.push({
        url: `${baseUrl}/series/${series}/${rangeStart}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    })
  })

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/top-rated`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...staticUrls, ...scpUrls, ...seriesUrls, ...rangeUrls]
}
