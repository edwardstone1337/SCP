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
 *
 * WORKFLOW: After modifying applyInlineStyleLegibilityFixes or sanitizeHtml logic,
 * verify dark theme legibility across the top 100 SCPs:
 *   npx tsx scripts/dark-theme-scanner.ts
 */
import DOMPurify from 'dompurify'

let sanitizeHooksRegistered = false

const NAMED_COLORS: Record<string, [number, number, number, number]> = {
  black: [0, 0, 0, 1],
  white: [255, 255, 255, 1],
  red: [255, 0, 0, 1],
  blue: [0, 0, 255, 1],
  green: [0, 128, 0, 1],
  lime: [0, 255, 0, 1],
  yellow: [255, 255, 0, 1],
  orange: [255, 165, 0, 1],
  purple: [128, 0, 128, 1],
  violet: [238, 130, 238, 1],
  pink: [255, 192, 203, 1],
  brown: [165, 42, 42, 1],
  gray: [128, 128, 128, 1],
  grey: [128, 128, 128, 1],
  darkgray: [169, 169, 169, 1],
  darkgrey: [169, 169, 169, 1],
  lightgray: [211, 211, 211, 1],
  lightgrey: [211, 211, 211, 1],
  silver: [192, 192, 192, 1],
  maroon: [128, 0, 0, 1],
  navy: [0, 0, 128, 1],
  teal: [0, 128, 128, 1],
  olive: [128, 128, 0, 1],
  cyan: [0, 255, 255, 1],
  magenta: [255, 0, 255, 1],
  aqua: [0, 255, 255, 1],
  transparent: [0, 0, 0, 0],
}

const COLOR_TOKEN_PATTERN = /#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)|\b[a-z]+\b/gi
const URL_FUNCTION_PATTERN = /url\((?:[^()\\]|\\.)*\)/gi

interface ParsedColor {
  r: number
  g: number
  b: number
  a: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function normalizeCssColor(colorValue: string): string {
  return colorValue.trim().toLowerCase().replace(/\s*!important\s*$/i, '')
}

function parseAlpha(value: string | null): number {
  if (!value) return 1
  const trimmed = value.trim().toLowerCase()
  if (trimmed.endsWith('%')) {
    const percentage = Number.parseFloat(trimmed.slice(0, -1))
    if (Number.isNaN(percentage)) return 1
    return clamp(percentage / 100, 0, 1)
  }
  const alpha = Number.parseFloat(trimmed)
  if (Number.isNaN(alpha)) return 1
  return clamp(alpha, 0, 1)
}

function parseRgbChannel(value: string): number | null {
  const trimmed = value.trim().toLowerCase()
  if (trimmed === '') return null
  if (trimmed.endsWith('%')) {
    const percentage = Number.parseFloat(trimmed.slice(0, -1))
    if (Number.isNaN(percentage)) return null
    return Math.round(clamp(percentage, 0, 100) * 2.55)
  }
  const numeric = Number.parseFloat(trimmed)
  if (Number.isNaN(numeric)) return null
  return Math.round(clamp(numeric, 0, 255))
}

function parseHue(value: string): number | null {
  const trimmed = value.trim().toLowerCase()
  if (trimmed === '') return null

  let degrees: number
  if (trimmed.endsWith('deg')) {
    degrees = Number.parseFloat(trimmed.slice(0, -3))
  } else if (trimmed.endsWith('rad')) {
    const radians = Number.parseFloat(trimmed.slice(0, -3))
    degrees = (radians * 180) / Math.PI
  } else if (trimmed.endsWith('turn')) {
    const turns = Number.parseFloat(trimmed.slice(0, -4))
    degrees = turns * 360
  } else if (trimmed.endsWith('grad')) {
    const grads = Number.parseFloat(trimmed.slice(0, -4))
    degrees = grads * 0.9
  } else {
    degrees = Number.parseFloat(trimmed)
  }

  if (Number.isNaN(degrees)) return null
  const normalized = ((degrees % 360) + 360) % 360
  return normalized
}

function parsePercentage(value: string): number | null {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed.endsWith('%')) return null
  const numeric = Number.parseFloat(trimmed.slice(0, -1))
  if (Number.isNaN(numeric)) return null
  return clamp(numeric / 100, 0, 1)
}

