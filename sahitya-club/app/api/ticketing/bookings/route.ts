import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";
import { getAdminDb } from "@/lib/firebase-admin";
import { createTicketId, createTicketToken, hashTicketToken } from "@/lib/ticketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const limit = await enforceRateLimit({
    request,
    namespace: "ticketing-booking",
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);

  try {
    const body = await request.json();
    const eventSlug = typeof body?.eventSlug === "string" ? body.eventSlug.trim() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
    const quantity = Number(body?.quantity);

    if (!/^[a-z0-9-]{2,64}$/.test(eventSlug)) {
      return NextResponse.json({ message: "Invalid event." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 120) {
      return NextResponse.json({ message: "Name must be between 2 and 120 characters." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone.replace(/\D/g, "").length < 10 || phone.length > 30) {
      return NextResponse.json({ message: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 5) {
      return NextResponse.json({ message: "You can reserve 1–5 tickets per booking." }, { status: 400 });
    }

    const db = getAdminDb();
    const eventRef = db.collection("ticketing_events").doc(eventSlug);
    const bookingId = randomUUID();
    const bookingRef = db.collection("ticketing_bookings").doc(bookingId);
    const ticketToken = createTicketToken();
    const ticketId = createTicketId();
    const now = Date.now();

    const result = await db.runTransaction(async (transaction) => {
      const eventSnapshot = await transaction.get(eventRef);
      if (!eventSnapshot.exists) throw new Error("This event could not be found.");

      const event = eventSnapshot.data()!;
      if (event.status !== "PUBLISHED") throw new Error("Ticket booking is not open for this event.");
      if (Number(event.ticketPrice || 0) > 0) throw new Error("Online payment is not connected yet. Paid ticket booking will open after the payment provider is configured.");
      if (Date.parse(String(event.startAt)) <= now) throw new Error("Ticket booking for this event has closed.");

      const capacity = Number(event.capacity || 0);
      const reservedCount = Number(event.reservedCount || 0);
      if (reservedCount + quantity > capacity) throw new Error("Not enough tickets are available for this quantity.");

      transaction.create(bookingRef, {
        bookingId,
        ticketId,
        eventId: eventSlug,
        eventTitle: String(event.title || ""),
        eventStartAt: String(event.startAt || ""),
        venue: String(event.venue || ""),
        attendeeName: name,
        attendeeEmail: email,
        attendeePhone: phone,
        quantity,
        unitPrice: 0,
        totalAmount: 0,
        currency: "BDT",
        paymentStatus: "NOT_REQUIRED",
        status: "CONFIRMED",
        ticketTokenHash: hashTicketToken(ticketToken),
        checkedInCount: 0,
        createdAt: now,
        updatedAt: now,
      });
      transaction.update(eventRef, { reservedCount: reservedCount + quantity, updatedAt: now });

      return { title: String(event.title || ""), startAt: String(event.startAt || ""), venue: String(event.venue || "") };
    });

    return NextResponse.json({
      success: true,
      booking: {
        bookingId,
        ticketId,
        eventTitle: result.title,
        eventStartAt: result.startAt,
        venue: result.venue,
        attendeeName: name,
        quantity,
        status: "CONFIRMED",
        ticketToken,
      },
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reserve tickets.";
    const conflictMessages = [
      "This event could not be found.",
      "Ticket booking is not open for this event.",
      "Online payment is not connected yet. Paid ticket booking will open after the payment provider is configured.",
      "Ticket booking for this event has closed.",
      "Not enough tickets are available for this quantity.",
    ];
    const status = error instanceof SyntaxError ? 400 : conflictMessages.includes(message) ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
