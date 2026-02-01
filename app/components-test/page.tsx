import { Heading, Text, Mono, Label } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { ProgressRing } from '@/components/ui/progress-ring'
import { ProgressText } from '@/components/ui/progress-text'
import { Main } from '@/components/ui/main'
import { Container } from '@/components/ui/container'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { Logo } from '@/components/ui/logo'
import { PageHeader } from '@/components/ui/page-header'
import { SeriesCard } from '@/components/ui/series-card'
import { RangeListItem } from '@/components/ui/range-list-item'
import { ScpListItem } from '@/components/ui/scp-list-item'

export default function ComponentsTestPage() {
  return (
    <Main>
      <Container>
        <Stack gap="section">
        {/* Layout Components */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Layout Components
          </Heading>

          {/* Main - used as page wrapper */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              Main — Full-height page wrapper (this page uses Main)
            </Text>
            <Text variant="muted" size="sm">
              min-height: 100vh, background: var(--color-background), padding:
              var(--spacing-page-padding) (48px)
            </Text>
          </Stack>

          {/* Container sizes */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              Container — Centered content with max-width (size: sm, md, lg, xl)
            </Text>
            <Stack direction="horizontal" gap="normal" style={{ flexWrap: 'wrap' }}>
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <Container key={size} size={size}>
                  <div
                    style={{
                      padding: 'var(--spacing-2)',
                      backgroundColor: 'var(--color-grey-9)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-grey-8)',
                    }}
                  >
                    <Text size="sm">
                      Container {size} (max {size === 'sm' ? '640' : size === 'md' ? '768' : size === 'lg' ? '1024' : '1280'}px)
                    </Text>
                  </div>
                </Container>
              ))}
            </Stack>
          </Stack>

          {/* Stack - vertical and horizontal */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              Stack — Flexbox with consistent gap (direction, gap, align, justify)
            </Text>
            <Stack direction="horizontal" gap="loose" style={{ flexWrap: 'wrap' }}>
              <Stack gap="tight" align="start">
                <Text size="sm">Vertical, gap: tight (8px)</Text>
                <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
                <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
                <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
              </Stack>
              <Stack gap="normal" align="start">
                <Text size="sm">Vertical, gap: normal (16px)</Text>
                <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
                <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
                <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
              </Stack>
              <Stack direction="horizontal" gap="tight" align="center">
                <Text size="sm">Horizontal, gap: tight</Text>
                <div style={{ width: 20, height: 30, backgroundColor: 'var(--color-accent)' }} />
                <div style={{ width: 20, height: 30, backgroundColor: 'var(--color-accent)' }} />
                <div style={{ width: 20, height: 30, backgroundColor: 'var(--color-accent)' }} />
              </Stack>
            </Stack>
          </Stack>

          {/* Grid - responsive card grid */}
          <Stack gap="normal">
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              Grid — Responsive 2→3→4 columns (resize browser to test)
            </Text>
            <Grid>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <Card key={n}>
                  <Heading level={4}>Card {n}</Heading>
                  <Text variant="secondary" size="sm">
                    Responsive grid item
                  </Text>
                </Card>
              ))}
            </Grid>
            <Text variant="muted" size="sm" style={{ marginTop: 'var(--spacing-2)' }}>
              Fixed cols=3 example:
            </Text>
            <Grid cols={3}>
              {[1, 2, 3].map((n) => (
                <Card key={n}>
                  <Text size="sm">Fixed 3-col item {n}</Text>
                </Card>
              ))}
            </Grid>
          </Stack>
        </section>

        {/* Headings */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Typography System
          </Heading>

          <div className="space-y-4">
            <Heading level={1}>Heading 1 - Large Title</Heading>
            <Heading level={2}>Heading 2 - Page Title</Heading>
            <Heading level={3}>Heading 3 - Section</Heading>
            <Heading level={4}>Heading 4 - Subsection</Heading>

            <Heading level={3} accent>
              WARNING (Accent)
            </Heading>
          </div>
        </section>

        {/* Text */}
        <section>
          <Heading level={3} style={{ marginBottom: 'var(--spacing-4)' }}>
            Text Variants
          </Heading>

          <div className="space-y-2">
            <Text variant="primary">Primary text - main content</Text>
            <Text variant="secondary">Secondary text - subtitles</Text>
            <Text variant="muted">Muted text - less important</Text>
          </div>
        </section>

        {/* Text Sizes */}
        <section>
          <Heading level={3} style={{ marginBottom: 'var(--spacing-4)' }}>
            Text Sizes
          </Heading>

          <div className="space-y-2">
            <Text size="xs">Extra small text</Text>
            <Text size="sm">Small text</Text>
            <Text size="base">Base text</Text>
            <Text size="lg">Large text</Text>
            <Text size="xl">Extra large text</Text>
          </div>
        </section>

        {/* Mono */}
        <section>
          <Heading level={3} style={{ marginBottom: 'var(--spacing-4)' }}>
            Monospace
          </Heading>

          <div className="space-y-2">
            <Mono>SCP-173</Mono>
            <Mono size="lg">SCP-001</Mono>
          </div>
        </section>

        {/* Labels */}
        <section>
          <Heading level={3} style={{ marginBottom: 'var(--spacing-4)' }}>
            Labels
          </Heading>

          <div className="space-y-4">
            <div>
              <Label htmlFor="test">Regular Label</Label>
              <input
                id="test"
                type="text"
                className="px-4 py-2 border rounded"
              />
            </div>

            <div>
              <Label htmlFor="test2" required>
                Required Label
              </Label>
              <input
                id="test2"
                type="text"
                className="px-4 py-2 border rounded"
              />
            </div>
          </div>
        </section>

        {/* Spacing System */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Spacing System (8px Grid)
          </Heading>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)',
            }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 8].map((size) => (
              <div
                key={size}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                }}
              >
                <div style={{ width: '120px', flexShrink: 0 }}>
                  <Text variant="secondary" size="sm">
                    --spacing-{size}
                  </Text>
                </div>
                <div
                  style={{
                    width: `var(--spacing-${size})`,
                    height: '24px',
                    backgroundColor: 'var(--color-accent)',
                  }}
                />
                <Text variant="muted" size="sm">
                  {size === 0 ? '0' : `${size * 8}px`}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {/* Button Component */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Button Component
          </Heading>

          {/* Variants */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Variants
            </Text>
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-2)',
                flexWrap: 'wrap',
              }}
            >
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
            </div>
          </div>

          {/* Sizes */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Sizes (with heights)
            </Text>
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-2)',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-1)' }}>
                  ~32px tall
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-1)' }}>
                  ~40px tall
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-1)' }}>
                  ~52px tall
                </Text>
              </div>
            </div>
          </div>

          {/* States */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              States
            </Text>
            <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
              <Button variant="primary">Default</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Full Width */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Full Width
            </Text>
            <Button variant="primary" fullWidth>
              Continue
            </Button>
          </div>

          {/* As Link */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              As Link (href prop)
            </Text>
            <Button variant="secondary" href="/series">
              Browse Series →
            </Button>
          </div>
        </section>

        {/* Link Component */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Link Component
          </Heading>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)',
            }}
          >
            {/* Default */}
            <div>
              <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
                Default Link
              </Text>
              <Link href="/series" variant="default">
                Browse all series
              </Link>
            </div>

            {/* Back */}
            <div>
              <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
                Back Link
              </Text>
              <Link href="/series" variant="back">
                ← Back to series
              </Link>
            </div>

            {/* Nav */}
            <div>
              <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
                Navigation Link
              </Text>
              <Link href="/series" variant="nav">
                Series
              </Link>
            </div>
          </div>
        </section>

        {/* Card Component */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Card Component
          </Heading>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-4)',
            }}
          >
            {/* Default Card */}
            <div>
              <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
                Default Card
              </Text>
              <Card>
                <Heading level={4}>Card Title</Heading>
                <Text variant="secondary">
                  This is a default card with padding and rounded corners.
                </Text>
              </Card>
            </div>

            {/* Interactive Card (as link) */}
            <div>
              <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
                Interactive Card (hover me)
              </Text>
              <Card variant="interactive" href="/series">
                <Heading level={4}>Clickable Card</Heading>
                <Text variant="secondary">
                  This card scales on hover and works as a link.
                </Text>
              </Card>
            </div>

            {/* Card with accent border */}
            <div>
              <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
                Card with Accent Border
              </Text>
              <Card accentBorder>
                <Heading level={4}>Important Card</Heading>
                <Text variant="secondary">
                  This card has a red accent border.
                </Text>
              </Card>
            </div>

            {/* Card padding variants */}
            <div>
              <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
                Card padding (sm 16px, md 24px, lg 32px default)
              </Text>
              <Stack direction="horizontal" gap="normal" style={{ flexWrap: 'wrap' }}>
                <Card padding="sm">
                  <Text size="sm">padding=&quot;sm&quot;</Text>
                </Card>
                <Card padding="md">
                  <Text size="sm">padding=&quot;md&quot;</Text>
                </Card>
                <Card padding="lg">
                  <Text size="sm">padding=&quot;lg&quot;</Text>
                </Card>
              </Stack>
            </div>
          </div>
        </section>

        {/* Badge Component */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Badge Component
          </Heading>

          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-2)',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Access Granted</Badge>
            <Badge variant="progress">75%</Badge>
          </div>
        </section>

        {/* ProgressRing Component */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            ProgressRing Component
          </Heading>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Value variants (0%, 10%, 50%, 100%)
            </Text>
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-6)',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {[0, 10, 50, 100].map((v) => (
                <div key={v} style={{ textAlign: 'center' }}>
                  <ProgressRing value={v} size="md" />
                  <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-2)' }}>
                    {v}%
                  </Text>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Size variants (xs 48px, sm 64px, md 96px, lg 128px)
            </Text>
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-6)',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <ProgressRing value={50} size="xs" />
                <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-2)' }}>
                  xs
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing value={50} size="sm" />
                <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-2)' }}>
                  sm
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing value={50} size="md" />
                <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-2)' }}>
                  md
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <ProgressRing value={50} size="lg" />
                <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-2)' }}>
                  lg
                </Text>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              With centered content (children)
            </Text>
            <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              <ProgressRing value={75} size="md">
                <Text variant="secondary" size="sm">
                  75%
                </Text>
              </ProgressRing>
              <ProgressRing value={100} size="lg">
                <Text variant="secondary" size="base">
                  Done
                </Text>
              </ProgressRing>
            </div>
          </div>
        </section>

        {/* ProgressText Component */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            ProgressText Component
          </Heading>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Variant: percentage — 0%, partial, 100%
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2)',
              }}
            >
              <ProgressText read={0} total={100} variant="percentage" />
              <ProgressText read={25} total={100} variant="percentage" />
              <ProgressText read={100} total={100} variant="percentage" />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Variant: fraction — 0%, partial, 100%
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2)',
              }}
            >
              <ProgressText read={0} total={100} variant="fraction" />
              <ProgressText read={25} total={100} variant="fraction" />
              <ProgressText read={100} total={100} variant="fraction" />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Variant: both — 0%, partial, 100%
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2)',
              }}
            >
              <ProgressText read={0} total={100} variant="both" />
              <ProgressText read={25} total={100} variant="both" />
              <ProgressText read={100} total={100} variant="both" />
            </div>
          </div>

          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-3)' }}>
              Size variants (sm, md, lg)
            </Text>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2)',
              }}
            >
              <ProgressText read={50} total={100} variant="percentage" size="sm" />
              <ProgressText read={50} total={100} variant="percentage" size="md" />
              <ProgressText read={50} total={100} variant="percentage" size="lg" />
            </div>
          </div>
        </section>

        {/* Icon Component */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Icon Component
          </Heading>

          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-1)',
                alignItems: 'center',
              }}
            >
              <Icon name="check" size="sm" />
              <Text variant="muted" size="xs">
                check sm
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-1)',
                alignItems: 'center',
              }}
            >
              <Icon name="eye" size="md" />
              <Text variant="muted" size="xs">
                eye md
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-1)',
                alignItems: 'center',
              }}
            >
              <Icon name="star" size="lg" />
              <Text variant="muted" size="xs">
                star lg
              </Text>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-1)',
                alignItems: 'center',
              }}
            >
              <Icon name="arrow-back" size="md" />
              <Text variant="muted" size="xs">
                arrow md
              </Text>
            </div>
          </div>
        </section>

        {/* Border Radius */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Border Radius
          </Heading>

          <div
            style={{ display: 'flex', gap: 'var(--spacing-4)' }}
          >
            {['sm', 'md', 'lg', 'xl', 'full'].map((radius) => (
              <div key={radius} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--color-accent)',
                    borderRadius: `var(--radius-${radius})`,
                    marginBottom: 'var(--spacing-2)',
                  }}
                />
                <Text variant="secondary" size="xs">
                  {radius}
                </Text>
              </div>
            ))}
          </div>
        </section>

        {/* Card Padding Example */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Semantic Spacing
          </Heading>

          <div
            style={{
              padding: 'var(--spacing-card-padding)',
              backgroundColor: 'var(--color-grey-9)',
              borderRadius: 'var(--radius-card)',
              border: '2px solid var(--color-grey-8)',
            }}
          >
            <Text>This card uses semantic spacing tokens:</Text>
            <Text variant="secondary" size="sm">
              padding: var(--spacing-card-padding) = 32px
            </Text>
            <Text variant="secondary" size="sm">
              borderRadius: var(--radius-card) = 12px
            </Text>
          </div>
        </section>

        {/* Page Components */}
        <section>
          <Heading level={2} style={{ marginBottom: 'var(--spacing-4)' }}>
            Page Components
          </Heading>

          {/* Logo */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              Logo — sm (32px), md (48px), lg (64px)
            </Text>
            <Stack direction="horizontal" gap="normal" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Logo size="sm" />
              <Logo size="md" />
              <Logo size="lg" />
            </Stack>
          </Stack>

          {/* PageHeader */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              PageHeader — simple, with back, with back + badge
            </Text>
            <Stack gap="loose">
              <PageHeader title="Simple title" description="Optional description text." />
              <PageHeader title="With back link" backHref="/series" description="Back link above title." />
              <PageHeader title="With badge" backHref="/series" badge="Access Granted" description="Badge below title." />
            </Stack>
          </Stack>

          {/* StatusIndicator */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              StatusIndicator — read and unread (sm, md)
            </Text>
            <Stack direction="horizontal" gap="normal" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <StatusIndicator status="read" size="sm" />
              <StatusIndicator status="read" size="md" />
              <StatusIndicator status="unread" size="sm" />
              <StatusIndicator status="unread" size="md" />
            </Stack>
          </Stack>

          {/* SeriesCard */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              SeriesCard — 0% and &gt;0% states
            </Text>
            <Grid cols={2}>
              <SeriesCard series="Series I" roman="I" total={100} read={0} href="/series/1" />
              <SeriesCard series="Series II" roman="II" total={100} read={45} href="/series/2" />
            </Grid>
          </Stack>

          {/* RangeListItem */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              RangeListItem — 0% and &gt;0% states
            </Text>
            <Stack gap="tight" style={{ maxWidth: 400 }}>
              <RangeListItem rangeLabel="001–099" total={99} read={0} href="/series/1/001-099" />
              <RangeListItem rangeLabel="100–199" total={100} read={33} href="/series/1/100-199" />
            </Stack>
          </Stack>

          {/* ScpListItem */}
          <Stack gap="normal" style={{ marginBottom: 'var(--spacing-6)' }}>
            <Text variant="secondary" style={{ marginBottom: 'var(--spacing-2)' }}>
              ScpListItem — read and unread states
            </Text>
            <Stack gap="tight" style={{ maxWidth: 480 }}>
              <ScpListItem scpId="SCP-173" title="The Sculpture" rating={4} isRead={true} href="/scp/173" />
              <ScpListItem scpId="SCP-096" title={'The "Shy Guy"'} rating={5} isRead={false} href="/scp/096" />
            </Stack>
          </Stack>
        </section>
      </Stack>
    </Container>
    </Main>
  )
}
