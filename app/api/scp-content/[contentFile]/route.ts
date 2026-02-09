import { NextResponse } from 'next/server'

const UPSTREAM_BASE = 'https://scp-data.tedivm.com/data/scp/items/'
const UPSTREAM_TIMEOUT_MS = 8000

function isValidContentFile(file: string): boolean {
  return /^[A-Za-z0-9._-]+\.json$/.test(file)
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ contentFile: string }> }
) {
  const { contentFile } = await params

  if (!isValidContentFile(contentFile)) {
    return NextResponse.json({ error: 'Invalid content file' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstreamUrl = `${UPSTREAM_BASE}${encodeURIComponent(contentFile)}`
    const upstreamResponse = await fetch(upstreamUrl, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    })

    if (!upstreamResponse.ok) {
      const status = upstreamResponse.status === 404 ? 404 : 502
      return NextResponse.json(
        {
          error:
            upstreamResponse.status === 404
              ? 'Content file not found'
              : 'Upstream content service unavailable',
        },
        { status }
      )
    }

    const body = await upstreamResponse.text()
    return new NextResponse(body, {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    const isAbort = error instanceof Error && error.name === 'AbortError'
    return NextResponse.json(
      {
        error: isAbort
          ? 'Upstream content request timed out'
          : 'Failed to fetch upstream content',
      },
      { status: isAbort ? 504 : 502 }
    )
  } finally {
    clearTimeout(timeout)
  }
}
