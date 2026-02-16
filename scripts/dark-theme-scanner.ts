#!/usr/bin/env tsx
/**
 * Dark Theme Scanner
 *
 * Fetches the top 100 SCPs, runs them through our sanitization pipeline,
 * and scans for remaining dark theme legibility issues.
 *
 * Run: npx tsx scripts/dark-theme-scanner.ts
 */

import { createClient } from '@supabase/supabase-js'
import { JSDOM } from 'jsdom'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as dotenv from 'dotenv'
import DOMPurifyFactory from 'dompurify'

// Load environment variables
dotenv.config({ path: '.env.local' })

// We need to set up a minimal DOM environment for DOMPurify
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const domWindow = dom.window as any
const DOMPurify = DOMPurifyFactory(domWindow)

// Set up global references for the color utilities
/* eslint-disable @typescript-eslint/no-explicit-any */
;(global as any).window = domWindow
;(global as any).document = domWindow.document
;(global as any).DOMParser = domWindow.DOMParser
/* eslint-enable @typescript-eslint/no-explicit-any */

// Now we can import sanitizeHtml and color utilities
import { sanitizeHtml, getRelativeLuminance } from '../lib/utils/sanitize'

interface ScpRecord {
  id: string
  scp_id: string
  scp_number: number
  title: string
  rating: number | null
  content_file: string | null
}

interface Issue {
  category: 'A' | 'B' | 'C' | 'D' | 'E'
  description: string
  element: string
  selector: string
  inlineStyle: string
  details: Record<string, unknown>
  suggestion: string
}

interface ScpIssues {
  scpId: string
  rating: number | null
  issues: Issue[]
}

interface Report {
  scannedAt: string
  totalScps: number
  scpsWithIssues: number
  summary: {
    categoryA: { count: number; affectedScps: string[] }
    categoryB: { count: number; affectedScps: string[] }
    categoryC: { count: number; affectedScps: string[] }
    categoryD: { count: number; affectedScps: string[] }
    categoryE: { count: number; affectedScps: string[] }
  }
  details: ScpIssues[]
}

const API_BASE = 'https://scp-data.tedivm.com/data/scp/items'
const FETCH_DELAY_MS = 200

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getElementSelector(element: Element): string {
  if (element.id) {
    return `#${element.id}`
  }

  const parent = element.parentElement
  if (!parent) {
    return element.tagName.toLowerCase()
  }

  const siblings = Array.from(parent.children)
  const index = siblings.indexOf(element)
  const parentSelector = getElementSelector(parent)

  return `${parentSelector} > ${element.tagName.toLowerCase()}:nth-child(${index + 1})`
}

function getContrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

