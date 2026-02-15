import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/utils/site-url'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Heading, Text } from '@/components/ui/typography'
import { Link } from '@/components/ui/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about SCP Reader, an independent reading companion for the SCP Foundation collaborative fiction archive. Track your progress, bookmark favorites, and explore the SCP database.',
  alternates: {
    canonical: `${getSiteUrl()}/about`,
  },
  openGraph: {
    siteName: 'SCP Reader',
    type: 'website',
    title: 'About',
    description: 'Learn about SCP Reader, an independent reading companion for the SCP Foundation collaborative fiction archive. Track your progress, bookmark favorites, and explore the SCP database.',
    url: `${getSiteUrl()}/about`,
  },
  twitter: {
    card: 'summary',
    title: 'About',
    description: 'Learn about SCP Reader, an independent reading companion for the SCP Foundation collaborative fiction archive. Track your progress, bookmark favorites, and explore the SCP database.',
  },
}

const sectionHeadingStyle: CSSProperties = {
  fontSize: 'var(--font-size-lg)',
  lineHeight: 'var(--line-height-lg)',
}

const linkStyle: CSSProperties = {
  color: 'var(--color-text-secondary)',
  textDecoration: 'underline',
  textUnderlineOffset: 'var(--border-width-thick)',
}

export default function AboutPage() {
  return (
    <Main>
      <Container size="md">
        <Card padding="lg">
          <Stack direction="vertical" gap="section">
            <Stack direction="vertical" gap="normal">
              <Heading level={2}>About SCP Reader</Heading>
            </Stack>

            <section aria-labelledby="about-what-is-this">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="about-what-is-this" style={sectionHeadingStyle}>
                  What is this?
                </Heading>
                <Text variant="secondary">
                  SCP Reader is an independent fan-built reading companion for the SCP Foundation
                  collaborative fiction archive. It helps readers track their progress across the
                  full catalogue of SCP entries - bookmark articles, mark them as read, and pick up
                  where they left off.
                </Text>
                <Text variant="secondary">
                  This project is not affiliated with, endorsed by, or officially connected to the
                  SCP Foundation wiki or its staff.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-content-license">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="about-content-license" style={sectionHeadingStyle}>
                  Content License
                </Heading>
                <Text variant="secondary">
                  All SCP Foundation content - including article text, titles, and associated
                  concepts - is licensed under Creative Commons Attribution-ShareAlike 3.0 Unported
                  (CC BY-SA 3.0) and originates from{' '}
                  <Link href="https://scpwiki.com" variant="default" style={linkStyle}>
                    scpwiki.com
                  </Link>{' '}
                  and its authors.
                </Text>
                <Text variant="secondary">
                  SCP Reader, as a derivative work, is also released under{' '}
                  <Link
                    href="https://creativecommons.org/licenses/by-sa/3.0/"
                    variant="default"
                    style={linkStyle}
                  >
                    CC BY-SA 3.0
                  </Link>
                  . You are free to share and adapt this work under the same license terms.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-data-source">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="about-data-source" style={sectionHeadingStyle}>
                  Data Source
                </Heading>
                <Text variant="secondary">
                  Article data is provided by the{' '}
                  <Link
                    href="https://scp-data.tedivm.com"
                    variant="default"
                    style={linkStyle}
                  >
                    SCP Data API
                  </Link>{' '}
                  (maintained by tedivm), a daily-updated static dataset of the SCP Wiki. The API
                  itself is not affiliated with the SCP Wiki.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-author-attribution">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="about-author-attribution" style={sectionHeadingStyle}>
                  Author Attribution
                </Heading>
                <Text variant="secondary">
                  Individual SCP articles are written by contributors to the SCP Wiki. Where
                  available, the original author is credited on each article page. For full
                  revision history, visit the original entry on{' '}
                  <Link href="https://scpwiki.com" variant="default" style={linkStyle}>
                    scpwiki.com
                  </Link>
                  .
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-contact">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="about-contact" style={sectionHeadingStyle}>
                  Contact
                </Heading>
                <Text variant="secondary">
                  SCP Reader is built by Edward Stone. For questions, concerns, or attribution
                  requests, reach out via{' '}
                  <Link
                    href="https://edwardstone.design"
                    variant="default"
                    style={linkStyle}
                  >
                    edwardstone.design
                  </Link>
                  .
                </Text>
              </Stack>
            </section>
          </Stack>
        </Card>
      </Container>
    </Main>
  )
}