function parseHexColor(value: string): ParsedColor | null {
  const hex = value.replace('#', '')
  if (![3, 4, 6, 8].includes(hex.length)) {
    return null
  }

  const expanded = hex.length === 3 || hex.length === 4
    ? hex.split('').map((ch) => ch + ch).join('')
    : hex

  const hasAlpha = expanded.length === 8
  const r = Number.parseInt(expanded.slice(0, 2), 16)
  const g = Number.parseInt(expanded.slice(2, 4), 16)
  const b = Number.parseInt(expanded.slice(4, 6), 16)
  const alphaByte = hasAlpha ? Number.parseInt(expanded.slice(6, 8), 16) : 255
  if ([r, g, b, alphaByte].some((part) => Number.isNaN(part))) {
    return null
  }

  return { r, g, b, a: alphaByte / 255 }
}

function splitFunctionArguments(content: string): { channels: string[], alpha: string | null } | null {
  const value = content.trim()
  if (value === '') return null

  if (value.includes(',')) {
    const parts = value.split(',').map((part) => part.trim()).filter(Boolean)
    if (parts.length < 3 || parts.length > 4) return null
    return {
      channels: parts.slice(0, 3),
      alpha: parts.length === 4 ? parts[3] : null,
    }
  }

  const slashParts = value.split('/')
  if (slashParts.length > 2) return null
  const channels = slashParts[0].trim().split(/\s+/).filter(Boolean)
  if (channels.length !== 3) return null
  return {
    channels,
    alpha: slashParts.length === 2 ? slashParts[1].trim() : null,
  }
}