function scanElement(element: Element, issues: Issue[]): void {
  if (!(element instanceof window.HTMLElement)) return

  const style = element.getAttribute('style')
  if (!style) return

  const computedStyle = {
    color: '',
    backgroundColor: '',
    backgroundImage: '',
    background: '',
    borderColor: '',
    borderTopColor: '',
    borderRightColor: '',
    borderBottomColor: '',
    borderLeftColor: '',
    opacity: '',
    display: '',
  }

  // Parse inline styles manually
  const styleDeclarations = style.split(';').map((s) => s.trim()).filter(Boolean)
  for (const declaration of styleDeclarations) {
    const [property, value] = declaration.split(':').map((s) => s.trim())
    if (!property || !value) continue

    const normalizedProperty = property.toLowerCase()
    if (normalizedProperty === 'color') computedStyle.color = value
    else if (normalizedProperty === 'background-color') computedStyle.backgroundColor = value
    else if (normalizedProperty === 'background-image') computedStyle.backgroundImage = value
    else if (normalizedProperty === 'background') computedStyle.background = value
    else if (normalizedProperty === 'border-color') computedStyle.borderColor = value
    else if (normalizedProperty === 'border-top-color') computedStyle.borderTopColor = value
    else if (normalizedProperty === 'border-right-color') computedStyle.borderRightColor = value
    else if (normalizedProperty === 'border-bottom-color') computedStyle.borderBottomColor = value
    else if (normalizedProperty === 'border-left-color') computedStyle.borderLeftColor = value
    else if (normalizedProperty === 'opacity') computedStyle.opacity = value
    else if (normalizedProperty === 'display') computedStyle.display = value
  }

  const hasTextContent = element.textContent?.trim().length ?? 0 > 0

  // Category A: Contrast failures
  if (computedStyle.color) {
    const colorLum = getRelativeLuminance(computedStyle.color)
    const hasExplicitBg = computedStyle.backgroundColor || computedStyle.background

    // Dark text on our dark background
    if (colorLum !== null && colorLum < 0.3 && !hasExplicitBg) {
      issues.push({
        category: 'A',
        description: 'Dark text without background',
        element: element.tagName.toLowerCase(),
        selector: getElementSelector(element),
        inlineStyle: style,
        details: { color: computedStyle.color, luminance: colorLum.toFixed(3) },
        suggestion: 'Add background or remap color',
      })
    }

    // Light text on light background
    if (hasExplicitBg && computedStyle.backgroundColor) {
      const bgLum = getRelativeLuminance(computedStyle.backgroundColor)
      if (colorLum !== null && bgLum !== null && colorLum > 0.85 && bgLum > 0.85) {
        issues.push({
          category: 'A',
          description: 'Light text on light background',
          element: element.tagName.toLowerCase(),
          selector: getElementSelector(element),
          inlineStyle: style,
          details: {
            color: computedStyle.color,
            colorLuminance: colorLum.toFixed(3),
            backgroundColor: computedStyle.backgroundColor,
            backgroundLuminance: bgLum.toFixed(3),
          },
          suggestion: 'Adjust color or background',
        })
      }
    }
  }

  // Light background without explicit color (our pipeline should add #1a1a1a, but verify)
  if (computedStyle.backgroundColor && !computedStyle.color) {
    const bgLum = getRelativeLuminance(computedStyle.backgroundColor)
    if (bgLum !== null && bgLum > 0.7) {
      issues.push({
        category: 'A',
        description: 'Light background without explicit text color',
        element: element.tagName.toLowerCase(),
        selector: getElementSelector(element),
        inlineStyle: style,
        details: { backgroundColor: computedStyle.backgroundColor, backgroundLuminance: bgLum.toFixed(3) },
        suggestion: 'Pipeline should add dark text color (#1a1a1a)',
      })
    }
  }

  // Category B: Border/visual issues
  const borderColors = [
    computedStyle.borderColor,
    computedStyle.borderTopColor,
    computedStyle.borderRightColor,
    computedStyle.borderBottomColor,
    computedStyle.borderLeftColor,
  ].filter(Boolean)

  for (const borderColor of borderColors) {
    const borderLum = getRelativeLuminance(borderColor)
    if (borderLum !== null && borderLum < 0.2) {
      issues.push({
        category: 'B',
        description: 'Dark border color',
        element: element.tagName.toLowerCase(),
        selector: getElementSelector(element),
        inlineStyle: style,
        details: { borderColor, luminance: borderLum.toFixed(3) },
        suggestion: 'Remap to grey-6 or lighter',
      })
    }
  }

  // Category C: Opacity/visibility
  if (computedStyle.opacity) {
    const opacity = Number.parseFloat(computedStyle.opacity)
    if (!Number.isNaN(opacity) && opacity < 0.3 && hasTextContent) {
      issues.push({
        category: 'C',
        description: 'Very low opacity on content element',
        element: element.tagName.toLowerCase(),
        selector: getElementSelector(element),
        inlineStyle: style,
        details: { opacity: computedStyle.opacity },
        suggestion: 'May be intentional; verify visibility',
      })
    }
  }

  if (computedStyle.color === 'transparent' && hasTextContent) {
    issues.push({
      category: 'C',
      description: 'Transparent text color',
      element: element.tagName.toLowerCase(),
      selector: getElementSelector(element),
      inlineStyle: style,
      details: { color: 'transparent' },
      suggestion: 'Likely intentional redaction; flag for review',
    })
  }

  if (computedStyle.display === 'none' && hasTextContent) {
    issues.push({
      category: 'C',
      description: 'Hidden content-bearing element',
      element: element.tagName.toLowerCase(),
      selector: getElementSelector(element),
      inlineStyle: style,
      details: { display: 'none' },
      suggestion: 'May be intentional; verify if content should be visible',
    })
  }

  // Category D: Nested context conflicts (check parent background vs. child color)
  const parent = element.parentElement
  if (parent && computedStyle.color) {
    const parentBg = parent.style.backgroundColor || parent.style.background
    if (parentBg) {
      const parentBgLum = getRelativeLuminance(parentBg)
      const childColorLum = getRelativeLuminance(computedStyle.color)

      if (parentBgLum !== null && childColorLum !== null) {
        const contrast = getContrastRatio(parentBgLum, childColorLum)
        if (contrast < 3) {
          issues.push({
            category: 'D',
            description: 'Low contrast between child text and parent background',
            element: element.tagName.toLowerCase(),
            selector: getElementSelector(element),
            inlineStyle: style,
            details: {
              childColor: computedStyle.color,
              childColorLuminance: childColorLum.toFixed(3),
              parentBackground: parentBg,
              parentBackgroundLuminance: parentBgLum.toFixed(3),
              contrastRatio: contrast.toFixed(2),
            },
            suggestion: 'Adjust child color or parent background',
          })
        }
      }
    }
  }

  // Category E: Unhandled patterns
  if (computedStyle.backgroundImage || computedStyle.background.includes('gradient') || computedStyle.background.includes('url(')) {
    if (!computedStyle.color) {
      issues.push({
        category: 'E',
        description: 'Background image/gradient without explicit text color',
        element: element.tagName.toLowerCase(),
        selector: getElementSelector(element),
        inlineStyle: style,
        details: {
          backgroundImage: computedStyle.backgroundImage || 'in background shorthand',
          background: computedStyle.background,
        },
        suggestion: 'Add explicit color or verify pipeline handles gradients',
      })
    }
  }

  // Check for filter, mix-blend-mode, text-shadow with dark colors
  const advancedStyleProps = ['filter', 'mix-blend-mode', 'text-shadow']
  for (const prop of advancedStyleProps) {
    const regex = new RegExp(`${prop}\\s*:\\s*([^;]+)`, 'i')
    const match = style.match(regex)
    if (match) {
      const value = match[1].trim()
      // Simple heuristic: flag if contains dark color values
      const darkColorPattern = /#[0-2][0-2][0-2][0-2][0-2][0-2]|rgb\(\s*[0-5]?\d\s*,\s*[0-5]?\d\s*,\s*[0-5]?\d\s*\)/i
      if (darkColorPattern.test(value)) {
        issues.push({
          category: 'E',
          description: `Dark color in ${prop}`,
          element: element.tagName.toLowerCase(),
          selector: getElementSelector(element),
          inlineStyle: style,
          details: { property: prop, value },
          suggestion: 'Review and potentially remap dark values',
        })
      }
    }
  }
}

