import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { hashTicketToken } from "@/lib/ticketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ bookingId: string }> }
) {
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

    return NextResponse.json({
      ticket: {
        bookingId: booking.bookingId,
        ticketId: booking.ticketId,
        eventTitle: booking.eventTitle,
        eventStartAt: booking.eventStartAt,
        venue: booking.venue,
        attendeeName: booking.attendeeName,
        quantity: booking.quantity,
        status: booking.status,
        checkedInCount: booking.checkedInCount || 0,
      },
    }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ message: "Unable to verify ticket." }, { status: 500 });
  }
}
