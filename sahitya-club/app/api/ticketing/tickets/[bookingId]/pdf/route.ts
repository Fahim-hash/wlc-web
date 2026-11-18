import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { hashTicketToken } from "@/lib/ticketing";
import { createTicketPdf } from "@/lib/ticketing-pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ bookingId: string }> }) {
  try {
    const { bookingId } = await context.params;
    const token = new URL(request.url).searchParams.get("token") || "";
    if (!/^[a-f0-9-]{36}$/i.test(bookingId) || token.length < 32 || token.length > 128) {
      return NextResponse.json({ message: "Ticket not found." }, { status: 404 });
    }

    const snapshot = await getAdminDb().collection("ticketing_bookings").doc(bookingId).get();
    if (!snapshot.exists) return NextResponse.json({ message: "Ticket not found." }, { status: 404 });
    const booking = snapshot.data()!;
    const storedHash = typeof booking.ticketTokenHash === "string" ? booking.ticketTokenHash : "";
    const suppliedHash = hashTicketToken(token);
    const stored = Buffer.from(storedHash, "hex");
    const supplied = Buffer.from(suppliedHash, "hex");
    if (stored.length !== supplied.length || !timingSafeEqual(stored, supplied) || booking.status !== "CONFIRMED") {
      return NextResponse.json({ message: "Ticket not found or no longer valid." }, { status: 404 });
    }

    const pdf = await createTicketPdf({
      eventTitle: String(booking.eventTitle || "WLC Event"),
      eventStartAt: String(booking.eventStartAt || ""),
      venue: String(booking.venue || ""),
      eventSummary: String(booking.eventSummary || ""),
      eventDescription: String(booking.eventDescription || ""),
      bannerUrl: String(booking.bannerUrl || ""),
      ticketPrice: Number(booking.ticketPrice || 0),
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
  } catch {
    return NextResponse.json({ message: "Unable to generate your ticket PDF." }, { status: 500 });
  }
}
