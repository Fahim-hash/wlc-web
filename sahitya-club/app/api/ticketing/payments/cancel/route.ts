import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("bookingId") || "";
  const destination = new URL("/ticketing/payment", url.origin);
  destination.searchParams.set("state", "cancelled");
  if (!/^[a-f0-9-]{36}$/i.test(bookingId)) return NextResponse.redirect(destination);
  destination.searchParams.set("bookingId", bookingId);

  try {
    const db = getAdminDb();
    const bookingRef = db.collection("ticketing_bookings").doc(bookingId);
    await db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(bookingRef);
      if (!snapshot.exists) return;
      const booking = snapshot.data()!;
      if (booking.paymentStatus !== "PENDING" || booking.status !== "PENDING") return;
      const eventRef = db.collection("ticketing_events").doc(String(booking.eventId || ""));
      const eventSnapshot = await transaction.get(eventRef);
      transaction.update(bookingRef, { paymentStatus: "CANCELLED", status: "CANCELLED", cancelledAt: Date.now(), updatedAt: Date.now() });
      if (eventSnapshot.exists) {
        const current = Number(eventSnapshot.data()?.reservedCount || 0);
        transaction.update(eventRef, { reservedCount: Math.max(0, current - Number(booking.quantity || 1)), updatedAt: Date.now() });
      }
    });
  } catch (error) {
    console.error("[ticketing:payment-cancel]", error);
    destination.searchParams.set("state", "verify");
  }
  return NextResponse.redirect(destination);
}
