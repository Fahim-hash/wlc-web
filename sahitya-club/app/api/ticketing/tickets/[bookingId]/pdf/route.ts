import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { hashTicketToken } from "@/lib/ticketing";
import { createTicketPdf } from "@/lib/ticketing-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request, context: { params: Promise<{ bookingId: string }> }) {
  try {
    const { bookingId } = await context.params;
    const token = new URL(request.url).searchParams.get("token") || "";
    if (!/^[a-f0-9-]{36}$/i.test(bookingId) || token.length < 32 || token.length > 128) {
      return NextResponse.json({ message: "Ticket not found." }, { status: 404 });
    }

    const db = getAdminDb();
    const snapshot = await db.collection("ticketing_bookings").doc(bookingId).get();
    if (!snapshot.exists) return NextResponse.json({ message: "Ticket not found." }, { status: 404 });
    const booking = snapshot.data()!;
    const storedHash = typeof booking.ticketTokenHash === "string" ? booking.ticketTokenHash : "";
    const suppliedHash = hashTicketToken(token);
    const stored = Buffer.from(storedHash, "hex");
    const supplied = Buffer.from(suppliedHash, "hex");
    if (stored.length !== supplied.length || !timingSafeEqual(stored, supplied) || booking.status !== "CONFIRMED") {
      return NextResponse.json({ message: "Ticket not found or no longer valid." }, { status: 404 });
    }

    const eventSnapshot = booking.eventId ? await db.collection("ticketing_events").doc(String(booking.eventId)).get() : null;
    const event = eventSnapshot?.exists ? eventSnapshot.data()! : {};
    const pdf = await createTicketPdf({
      eventTitle: String(booking.eventTitle || event.title || "WLC Event"),
      eventStartAt: String(booking.eventStartAt || event.startAt || ""),
      venue: String(booking.venue || event.venue || ""),
      eventSummary: String(booking.eventSummary || event.summary || ""),
      eventDescription: String(booking.eventDescription || event.description || ""),
      bannerUrl: String(booking.bannerUrl || event.bannerUrl || ""),
      ticketPrice: Number(booking.ticketPrice ?? event.ticketPrice ?? 0),
      currency: String(booking.currency || "BDT"),
      attendeeName: String(booking.attendeeName || ""),
      attendeeEmail: String(booking.attendeeEmail || ""),
      attendeePhone: String(booking.attendeePhone || ""),
      quantity: Number(booking.quantity || 1),
      ticketId: String(booking.ticketId || ""),
      bookingId,
    });
    const filename = `WLC-Ticket-${String(booking.ticketId || bookingId).replace(/[^a-zA-Z0-9_-]/g, "")}.pdf`;
    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[ticketing:pdf-download]", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to generate your ticket PDF." }, { status: 500 });
  }
}
