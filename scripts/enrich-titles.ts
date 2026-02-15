/**
 * SCP Title Enrichment Script
 *
 * Fetches descriptive titles from the SCP Wiki series index pages
 * and updates the `scps.title` column in Supabase.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (not the anon key).
 *
 * Run: npm run enrich-titles
 */
import { createClient } from '@supabase/supabase-js'
import { JSDOM } from 'jsdom'
import { mkdirSync, writeFileSync } from 'node:fs'
import * as path from 'node:path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BATCH_SIZE = 500
const FETCH_DELAY_MS = 500
const BATCH_DELAY_MS = 100
const DRY_RUN = process.argv.includes('--dry-run')

const SERIES_URLS = [
  'https://scp-wiki.wikidot.com/scp-series',
  'https://scp-wiki.wikidot.com/scp-series-2',
  'https://scp-wiki.wikidot.com/scp-series-3',
  'https://scp-wiki.wikidot.com/scp-series-4',
  'https://scp-wiki.wikidot.com/scp-series-5',
  'https://scp-wiki.wikidot.com/scp-series-6',
  'https://scp-wiki.wikidot.com/scp-series-7',
  'https://scp-wiki.wikidot.com/scp-series-8',
  'https://scp-wiki.wikidot.com/scp-series-9',
  'https://scp-wiki.wikidot.com/scp-series-10',
]

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Extract SCP ID from an href like "/scp-173" → "SCP-173"
 */
function hrefToScpId(href: string): string | null {
  const match = href.match(/^\/scp-(\d+)$/)
  if (!match) return null
  return `SCP-${match[1]}`
}

/**
 * Extract descriptive title from a list item's text content.
 * Expects format like "SCP-173 - The Sculpture" — returns "The Sculpture".
 * Uses the first " - " separator (space-hyphen-space).
 */
function extractTitle(textContent: string): string | null {
  const separatorIndex = textContent.indexOf(' - ')
  if (separatorIndex === -1) return null
  const title = textContent.substring(separatorIndex + 3).trim()
  if (!title) return null
  return title
}

async function fetchSeriesPage(url: string, index: number): Promise<string | null> {
  console.log(`  Fetching series page ${index + 1}/${SERIES_URLS.length}... (${url})`)
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SCP-Reader-Title-Enrichment/1.0 (contact: github.com/scp-reader)',
      },
    })
    if (!response.ok) {
      console.error(`  ✗ HTTP ${response.status} for ${url}`)
      return null
    }
    const html = await response.text()
    console.log(`  ✓ Fetched (${(html.length / 1024).toFixed(0)} KB)`)
    return html
  } catch (error) {
    console.error(`  ✗ Failed to fetch ${url}:`, error instanceof Error ? error.message : error)
    return null
  }
}

function parseTitlesFromHtml(html: string): Map<string, string> {
  const titles = new Map<string, string>()
  const dom = new JSDOM(html)
  const document = dom.window.document

  // Find all <li> elements that contain an SCP link
  const listItems = document.querySelectorAll('li')

  for (const li of listItems) {
    // Find the first <a> whose href matches /scp-\d+
    const links = li.querySelectorAll('a')
    let scpId: string | null = null

    for (const link of links) {
      const href = link.getAttribute('href')
      if (!href) continue
      scpId = hrefToScpId(href)
      if (scpId) break
    }

    if (!scpId) continue

    // Extract title from the full text content of the <li>
    const textContent = li.textContent || ''
    const title = extractTitle(textContent)

    if (title) {
      titles.set(scpId, title)
    }
  }

  return titles
}

