import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated } from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Admin authentication required." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const bookingId = typeof body?.bookingId === "string" ? body.bookingId.trim() : "";
    if (!/^[a-f0-9-]{36}$/i.test(bookingId)) {
      return NextResponse.json({ message: "Invalid ticket QR or booking reference." }, { status: 400 });
    }

    const db = getAdminDb();
    const bookingRef = db.collection("ticketing_bookings").doc(bookingId);
    const checkinRef = db.collection("ticketing_checkins").doc(randomUUID());
    const now = Date.now();

    const result = await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(bookingRef);
      if (!snapshot.exists) throw new Error("Ticket not found.");

      const booking = snapshot.data()!;
      if (booking.status !== "CONFIRMED") throw new Error("This booking is not valid for entry.");
      if (booking.paymentStatus !== "NOT_REQUIRED" && booking.paymentStatus !== "PAID") {
        throw new Error("Payment has not been confirmed for this ticket.");
      }

      const quantity = Math.max(1, Number(booking.quantity || 1));
      const checkedInCount = Math.max(0, Number(booking.checkedInCount || 0));
      if (checkedInCount >= quantity) throw new Error("All tickets in this booking have already been checked in.");

      const nextCount = checkedInCount + 1;
      transaction.update(bookingRef, { checkedInCount: nextCount, lastCheckedInAt: now, updatedAt: now });
      transaction.create(checkinRef, {
        bookingId,
        ticketId: booking.ticketId || "",
        eventId: booking.eventId || "",
        attendeeName: booking.attendeeName || "",
        checkedInAt: now,
        checkedInBy: "memberhub-admin",
        sequence: nextCount,
      });

      return {
        bookingId,
        ticketId: String(booking.ticketId || ""),
        eventTitle: String(booking.eventTitle || ""),
        attendeeName: String(booking.attendeeName || ""),
        quantity,
        checkedInCount: nextCount,
        remaining: Math.max(0, quantity - nextCount),
      };
    });

    return NextResponse.json({ success: true, checkin: result }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to check in this ticket.";
    const status = ["Ticket not found."].includes(message) ? 404 : 409;
    return NextResponse.json({ success: false, message }, { status });
  }
}
