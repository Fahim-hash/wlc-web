import { NextResponse } from "next/server";
import { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";
import { loginMember, MEMBER_SESSION_COOKIE, MemberPortalAuthError } from "@/lib/member-portal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const limit = await enforceRateLimit({
      request,
      namespace: "member-portal-login",
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 4096) {
      return NextResponse.json({ success: false, message: "Request too large." }, { status: 413 });
    }

    let body: { username?: unknown; password?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: "Invalid sign-in request." }, { status: 400 });
    }

    const session = await loginMember({
      username: typeof body?.username === "string" ? body.username : "",
      password: typeof body?.password === "string" ? body.password : "",
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(MEMBER_SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(session.expiresAt),
    });
    return response;
  } catch (error) {
    if (error instanceof MemberPortalAuthError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 401 });
    }
    if (error instanceof Error) {
      // Keep credentials and member data out of logs; the message identifies
      // missing server configuration or infrastructure failures for operators.
      console.error("[member-portal/login] Server-side sign-in failure:", error.message);
    } else {
      console.error("[member-portal/login] Unknown server-side sign-in failure");
    }
    return NextResponse.json(
      { success: false, message: "The member portal is temporarily unavailable. Please try again later." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
