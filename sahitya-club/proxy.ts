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

export async function proxy(request: NextRequest) {
  const url = request.nextUrl
  const { pathname } = url
  const hostname = request.headers.get('host') || ''

  // Visitor location logging; does not change routing behavior.
  logVisitor(request)

  // ==========================================
  // 🎯 ১. সাবডোমেন (panel.wlc.pro.bd) হ্যান্ডেলিং
  // ==========================================
  if (hostname.includes('panel.wlc.pro.bd')) {
    // 💡 প্যানেল সবসময় অন থাকবে, মেইনটেইন্যান্স মোড একে টাচ করতে পারবে না।
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/panelpage', request.url))
    }
    return NextResponse.rewrite(new URL(`/panelpage${pathname}`, request.url))
  }

  // 🔒 ২. মেইন সাইট (wlc.pro.bd) দিয়ে সরাসরি /panelpage এ ঢোকা ব্লক করা
  if (!hostname.includes('panel.wlc.pro.bd') && pathname.startsWith('/panelpage')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Skip flag evaluation for framework assets, APIs, static files, and
  // system endpoints to avoid unnecessary provider requests.
  if (
    pathname === '/reserve' ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.well-known/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Vercel Flags controls maintenance mode; defaultValue=false is fail-safe.
  const isMaintenanceMode = await maintenanceMode()
  if (isMaintenanceMode) {
    return NextResponse.redirect(new URL('/reserve', request.url))
  }

  return NextResponse.next()
}

// সব পেজ এবং রাউটে মিডলওয়্যার চেক করার জন্য
export const config = {
  matcher: '/:path*',
}
