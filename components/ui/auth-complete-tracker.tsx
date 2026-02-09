'use client'

import { useEffect } from 'react'
import { trackAuthComplete } from '@/lib/analytics'

export function AuthCompleteTracker() {
  useEffect(() => {
    const currentUrl = new URL(window.location.href)
    if (currentUrl.searchParams.get('auth') !== 'complete') {
      return
    }

    trackAuthComplete()
    currentUrl.searchParams.delete('auth')
    const nextSearch = currentUrl.searchParams.toString()
    const nextUrl = `${currentUrl.pathname}${nextSearch ? `?${nextSearch}` : ''}${currentUrl.hash}`
    window.history.replaceState(window.history.state, '', nextUrl)
  }, [])

  return null
}
