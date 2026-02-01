import { Heading, Text, Mono, Label } from '@/components/ui/typography'

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
                <Text
                  variant="secondary"
                  size="sm"
                  style={{ width: '120px' }}
                >
                  --spacing-{size}
                </Text>
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