async function enrichTitles() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is required for title enrichment')
    process.exit(1)
  }

  if (!SUPABASE_URL) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is required')
    process.exit(1)
  }

  console.log('SCP Title Enrichment\n')

  // Step 1: Fetch series pages
  console.log('Step 1: Fetching series index pages from SCP Wiki...\n')

  const allTitles = new Map<string, string>()
  let fetchErrors = 0

  for (let i = 0; i < SERIES_URLS.length; i++) {
    const html = await fetchSeriesPage(SERIES_URLS[i], i)

    if (html) {
      const titles = parseTitlesFromHtml(html)
      console.log(`  Parsed ${titles.size} titles from series ${i + 1}`)
      for (const [id, title] of titles) {
        allTitles.set(id, title)
      }
    } else {
      fetchErrors++
    }

    // Polite delay between requests
    if (i < SERIES_URLS.length - 1) {
      await sleep(FETCH_DELAY_MS)
    }
  }

  console.log(`\n  Total titles parsed from wiki: ${allTitles.size}`)
  if (fetchErrors > 0) {
    console.log(`  Series pages that failed to fetch: ${fetchErrors}`)
  }

  if (allTitles.size === 0) {
    console.error('\nNo titles parsed. Aborting.')
    process.exit(1)
  }

  // Step 2: Update Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Build update entries: only include titles that differ from scp_id
  const updates: { scp_id: string; title: string }[] = []
  let skippedSameAsId = 0

  for (const [scpId, title] of allTitles) {
    if (title === scpId) {
      skippedSameAsId++
      continue
    }
    updates.push({ scp_id: scpId, title })
  }

  let updatedRows = 0
  let updateErrors = 0
  let notFound = 0

  if (DRY_RUN) {
    console.log('\nDRY RUN — skipping Supabase updates\n')
    console.log(`  Titles to update: ${updates.length}`)
    console.log(`  Skipped (same as scp_id): ${skippedSameAsId}\n`)
    console.log('  Sample parsed titles (first 20):')
    for (const entry of updates.slice(0, 20)) {
      console.log(`    ${entry.scp_id} → ${entry.title}`)
    }
    if (updates.length > 20) {
      console.log(`    ... and ${updates.length - 20} more`)
    }

    const outputDir = path.join(process.cwd(), 'scripts', 'output')
    mkdirSync(outputDir, { recursive: true })
    const outputPath = path.join(outputDir, 'enrichment-dry-run.json')
    writeFileSync(
      outputPath,
      JSON.stringify(
        Object.fromEntries(updates.map((u) => [u.scp_id, u.title])),
        null,
        2
      )
    )
    console.log(`\n  Full title map written to ${outputPath}`)
  } else {
    console.log('\nStep 2: Updating titles in Supabase...\n')
    console.log(`  Titles to update: ${updates.length}`)
    console.log(`  Skipped (same as scp_id): ${skippedSameAsId}`)

    const totalBatches = Math.ceil(updates.length / BATCH_SIZE)

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE)
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1

      console.log(`  Processing batch ${batchNumber}/${totalBatches} (${batch.length} rows)...`)

      const results = await Promise.all(
        batch.map(async (entry) => {
          const { error, data } = await supabase
            .from('scps')
            .update({ title: entry.title })
            .eq('scp_id', entry.scp_id)
            .select('scp_id')
          return { entry, error, data }
        })
      )

      for (const { entry, error, data } of results) {
        if (error) {
          console.error(`    ✗ Error updating ${entry.scp_id}: ${error.message}`)
          updateErrors++
        } else if (!data || data.length === 0) {
          notFound++
        } else {
          updatedRows++
        }
      }

      console.log(`  ✓ Batch ${batchNumber} complete`)

      if (i + BATCH_SIZE < updates.length) {
        await sleep(BATCH_DELAY_MS)
      }
    }
  }

  // Step 3: Summary
  console.log('\n===========================================================')
  console.log('                    ENRICHMENT SUMMARY                      ')
  console.log('===========================================================\n')
  console.log(`  Series pages fetched:          ${SERIES_URLS.length - fetchErrors}/${SERIES_URLS.length}`)
  console.log(`  Total titles parsed from wiki:  ${allTitles.size}`)
  console.log(`  Titles sent for update:         ${updates.length}`)
  console.log(`  DB rows updated:                ${updatedRows}`)
  console.log(`  Not found in DB:                ${notFound}`)
  console.log(`  Skipped (same as scp_id):       ${skippedSameAsId}`)
  console.log(`  Errors:                         ${updateErrors + fetchErrors}`)
  console.log('\n===========================================================\n')

  // Verify with a sample of well-known SCPs
  const sampleIds = ['SCP-173', 'SCP-682', 'SCP-999', 'SCP-096', 'SCP-049']
  const { data: sample } = await supabase
    .from('scps')
    .select('scp_id, title')
    .in('scp_id', sampleIds)

  if (sample && sample.length > 0) {
    console.log(`  Sample titles ${DRY_RUN ? '(current DB state)' : 'after enrichment'}:`)
    for (const row of sample) {
      console.log(`    ${row.scp_id}: ${row.title}`)
    }
  }

  console.log('\nDone.')
}

enrichTitles().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
