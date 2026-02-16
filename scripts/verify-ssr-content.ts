#!/usr/bin/env tsx
/**
 * SSR Content Verification Script (one-time QA)
 *
 * Fetches SCP pages from a running local dev server and checks that
 * the <article> element contains server-rendered content (not empty
 * or just a loading skeleton).
 *
 * Prerequisites: npm run dev must be running on localhost:3000
 * Run: npx tsx scripts/verify-ssr-content.ts
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const TEST_SCPS = ['SCP-173', 'SCP-999', 'SCP-3000']

interface Result {
  scpId: string
  status: 'PASS' | 'FAIL'
  contentLength: number
  details: string
}

async function checkScp(scpId: string): Promise<Result> {
  const url = `${BASE_URL}/scp/${scpId}`
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SSR-Verify/1.0' },
    })

    if (!response.ok) {
      return { scpId, status: 'FAIL', contentLength: 0, details: `HTTP ${response.status}` }
    }

    const html = await response.text()

    // Check for the <article> element with class="scp-content"
    const articleMatch = html.match(/<article[^>]*class="scp-content"[^>]*>([\s\S]*?)<\/article>/)
    if (!articleMatch) {
      // Check if we have a loading skeleton instead
      const hasSkeleton = html.includes('Loading SCP content')
      return {
        scpId,
        status: 'FAIL',
        contentLength: 0,
        details: hasSkeleton
          ? 'Page has loading skeleton but no server-rendered article content'
          : 'No <article class="scp-content"> element found in HTML',
      }
    }

    const articleContent = articleMatch[1].trim()
    if (articleContent.length === 0) {
      return { scpId, status: 'FAIL', contentLength: 0, details: 'Article element is empty' }
    }

    // Check it's not just whitespace or trivial content
    const textContent = articleContent.replace(/<[^>]*>/g, '').trim()
    if (textContent.length < 50) {
      return {
        scpId,
        status: 'FAIL',
        contentLength: textContent.length,
        details: `Article content too short (${textContent.length} chars of text)`,
      }
    }

    return {
      scpId,
      status: 'PASS',
      contentLength: articleContent.length,
      details: `${articleContent.length} chars HTML, ${textContent.length} chars text`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { scpId, status: 'FAIL', contentLength: 0, details: `Fetch error: ${message}` }
  }
}

async function main() {
  console.log('SSR Content Verification')
  console.log(`Target: ${BASE_URL}`)
  console.log(`Testing: ${TEST_SCPS.join(', ')}\n`)

  const results: Result[] = []

  for (const scpId of TEST_SCPS) {
    process.stdout.write(`  ${scpId}... `)
    const result = await checkScp(scpId)
    results.push(result)

    if (result.status === 'PASS') {
      console.log(`PASS (${result.details})`)
    } else {
      console.log(`FAIL — ${result.details}`)
    }
  }

  console.log()
  const passed = results.filter((r) => r.status === 'PASS').length
  const failed = results.filter((r) => r.status === 'FAIL').length
  console.log(`Results: ${passed} PASS, ${failed} FAIL`)

  if (failed > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
