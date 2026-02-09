import type { CSSProperties } from 'react'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Card } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { Heading, Text } from '@/components/ui/typography'

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
                <h2 id="about-what-is-this" style={sectionHeadingStyle}>
                  What is this?
                </h2>
                <Text style={paragraphStyle}>
                  SCP Reader is an independent fan-built reading companion for the SCP Foundation
                  collaborative fiction archive. It helps readers track their progress across the
                  full catalogue of SCP entries - bookmark articles, mark them as read, and pick up
                  where they left off.
                </Text>
                <Text style={paragraphStyle}>
                  This project is not affiliated with, endorsed by, or officially connected to the
                  SCP Foundation wiki or its staff.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-content-license">
              <Stack direction="vertical" gap="normal">
                <h2 id="about-content-license" style={sectionHeadingStyle}>
                  Content License
                </h2>
                <Text style={paragraphStyle}>
                  All SCP Foundation content - including article text, titles, and associated
                  concepts - is licensed under Creative Commons Attribution-ShareAlike 3.0 Unported
                  (CC BY-SA 3.0) and originates from{' '}
                  <a href="https://scpwiki.com" data-variant="default" style={linkStyle}>
                    scpwiki.com
                  </a>{' '}
                  and its authors.
                </Text>
                <Text style={paragraphStyle}>
                  SCP Reader, as a derivative work, is also released under{' '}
                  <a
                    href="https://creativecommons.org/licenses/by-sa/3.0/"
                    data-variant="default"
                    style={linkStyle}
                  >
                    CC BY-SA 3.0
                  </a>
                  . You are free to share and adapt this work under the same license terms.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-data-source">
              <Stack direction="vertical" gap="normal">
                <h2 id="about-data-source" style={sectionHeadingStyle}>
                  Data Source
                </h2>
                <Text style={paragraphStyle}>
                  Article data is provided by the{' '}
                  <a
                    href="https://scp-data.tedivm.com"
                    data-variant="default"
                    style={linkStyle}
                  >
                    SCP Data API
                  </a>{' '}
                  (maintained by tedivm), a daily-updated static dataset of the SCP Wiki. The API
                  itself is not affiliated with the SCP Wiki.
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-author-attribution">
              <Stack direction="vertical" gap="normal">
                <h2 id="about-author-attribution" style={sectionHeadingStyle}>
                  Author Attribution
                </h2>
                <Text style={paragraphStyle}>
                  Individual SCP articles are written by contributors to the SCP Wiki. Where
                  available, the original author is credited on each article page. For full
                  revision history, visit the original entry on{' '}
                  <a href="https://scpwiki.com" data-variant="default" style={linkStyle}>
                    scpwiki.com
                  </a>
                  .
                </Text>
              </Stack>
            </section>

            <section aria-labelledby="about-contact">
              <Stack direction="vertical" gap="normal">
                <h2 id="about-contact" style={sectionHeadingStyle}>
                  Contact
                </h2>
                <Text style={paragraphStyle}>
                  SCP Reader is built by Edward Stone. For questions, concerns, or attribution
                  requests, reach out via{' '}
                  <a
                    href="https://edwardstone.design"
                    data-variant="default"
                    style={linkStyle}
                  >
                    edwardstone.design
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
