import { spawn } from 'node:child_process'

const host = process.env.AUTH_SMOKE_HOST || '127.0.0.1'
const port = process.env.AUTH_SMOKE_PORT || '3101'
const baseUrl = `http://${host}:${port}`
const startupTimeoutMs = 60000

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeLocation(locationValue) {
  if (!locationValue) return ''
  if (locationValue.startsWith('http://') || locationValue.startsWith('https://')) {
    return new URL(locationValue).pathname + new URL(locationValue).search
  }
  return locationValue
}

async function waitForServer() {
  const start = Date.now()

  while (Date.now() - start < startupTimeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/login`, { redirect: 'manual' })
      if (response.status === 200) return
    } catch {
      // Server is not ready yet.
    }

    await sleep(500)
  }

  throw new Error(`Timed out waiting for server at ${baseUrl}`)
}

async function assertLoginPage() {
  const response = await fetch(`${baseUrl}/login`)
  if (response.status !== 200) {
    throw new Error(`/login returned ${response.status}, expected 200`)
  }

  const html = await response.text()
  if (!html.includes('Request Archive Access')) {
    throw new Error('/login does not contain expected sign-in content')
  }
}

async function assertSavedRedirectsToLogin() {
  const response = await fetch(`${baseUrl}/saved`, { redirect: 'manual' })
  if (response.status === 307 || response.status === 302) {
    const location = normalizeLocation(response.headers.get('location'))
    const isExpected =
      location === '/login?redirect=/saved' || location === '/login?redirect=%2Fsaved'

    if (!isExpected) {
      throw new Error(
        `/saved redirected to "${location}", expected "/login?redirect=/saved"`
      )
    }
    return
  }

  if (response.status === 200) {
    const html = await response.text()
    const resolvedPath = new URL(response.url).pathname
    const looksLikeLogin =
      html.includes('Request Archive Access') ||
      html.includes('/login?redirect=/saved') ||
      html.includes('/login?redirect=%2Fsaved')
    const leakedSavedContent = html.includes('Saved Articles')

    if (leakedSavedContent && !looksLikeLogin) {
      throw new Error('/saved rendered saved content for unauthenticated request')
    }

    if (!looksLikeLogin) {
      throw new Error(
        `/saved did not resolve to login behavior (status 200 at "${resolvedPath}")`
      )
    }
    return
  }

  throw new Error(`/saved returned ${response.status}, expected redirect/login`)
}

async function assertCallbackRedirectsToLoginError() {
  const response = await fetch(`${baseUrl}/auth/callback`, { redirect: 'manual' })
  if (response.status === 307 || response.status === 302) {
    const location = normalizeLocation(response.headers.get('location'))
    if (!location.startsWith('/login?error=')) {
      throw new Error(
        `/auth/callback redirected to "${location}", expected login error redirect`
      )
    }
    return
  }

  if (response.status === 200) {
    const html = await response.text()
    const looksLikeLogin =
      html.includes('Request Archive Access') ||
      html.includes('/login?error=') ||
      html.includes('Could not verify magic link')

    if (!looksLikeLogin) {
      throw new Error('/auth/callback did not resolve to expected login error flow')
    }
    return
  }

  throw new Error(`/auth/callback returned ${response.status}, expected redirect/login`)
}

async function run() {
  const child = spawn(
    'npm',
    ['run', 'start', '--', '--hostname', host, '--port', port],
    {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  )

  let recentOutput = ''
  const appendOutput = (chunk) => {
    recentOutput += chunk.toString()
    if (recentOutput.length > 4000) {
      recentOutput = recentOutput.slice(-4000)
    }
  }

  child.stdout.on('data', appendOutput)
  child.stderr.on('data', appendOutput)

  const shutdown = () => {
    if (!child.killed) {
      child.kill('SIGTERM')
    }
  }

  try {
    await waitForServer()
    await assertLoginPage()
    await assertSavedRedirectsToLogin()
    await assertCallbackRedirectsToLoginError()
    console.log('Auth smoke test passed')
  } catch (error) {
    console.error('Auth smoke test failed')
    console.error(error instanceof Error ? error.message : String(error))
    if (recentOutput) {
      console.error('Recent server output:')
      console.error(recentOutput)
    }
    process.exitCode = 1
  } finally {
    shutdown()
    await new Promise((resolve) => {
      child.on('exit', () => resolve())
      setTimeout(() => resolve(), 3000)
    })
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
