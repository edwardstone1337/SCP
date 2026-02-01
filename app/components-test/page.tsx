import { Heading, Text, Mono, Label } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'

export default function ComponentsTestPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-background)',
        padding: 'var(--spacing-page-padding)',
      }}
    >
      <div
        className="max-w-4xl mx-auto"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-section-gap)',
        }}
      >
        {/* Headings */}
        <section>
          <Heading level={2} className="mb-4">
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
          <Heading level={3} className="mb-4">
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
          <Heading level={3} className="mb-4">
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
          <Heading level={3} className="mb-4">
            Monospace
          </Heading>

          <div className="space-y-2">
            <Mono>SCP-173</Mono>
            <Mono size="lg">SCP-001</Mono>
          </div>
        </section>

        {/* Labels */}
        <section>
          <Heading level={3} className="mb-4">
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
          <Heading level={2} className="mb-4">
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
          <Heading level={2} className="mb-4">
            Button Component
          </Heading>

          {/* Variants */}
          <div className="mb-6">
            <Text variant="secondary" className="mb-3">
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
          <div className="mb-6">
            <Text variant="secondary" className="mb-3">
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
                <Text variant="muted" size="xs" className="mt-1">
                  ~32px tall
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Text variant="muted" size="xs" className="mt-1">
                  ~40px tall
                </Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <Text variant="muted" size="xs" className="mt-1">
                  ~52px tall
                </Text>
              </div>
            </div>
          </div>

          {/* States */}
          <div className="mb-6">
            <Text variant="secondary" className="mb-3">
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
          <div className="mb-6">
            <Text variant="secondary" className="mb-3">
              Full Width
            </Text>
            <Button variant="primary" fullWidth>
              Continue
            </Button>
          </div>

          {/* As Link */}
          <div className="mb-6">
            <Text variant="secondary" className="mb-3">
              As Link (href prop)
            </Text>
            <Button variant="secondary" href="/series">
              Browse Series →
            </Button>
          </div>
        </section>

        {/* Link Component */}
        <section>
          <Heading level={2} className="mb-4">
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
              <Text variant="secondary" className="mb-2">
                Default Link
              </Text>
              <Link href="/series" variant="default">
                Browse all series
              </Link>
            </div>

            {/* Back */}
            <div>
              <Text variant="secondary" className="mb-2">
                Back Link
              </Text>
              <Link href="/series" variant="back">
                ← Back to series
              </Link>
            </div>

            {/* Nav */}
            <div>
              <Text variant="secondary" className="mb-2">
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
          <Heading level={2} className="mb-4">
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
              <Text variant="secondary" className="mb-2">
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
              <Text variant="secondary" className="mb-2">
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
              <Text variant="secondary" className="mb-2">
                Card with Accent Border
              </Text>
              <Card accentBorder>
                <Heading level={4}>Important Card</Heading>
                <Text variant="secondary">
                  This card has a red accent border.
                </Text>
              </Card>
            </div>
          </div>
        </section>

        {/* Badge Component */}
        <section>
          <Heading level={2} className="mb-4">
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

        {/* Icon Component */}
        <section>
          <Heading level={2} className="mb-4">
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
          <Heading level={2} className="mb-4">
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
          <Heading level={2} className="mb-4">
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
      </div>
    </main>
  )
}
