import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";\nimport { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const limit = await enforceRateLimit({ request, namespace: "member-portal-verify", limit: 30, windowMs: 60 * 1000 });
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);
  } catch {
    return NextResponse.json({ valid: false, message: "Verification service is temporarily unavailable." }, { status: 503 });
  }

  const memberId = new URL(request.url).searchParams.get("id")?.trim().toUpperCase() || "";
  if (!/^WLC-[A-Z0-9]+-\d{3,}$/.test(memberId)) {
    return NextResponse.json({ valid: false, message: "Invalid member ID." }, { status: 400 });
  }
  try {
    const snapshot = await getAdminDb().collection("registered_members").doc(memberId).get();
    if (!snapshot.exists) return NextResponse.json({ valid: false, message: "Member record not found." }, { status: 404 });
    const member = snapshot.data()!;
    if (member.status !== "ACTIVE") {
      return NextResponse.json({ valid: false, memberId, message: "This membership is not currently active." });
    }
    return NextResponse.json({
      valid: true,
      memberId,
      name: String(member.name || ""),
      status: "ACTIVE",
      organization: "Willes Literary Club",
    });
  } catch {
    return NextResponse.json({ valid: false, message: "Verification service is temporarily unavailable." }, { status: 503 });
  }
}
