import { Heading, Text, Mono, Label } from '@/components/ui/typography'

export default function ComponentsTestPage() {
  return (
    <main
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
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
      </div>
    </main>
  )
}
