'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

interface BackToTopProps {
  /** Scroll threshold in pixels before button appears */
  threshold?: number
  /** Hide when within this many pixels of page bottom */
  bottomOffset?: number
}

export function BackToTop({ threshold = 400, bottomOffset = 200 }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolledPastThreshold = window.scrollY > threshold
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - bottomOffset

      setIsVisible(scrolledPastThreshold && !nearBottom)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, bottomOffset])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-4)',
        right: 'var(--spacing-4)',
        zIndex: 'var(--z-sticky)',
      }}
    >
      <Button
        variant="secondary"
        size="sm"
        onClick={scrollToTop}
        aria-label="Back to top"
        style={{
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-elevated)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
          <Icon name="arrow-up" size="sm" />
          Top
        </span>
      </Button>
    </div>
  )
}
