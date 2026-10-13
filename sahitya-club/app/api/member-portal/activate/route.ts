import { NextResponse } from "next/server";
import { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";
import { activateMemberAccount } from "@/lib/member-portal";
export const runtime = "nodejs";
export async function POST(request: Request) {
 try {
 const limit = await enforceRateLimit({ request, namespace: "member-portal-activate", limit: 5, windowMs: 15 * 60 * 1000 });
 if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);
 const contentLength = Number(request.headers.get("content-length") || 0);
 if (contentLength > 4096) return NextResponse.json({ success: false, message: "Request too large." }, { status: 413 });
 const body = await request.json(); const member = await activateMemberAccount({ token: String(body?.token || ""), username: String(body?.username || ""), password: String(body?.password || "") }); return NextResponse.json({ success: true, member }); }
 catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Activation failed." }, { status: 400 }); }
}
