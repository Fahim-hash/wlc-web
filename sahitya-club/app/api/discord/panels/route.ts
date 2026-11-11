import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.DISCORD_BOT_SYNC_SECRET?.trim();
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() || "";
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Read-only bridge: Discord can read published panel data, never write to Firestore. */
export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const snapshot = await getAdminDb().collection("panel_members").get();
    const panels: Record<string, Array<Record<string, unknown>>> = {};

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const panelId = typeof data.panelId === "string" ? data.panelId : "";
      if (!/^GEN-[1-3]$/.test(panelId) || data.status !== "PUBLISHED") continue;

      (panels[panelId] ||= []).push({
        id: doc.id,
        name: typeof data.name === "string" ? data.name : "",
        role: typeof data.role === "string" ? data.role : "",
        group: typeof data.group === "string" ? data.group : "executive",
        department: typeof data.department === "string" ? data.department : null,
        sortOrder: Number(data.sortOrder || 0),
      });
    }

    for (const members of Object.values(panels)) {
      members.sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
    }

    return NextResponse.json({
      success: true,
      source: "firestore/panel_members",
      generatedAt: new Date().toISOString(),
      panels,
      note: "Only PUBLISHED panel_members records are returned.",
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("[discord-panels] sync failed", error);
    return NextResponse.json({ success: false, message: "Panel data is temporarily unavailable." }, { status: 503 });
  }
}
