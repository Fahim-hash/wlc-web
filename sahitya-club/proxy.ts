// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { maintenanceMode } from './flags'

/**
 * Log lightweight page-visit metadata to the Vercel runtime logs.
 * No IP addresses, query strings, cookies, or personal identifiers are stored.
 */
function logVisitor(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    request.method !== 'GET' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/.well-known/') ||
    pathname.includes('.') ||
    request.headers.has('next-router-prefetch') ||
    request.headers.get('purpose') === 'prefetch'
  ) return

  const country = request.headers.get('x-vercel-ip-country') || 'unknown'
  const rawCity = request.headers.get('x-vercel-ip-city')
  let city = 'unknown'

  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity)
    } catch {
      city = rawCity
    }
  }

  console.info('[WLC_VISITOR]', JSON.stringify({
    timestamp: new Date().toISOString(),
    country,
    city,
    method: request.method,
    path: pathname,
  }))
}

/**
 * These operational routes stay available while public WLC pages are offline.
 * The panel subdomain is handled separately.
 */
function isMaintenanceExemptPath(pathname: string) {
  const exemptPrefixes = [
    '/maintenance',
    '/member-portal',
    '/memberhub',
    '/telegram-app',
    '/api',
    '/_next',
    '/.well-known',
  ]

  return pathname.includes('.') || exemptPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  logVisitor(request)

  // The dedicated admin panel subdomain is always available.
  if (hostname.includes('panel.wlc.pro.bd')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/panelpage', request.url))
    }
    return NextResponse.rewrite(new URL(`/panelpage${pathname}`, request.url))
  }

  // Prevent direct access to the panel's internal rewrite target on the main host.
  if (!hostname.includes('panel.wlc.pro.bd') && pathname.startsWith('/panelpage')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isMaintenanceExemptPath(pathname)) {
    return NextResponse.next()
  }

  const isMaintenanceMode = await maintenanceMode()
  if (isMaintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url), 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
