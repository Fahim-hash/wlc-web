// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// যখন মেইনটেইন্যান্স মোড অন করতে চান, এটাকে true করে দেবেন 🚀
const IS_MAINTENANCE_MODE = false; 

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { pathname } = url;
  const hostname = request.headers.get('host') || '';

  // ==========================================
  // 🎯 ১. সাবডোমেন (panel.wlc.pro.bd) হ্যান্ডেলিং
  // ==========================================
  if (hostname.includes('panel.wlc.pro.bd')) {
    // 💡 প্যানেল সবসময় অন থাকবে, মেইনটেইন্যান্স মোড একে টাচ করতে পারবে না।
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/panelpage', request.url));
    }
    return NextResponse.rewrite(new URL(`/panelpage${pathname}`, request.url));
  }

  // 🔒 ২. মেইন সাইট (wlc.pro.bd) দিয়ে সরাসরি /panelpage এ ঢোকা ব্লক করা
  if (!hostname.includes('panel.wlc.pro.bd') && pathname.startsWith('/panelpage')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ==========================================
  // 🛠️ ৩. মেইন সাইটের জন্য মেইনটেইন্যান্স মোড
  // ==========================================
  if (
    IS_MAINTENANCE_MODE && 
    pathname !== '/soon' && 
    !pathname.startsWith('/_next') && 
    !pathname.includes('.')
  ) {
    return NextResponse.redirect(new URL('/soon', request.url))
  }

  return NextResponse.next()
}

// সব পেজ এবং রাউটে মিডলওয়্যার চেক করার জন্য
export const config = {
  matcher: '/:path*',
}
