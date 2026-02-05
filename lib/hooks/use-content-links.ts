'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const WIKI_BASE = 'https://scp-wiki.wikidot.com'

/** Relative SCP link: /scp-682 or /scp-682#section */
const SCP_RELATIVE = /^\/scp-(\d+)(?:[#?]|$)/

/** Absolute SCP wiki URLs; capture group 1 = number */
const SCP_ABSOLUTE =
  /^https?:\/\/(?:scp-wiki\.wikidot\.com|scpwiki\.com|www\.scp-wiki\.net)\/scp-(\d+)(?:[#?\/]|$)/i

function getScpNumber(href: string): string | null {
  const trimmed = (href || '').trim()
  const relativeMatch = trimmed.match(SCP_RELATIVE)
  if (relativeMatch) return relativeMatch[1]
  const absoluteMatch = trimmed.match(SCP_ABSOLUTE)
  if (absoluteMatch) return absoluteMatch[1]
  return null
}

function isScpLink(href: string): boolean {
  return getScpNumber(href) !== null
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href) && !isScpLink(href)
}

/** Relative path starting with / that is not an SCP link (e.g. /licensing-guide, /component:license-box) */
function isRelativeWikiLink(href: string): boolean {
  const trimmed = (href || '').trim()
  return trimmed.startsWith('/') && getScpNumber(href) === null
}

/**
 * Intercepts link clicks inside .scp-content:
 * 1. Footnote refs → skip (handled by useFootnotes)
 * 2. SCP-to-SCP (relative or absolute) → client-side navigation
 * 3. External http(s) → new tab
 * 4. Relative wiki paths (/foo, /component:bar) → rewrite to wiki URL, new tab
 * 5. Empty/missing href (e.g. stripped javascript:) → preventDefault only
 * 6. Everything else → default behavior
 *
 * @param containerRef - Ref to the .scp-content container (or parent that contains it)
 * @param contentLoaded - When true, content is rendered and we attach the listener
 */
export function useContentLinks(
  containerRef: React.RefObject<HTMLElement | null>,
  contentLoaded: boolean
): void {
  const router = useRouter()

  useEffect(() => {
    if (!contentLoaded || !containerRef.current) return

    const container = containerRef.current

    function handleClick(e: MouseEvent): void {
      const target = e.target as Node
      const anchor = (target as Element).closest?.('a')
      if (!anchor || !container.contains(anchor)) return

      const href = anchor.getAttribute('href')
      if (href == null || href === '') {
        e.preventDefault()
        return
      }

      // 1. Skip footnote refs (useFootnotes handles tooltip)
      if (anchor.id?.startsWith('footnoteref-')) return

      // 2. SCP-to-SCP → in-app navigation
      const scpNum = getScpNumber(href)
      if (scpNum != null) {
        e.preventDefault()
        router.push(`/scp/SCP-${scpNum}`)
        return
      }

      // 3. External (absolute http(s), including wiki non-SCP pages) → new tab
      if (isExternal(href)) {
        e.preventDefault()
        window.open(href, '_blank', 'noopener,noreferrer')
        return
      }

      // 4. Relative wiki link (e.g. /licensing-guide, /component:license-box) → wiki in new tab
      if (isRelativeWikiLink(href)) {
        e.preventDefault()
        const path = (href || '').trim()
        const rewrittenUrl = `${WIKI_BASE}${path.startsWith('/') ? path : `/${path}`}`
        window.open(rewrittenUrl, '_blank', 'noopener,noreferrer')
        return
      }

      // 5. Empty/missing href already handled above
      // 6. Everything else: allow default (e.g. in-page #anchor)
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
    // containerRef is stable (useRef), but included for correctness
    // when the container element mounts/unmounts
  }, [contentLoaded, containerRef, router])
}
