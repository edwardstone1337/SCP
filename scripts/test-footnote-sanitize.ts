#!/usr/bin/env tsx
/**
 * One-off test: run sanitizeHtmlServer on SCP-049 content and inspect footnote markup.
 * Run: npx tsx scripts/test-footnote-sanitize.ts
 */

async function fetchScpContent(contentFile: string, scpId: string) {
  const url = `https://scp-data.tedivm.com/data/scp/items/${encodeURIComponent(contentFile)}`
  const res = await fetch(url)
  if (!res.ok) return null
  const data = await res.json()
  const entry = data[scpId]
  return entry
    ? {
        raw_content: entry.raw_content as string,
        raw_source: (entry.raw_source as string) ?? '',
      }
    : null
}

async function main() {
  const entry = await fetchScpContent('content_series-1.json', 'SCP-049')
  if (!entry?.raw_content) {
    console.error('SCP-049 not found or no raw_content')
    process.exit(1)
  }

  const raw = entry.raw_content
  const beforeRef =
    raw.match(/<a[^>]*class="footnoteref"[^>]*>/)?.[0] ??
    raw.match(/<a[^>]*id="footnoteref-1"[^>]*>/)?.[0] ??
    ''
  console.log('--- BEFORE sanitization (first footnote ref) ---')
  console.log(beforeRef)
  console.log('')

  const { sanitizeHtmlServer } = await import('../lib/utils/sanitize-server')
  const { recoverWikidotImages } = await import('../lib/utils/recover-wikidot-images')
  const recovered = recoverWikidotImages(raw, entry.raw_source, 'SCP-049')
  const html = await sanitizeHtmlServer(recovered)

  const afterRef =
    html.match(/<a[^>]*footnoteref[^>]*>/)?.[0] ??
    html.match(/<a[^>]*id="footnoteref-1"[^>]*>/)?.[0] ??
    ''
  console.log('--- AFTER sanitization (first footnote ref anchor) ---')
  console.log(afterRef)
  console.log('')

  const hasId = /id="footnoteref-\d+"/.test(html)
  const hrefMatch =
    html.match(/<a[^>]*id="footnoteref-1"[^>]*href="([^"]*)"/) ??
    html.match(/<a[^>]*href="([^"]*)"[^>]*id="footnoteref-1"/)
  const hrefValue = hrefMatch ? hrefMatch[1] : ' (not found)'
  console.log('Preserves id="footnoteref-N":', hasId)
  console.log('href value for first ref:', hrefValue)
  console.log('')

  const footnoteDiv = html.match(/<div[^>]*id="footnote-1"[^>]*>/)?.[0]
  console.log('Footnote target div id="footnote-1" preserved:', !!footnoteDiv)
  if (footnoteDiv) console.log(footnoteDiv)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
