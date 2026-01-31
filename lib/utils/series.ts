// Map series values to Roman numerals
const ROMAN_NUMERALS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] as const

export function seriesToRoman(series: string): string | null {
  const match = series.match(/^series-(\d+)$/)
  if (!match) return null

  const num = parseInt(match[1], 10)
  return num >= 1 && num <= ROMAN_NUMERALS.length ? ROMAN_NUMERALS[num] : null
}

export function romanToSeries(roman: string): string {
  const index = ROMAN_NUMERALS.indexOf(roman as (typeof ROMAN_NUMERALS)[number])
  return index > 0 ? `series-${index}` : ''
}

// Get content filename from series
export function getContentFilename(series: string): string {
  // Only handle main series (series-1, series-2, etc.)
  const match = series.match(/^series-(\d+)$/)
  if (match) {
    return `content_series-${match[1]}.json`
  }

  // Specials (if we ever need them)
  if (series === 'explained') return 'content_explained.json'
  if (series === 'scp-001') return 'content_scp-001.json'

  throw new Error(`Unknown series: ${series}`)
}

// Calculate range from SCP number
export function getRange(scpNumber: number): number {
  return Math.floor(scpNumber / 100) * 100
}

export function formatRange(rangeStart: number): string {
  const start = String(rangeStart).padStart(3, '0')
  const end = String(rangeStart + 99).padStart(3, '0')
  return `${start} - ${end}`
}
