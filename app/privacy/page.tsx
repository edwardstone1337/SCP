import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { getSiteUrl } from '@/lib/utils/site-url'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Heading, Text } from '@/components/ui/typography'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for SCP Reader. Learn how we handle your data, what we collect, and how we protect your information.',
  alternates: {
    canonical: `${getSiteUrl()}/privacy`,
  },
  openGraph: {
    siteName: 'SCP Reader',
    type: 'website',
    title: 'Privacy Policy',
    description: 'Privacy policy for SCP Reader. Learn how we handle your data, what we collect, and how we protect your information.',
    url: `${getSiteUrl()}/privacy`,
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy',
    description: 'Privacy policy for SCP Reader. Learn how we handle your data, what we collect, and how we protect your information.',
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

export default function PrivacyPage() {
  return (
    <Main>
      <Container size="md">
        <Card padding="lg">
          <Stack direction="vertical" gap="section">
            <Stack direction="vertical" gap="normal">
              <Heading level={2}>Privacy Policy</Heading>
              <Text style={paragraphStyle}>Effective date: February 14, 2026</Text>
            </Stack>

            <section aria-labelledby="privacy-what-we-collect">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-what-we-collect" style={sectionHeadingStyle}>
                  What We Collect
                </h2>
                <Text style={paragraphStyle}>
                  When you create an account, we collect your email address (provided via magic link
                  or Google sign-in) and, if you sign in with Google, your display name. These are
                  the only pieces of personal information we ask for.
                </Text>
                <Text style={paragraphStyle}>
                  As you use the app, we store your reading data — which SCPs you&apos;ve marked as
                  read, your bookmarks, and your recently viewed articles. This is the core of what
                  SCP Reader does.
                </Text>
                <Text style={paragraphStyle}>
                  We use Google Analytics 4 to collect anonymous usage data such as page views and
                  feature usage. No personally identifiable information is sent to GA4.
                </Text>
                <Text style={paragraphStyle}>
                  For cookies, we use authentication session cookies managed by Supabase. We do not
                  use advertising or third-party tracking cookies.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="privacy-how-we-use">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-how-we-use" style={sectionHeadingStyle}>
                  How We Use Your Data
                </h2>
                <Text style={paragraphStyle}>
                  Your email and name are used solely for authentication and identifying your
                  account. Your reading data powers the features you signed up for — tracking
                  progress, managing bookmarks, and showing your recently viewed articles. Analytics
                  data helps us understand how the app is used so we can improve it.
                </Text>
                <Text style={paragraphStyle}>
                  We do not sell, share, or transfer your personal data to any third parties.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="privacy-google-user-data">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-google-user-data" style={sectionHeadingStyle}>
                  Google User Data
                </h2>
                <Text style={paragraphStyle}>
                  When you sign in with Google, we receive your email address and display name. This
                  data is used only for authentication and account identification. We do not access
                  any other Google account data — no contacts, calendar, drive, or other services.
                </Text>
                <Text style={paragraphStyle}>
                  Google user data is stored securely in our database and is not shared with third
                  parties.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="privacy-data-storage">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-data-storage" style={sectionHeadingStyle}>
                  Data Storage &amp; Security
                </h2>
                <Text style={paragraphStyle}>
                  Your data is stored in Supabase (hosted on AWS). All connections between your
                  browser and our servers use HTTPS encryption. Database access is controlled by Row
                  Level Security, which means users can only access their own data. Authentication
                  is handled by Supabase Auth with industry-standard security practices.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="privacy-data-retention">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-data-retention" style={sectionHeadingStyle}>
                  Data Retention &amp; Deletion
                </h2>
                <Text style={paragraphStyle}>
                  We retain your data for as long as your account exists. You can delete your
                  account at any time from the navigation menu. Deleting your account permanently
                  removes all associated data — your reading progress, bookmarks, and recently
                  viewed history. This action cannot be undone.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="privacy-children">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-children" style={sectionHeadingStyle}>
                  Children&apos;s Privacy
                </h2>
                <Text style={paragraphStyle}>
                  SCP Reader is not directed at children under 13. We do not knowingly collect data
                  from children under 13.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="privacy-changes">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-changes" style={sectionHeadingStyle}>
                  Changes to This Policy
                </h2>
                <Text style={paragraphStyle}>
                  We may update this policy from time to time. Changes will be reflected on this
                  page with an updated effective date.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="privacy-contact">
              <Stack direction="vertical" gap="normal">
                <h2 id="privacy-contact" style={sectionHeadingStyle}>
                  Contact
                </h2>
                <Text style={paragraphStyle}>
                  If you have questions about this policy, please reach out via the contact
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