function parseRgbFunction(value: string): ParsedColor | null {
  const match = value.match(/^rgba?\((.+)\)$/i)
  if (!match) return null

  const parsed = splitFunctionArguments(match[1])
  if (!parsed) return null

  const [rRaw, gRaw, bRaw] = parsed.channels
  const r = parseRgbChannel(rRaw)
  const g = parseRgbChannel(gRaw)
  const b = parseRgbChannel(bRaw)
  if ([r, g, b].some((part) => part == null)) {
    return null
  }

  return {
    r: r as number,
    g: g as number,
    b: b as number,
    a: parseAlpha(parsed.alpha),
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let rPrime = 0
  let gPrime = 0
  let bPrime = 0

  if (h < 60) {
    rPrime = c
    gPrime = x
  } else if (h < 120) {
    rPrime = x
    gPrime = c
  } else if (h < 180) {
    gPrime = c
    bPrime = x
  } else if (h < 240) {
    gPrime = x
    bPrime = c
  } else if (h < 300) {
    rPrime = x
    bPrime = c
  } else {
    rPrime = c
    bPrime = x
  }

  return [
    Math.round((rPrime + m) * 255),
    Math.round((gPrime + m) * 255),
    Math.round((bPrime + m) * 255),
  ]
}

function parseHslFunction(value: string): ParsedColor | null {
  const match = value.match(/^hsla?\((.+)\)$/i)
  if (!match) return null

  const parsed = splitFunctionArguments(match[1])
  if (!parsed) return null

  const [hRaw, sRaw, lRaw] = parsed.channels
  const h = parseHue(hRaw)
  const s = parsePercentage(sRaw)
  const l = parsePercentage(lRaw)
  if ([h, s, l].some((part) => part == null)) {
    return null
  }

  const [r, g, b] = hslToRgb(h as number, s as number, l as number)
  return {
    r,
    g,
    b,
    a: parseAlpha(parsed.alpha),
  }
}

export function parseColor(value: string): ParsedColor | null {
  const normalized = normalizeCssColor(value)
  if (normalized === '') return null

  if (normalized in NAMED_COLORS) {
    const [r, g, b, a] = NAMED_COLORS[normalized]
    return { r, g, b, a }
  }

  if (normalized.startsWith('#')) {
    return parseHexColor(normalized)
  }

  if (/^rgba?\(/i.test(normalized)) {
    return parseRgbFunction(normalized)
  }

  if (/^hsla?\(/i.test(normalized)) {
    return parseHslFunction(normalized)
  }

  return null
}

export function getRelativeLuminance(colorValue: string): number | null {
  const parsed = parseColor(colorValue)
  if (!parsed || parsed.a <= 0) {
    return null
  }

  const linear = [parsed.r, parsed.g, parsed.b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function getExplicitBackgroundColor(backgroundValue: string, backgroundColorValue: string): string | null {
  const backgroundColor = parseColor(backgroundColorValue)
  if (backgroundColor && backgroundColor.a > 0) {
    return backgroundColorValue
  }

  if (backgroundValue.trim() === '') {
    return null
  }

  const backgroundWithoutUrls = backgroundValue.replace(URL_FUNCTION_PATTERN, ' ')
  const candidates = backgroundWithoutUrls.match(COLOR_TOKEN_PATTERN) ?? []
  for (const candidate of candidates) {
    const parsed = parseColor(candidate)
    if (parsed && parsed.a > 0) {
      return candidate
    }
  }

  return null
}

function replaceNearBlackColorsInValue(value: string, replacementColor: string): string {
  return value.replace(COLOR_TOKEN_PATTERN, (token) => {
    const luminance = getRelativeLuminance(token)
    if (luminance !== null && luminance < 0.15) {
      return replacementColor
    }
    return token
  })
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
    const hasInlineBackgroundImage = backgroundImageValue !== ''
    const isNonVisualBackground = (value: string) => ['', 'transparent', 'none', 'inherit', 'initial', 'unset'].includes(value)
    const hasExplicitBackgroundColor = getExplicitBackgroundColor(backgroundValue, backgroundColorValue) !== null
    const hasMeaningfulBackgroundImage =
      hasInlineBackgroundImage &&
      !isNonVisualBackground(backgroundImageValue)
    const hasMeaningfulBackground = hasExplicitBackgroundColor || hasMeaningfulBackgroundImage

    if (hasMeaningfulBackground && !hasInlineColor) {
      // For background images/gradients, remove the image and apply dark theme colors
      const hasBackgroundImage = hasMeaningfulBackgroundImage ||
                                 backgroundValue.includes('url(') ||
                                 backgroundValue.includes('gradient')
      if (hasBackgroundImage) {
        style.setProperty('background', 'none', 'important')
        style.setProperty('background-color', 'var(--grey-2, #1e1e1e)', 'important')
        style.setProperty('color', 'var(--grey-9, #e0e0e0)', 'important')
      } else {
        // For solid background colors, set dark text
        style.setProperty('color', '#1a1a1a')
      }

      return
    }

    if (!hasInlineColor || hasMeaningfulBackground) {
      return
    }

    const luminance = getRelativeLuminance(colorValue)
    if (luminance !== null && luminance < 0.4) {
      style.setProperty('background-color', '#f5f5f5')
    }
  })

  const borderReplacementColor = 'var(--grey-6, #888)'
  const borderColorProperties = ['border-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'] as const
  const borderShorthandProperties = ['border', 'border-top', 'border-right', 'border-bottom', 'border-left'] as const

  template.content.querySelectorAll<HTMLElement>('[style]').forEach((element) => {
    const style = element.style

    borderColorProperties.forEach((property) => {
      const value = style.getPropertyValue(property).trim()
      if (value === '') {
        return
      }
      const luminance = getRelativeLuminance(value)
      if (luminance !== null && luminance < 0.15) {
        style.setProperty(property, borderReplacementColor)
      }
    })

    borderShorthandProperties.forEach((property) => {
      const value = style.getPropertyValue(property).trim()
      if (value === '') {
        return
      }
      const rewritten = replaceNearBlackColorsInValue(value, borderReplacementColor)
      if (rewritten !== value) {
        style.setProperty(property, rewritten)
      }
    })
  })

  return template.innerHTML
}

function registerSanitizeHooks(purifyInstance?: any) {
  const purify = purifyInstance || DOMPurify

  if (sanitizeHooksRegistered || (typeof window === 'undefined' && !purifyInstance)) {
    return
  }

  purify.addHook('afterSanitizeElements', (node: any) => {
    // In Node.js, Element comes from the JSDOM window
    const ElementClass = (typeof window !== 'undefined' && window.Element) || Element
    if (!(node instanceof ElementClass)) {
      return
    }

    if (node.classList.contains('licensebox')) {
      node.remove()
      return
    }

    if (node.tagName === 'A') {
      const href = node.getAttribute('href')
      if (href && /^\s*javascript\s*:/i.test(href)) {
        // Neutralize javascript: hrefs instead of removing the element,
        // as Wikidot footnote refs use href="javascript:;" and useFootnotes
        // depends on these anchor elements being present in the DOM.
        node.setAttribute('href', '#')
      }
    }
  })

  sanitizeHooksRegistered = true
}

/**
 * Sanitize HTML content from external sources to prevent XSS
 * Uses DOMPurify with a safe configuration
 *
 * @param html - The HTML string to sanitize
 * @param customDOMPurify - Optional DOMPurify instance (for Node.js environments)
 */
export function sanitizeHtml(html: string, customDOMPurify?: any): string {
  // If no custom DOMPurify provided and we're server-side, return as-is
  if (typeof window === 'undefined' && !customDOMPurify) {
    // Server-side: return as-is (will be sanitized on client)
    return html
  }

  const purify = customDOMPurify || DOMPurify
  registerSanitizeHooks(customDOMPurify)

  const sanitized = purify.sanitize(html, {
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
