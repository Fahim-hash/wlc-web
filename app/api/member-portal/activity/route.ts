import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { listPublished } from "@/lib/cms";
import { currentMember } from "@/lib/member-portal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? value : null;
}

export async function GET() {
  try {
    const member = await currentMember();
    if (!member) return NextResponse.json({ authenticated: false }, { status: 401 });

    const db = getAdminDb();
    const [events, announcements, attendanceSnap, certificatesSnap] = await Promise.all([
      listPublished("events", 30),
      listPublished("announcements", 30),
      db.collection("member_attendance").where("memberId", "==", member.memberId).limit(100).get(),
      db.collection("member_certificates").where("memberId", "==", member.memberId).limit(100).get(),
    ]);

    const cleanEvent = (record: Record<string, unknown>) => ({
      id: safeText(record.id),
      title: safeText(record.title),
      date: safeText(record.date),
      time: safeText(record.time),
      venue: safeText(record.venue),
      description: safeText(record.description),
      link: safeText(record.link),
    });
    const cleanAnnouncement = (record: Record<string, unknown>) => ({
      id: safeText(record.id),
      title: safeText(record.title),
      date: safeText(record.date || record.publishedAt),
      summary: safeText(record.summary || record.description || record.content),
      link: safeText(record.link),
    });
    const attendance = attendanceSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        eventId: safeText(data.eventId),
        eventTitle: safeText(data.eventTitle || data.title),
        eventDate: safeText(data.eventDate || data.date),
        status: safeText(data.status),
        checkedInAt: safeText(data.checkedInAt),
      };
    }).sort((a, b) => String(b.eventDate || "").localeCompare(String(a.eventDate || "")));
    const certificates = certificatesSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: safeText(data.title || data.name),
        certificateId: safeText(data.certificateId),
        issuedAt: safeText(data.issuedAt),
        downloadUrl: safeText(data.downloadUrl || data.fileUrl),
      };
    }).sort((a, b) => String(b.issuedAt || "").localeCompare(String(a.issuedAt || "")));

    return NextResponse.json({
      authenticated: true,
      events: events.map((item) => cleanEvent(item as Record<string, unknown>)),
      announcements: announcements.map((item) => cleanAnnouncement(item as Record<string, unknown>)),
      attendance,
      certificates,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to load member activity." },
      { status: 500 },
    );
  }
}
