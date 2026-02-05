'use client'

import { useState } from 'react'
import { Heading, Text, Mono, Label } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
import { ReadToggleButton } from '@/components/ui/read-toggle-button'
import { BookmarkButton } from '@/components/ui/bookmark-button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Message } from '@/components/ui/message'
import { Logo } from '@/components/ui/logo'
import { PageHeader } from '@/components/ui/page-header'
import { SeriesCard } from '@/components/ui/series-card'
import { RangeListItem } from '@/components/ui/range-list-item'
import { ScpListItem } from '@/components/ui/scp-list-item'
import { Breadcrumb } from '@/components/ui/breadcrumb'

const SECTION_DIVIDER_STYLE: React.CSSProperties = {
  borderTop: '1px solid var(--color-grey-8)',
  marginTop: 'var(--spacing-8)',
  paddingTop: 'var(--spacing-8)',
}

export default function ComponentsTestPage() {
  const [inputValue, setInputValue] = useState('With value')

  return (
    <Main>
      <Container>
        <Stack gap="section">
          {/* ========== DESIGN TOKENS ========== */}
          <section>
            <Heading level={1} style={{ marginBottom: 'var(--spacing-6)' }}>
              Design Tokens
            </Heading>

            {/* Color swatches */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Color Swatches
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Key colors: accent, greys, background, text colors
              </Text>
              <Stack direction="horizontal" gap="normal" style={{ flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-accent)',
                      marginBottom: 'var(--spacing-1)',
                    }}
                  />
                  <Text variant="muted" size="xs">accent</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-grey-8)',
                      marginBottom: 'var(--spacing-1)',
                    }}
                  />
                  <Text variant="muted" size="xs">background</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-1)',
                    }}
                  />
                  <Text variant="muted" size="xs">text-primary</Text>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-1)',
                    }}
                  />
                  <Text variant="muted" size="xs">text-secondary</Text>
                </div>
                {[3, 5, 7, 9].map((n) => (
                  <div key={n} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: `var(--color-grey-${n})`,
                        border: n <= 5 ? '1px solid var(--color-grey-8)' : undefined,
                        marginBottom: 'var(--spacing-1)',
                      }}
                    />
                    <Text variant="muted" size="xs">grey-{n}</Text>
                  </div>
                ))}
              </Stack>
            </div>

            {/* Typography scale */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Typography Scale
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Font sizes (xs → 5xl)
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Text size="xs">xs — 12px</Text>
                <Text size="sm">sm — 14px</Text>
                <Text size="base">base — 16px</Text>
                <Text size="lg">lg — 20px</Text>
                <Text size="xl">xl — 24px</Text>
                <span style={{ fontSize: '1.875rem', color: 'var(--color-text-primary)' }}>2xl — 30px</span>
                <span style={{ fontSize: '2.375rem', color: 'var(--color-text-primary)' }}>3xl — 38px</span>
                <span style={{ fontSize: '2.875rem', color: 'var(--color-text-primary)' }}>4xl — 46px</span>
                <span style={{ fontSize: '3.5rem', color: 'var(--color-text-primary)' }}>5xl — 56px</span>
              </div>
            </div>

            {/* Spacing scale */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Spacing Scale
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                8px grid system
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {[0, 1, 2, 3, 4, 5, 6, 8].map((size) => (
                  <div
                    key={size}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                    }}
                  >
                    <div style={{ width: 120, flexShrink: 0 }}>
                      <Text variant="secondary" size="sm">
                        --spacing-{size}
                      </Text>
                    </div>
                    <div
                      style={{
                        width: `var(--spacing-${size})`,
                        height: 24,
                        backgroundColor: 'var(--color-accent)',
                      }}
                    />
                    <Text variant="muted" size="sm">
                      {size === 0 ? '0' : `${size * 8}px`}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Border radius (design token) */}
            <div>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Border Radius
              </Heading>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                {['sm', 'md', 'lg', 'xl', 'full'].map((radius) => (
                  <div key={radius} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
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
            </div>
          </section>

          {/* ========== ATOMS ========== */}
          <section style={SECTION_DIVIDER_STYLE}>
            <Heading level={1} style={{ marginBottom: 'var(--spacing-6)' }}>
              Atoms
            </Heading>

            {/* Icon */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Icon
              </Heading>
              <div style={{ display: 'flex', gap: 'var(--spacing-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                <Icon name="check" size="sm" />
                <Icon name="eye" size="md" />
                <Icon name="star" size="lg" />
                <Icon name="arrow-back" size="md" />
                <Icon name="bookmark" size="md" />
                <Icon name="bookmark-filled" size="md" />
              </div>
            </div>

            {/* Badge */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Badge
              </Heading>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge variant="default">Default</Badge>
                <Badge variant="accent">Access Granted</Badge>
                <Badge variant="progress">75%</Badge>
              </div>
            </div>

            {/* Spinner */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Spinner
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Sizes (sm 16px, md 24px, lg 32px)
              </Text>
              <Stack direction="horizontal" gap="loose" align="center" style={{ flexWrap: 'wrap' }}>
                <Stack direction="vertical" gap="tight" align="center">
                  <Spinner size="sm" />
                  <Text variant="muted" size="xs">sm</Text>
                </Stack>
                <Stack direction="vertical" gap="tight" align="center">
                  <Spinner size="md" />
                  <Text variant="muted" size="xs">md</Text>
                </Stack>
                <Stack direction="vertical" gap="tight" align="center">
                  <Spinner size="lg" />
                  <Text variant="muted" size="xs">lg</Text>
                </Stack>
              </Stack>
            </div>

            {/* Logo */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Logo
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                sm (32px), md (48px), lg (64px)
              </Text>
              <Stack direction="horizontal" gap="normal" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Logo size="sm" />
                <Logo size="md" />
                <Logo size="lg" />
              </Stack>
            </div>

            {/* Typography: Heading */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Typography — Heading
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Heading level={1}>Heading 1 — Large Title</Heading>
                <Heading level={2}>Heading 2 — Page Title</Heading>
                <Heading level={3}>Heading 3 — Section</Heading>
                <Heading level={4}>Heading 4 — Subsection</Heading>
                <Heading level={3} accent>WARNING (Accent)</Heading>
              </div>
            </div>

            {/* Typography: Text */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Typography — Text
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Text variant="primary">Primary text — main content</Text>
                <Text variant="secondary">Secondary text — subtitles</Text>
                <Text variant="muted">Muted text — less important</Text>
              </div>
            </div>

            {/* Typography: Text sizes */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Typography — Text Sizes
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Text size="xs">Extra small text</Text>
                <Text size="sm">Small text</Text>
                <Text size="base">Base text</Text>
                <Text size="lg">Large text</Text>
                <Text size="xl">Extra large text</Text>
              </div>
            </div>

            {/* Typography: Mono */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Typography — Mono
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <Mono>SCP-173</Mono>
                <Mono size="lg">SCP-001</Mono>
              </div>
            </div>

            {/* Typography: Label */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Typography — Label
              </Heading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div>
                  <Label htmlFor="test">Regular Label</Label>
                  <input id="test" type="text" className="px-4 py-2 border rounded" />
                </div>
                <div>
                  <Label htmlFor="test2" required>Required Label</Label>
                  <input id="test2" type="text" className="px-4 py-2 border rounded" />
                </div>
              </div>
            </div>

            {/* Input */}
            <div>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Input
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Empty, with value, disabled
              </Text>
              <Stack gap="normal" style={{ maxWidth: 320 }}>
                <div>
                  <Label htmlFor="input-empty" style={{ display: 'block', marginBottom: 'var(--spacing-1)' }}>Empty</Label>
                  <Input
                    id="input-empty"
                    value=""
                    onChange={() => {}}
                    placeholder="Enter text..."
                  />
                </div>
                <div>
                  <Label htmlFor="input-with-value" style={{ display: 'block', marginBottom: 'var(--spacing-1)' }}>With value</Label>
                  <Input
                    id="input-with-value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="input-disabled" style={{ display: 'block', marginBottom: 'var(--spacing-1)' }}>Disabled</Label>
                  <Input
                    id="input-disabled"
                    value="Disabled value"
                    onChange={() => {}}
                    disabled
                  />
                </div>
              </Stack>
            </div>

            {/* Select */}
            <div style={{ marginTop: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Select
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Native select matching Input styling
              </Text>
              <div style={{ maxWidth: 200 }}>
                <Select
                  options={[
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' },
                  ]}
                  value="option1"
                  onChange={() => {}}
                />
              </div>
            </div>
          </section>

          {/* ========== MOLECULES ========== */}
          <section style={SECTION_DIVIDER_STYLE}>
            <Heading level={1} style={{ marginBottom: 'var(--spacing-6)' }}>
              Molecules
            </Heading>

            {/* Breadcrumb */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Breadcrumb
              </Heading>
              <Breadcrumb items={[
                { label: 'Series', href: '/series' },
                { label: 'Series X', href: '/series/series-10' },
                { label: '9600-9699', href: '/series/series-10/9600' },
                { label: 'SCP-9600' },
              ]} />
            </div>

            {/* Button */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Button
              </Heading>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Variants</Text>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Sizes</Text>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'flex-start' }}>
                  <Button variant="primary" size="sm">Small</Button>
                  <Button variant="primary" size="md">Medium</Button>
                  <Button variant="primary" size="lg">Large</Button>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>States</Text>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <Button variant="primary">Default</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Full Width</Text>
                <Button variant="primary" fullWidth>Continue</Button>
              </div>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>As Link (href)</Text>
                <Button variant="secondary" href="/series">Browse Series →</Button>
              </div>
              <div>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Loading State</Text>
                <Button variant="primary" loading>Loading...</Button>
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Message
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Success and error feedback
              </Text>
              <Stack gap="normal" style={{ maxWidth: 400 }}>
                <Message type="success">Operation completed successfully.</Message>
                <Message type="error">Something went wrong. Please try again.</Message>
              </Stack>
            </div>

            {/* Link */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Link
              </Heading>
              <Stack gap="normal">
                <div>
                  <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-1)' }}>Default</Text>
                  <Link href="/series" variant="default">Browse all series</Link>
                </div>
                <div>
                  <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-1)' }}>Back</Text>
                  <Link href="/series" variant="back">← Back to series</Link>
                </div>
                <div>
                  <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-1)' }}>Nav</Text>
                  <Link href="/series" variant="nav">Series</Link>
                </div>
              </Stack>
            </div>

            {/* Card */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Card
              </Heading>
              <Stack gap="normal">
                <div>
                  <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Default</Text>
                  <Card>
                    <Heading level={4}>Card Title</Heading>
                    <Text variant="secondary">This is a default card with padding and rounded corners.</Text>
                  </Card>
                </div>
                <div>
                  <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Interactive (hover)</Text>
                  <Card variant="interactive" href="/series">
                    <Heading level={4}>Clickable Card</Heading>
                    <Text variant="secondary">This card scales on hover and works as a link.</Text>
                  </Card>
                </div>
                <div>
                  <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Accent Border</Text>
                  <Card accentBorder>
                    <Heading level={4}>Important Card</Heading>
                    <Text variant="secondary">This card has a red accent border.</Text>
                  </Card>
                  <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-1)' }}>Use for progress/emphasis; do not use for read status on list items.</Text>
                </div>
                <div>
                  <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Padding variants (sm, md, lg)</Text>
                  <Stack direction="horizontal" gap="normal" style={{ flexWrap: 'wrap' }}>
                    <Card padding="sm"><Text size="sm">padding=&quot;sm&quot;</Text></Card>
                    <Card padding="md"><Text size="sm">padding=&quot;md&quot;</Text></Card>
                    <Card padding="lg"><Text size="sm">padding=&quot;lg&quot;</Text></Card>
                  </Stack>
                </div>
              </Stack>
            </div>

            {/* ProgressRing */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                ProgressRing
              </Heading>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Value variants (0%, 10%, 50%, 100%)</Text>
                <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', alignItems: 'center' }}>
                  {[0, 10, 50, 100].map((v) => (
                    <div key={v} style={{ textAlign: 'center' }}>
                      <ProgressRing value={v} size="md" />
                      <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-2)' }}>{v}%</Text>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Size variants (xs, sm, md, lg)</Text>
                <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
                    <div key={size} style={{ textAlign: 'center' }}>
                      <ProgressRing value={50} size={size} />
                      <Text variant="muted" size="xs" style={{ marginTop: 'var(--spacing-2)' }}>{size}</Text>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>With centered content</Text>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                  <ProgressRing value={75} size="md">
                    <Text variant="secondary" size="sm">75%</Text>
                  </ProgressRing>
                  <ProgressRing value={100} size="lg">
                    <Text variant="secondary" size="base">Done</Text>
                  </ProgressRing>
                </div>
              </div>
            </div>

            {/* ProgressText */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                ProgressText
              </Heading>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Variant: percentage</Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <ProgressText read={0} total={100} variant="percentage" />
                  <ProgressText read={25} total={100} variant="percentage" />
                  <ProgressText read={100} total={100} variant="percentage" />
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Variant: fraction</Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <ProgressText read={0} total={100} variant="fraction" />
                  <ProgressText read={25} total={100} variant="fraction" />
                  <ProgressText read={100} total={100} variant="fraction" />
                </div>
              </div>
              <div style={{ marginBottom: 'var(--spacing-4)' }}>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Variant: both</Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <ProgressText read={0} total={100} variant="both" />
                  <ProgressText read={25} total={100} variant="both" />
                  <ProgressText read={100} total={100} variant="both" />
                </div>
              </div>
              <div>
                <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>Size variants (sm, md, lg)</Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <ProgressText read={50} total={100} variant="percentage" size="sm" />
                  <ProgressText read={50} total={100} variant="percentage" size="md" />
                  <ProgressText read={50} total={100} variant="percentage" size="lg" />
                </div>
              </div>
            </div>

            {/* ReadToggleButton */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                ReadToggleButton
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Mark as Read (primary) / Mark as Unread (secondary, with border). Requires auth; demo uses mock IDs.
              </Text>
              <Stack direction="horizontal" gap="loose" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <Text variant="muted" size="xs" style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}>Unread state</Text>
                  <ReadToggleButton
                    scpId="00000000-0000-0000-0000-000000000001"
                    isRead={false}
                    userId="demo-user-id"
                    size="sm"
                  />
                </div>
                <div>
                  <Text variant="muted" size="xs" style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}>Read state</Text>
                  <ReadToggleButton
                    scpId="00000000-0000-0000-0000-000000000002"
                    isRead={true}
                    userId="demo-user-id"
                    size="sm"
                  />
                </div>
                <div>
                  <Text variant="muted" size="xs" style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}>Size: md</Text>
                  <ReadToggleButton
                    scpId="00000000-0000-0000-0000-000000000003"
                    isRead={false}
                    userId="demo-user-id"
                    size="md"
                  />
                </div>
              </Stack>
            </div>

            {/* BookmarkButton */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                BookmarkButton
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Save / Saved (requires auth; demo uses mock IDs)
              </Text>
              <Stack direction="horizontal" gap="loose" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div>
                  <Text variant="muted" size="xs" style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}>Not bookmarked</Text>
                  <BookmarkButton
                    scpId="demo-id"
                    scpRouteId="SCP-173"
                    isBookmarked={false}
                    userId="demo-user"
                    size="sm"
                  />
                </div>
                <div>
                  <Text variant="muted" size="xs" style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}>Bookmarked</Text>
                  <BookmarkButton
                    scpId="demo-id-2"
                    scpRouteId="SCP-096"
                    isBookmarked={true}
                    userId="demo-user"
                    size="sm"
                  />
                </div>
              </Stack>
            </div>

          </section>

          {/* ========== ORGANISMS ========== */}
          <section style={SECTION_DIVIDER_STYLE}>
            <Heading level={1} style={{ marginBottom: 'var(--spacing-6)' }}>
              Organisms
            </Heading>

            {/* PageHeader */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                PageHeader
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                simple, with back, with back + badge
              </Text>
              <Stack gap="loose">
                <PageHeader title="Simple title" description="Optional description text." />
                <PageHeader title="With back link" backHref="/series" description="Back link above title." />
                <PageHeader title="With badge" backHref="/series" badge="Access Granted" description="Badge below title." />
              </Stack>
            </div>

            {/* SeriesCard */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                SeriesCard
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                0% and &gt;0% states
              </Text>
              <Grid cols={2}>
                <SeriesCard series="Series I" roman="I" total={100} read={0} href="/series/1" />
                <SeriesCard series="Series II" roman="II" total={100} read={45} href="/series/2" />
              </Grid>
            </div>

            {/* RangeListItem */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                RangeListItem
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                0% and &gt;0% states
              </Text>
              <Stack gap="tight" style={{ maxWidth: 400 }}>
                <RangeListItem rangeLabel="001–099" total={99} read={0} href="/series/1/001-099" />
                <RangeListItem rangeLabel="100–199" total={100} read={33} href="/series/1/100-199" />
              </Stack>
            </div>

            {/* ScpListItem */}
            <div>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                ScpListItem
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                read/unread and bookmarked states; Save and Mark as Read buttons
              </Text>
              <Stack gap="tight" style={{ maxWidth: 480 }}>
                <ScpListItem
                  id="00000000-0000-0000-0000-000000000001"
                  scpId="SCP-173"
                  title="The Sculpture"
                  rating={4}
                  isRead={true}
                  isBookmarked={true}
                  href="/scp/173"
                  userId="demo-user-id"
                />
                <ScpListItem
                  id="00000000-0000-0000-0000-000000000002"
                  scpId="SCP-096"
                  title={'The "Shy Guy"'}
                  rating={5}
                  isRead={false}
                  isBookmarked={false}
                  href="/scp/096"
                  userId="demo-user-id"
                />
              </Stack>
            </div>
          </section>

          {/* ========== LAYOUT ========== */}
          <section style={SECTION_DIVIDER_STYLE}>
            <Heading level={1} style={{ marginBottom: 'var(--spacing-6)' }}>
              Layout
            </Heading>

            {/* Main */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Main
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-2)' }}>
                Full-height page wrapper (this page uses Main)
              </Text>
              <Text variant="muted" size="sm">
                min-height: 100vh, background: var(--color-background), padding: var(--spacing-page-padding) (48px)
              </Text>
            </div>

            {/* Container */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Container
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Centered content with max-width (size: xs, sm, md, lg, xl)
              </Text>
              <Stack direction="horizontal" gap="normal" style={{ flexWrap: 'wrap' }}>
                {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
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
                        Container {size} (max {size === 'xs' ? '448' : size === 'sm' ? '640' : size === 'md' ? '768' : size === 'lg' ? '1024' : '1280'}px)
                      </Text>
                    </div>
                  </Container>
                ))}
              </Stack>
            </div>

            {/* Stack */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Stack
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Flexbox with consistent gap (direction, gap, align, justify)
              </Text>
              <Stack direction="horizontal" gap="loose" style={{ flexWrap: 'wrap' }}>
                <Stack gap="tight" align="start">
                  <Text size="sm">Vertical, gap: tight</Text>
                  <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
                  <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
                  <div style={{ width: 40, height: 20, backgroundColor: 'var(--color-accent)' }} />
                </Stack>
                <Stack gap="normal" align="start">
                  <Text size="sm">Vertical, gap: normal</Text>
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
            </div>

            {/* Grid */}
            <div>
              <Heading level={3} className="mb-2" style={{ marginBottom: 'var(--spacing-2)' }}>
                Grid
              </Heading>
              <Text variant="secondary" size="sm" style={{ marginBottom: 'var(--spacing-3)' }}>
                Responsive 2→3→4 columns (resize browser to test)
              </Text>
              <Grid>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <Card key={n}>
                    <Heading level={4}>Card {n}</Heading>
                    <Text variant="secondary" size="sm">Responsive grid item</Text>
                  </Card>
                ))}
              </Grid>
              <Text variant="muted" size="sm" style={{ marginTop: 'var(--spacing-2)' }}>
                Fixed cols=3 example:
              </Text>
              <div style={{ marginTop: 'var(--spacing-2)' }}>
                <Grid cols={3}>
                  {[1, 2, 3].map((n) => (
                    <Card key={n}>
                      <Text size="sm">Fixed 3-col item {n}</Text>
                    </Card>
                  ))}
                </Grid>
              </div>
            </div>
          </section>
        </Stack>
      </Container>
    </Main>
  )
}
