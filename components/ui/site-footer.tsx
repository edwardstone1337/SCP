import type { CSSProperties } from 'react'
import { Container } from '@/components/ui/container'
import { Link } from '@/components/ui/link'
import { Stack } from '@/components/ui/stack'

const bodyTextStyle: CSSProperties = {
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-sm)',
}

const linkStyle: CSSProperties = {
  color: 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-xs)',
  lineHeight: 'var(--line-height-sm)',
  textDecoration: 'underline',
  textUnderlineOffset: 'var(--border-width-thick)',
}

const separatorStyle: CSSProperties = {
  color: 'var(--color-text-muted)',
  fontSize: 'var(--font-size-xs)',
}

export function SiteFooter() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site licensing and attribution"
      style={{
        borderTop: 'var(--border-width-normal) solid var(--color-surface-border)',
        paddingTop: 'var(--spacing-section-gap)',
        paddingBottom: 'var(--spacing-section-gap)',
      }}
    >
      <Container size="lg">
        <div
          style={{
            paddingLeft: 'var(--spacing-page-padding)',
            paddingRight: 'var(--spacing-page-padding)',
          }}
        >
          <Stack direction="vertical" gap="tight" align="center" style={{ textAlign: 'center' }}>
            <p style={bodyTextStyle}>
              SCP Reader is an independent fan project - not affiliated with the SCP Foundation.
            </p>
            <p style={bodyTextStyle}>
              SCP content is licensed under CC BY-SA 3.0 and originates from scpwiki.com and its
              authors. This project is also released under CC BY-SA 3.0.
            </p>
            <p style={bodyTextStyle}>
              Data provided by the SCP Data API.
            </p>
            <p>
              <Link href="/about" variant="default" style={linkStyle}>
                About &amp; Attribution
              </Link>
              <span style={separatorStyle} aria-hidden="true"> · </span>
              <Link href="/privacy" variant="default" style={linkStyle}>
                Privacy
              </Link>
              <span style={separatorStyle} aria-hidden="true"> · </span>
              <Link href="/terms" variant="default" style={linkStyle}>
                Terms
              </Link>
            </p>
          </Stack>
        </div>
      </Container>
    </footer>
  )
}
