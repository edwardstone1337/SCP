/**
 * Returns a deterministic index for today's date (UTC).
 * Same date always produces the same index.
 */
export function getDailyIndex(totalCount: number): number {
  const today = new Date()
  const y = today.getUTCFullYear()
  const m = String(today.getUTCMonth() + 1).padStart(2, '0')
  const d = String(today.getUTCDate()).padStart(2, '0')
  const dateString = `${y}-${m}-${d}`

  // Simple hash
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32-bit integer
  }

  return Math.abs(hash) % totalCount
}
