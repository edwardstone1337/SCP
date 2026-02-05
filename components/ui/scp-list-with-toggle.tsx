'use client'

import { useState } from 'react'
import { Stack } from '@/components/ui/stack'
import { ScpListItem } from '@/components/ui/scp-list-item'
import { Text, Label } from '@/components/ui/typography'
import { Select } from '@/components/ui/select'

const sortOptions = [
  { value: 'number-asc', label: 'Oldest First' },
  { value: 'number-desc', label: 'Newest First' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
]

interface ScpItem {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
  is_bookmarked: boolean
}

interface ScpListWithToggleProps {
  scps: ScpItem[]
  isAuthenticated: boolean  // Hide toggle for guests (all items are unread anyway)
  userId?: string | null    // For ReadToggleButton auth
}

function sortScps(scps: ScpItem[], sortBy: string): ScpItem[] {
  const sorted = [...scps]
  switch (sortBy) {
    case 'number-desc':
      return sorted.sort((a, b) => b.scp_number - a.scp_number)
    case 'rating-desc':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'rating-asc':
      return sorted.sort((a, b) => a.rating - b.rating)
    case 'number-asc':
    default:
      return sorted.sort((a, b) => a.scp_number - b.scp_number)
  }
}

export function ScpListWithToggle({ scps, isAuthenticated, userId }: ScpListWithToggleProps) {
  const [hideRead, setHideRead] = useState(false)
  const [sortBy, setSortBy] = useState('number-asc')

  const sortedScps = sortScps(scps, sortBy)
  const filteredScps = hideRead ? sortedScps.filter(scp => !scp.is_read) : sortedScps
  const readCount = scps.filter(scp => scp.is_read).length

  return (
    <div>
      {/* Controls row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-list-gap)',
          gap: 'var(--spacing-2)',
          flexWrap: 'wrap',
        }}
      >
        {/* Sort dropdown - always visible */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <Label htmlFor="sort-select" style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>
            Sort by
          </Label>
          <Select
            id="sort-select"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            aria-label="Sort articles"
            style={{ width: 'auto', minWidth: '150px' }}
          />
        </div>

        {/* Hide read toggle - only for authenticated with read items */}
        {isAuthenticated && readCount > 0 && (
          <label
            htmlFor="hide-read-checkbox"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-1)',
              cursor: 'pointer',
            }}
          >
            <input
              id="hide-read-checkbox"
              type="checkbox"
              checked={hideRead}
              onChange={(e) => setHideRead(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--color-accent)',
              }}
            />
            <Text variant="secondary" size="sm">
              Hide read ({readCount})
            </Text>
          </label>
        )}
      </div>

      {/* List */}
      <Stack direction="vertical" gap="tight">
        {filteredScps.map((scp) => (
          <ScpListItem
            key={scp.id}
            id={scp.id}
            scpId={scp.scp_id}
            title={scp.title}
            rating={scp.rating}
            isRead={scp.is_read}
            isBookmarked={scp.is_bookmarked}
            href={`/scp/${scp.scp_id}`}
            userId={userId ?? null}
          />
        ))}
      </Stack>
      
      {/* Empty state when all filtered out */}
      {filteredScps.length === 0 && hideRead && (
        <Text variant="secondary" style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
          All articles in this range have been read.
        </Text>
      )}
    </div>
  )
}
