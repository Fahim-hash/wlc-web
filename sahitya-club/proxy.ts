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

  // Keep logs focused on page visits, not API calls, assets, or prefetches.
  if (
    request.method !== 'GET' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/.well-known/') ||
    pathname.includes('.') ||
    request.headers.has('next-router-prefetch') ||
    request.headers.get('purpose') === 'prefetch'
  ) {
    return
  }

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

  console.info(
    '[WLC_VISITOR]',
    JSON.stringify({
      timestamp: new Date().toISOString(),
      country,
      city,
      method: request.method,
      path: pathname,
    }),
  )
}

/**
 * Operational routes that must remain available while the public site is
 * under maintenance. The panel subdomain is handled separately below.
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

  return (
    pathname === '/reserve' ||
    pathname.includes('.') ||
    exemptPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  )
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl
  const { pathname } = url
  const hostname = request.headers.get('host') || ''

  // Visitor location logging; does not change routing behavior.
  logVisitor(request)

  // The dedicated panel subdomain remains available during maintenance.
  if (hostname.includes('panel.wlc.pro.bd')) {
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/panelpage', request.url))
    }
    return NextResponse.rewrite(new URL(`/panelpage${pathname}`, request.url))
  }

  // Block direct access to the panel's internal rewrite target on the main host.
  if (!hostname.includes('panel.wlc.pro.bd') && pathname.startsWith('/panelpage')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isMaintenanceExemptPath(pathname)) {
    return NextResponse.next()
  }

  // Vercel Flags controls WLC maintenance mode; defaultValue=false is fail-safe.
  const isMaintenanceMode = await maintenanceMode()
  if (isMaintenanceMode) {
    return NextResponse.redirect(new URL('/maintenance', request.url), 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
