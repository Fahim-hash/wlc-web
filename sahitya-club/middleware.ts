// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// যখন মেইনটেইন্যান্স মোড অন করতে চাও, এটাকে true করে দেবে 🚀
const IS_MAINTENANCE_MODE = false; 

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // মেইনটেইন্যান্স মোড অন থাকলে এবং ইউজার যদি অলরেডি /maintenance পেজে না থাকে
  // এবং কোনো ইমেজ বা লোগো ফাইল রিকোয়েস্ট না করে, তাকে রিডাইরেক্ট করো
  if (
    IS_MAINTENANCE_MODE && 
    pathname !== '/maintenance' && 
    !pathname.startsWith('/_next') && 
    !pathname.includes('.')
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url))
  }

  return NextResponse.next()
}

// কোন কোন পেজে এই মিডলওয়্যার চেক করবে (সব পেজে)
export const config = {
  matcher: '/:path*',
}
