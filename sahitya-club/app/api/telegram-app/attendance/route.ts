import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getVerifiedTelegramMiniAppAdmin } from "@/lib/telegram-mini-app-auth-v2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = getVerifiedTelegramMiniAppAdmin(request);
  if (!admin) return NextResponse.json({ message: "Telegram admin verification failed. Open this app from the WLC bot." }, { status: 401 });
  try {
    const db = getAdminDb();
    const requestedMemberId = String(new URL(request.url).searchParams.get("memberId") || "").trim().toUpperCase();
    if (requestedMemberId) {
      if (!/^WLC-[A-Z0-9]+-\d{3,}$/.test(requestedMemberId)) return NextResponse.json({ message: "Invalid WLC member ID." }, { status: 400 });
      const memberSnap = await db.collection("registered_members").doc(requestedMemberId).get();
      if (!memberSnap.exists || memberSnap.data()?.status !== "ACTIVE") return NextResponse.json({ message: "No active member found for that ID." }, { status: 404 });
      return NextResponse.json({ member: { memberId: requestedMemberId, name: String(memberSnap.data()?.name || "") } });
    }
    const snap = await db.collection("events").where("status", "==", "PUBLISHED").limit(100).get();
    const events = snap.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, title: String(data.title || "WLC event"), date: typeof data.date === "string" ? data.date : "" };
    }).sort((a,b) => a.date.localeCompare(b.date));
    return NextResponse.json({ admin: { id: admin.id, firstName: admin.firstName || "" }, events });
  } catch {
    return NextResponse.json({ message: "Could not load published events." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = getVerifiedTelegramMiniAppAdmin(request);
  if (!admin) return NextResponse.json({ message: "Telegram admin verification failed." }, { status: 401 });
  try {
    const body = await request.json();
    const memberId = String(body?.memberId || "").trim().toUpperCase();
    const eventId = String(body?.eventId || "").trim();
    const status = String(body?.status || "PRESENT").toUpperCase();
    if (!/^WLC-[A-Z0-9]+-\d{3,}$/.test(memberId)) return NextResponse.json({ message: "Enter a valid WLC member ID." }, { status: 400 });
    if (!eventId || !["PRESENT", "LATE"].includes(status)) return NextResponse.json({ message: "Choose an event and valid status." }, { status: 400 });

    const db = getAdminDb();
    const memberRef = db.collection("registered_members").doc(memberId);
    const eventRef = db.collection("events").doc(eventId);
    const [memberSnap, eventSnap] = await Promise.all([memberRef.get(), eventRef.get()]);
    if (!memberSnap.exists || memberSnap.data()?.status !== "ACTIVE") return NextResponse.json({ message: "No active member found for that ID." }, { status: 404 });
    if (!eventSnap.exists || eventSnap.data()?.status !== "PUBLISHED") return NextResponse.json({ message: "Published event not found." }, { status: 404 });

    const legacy = await db.collection("member_attendance").where("memberId", "==", memberId).get();
    const duplicate = legacy.docs.find(doc => String(doc.data().eventId || "") === eventId);
    if (duplicate) return NextResponse.json({ message: "Attendance already exists for this member and event.", duplicate: true }, { status: 409 });

    const recordId = "tg_" + crypto.createHash("sha256").update(eventId + ":" + memberId).digest("hex").slice(0, 40);
    const recordRef = db.collection("member_attendance").doc(recordId);
    const now = Date.now();
    const memberName = String(memberSnap.data()?.name || "");
    const eventTitle = String(eventSnap.data()?.title || "WLC event");
    const record = {
      memberId, memberName, eventId, eventTitle,
      eventDate: typeof eventSnap.data()?.date === "string" ? eventSnap.data()?.date : "",
      status, checkedInAt: now, updatedAt: now, createdAt: now,
      updatedBy: "telegram:" + admin.id, source: "telegram-mini-app"
    };
    const saved = await db.runTransaction(async tx => {
      const current = await tx.get(recordRef);
      if (current.exists) return false;
      tx.create(recordRef, record);
      return true;
    });
    if (!saved) return NextResponse.json({ message: "This member has already been checked in for this event.", duplicate: true }, { status: 409 });
    await db.collection("audit_logs").add({ action: "CREATE_ATTENDANCE", collection: "member_attendance", recordId, actor: "telegram:" + admin.id, createdAt: now });
    return NextResponse.json({ success: true, message: "Attendance recorded.", member: { memberId, name: memberName }, event: eventTitle, status });
  } catch (error) {
    console.error("Telegram Mini App attendance error:", error);
    return NextResponse.json({ message: "Unable to save attendance right now." }, { status: 500 });
  }
}