import { NextResponse } from "next/server";
import { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";
import {
  createMemberAdminSession,
  isMemberAdminSecret,
  MEMBER_ADMIN_COOKIE,
} from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const limit = await enforceRateLimit({ request, namespace: "legacy-controlhub-login", limit: 5, windowMs: 15 * 60 * 1000 });
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 4096) {
      return NextResponse.json({ success: false, message: "Request too large." }, { status: 413 });
    }

    const body = await request.json();
    const gatewayKey = typeof body?.gatewayKey === "string" ? body.gatewayKey.trim() : "";

    // No hard-coded fallback: admin access must be configured in Vercel.
    if (!isMemberAdminSecret(gatewayKey)) {
      return NextResponse.json(
        { success: false, message: "Invalid admin access key." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const session = createMemberAdminSession();
    const response = NextResponse.json(
      { success: true, token: session.value, expiresAt: session.expiresAt },
      { headers: { "Cache-Control": "no-store" } }
    );
    response.cookies.set({
      name: MEMBER_ADMIN_COOKIE,
      value: session.value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.floor((session.expiresAt - Date.now()) / 1000),
    });
    return response;
  } catch (error) {
    console.error("Control hub authentication failed:", error);
    return NextResponse.json(
      { success: false, message: "Authentication service is unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
