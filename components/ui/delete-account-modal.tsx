'use client'

import { CSSProperties, useState } from 'react'
import { useModal } from '@/components/ui/modal-provider'
import { createClient } from '@/lib/supabase/client'
import { deleteAccount } from '@/app/actions/auth'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'

const headingStyle: CSSProperties = {
  fontSize: 'var(--font-size-xl)',
  lineHeight: 'var(--line-height-xl)',
  fontWeight: 700,
  color: 'var(--color-text-primary)',
  margin: 0,
}

const warningStyle: CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
}

const errorStyle: CSSProperties = {
  color: 'var(--color-red-7)',
  fontSize: 'var(--font-size-sm)',
  lineHeight: 'var(--line-height-sm)',
}

const buttonRowStyle: CSSProperties = {
  display: 'flex',
  gap: 'var(--spacing-2)',
  justifyContent: 'flex-end',
}

export function DeleteAccountModal() {
  const { closeModal } = useModal()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    const result = await deleteAccount()

    if ('error' in result) {
      setError(result.error)
      setIsDeleting(false)
      return
    }

    // Success: clear local session and hard-navigate to home
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/?account_deleted=true'
  }

  return (
    <Stack direction="vertical" gap="normal">
      <h2 style={headingStyle}>Delete Account</h2>

      <Text variant="secondary" style={warningStyle}>
        This will permanently delete your account and all your reading progress,
        bookmarks, and recently viewed articles. This cannot be undone.
      </Text>

      {error && (
        <div role="alert" style={errorStyle}>
          {error}
        </div>
      )}

      <div style={buttonRowStyle}>
        <Button
          variant="secondary"
          size="md"
          onClick={closeModal}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          size="md"
          loading={isDeleting}
          disabled={isDeleting}
          onClick={handleDelete}
          aria-label="Permanently delete your account"
        >
          Delete My Account
        </Button>
      </div>
    </Stack>
  )
}