function scanHtml(html: string): Issue[] {
  const issues: Issue[] = []
  const doc = new JSDOM(html)
  const body = doc.window.document.body

  // Scan all elements with inline styles
  const elementsWithStyle = body.querySelectorAll('[style]')
  elementsWithStyle.forEach((element) => {
    scanElement(element, issues)
  })

  return issues
}

async function fetchScpContent(contentFile: string, scpId: string): Promise<string | null> {
  try {
    const url = `${API_BASE}/${contentFile}`
    const response = await fetch(url)
    if (!response.ok) {
      console.error(`  ✗ Failed to fetch ${scpId}: HTTP ${response.status}`)
      return null
    }

    const json = await response.json()
    const content = json[scpId]
    if (!content || !content.raw_content) {
      console.error(`  ✗ No raw_content for ${scpId}`)
      return null
    }

    return content.raw_content
  } catch (error) {
    console.error(`  ✗ Error fetching ${scpId}:`, error)
    return null
  }
}

async function main() {
  console.log('🔍 Dark Theme Scanner\n')

  // Step 1: Fetch top 100 SCPs from Supabase
  console.log('Step 1: Fetching top 100 SCPs from Supabase...')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: scps, error } = await supabase
    .from('scps')
    .select('id, scp_id, scp_number, title, rating, content_file')
    .order('rating', { ascending: false })
    .limit(100)

  if (error) {
    console.error('❌ Supabase query failed:', error)
    process.exit(1)
  }

  if (!scps || scps.length === 0) {
    console.error('❌ No SCPs returned from database')
    process.exit(1)
  }

  console.log(`✓ Fetched ${scps.length} SCPs\n`)

  // Step 2-4: Process each SCP
  console.log('Step 2-4: Fetching content, sanitizing, and scanning...\n')

  const report: Report = {
    scannedAt: new Date().toISOString(),
    totalScps: scps.length,
    scpsWithIssues: 0,
    summary: {
      categoryA: { count: 0, affectedScps: [] },
      categoryB: { count: 0, affectedScps: [] },
      categoryC: { count: 0, affectedScps: [] },
      categoryD: { count: 0, affectedScps: [] },
      categoryE: { count: 0, affectedScps: [] },
    },
    details: [],
  }

  let processed = 0
  for (const scp of scps as ScpRecord[]) {
    processed++
    console.log(`[${processed}/${scps.length}] ${scp.scp_id}: ${scp.title}`)

    if (!scp.content_file) {
      console.log('  ⊘ No content_file, skipping\n')
      continue
    }

    // Fetch raw content
    const rawHtml = await fetchScpContent(scp.content_file, scp.scp_id)
    if (!rawHtml) {
      console.log('  ⊘ Failed to fetch content\n')
      await sleep(FETCH_DELAY_MS)
      continue
    }

    // Sanitize (pass DOMPurify instance for Node.js compatibility)
    const sanitized = sanitizeHtml(rawHtml, DOMPurify)

    // Scan
    const issues = scanHtml(sanitized)

    if (issues.length > 0) {
      console.log(`  ⚠ Found ${issues.length} issue(s)`)
      report.scpsWithIssues++
      report.details.push({
        scpId: scp.scp_id,
        rating: scp.rating,
        issues,
      })

      // Update summary
      for (const issue of issues) {
        const category = `category${issue.category}` as keyof typeof report.summary
        report.summary[category].count++
        if (!report.summary[category].affectedScps.includes(scp.scp_id)) {
          report.summary[category].affectedScps.push(scp.scp_id)
        }
      }
    } else {
      console.log('  ✓ No issues')
    }

    console.log()

    // Be polite to the API
    await sleep(FETCH_DELAY_MS)
  }

  // Step 5: Write report
  console.log('\nStep 5: Writing report...\n')

  const outputDir = path.join(process.cwd(), 'scripts', 'output')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const reportPath = path.join(outputDir, 'dark-theme-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')

  console.log(`✓ Report written to: ${reportPath}\n`)

  // Console summary
  console.log('═══════════════════════════════════════════════════════════')
  console.log('                      SUMMARY REPORT                        ')
  console.log('═══════════════════════════════════════════════════════════\n')

  console.log(`Total SCPs scanned:      ${report.totalScps}`)
  console.log(`SCPs with issues:        ${report.scpsWithIssues}`)
  console.log(`SCPs without issues:     ${report.totalScps - report.scpsWithIssues}\n`)

  console.log('Issues by category:')
  console.log(`  Category A (Contrast failures):        ${report.summary.categoryA.count} (${report.summary.categoryA.affectedScps.length} SCPs)`)
  console.log(`  Category B (Border/visual):            ${report.summary.categoryB.count} (${report.summary.categoryB.affectedScps.length} SCPs)`)
  console.log(`  Category C (Opacity/visibility):       ${report.summary.categoryC.count} (${report.summary.categoryC.affectedScps.length} SCPs)`)
  console.log(`  Category D (Nested context):           ${report.summary.categoryD.count} (${report.summary.categoryD.affectedScps.length} SCPs)`)
  console.log(`  Category E (Unhandled patterns):       ${report.summary.categoryE.count} (${report.summary.categoryE.affectedScps.length} SCPs)\n`)

  console.log('Most affected SCPs (by total issue count):')
  const topAffected = report.details
    .sort((a, b) => b.issues.length - a.issues.length)
    .slice(0, 10)

  topAffected.forEach((scp, index) => {
    console.log(`  ${index + 1}. ${scp.scpId} (rating: ${scp.rating ?? 'N/A'}) — ${scp.issues.length} issues`)
  })

  console.log('\n═══════════════════════════════════════════════════════════\n')
  console.log('✓ Scan complete!')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
