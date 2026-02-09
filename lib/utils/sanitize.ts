/**
 * HTML Sanitization for SCP Content
 *
 * IMPORTANT: This sanitization currently only runs CLIENT-SIDE.
 * The sanitizeHtml function is designed to be used in Client Components only.
 *
 * Server-side sanitization is planned for v1.1 using isomorphic-dompurify.
 *
 * Current usage:
 * - app/scp/[id]/scp-reader.tsx (Client Component) ✓
 *
 * DO NOT USE in Server Components until server-side sanitization is implemented.
 */
import DOMPurify from 'dompurify'

let sanitizeHooksRegistered = false

function getRelativeLuminance(colorValue: string): number | null {
  const value = colorValue.trim().toLowerCase()
  const named: Record<string, [number, number, number]> = { black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 128, 0], blue: [0, 0, 255] }
  let rgb: [number, number, number] | null = named[value] ?? null

  if (!rgb && /^#([\da-f]{3}|[\da-f]{6})$/.test(value)) {
    const hex = value.length === 4 ? value.slice(1).split('').map((part) => part + part).join('') : value.slice(1)
    rgb = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((part) => Number.parseInt(part, 16)) as [number, number, number]
  }

  if (!rgb) {
    const match = value.match(/^rgba?\((.+)\)$/)
    if (!match) return null
    const channels = match[1].split(',').slice(0, 3).map((part) => part.trim())
    if (channels.length !== 3) return null
    rgb = channels.map((channel) => channel.endsWith('%')
      ? Math.round((Math.max(0, Math.min(100, Number.parseFloat(channel))) / 100) * 255)
      : Math.round(Math.max(0, Math.min(255, Number.parseFloat(channel))))) as [number, number, number]
  }

  const linear = rgb.map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function applyInlineStyleLegibilityFixes(html: string): string {
  const template = document.createElement('template')
  template.innerHTML = html

  template.content.querySelectorAll<HTMLElement>('[style]').forEach((element) => {
    const style = element.style
    const colorValue = style.getPropertyValue('color').trim()
    const backgroundValue = style.getPropertyValue('background').trim().toLowerCase()
    const backgroundColorValue = style.getPropertyValue('background-color').trim().toLowerCase()
    const backgroundImageValue = style.getPropertyValue('background-image').trim().toLowerCase()

    const hasInlineColor = colorValue !== ''
    const hasInlineBackground = backgroundValue !== ''
    const hasInlineBackgroundColor = backgroundColorValue !== ''
    const hasInlineBackgroundImage = backgroundImageValue !== ''
    const isNonVisualBackground = (value: string) => ['', 'transparent', 'none', 'inherit', 'initial', 'unset'].includes(value)
    const hasMeaningfulBackground =
      (hasInlineBackground && !isNonVisualBackground(backgroundValue)) ||
      (hasInlineBackgroundColor && !isNonVisualBackground(backgroundColorValue)) ||
      (hasInlineBackgroundImage && !isNonVisualBackground(backgroundImageValue))

    if (hasMeaningfulBackground && !hasInlineColor) {
      style.setProperty('color', '#1a1a1a')
      return
    }

    if (!hasInlineColor || hasInlineBackground || hasInlineBackgroundColor) {
      return
    }

    const luminance = getRelativeLuminance(colorValue)
    if (luminance !== null && luminance < 0.4) {
      style.setProperty('background-color', '#f5f5f5')
    }
  })

  return template.innerHTML
}

function registerSanitizeHooks() {
  if (sanitizeHooksRegistered || typeof window === 'undefined') {
    return
  }

  DOMPurify.addHook('afterSanitizeElements', (node) => {
    if (!(node instanceof Element)) {
      return
    }

    if (node.classList.contains('licensebox')) {
      node.remove()
      return
    }

    if (node.tagName === 'A') {
      const href = node.getAttribute('href')
      if (href && /^\s*javascript\s*:/i.test(href)) {
        node.remove()
      }
    }
  })

  sanitizeHooksRegistered = true
}

/**
 * Sanitize HTML content from external sources to prevent XSS
 * Uses DOMPurify with a safe configuration
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return as-is (will be sanitized on client)
    return html
  }

  registerSanitizeHooks()

  const sanitized = DOMPurify.sanitize(html, {
    // Allow common HTML tags used in SCP articles
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'table', 'thead', 'tbody',
      'tr', 'th', 'td', 'div', 'span', 'code', 'pre', 'hr', 'sup', 'sub'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style'],
    // Keep relative URLs for internal wiki links
    ALLOW_DATA_ATTR: false,
  })

  return applyInlineStyleLegibilityFixes(sanitized)
}
