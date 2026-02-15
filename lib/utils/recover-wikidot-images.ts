/**
 * Recovers missing images from Wikidot source into rendered HTML.
 * Parses raw_source for image refs not present in raw_content and injects <img> tags.
 * v2: Supports both bare filenames and full Wikidot URLs (sandbox, cross-wiki).
 */

const IMG_TAG_REGEX =
  /\[\[(f?[=<>])?image\s+(\S+?)(?:\s+style="([^"]*)")?\s*\]\]/gi
const IMAGE_BLOCK_REGEX =
  /\[\[include\s+[\s\S]*?component:image-block[\s\S]*?(?:\s|\|)name=([^\s|\]\n]+)/gi

function extractRenderedSrcs(rawContent: string): Set<string> {
  const set = new Set<string>()
  const imgRegex = /<img[^>]+src="([^"]+)"/gi
  let m: RegExpExecArray | null
  while ((m = imgRegex.exec(rawContent)) !== null) {
    const src = m[1]
    set.add(src)
    const basename = src.includes('/') ? src.replace(/^.*\//, '') : src
    if (basename) set.add(basename)
  }
  return set
}

function trimSource(rawSource: string): string {
  let s = rawSource
  const includeLicense = /\[\[include\s[^\]]*license-box[^\]]*\]\][\s\S]*$/i
  const footer = /\[\[div class="footer-wikiwalk[\s\S]*$/i
  if (includeLicense.test(s)) s = s.replace(includeLicense, '')
  if (footer.test(s)) s = s.replace(footer, '')
  return s
}

/**
 * Resolves an image reference to a final src URL.
 * Returns null for genuinely external images (Flickr, Imgur, etc.).
 * Allows any *.wdfiles.com or *.wikidot.com domain (sandbox, cross-wiki).
 */
function resolveImageSrc(ref: string, scpSlug: string): string | null {
  if (ref.startsWith('http://') || ref.startsWith('https://')) {
    try {
      const url = new URL(ref)
      if (
        url.hostname.endsWith('.wdfiles.com') ||
        url.hostname.endsWith('.wikidot.com')
      ) {
        url.protocol = 'https:'
        return url.toString()
      }
    } catch {
      // malformed URL
    }
    return null
  }
  if (ref.includes(':')) return null
  return `https://scp-wiki.wdfiles.com/local--files/${scpSlug}/${encodeURIComponent(ref)}`
}

function isAlreadyRendered(ref: string, src: string, rendered: Set<string>): boolean {
  if (rendered.has(ref) || rendered.has(src)) return true
  const basename = ref.includes('/') ? ref.replace(/^.*\//, '') : ref
  return rendered.has(basename)
}

interface RecoveredImage {
  src: string
  style: string
  align: 'left' | 'center' | 'right'
  segmentIndex: number
}

function getSegmentIndex(matchIndex: number, hrPositions: number[]): number {
  let seg = 0
  for (const pos of hrPositions) {
    if (matchIndex >= pos) seg++
    else break
  }
  return seg
}

function buildImageHtml(
  src: string,
  style: string,
  align: 'left' | 'center' | 'right'
): string {
  const safeStyle = (style || '').replace(/"/g, '&quot;').trim()
  const textAlign = { left: 'left', center: 'center', right: 'right' }[align]
  return `<div class="recovered-image" style="text-align:${textAlign}; margin:1rem 0;"><img src="${src}" style="${safeStyle}" alt="" loading="lazy" /></div>`
}

export function recoverWikidotImages(
  rawContent: string,
  rawSource: string,
  scpSlug: string
): string {
  if (!rawSource || !rawContent || !scpSlug?.trim()) return rawContent ?? ''

  const rendered = extractRenderedSrcs(rawContent)
  const trimmed = trimSource(rawSource)
  const slug = scpSlug.toLowerCase()

  // ---- positions in source (segment boundaries)
  const sourceHrPositions: number[] = []
  const hrInSource = /----/g
  let hm: RegExpExecArray | null
  while ((hm = hrInSource.exec(trimmed)) !== null) {
    sourceHrPositions.push(hm.index)
  }

  const recovered: RecoveredImage[] = []

  // Pattern A — [[...image filename...]]
  IMG_TAG_REGEX.lastIndex = 0
  let ma: RegExpExecArray | null
  while ((ma = IMG_TAG_REGEX.exec(trimmed)) !== null) {
    const prefix = (ma[1] ?? '').replace('f', '')
    const ref = ma[2].trim()
    const style = (ma[3] ?? '').trim()
    const src = resolveImageSrc(ref, slug)
    if (!src || isAlreadyRendered(ref, src, rendered)) continue
    const align: 'left' | 'center' | 'right' =
      prefix === '<' ? 'left' : prefix === '>' ? 'right' : 'center'
    recovered.push({
      src,
      style,
      align,
      segmentIndex: getSegmentIndex(ma.index, sourceHrPositions),
    })
  }

  // Pattern B — component:image-block name=...
  IMAGE_BLOCK_REGEX.lastIndex = 0
  let mb: RegExpExecArray | null
  while ((mb = IMAGE_BLOCK_REGEX.exec(trimmed)) !== null) {
    const ref = mb[1].trim()
    const src = resolveImageSrc(ref, slug)
    if (!src || isAlreadyRendered(ref, src, rendered)) continue
    recovered.push({
      src,
      style: '',
      align: 'center',
      segmentIndex: getSegmentIndex(mb.index, sourceHrPositions),
    })
  }

  if (recovered.length === 0) return rawContent

  // <hr positions in content (exclude any inside .licensebox)
  const licenseboxStart = rawContent.search(/<div\s+class="licensebox"/i)
  const contentBoundary = licenseboxStart > -1 ? licenseboxStart : rawContent.length
  const contentHrPositions: number[] = []
  const hrInContent = /<hr\b/gi
  while ((hm = hrInContent.exec(rawContent)) !== null) {
    if (hm.index < contentBoundary) contentHrPositions.push(hm.index)
  }
  const numContentSegments = contentHrPositions.length

  // Group recovered by segment, then insert before the corresponding <hr
  const bySegment = new Map<number, RecoveredImage[]>()
  for (const img of recovered) {
    const seg = img.segmentIndex
    if (!bySegment.has(seg)) bySegment.set(seg, [])
    bySegment.get(seg)!.push(img)
  }

  const inserts: { index: number; html: string }[] = []
  if (numContentSegments === 0) {
    const html = recovered
      .map((r) => buildImageHtml(r.src, r.style, r.align))
      .join('')
    inserts.push({ index: 0, html })
  } else {
    for (const [segStr, images] of bySegment) {
      const seg = Number(segStr)
      const html = images
        .map((r) => buildImageHtml(r.src, r.style, r.align))
        .join('')
      const index =
        seg === 0
          ? 0
          : seg >= numContentSegments
            ? contentBoundary
            : contentHrPositions[seg]
      inserts.push({ index, html })
    }
  }

  // Merge inserts at same index (e.g. multiple segments appended)
  const merged = new Map<number, string>()
  for (const { index, html } of inserts) {
    merged.set(index, (merged.get(index) ?? '') + html)
  }
  const sorted = [...merged.entries()].sort((a, b) => b[0] - a[0])
  let result = rawContent
  for (const [index, html] of sorted) {
    result = result.slice(0, index) + html + result.slice(index)
  }
  return result
}
