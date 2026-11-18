import { NextResponse } from "next/server";
import { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";
import { loginMember, MEMBER_SESSION_COOKIE } from "@/lib/member-portal";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const limit = await enforceRateLimit({ request, namespace: "member-portal-login", limit: 5, windowMs: 15 * 60 * 1000 });
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 4096) return NextResponse.json({ success: false, message: "Request too large." }, { status: 413 });

    const body = await request.json();
    const session = await loginMember({ username: String(body?.username || ""), password: String(body?.password || "") });
    const response = NextResponse.json({ success: true });
    response.cookies.set(MEMBER_SESSION_COOKIE, session.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: new Date(session.expiresAt) });
    return response;
  } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Login failed." }, { status: 401 }); }
}
