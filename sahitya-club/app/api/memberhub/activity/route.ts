import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated } from "@/lib/member-management";
import { listPublished } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isMemberAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const db = getAdminDb();
    const [membersSnap, events] = await Promise.all([
      db.collection("registered_members").where("status", "==", "ACTIVE").limit(500).get(),
      listPublished("events", 100),
    ]);
    return NextResponse.json({
      members: membersSnap.docs.map((doc) => {
        const data = doc.data();
        return { memberId: doc.id, name: String(data.name || ""), email: data.email || null };
      }).sort((a, b) => a.name.localeCompare(b.name)),
      events: events.map((event) => ({
        id: String(event.id),
        title: String(event.title || "WLC event"),
        date: typeof event.date === "string" ? event.date : "",
      })),
    });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not load member activity tools." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isMemberAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  try {
    const body = await request.json();
    const action = String(body?.action || "");
    const memberId = String(body?.memberId || "").trim().toUpperCase();
    if (!/^WLC-[A-Z0-9]+-\d{3,}$/.test(memberId)) return NextResponse.json({ message: "Choose a valid member." }, { status: 400 });

    const db = getAdminDb();
    const memberRef = db.collection("registered_members").doc(memberId);
    const memberSnap = await memberRef.get();
    if (!memberSnap.exists || memberSnap.data()?.status !== "ACTIVE") return NextResponse.json({ message: "Active member not found." }, { status: 404 });
    const memberName = String(memberSnap.data()?.name || "");

    if (action === "attendance") {
      const eventId = String(body?.eventId || "").trim();
      const status = String(body?.status || "").toUpperCase();
      if (!eventId || !["PRESENT", "ABSENT", "LATE", "EXCUSED"].includes(status)) {
        return NextResponse.json({ message: "Choose an event and a valid attendance status." }, { status: 400 });
      }
      const eventSnap = await db.collection("events").doc(eventId).get();
      if (!eventSnap.exists || eventSnap.data()?.status !== "PUBLISHED") return NextResponse.json({ message: "Published event not found." }, { status: 404 });
      const event = eventSnap.data()!;
      const records = await db.collection("member_attendance").where("memberId", "==", memberId).get();
      const existing = records.docs.find((doc) => String(doc.data().eventId || "") === eventId);
      const now = Date.now();
      const record = {
        memberId,
        memberName,
        eventId,
        eventTitle: String(event.title || "WLC event"),
        eventDate: typeof event.date === "string" ? event.date : "",
        status,
        checkedInAt: status === "PRESENT" || status === "LATE" ? now : null,
        updatedAt: now,
        updatedBy: "memberhub-admin",
      };
      if (existing) await existing.ref.set(record, { merge: true });
      else await db.collection("member_attendance").add({ ...record, createdAt: now });
      await db.collection("audit_logs").add({ action: existing ? "UPDATE_ATTENDANCE" : "CREATE_ATTENDANCE", collection: "member_attendance", recordId: existing?.id || memberId + ":" + eventId, actor: "memberhub-admin", createdAt: now });
      return NextResponse.json({ success: true, message: "Attendance saved for " + memberName + ".", record });
    }

    if (action === "certificate") {
      const title = String(body?.title || "").trim();
      const downloadUrl = String(body?.downloadUrl || "").trim();
      if (title.length < 2 || title.length > 120) return NextResponse.json({ message: "Certificate title must be 2–120 characters." }, { status: 400 });
      if (downloadUrl && !(downloadUrl.startsWith("/") || /^https?:\/\//i.test(downloadUrl))) return NextResponse.json({ message: "Certificate link must be an https/http URL or a site-relative path." }, { status: 400 });
      const now = Date.now();
      const certificateId = "WLC-CERT-" + now.toString(36).toUpperCase() + "-" + crypto.randomBytes(3).toString("hex").toUpperCase();
      const record = { memberId, memberName, title, certificateId, issuedAt: now, downloadUrl: downloadUrl || null, createdAt: now, createdBy: "memberhub-admin" };
      const ref = await db.collection("member_certificates").add(record);
      await db.collection("audit_logs").add({ action: "ISSUE_CERTIFICATE", collection: "member_certificates", recordId: ref.id, actor: "memberhub-admin", createdAt: now });
      return NextResponse.json({ success: true, message: "Certificate issued to " + memberName + ".", certificate: { id: ref.id, ...record } }, { status: 201 });
    }

    return NextResponse.json({ message: "Unknown activity action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to save activity." }, { status: 500 });
  }
}
