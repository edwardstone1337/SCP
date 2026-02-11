const NAMED_COLORS = {
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function normalizeCssColor(colorValue) {
  return colorValue.trim().toLowerCase().replace(/\s*!important\s*$/i, '')
}

function parseAlpha(value) {
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

function parseRgbChannel(value) {
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

function parseHue(value) {
  const trimmed = value.trim().toLowerCase()
  if (trimmed === '') return null

  let degrees
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
  return ((degrees % 360) + 360) % 360
}

function parsePercentage(value) {
  const trimmed = value.trim().toLowerCase()
  if (!trimmed.endsWith('%')) return null
  const numeric = Number.parseFloat(trimmed.slice(0, -1))
  if (Number.isNaN(numeric)) return null
  return clamp(numeric / 100, 0, 1)
}

function parseHexColor(value) {
  const hex = value.replace('#', '')
  if (![3, 4, 6, 8].includes(hex.length)) {
    return null
  }
  const expanded = (hex.length === 3 || hex.length === 4)
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

function splitFunctionArguments(content) {
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

function parseRgbFunction(value) {
  const match = value.match(/^rgba?\((.+)\)$/i)
  if (!match) return null
  const parsed = splitFunctionArguments(match[1])
  if (!parsed) return null

  const [rRaw, gRaw, bRaw] = parsed.channels
  const r = parseRgbChannel(rRaw)
  const g = parseRgbChannel(gRaw)
  const b = parseRgbChannel(bRaw)
  if ([r, g, b].some((part) => part == null)) return null

  return {
    r,
    g,
    b,
    a: parseAlpha(parsed.alpha),
  }
}

function hslToRgb(h, s, l) {
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

function parseHslFunction(value) {
  const match = value.match(/^hsla?\((.+)\)$/i)
  if (!match) return null
  const parsed = splitFunctionArguments(match[1])
  if (!parsed) return null

  const [hRaw, sRaw, lRaw] = parsed.channels
  const h = parseHue(hRaw)
  const s = parsePercentage(sRaw)
  const l = parsePercentage(lRaw)
  if ([h, s, l].some((part) => part == null)) return null

  const [r, g, b] = hslToRgb(h, s, l)
  return {
    r,
    g,
    b,
    a: parseAlpha(parsed.alpha),
  }
}

function parseColor(value) {
  const normalized = normalizeCssColor(value)
  if (normalized === '') return null
  if (normalized in NAMED_COLORS) {
    const [r, g, b, a] = NAMED_COLORS[normalized]
    return { r, g, b, a }
  }
  if (normalized.startsWith('#')) return parseHexColor(normalized)
  if (/^rgba?\(/i.test(normalized)) return parseRgbFunction(normalized)
  if (/^hsla?\(/i.test(normalized)) return parseHslFunction(normalized)
  return null
}

function getRelativeLuminance(colorValue) {
  const parsed = parseColor(colorValue)
  if (!parsed || parsed.a <= 0) return null

  const linear = [parsed.r, parsed.g, parsed.b].map((channel) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

function assert(name, condition, details) {
  if (!condition) {
    throw new Error(`${name} failed: ${details}`)
  }
}

const cases = [
  ['rgb(26, 26, 26)', (v) => v !== null && v < 0.15],
  ['rgb(0, 0, 0)', (v) => v !== null && v < 0.15],
  ['#f5f5f5', (v) => v !== null && v > 0.8],
  ['hsl(0, 0%, 10%)', (v) => v !== null && v < 0.15],
  ['chartreuse', (v) => v === null],
]

const results = cases.map(([input, predicate]) => {
  const value = getRelativeLuminance(input)
  assert(`getRelativeLuminance(${input})`, predicate(value), `received ${String(value)}`)
  return { input, luminance: value }
})

console.log('sanitize luminance checks passed')
for (const result of results) {
  console.log(`${result.input} => ${String(result.luminance)}`)
}
