import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = '/Users/edwardstone/Development/SCP'

async function read(relativePath) {
  return readFile(path.join(ROOT, relativePath), 'utf8')
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

async function run() {
  const layout = await read('app/layout.tsx')
  const signInPanel = await read('components/ui/sign-in-panel.tsx')
  const skipLink = await read('components/ui/skip-link.tsx')
  const nav = await read('components/navigation-client.tsx')
  const bookmark = await read('components/ui/bookmark-button.tsx')
  const readToggle = await read('components/ui/read-toggle-button.tsx')
  const recentlyViewed = await read('components/ui/recently-viewed-section.tsx')

  const checks = [
    {
      name: 'Modal provider is mounted in layout tree',
      pass: layout.includes('<ModalProvider>') && layout.includes('</ModalProvider>'),
      detail: 'app/layout.tsx must wrap app children with ModalProvider',
    },
    {
      name: 'SignInPanel heading text is present',
      pass: signInPanel.includes('Request Archive Access'),
      detail: 'components/ui/sign-in-panel.tsx must include expected heading copy',
    },
    {
      name: 'Skip link has no hardcoded z-index',
      pass:
        !/zIndex\s*:\s*\d+/.test(skipLink) &&
        !/z-index\s*:\s*\d+/.test(skipLink) &&
        skipLink.includes("zIndex: 'var(--z-skip-link)'"),
      detail: 'components/ui/skip-link.tsx must use tokenized z-index value',
    },
    {
      name: 'Navigation redirect includes search and hash',
      pass: nav.includes('window.location.search') && nav.includes('window.location.hash'),
      detail: 'components/navigation-client.tsx modal redirect should preserve full URL context',
    },
    {
      name: 'Bookmark redirect includes search and hash',
      pass: bookmark.includes('window.location.search') && bookmark.includes('window.location.hash'),
      detail: 'components/ui/bookmark-button.tsx modal redirect should preserve full URL context',
    },
    {
      name: 'Read toggle redirect includes search and hash',
      pass: readToggle.includes('window.location.search') && readToggle.includes('window.location.hash'),
      detail: 'components/ui/read-toggle-button.tsx modal redirect should preserve full URL context',
    },
    {
      name: 'Recently viewed redirect includes search and hash',
      pass:
        recentlyViewed.includes('window.location.search') &&
        recentlyViewed.includes('window.location.hash'),
      detail:
        'components/ui/recently-viewed-section.tsx modal redirect should preserve full URL context',
    },
  ]

  let hasFailure = false

  for (const check of checks) {
    if (check.pass) {
      console.log(`PASS: ${check.name}`)
    } else {
      hasFailure = true
      console.error(`FAIL: ${check.name} — ${check.detail}`)
    }
  }

  assert(!hasFailure, 'One or more QA checks failed')
  console.log('All modal/auth wiring checks passed')
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
