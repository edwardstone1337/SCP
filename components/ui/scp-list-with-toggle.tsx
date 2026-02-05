'use client'

import { useState } from 'react'
import { Stack } from '@/components/ui/stack'
import { ScpListItem } from '@/components/ui/scp-list-item'
import { Text } from '@/components/ui/typography'

interface ScpItem {
  id: string
  scp_id: string
  title: string
  rating: number
  is_read: boolean
}

interface ScpListWithToggleProps {
  scps: ScpItem[]
  isAuthenticated: boolean  // Hide toggle for guests (all items are unread anyway)
  userId?: string | null    // For ReadToggleButton auth
}

export function ScpListWithToggle({ scps, isAuthenticated, userId }: ScpListWithToggleProps) {
  const [hideRead, setHideRead] = useState(false)
  
  const filteredScps = hideRead ? scps.filter(scp => !scp.is_read) : scps
  const readCount = scps.filter(scp => scp.is_read).length
  
  return (
    <div>
      {/* Toggle - only show for authenticated users with some read items */}
      {isAuthenticated && readCount > 0 && (
        <div style={{ marginBottom: 'var(--spacing-2)' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-1)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={hideRead}
              onChange={(e) => setHideRead(e.target.checked)}
              style={{ 
                width: '18px', 
                height: '18px',
                accentColor: 'var(--color-accent)'
              }}
            />
            <Text variant="secondary" size="sm">
              Hide read ({readCount})
            </Text>
          </label>
        </div>
      )}
      
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
            href={`/scp/${scp.scp_id}`}
            userId={userId ?? null}
          />
        ))}
      </Stack>
      
      {/* Empty state when all filtered out */}
      {filteredScps.length === 0 && hideRead && (
        <Text variant="secondary" style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
          All articles in this range have been read! 🎉
        </Text>
      )}
    </div>
  )
}
