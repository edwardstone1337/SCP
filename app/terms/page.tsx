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
  title: 'Terms of Service',
  description: 'Terms of service for SCP Reader. Understand the terms governing your use of this fan-built SCP reading companion.',
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
  },
  openGraph: {
    siteName: 'SCP Reader',
    type: 'website',
    title: 'Terms of Service',
    description: 'Terms of service for SCP Reader. Understand the terms governing your use of this fan-built SCP reading companion.',
    url: `${getSiteUrl()}/terms`,
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service',
    description: 'Terms of service for SCP Reader. Understand the terms governing your use of this fan-built SCP reading companion.',
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

export default function TermsPage() {
  return (
    <Main>
      <Container size="md">
        <Card padding="lg">
          <Stack direction="vertical" gap="section">
            <Stack direction="vertical" gap="normal">
              <Heading level={2}>Terms of Service</Heading>
              <Text variant="secondary">Effective date: February 14, 2026</Text>
            </Stack>

            <section aria-labelledby="terms-what-this-is">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-what-this-is" style={sectionHeadingStyle}>
                  What This Is
                </Heading>
                <Text variant="secondary">
                  SCP Reader is a free, fan-built reading companion for the SCP Foundation wiki. It
                  helps you track your reading progress across the SCP archive. It is not affiliated
                  with or endorsed by the SCP Foundation or its wiki.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-content-licensing">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-content-licensing" style={sectionHeadingStyle}>
                  Content &amp; Licensing
                </Heading>
                <Text variant="secondary">
                  SCP Foundation content displayed in this app is sourced from the SCP Wiki
                  (scpwiki.com) via the{' '}
                  <Link
                    href="https://scp-data.tedivm.com"
                    variant="default"
                    style={linkStyle}
                  >
                    SCP Data API
                  </Link>
                  . All SCP content is licensed under{' '}
                  <Link
                    href="https://creativecommons.org/licenses/by-sa/3.0/"
                    variant="default"
                    style={linkStyle}
                  >
                    Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)
                  </Link>{' '}
                  by its original authors.
                </Text>
                <Text variant="secondary">
                  SCP Reader, as a derivative work, is also released under CC BY-SA 3.0. See our{' '}
                  <Link href="/about" variant="default" style={linkStyle}>
                    About page
                  </Link>{' '}
                  for full attribution details.
                </Text>
                <Text variant="secondary">
                  Individual article authorship is credited where available. For full authorship
                  history, refer to the SCP Wiki directly.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-your-account">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-your-account" style={sectionHeadingStyle}>
                  Your Account
                </Heading>
                <Text variant="secondary">
                  You may create an account via magic link or Google sign-in to save your reading
                  progress. You are responsible for maintaining access to the email address
                  associated with your account. You can delete your account at any time from the
                  navigation menu.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-acceptable-use">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-acceptable-use" style={sectionHeadingStyle}>
                  Acceptable Use
                </Heading>
                <Text variant="secondary">
                  Don&apos;t attempt to abuse, exploit, or interfere with the service. Don&apos;t
                  use automated tools to scrape or overload the service.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-no-warranty">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-no-warranty" style={sectionHeadingStyle}>
                  No Warranty
                </Heading>
                <Text variant="secondary">
                  SCP Reader is provided &ldquo;as is&rdquo; without any warranties, express or
                  implied. We don&apos;t guarantee that the service will be available, error-free,
                  or that your data will be preserved indefinitely.
                </Text>
                <Text variant="secondary">
                  SCP content accuracy and availability depends on the upstream SCP Wiki and SCP
                  Data API, which we do not control.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-limitation-of-liability">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-limitation-of-liability" style={sectionHeadingStyle}>
                  Limitation of Liability
                </Heading>
                <Text variant="secondary">
                  To the fullest extent permitted by law, SCP Reader and its operators are not
                  liable for any damages arising from your use of the service.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-changes">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-changes" style={sectionHeadingStyle}>
                  Changes to These Terms
                </Heading>
                <Text variant="secondary">
                  We may update these terms from time to time. Changes will be reflected on this
                  page with an updated effective date.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-contact">
              <Stack direction="vertical" gap="normal">
                <Heading level={2} id="terms-contact" style={sectionHeadingStyle}>
                  Contact
                </Heading>
                <Text variant="secondary">
                  If you have questions about these terms, please reach out via the contact
                  information on our{' '}
                  <Link href="/about" variant="default" style={linkStyle}>
                    About page
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
