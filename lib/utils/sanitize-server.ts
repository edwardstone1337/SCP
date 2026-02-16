/**
 * Server-side HTML sanitization for SCP content.
 *
 * Uses JSDOM + DOMPurify to run the same sanitization pipeline as the client.
 * JSDOM and DOMPurify instances are created lazily and reused across calls.
 *
 * Usage: import { sanitizeHtmlServer } from '@/lib/utils/sanitize-server'
 * Only import in server components or server-only modules.
 */
import { JSDOM } from 'jsdom'
import DOMPurifyFactory from 'dompurify'
import { applyInlineStyleLegibilityFixes, SANITIZE_CONFIG } from './sanitize'
import { logger } from '@/lib/logger'

// Lazy singleton — created once per Node.js process lifetime
let purifyInstance: ReturnType<typeof DOMPurifyFactory> | null = null
let jsdomDoc: Document | null = null
let hooksRegistered = false

function ensureInitialized() {
  if (purifyInstance && jsdomDoc) return
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
  // DOMPurify expects WindowLike which needs DOM constructors — JSDOM provides these
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  purifyInstance = DOMPurifyFactory(dom.window as any)
  jsdomDoc = dom.window.document as unknown as Document
}

function ensureHooks() {
  if (hooksRegistered || !purifyInstance) return

  purifyInstance.addHook('afterSanitizeElements', (node: Node) => {
    const el = node as Element
    if (!el.tagName) return

    if (el.classList?.contains('licensebox')) {
      el.remove()
      return
    }

    if (el.tagName === 'A') {
      const href = el.getAttribute('href')
      if (href && /^\s*javascript\s*:/i.test(href)) {
        el.setAttribute('href', '#')
      }
    }
  })

  hooksRegistered = true
}

/**
 * Sanitize HTML server-side using JSDOM + DOMPurify.
 * Applies the same XSS prevention, licensebox removal, and dark theme
 * legibility fixes as the client-side sanitizeHtml.
 */
export function sanitizeHtmlServer(html: string): string {
  try {
    ensureInitialized()
    ensureHooks()
    const sanitized = purifyInstance!.sanitize(html, SANITIZE_CONFIG)
    return applyInlineStyleLegibilityFixes(sanitized, jsdomDoc!)
  } catch (error) {
    logger.error('Server-side sanitization failed, falling back to unsanitized', { error })
    // Return empty — caller should fall back to client-side rendering
    throw error
  }
}
