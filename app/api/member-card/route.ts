import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const limit = await enforceRateLimit({ request, namespace: "member-card-lookup", limit: 15, windowMs: 60 * 1000 });
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);
  } catch {
    return NextResponse.json({ message: "Member lookup is temporarily unavailable." }, { status: 503 });
  }

  const memberId = new URL(request.url).searchParams.get("id")?.trim().toUpperCase() || "";
  if (!/^WLC-[A-Z0-9]+-\d{3,}$/.test(memberId)) {
    return NextResponse.json({ message: "Enter a valid WLC Member ID." }, { status: 400 });
  }

  try {
    const snapshot = await getAdminDb().collection("registered_members").doc(memberId).get();
    if (!snapshot.exists) return NextResponse.json({ message: "No member was found with this ID." }, { status: 404 });
    const member = snapshot.data()!;
    if (member.status !== "ACTIVE") {
      return NextResponse.json({ message: "This membership is not active, so a member card cannot be issued." }, { status: 403 });
    }

    // Only card-safe public fields are returned. Email, phone and internal notes stay private.
    return NextResponse.json({
      member: {
        memberId,
        name: String(member.name || "WLC Member"),
        batch: String(member.batch || ""),
        status: "ACTIVE",
      },
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ message: "Could not retrieve this member record. Please try again." }, { status: 503 });
  }
}
