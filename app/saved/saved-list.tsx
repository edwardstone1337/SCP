'use client'

import { useState } from 'react'
import { Stack } from '@/components/ui/stack'
import { ScpListItem } from '@/components/ui/scp-list-item'
import { Text, Label } from '@/components/ui/typography'
import { Select } from '@/components/ui/select'

const sortOptions = [
  { value: 'saved-desc', label: 'Recently Saved' },
  { value: 'saved-asc', label: 'Oldest Saved' },
  { value: 'number-asc', label: 'Oldest First' },
  { value: 'number-desc', label: 'Newest First' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
]

export interface SavedScpItem {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number
  is_read: boolean
  bookmarked_at: string
}

interface SavedListProps {
  items: SavedScpItem[]
  userId: string
}

function sortSaved(items: SavedScpItem[], sortBy: string): SavedScpItem[] {
  const sorted = [...items]
  switch (sortBy) {
    case 'saved-desc':
      return sorted.sort(
        (a, b) => new Date(b.bookmarked_at).getTime() - new Date(a.bookmarked_at).getTime()
      )
    case 'saved-asc':
      return sorted.sort(
        (a, b) => new Date(a.bookmarked_at).getTime() - new Date(b.bookmarked_at).getTime()
      )
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

export function SavedList({ items, userId }: SavedListProps) {
  const [sortBy, setSortBy] = useState('saved-desc')
  const sortedItems = sortSaved(items, sortBy)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-2)',
          gap: 'var(--spacing-2)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <Label htmlFor="sort-select" style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>
            Sort by
          </Label>
          <Select
            id="sort-select"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            aria-label="Sort saved articles"
            style={{ width: 'auto', minWidth: '150px' }}
          />
        </div>
      </div>

      <Stack direction="vertical" gap="tight">
        {sortedItems.map((item) => (
          <ScpListItem
            key={item.id}
            id={item.id}
            scpId={item.scp_id}
            title={item.title}
            rating={item.rating}
            isRead={item.is_read}
            isBookmarked={true}
            href={`/scp/${item.scp_id}`}
            userId={userId}
          />
        ))}
      </Stack>
    </div>
  )
}
