import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { maintenanceMode } from "./flags";

/**
 * Log lightweight page-visit metadata to the Vercel runtime logs.
 * No IP addresses, query strings, cookies, or personal identifiers are stored.
 */
function logVisitor(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep logs focused on page visits, not API calls, assets, or prefetches.
  if (
    request.method !== "GET" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/") ||
    pathname.includes(".") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.get("purpose") === "prefetch"
  ) {
    return;
  }

  const country = request.headers.get("x-vercel-ip-country") || "unknown";
  const rawCity = request.headers.get("x-vercel-ip-city");
  let city = "unknown";

  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }

  console.info(
    "[WLC_VISITOR]",
    JSON.stringify({
      timestamp: new Date().toISOString(),
      country,
      city,
      method: request.method,
      path: pathname,
    }),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Visitor location logging; does not change routing behavior.
  logVisitor(request);

  // The panel subdomain must remain available even during public-site maintenance.
  if (hostname.includes("panel.wlc.pro.bd")) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/panelpage", request.url));
    }
    return NextResponse.rewrite(new URL(`/panelpage${pathname}`, request.url));
  }

  // Block direct access to the internal panel route on the main hostname.
  if (!hostname.includes("panel.wlc.pro.bd") && pathname.startsWith("/panelpage")) {
    return NextResponse.redirect(new URL("/", re...[truncated]