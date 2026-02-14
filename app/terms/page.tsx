import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/utils/site-url'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Heading, Text } from '@/components/ui/typography'

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
  color: 'var(--color-text-primary)',
}

const paragraphStyle: CSSProperties = {
  color: 'var(--color-text-secondary)',
  fontSize: 'var(--font-size-base)',
  lineHeight: 'var(--line-height-base)',
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
              <Text style={paragraphStyle}>Effective date: February 14, 2026</Text>
            </Stack>

            <section aria-labelledby="terms-what-this-is">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-what-this-is" style={sectionHeadingStyle}>
                  What This Is
                </h2>
                <Text style={paragraphStyle}>
                  SCP Reader is a free, fan-built reading companion for the SCP Foundation wiki. It
                  helps you track your reading progress across the SCP archive. It is not affiliated
                  with or endorsed by the SCP Foundation or its wiki.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-content-licensing">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-content-licensing" style={sectionHeadingStyle}>
                  Content &amp; Licensing
                </h2>
                <Text style={paragraphStyle}>
                  SCP Foundation content displayed in this app is sourced from the SCP Wiki
                  (scpwiki.com) via the{' '}
                  <a
                    href="https://scp-data.tedivm.com"
                    data-variant="default"
                    style={linkStyle}
                  >
                    SCP Data API
                  </a>
                  . All SCP content is licensed under{' '}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/3.0/"
                    data-variant="default"
                    style={linkStyle}
                  >
                    Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)
                  </a>{' '}
                  by its original authors.
                </Text>
                <Text style={paragraphStyle}>
                  SCP Reader, as a derivative work, is also released under CC BY-SA 3.0. See our{' '}
                  <a href="/about" data-variant="default" style={linkStyle}>
                    About page
                  </a>{' '}
                  for full attribution details.
                </Text>
                <Text style={paragraphStyle}>
                  Individual article authorship is credited where available. For full authorship
                  history, refer to the SCP Wiki directly.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-your-account">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-your-account" style={sectionHeadingStyle}>
                  Your Account
                </h2>
                <Text style={paragraphStyle}>
                  You may create an account via magic link or Google sign-in to save your reading
                  progress. You are responsible for maintaining access to the email address
                  associated with your account. You can delete your account at any time from the
                  navigation menu.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-acceptable-use">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-acceptable-use" style={sectionHeadingStyle}>
                  Acceptable Use
                </h2>
                <Text style={paragraphStyle}>
                  Don&apos;t attempt to abuse, exploit, or interfere with the service. Don&apos;t
                  use automated tools to scrape or overload the service.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-no-warranty">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-no-warranty" style={sectionHeadingStyle}>
                  No Warranty
                </h2>
                <Text style={paragraphStyle}>
                  SCP Reader is provided &ldquo;as is&rdquo; without any warranties, express or
                  implied. We don&apos;t guarantee that the service will be available, error-free,
                  or that your data will be preserved indefinitely.
                </Text>
                <Text style={paragraphStyle}>
                  SCP content accuracy and availability depends on the upstream SCP Wiki and SCP
                  Data API, which we do not control.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-limitation-of-liability">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-limitation-of-liability" style={sectionHeadingStyle}>
                  Limitation of Liability
                </h2>
                <Text style={paragraphStyle}>
                  To the fullest extent permitted by law, SCP Reader and its operators are not
                  liable for any damages arising from your use of the service.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-changes">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-changes" style={sectionHeadingStyle}>
                  Changes to These Terms
                </h2>
                <Text style={paragraphStyle}>
                  We may update these terms from time to time. Changes will be reflected on this
                  page with an updated effective date.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="terms-contact">
              <Stack direction="vertical" gap="normal">
                <h2 id="terms-contact" style={sectionHeadingStyle}>
                  Contact
                </h2>
                <Text style={paragraphStyle}>
                  If you have questions about these terms, please reach out via the contact
                  information on our{' '}
                  <a href="/about" data-variant="default" style={linkStyle}>
                    About page
                  </a>
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
