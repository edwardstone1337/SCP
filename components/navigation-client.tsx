'use client'

import { useState, useRef, useEffect } from 'react'
import NextLink from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Link } from '@/components/ui/link'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Text } from '@/components/ui/typography'
import { useModal } from '@/components/ui/modal-provider'
import { SignInPanel } from '@/components/ui/sign-in-panel'
import { signOut } from '@/app/actions/auth'
import { seriesToRoman } from '@/lib/utils/series'

const SERIES_LIST = Array.from({ length: 10 }, (_, i) => {
  const id = `series-${i + 1}`
  const roman = seriesToRoman(id)!
  return { id, roman }
})

const navStyles: React.CSSProperties = {
  position: 'relative',
  zIndex: 'var(--z-nav)',
  backgroundColor: 'var(--color-grey-9)',
  borderBottom: '1px solid var(--color-grey-8)',
  paddingTop: 'var(--spacing-2)',
  paddingBottom: 'var(--spacing-2)',
}

const linkTouchStyle: React.CSSProperties = {
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
}

const paddingStyles: React.CSSProperties = {
  paddingLeft: 'var(--spacing-page-padding)',
  paddingRight: 'var(--spacing-page-padding)',
}

const signInLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  fontWeight: 700,
  fontFamily: 'var(--font-family-sans)',
  transition: 'all var(--transition-base)',
  cursor: 'pointer',
  textDecoration: 'none',
  borderWidth: 'var(--border-width-normal)',
  borderStyle: 'solid',
  backgroundColor: 'var(--color-accent)',
  color: 'var(--color-text-primary)',
  borderColor: 'var(--color-accent)',
  fontSize: 'var(--font-size-base)',
  paddingLeft: 'var(--spacing-3)',
  paddingRight: 'var(--spacing-3)',
  paddingTop: 'var(--spacing-1)',
  paddingBottom: 'var(--spacing-1)',
  borderRadius: 'var(--radius-button)',
}

interface NavigationClientProps {
  user: { email?: string } | null
}

export function NavigationClient({ user }: NavigationClientProps) {
  const { openModal } = useModal()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isSaved = pathname === '/saved'
  const queryString = searchParams.toString()
  const redirectPath = `${pathname}${queryString ? `?${queryString}` : ''}`
  const signInHref =
    pathname === '/login'
      ? '/login'
      : `/login?redirect=${encodeURIComponent(redirectPath)}`

  const [isOpen, setIsOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstOverlayLinkRef = useRef<HTMLAnchorElement>(null)
  const prevOpenRef = useRef(false)

  const closeOverlay = () => setIsOpen(false)
  const toggleOverlay = () => setIsOpen((open) => !open)
  const openSignInModal = () => {
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}${window.location.hash}`
        : redirectPath || '/'
    openModal(
      <SignInPanel context="modal" redirectTo={redirectTo} />,
      'Request Archive Access'
    )
  }

  const handleSignInClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    openSignInModal()
  }

  const isActiveSeriesPage = (seriesId: string) => pathname.startsWith(`/series/${seriesId}`)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const t = setTimeout(() => firstOverlayLinkRef.current?.focus(), 0)
      return () => {
        document.body.style.overflow = ''
        clearTimeout(t)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (prevOpenRef.current && !isOpen) {
      const t = setTimeout(() => menuButtonRef.current?.focus(), 0)
      return () => clearTimeout(t)
    }
    prevOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <>
      <nav aria-label="Main navigation" style={navStyles}>
        <Container size="lg">
          <div style={paddingStyles}>
            <Stack direction="horizontal" align="center" justify="between" gap="normal">
              {/* Left: Logo */}
              <Link href="/" variant="nav" style={linkTouchStyle}>
                <Stack direction="horizontal" align="center" gap="tight">
                  <Logo size="sm" />
                  <span>SCP Reader</span>
                </Stack>
              </Link>

              {/* Right: Auth + Menu (all viewports) */}
              <Stack direction="horizontal" align="center" gap="tight">
                {user ? (
                  <form action={signOut}>
                    <Button type="submit" variant="secondary" size="md">
                      Sign Out
                    </Button>
                  </form>
                ) : (
                  <NextLink
                    href={signInHref}
                    onClick={handleSignInClick}
                    style={signInLinkStyle}
                    data-variant="primary"
                  >
                    Sign In
                  </NextLink>
                )}
                <Button
                  ref={menuButtonRef}
                  type="button"
                  variant="secondary"
                  size="md"
                  aria-expanded={isOpen}
                  aria-controls="nav-menu"
                  onClick={toggleOverlay}
                >
                  {isOpen ? 'Close' : 'Menu'}
                </Button>
              </Stack>
            </Stack>
          </div>
        </Container>
      </nav>

      {/* Full-screen navigation overlay */}
      <div
        id="nav-menu"
        role="dialog"
        aria-label="Navigation menu"
        aria-hidden={!isOpen}
        className={`nav-overlay ${isOpen ? 'open' : ''}`}
      >
        <nav aria-label="Series navigation" className="nav-drawer">
          <Stack
            direction="vertical"
            align="start"
            gap="normal"
            style={{ gap: 'var(--spacing-2)', width: '100%' }}
          >
            <Text
              size="sm"
              variant="secondary"
              style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              Series
            </Text>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-1)',
                width: '100%',
                maxWidth: '320px',
              }}
            >
              {SERIES_LIST.map(({ id, roman }, index) => (
                <Link
                  key={id}
                  ref={index === 0 ? firstOverlayLinkRef : undefined}
                  href={`/series/${id}`}
                  variant="nav"
                  aria-current={isActiveSeriesPage(id) ? 'page' : undefined}
                  style={{
                    ...linkTouchStyle,
                    ...(isActiveSeriesPage(id) && { color: 'var(--color-accent)' }),
                  }}
                  onClick={closeOverlay}
                >
                  {`Series ${roman}`}
                </Link>
              ))}
            </div>

            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: 'var(--color-surface-border)',
                margin: 'var(--spacing-2) 0',
              }}
            />

            {user && (
              <>
                <Link
                  href="/saved"
                  variant="nav"
                  style={{
                    ...linkTouchStyle,
                    ...(isSaved && { color: 'var(--color-accent)' }),
                  }}
                  aria-current={isSaved ? 'page' : undefined}
                  onClick={closeOverlay}
                >
                  Saved
                </Link>
                {user.email && (
                  <Text size="sm" variant="secondary">
                    {user.email}
                  </Text>
                )}
              </>
            )}
          </Stack>
        </nav>
      </div>
    </>
  )
}
