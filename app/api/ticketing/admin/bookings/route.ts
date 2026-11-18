import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated } from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventSlug = searchParams.get("eventSlug")?.trim() || "";
    const snapshot = await getAdminDb()
      .collection("ticketing_bookings")
      .orderBy("createdAt", "desc")
      .limit(500)
      .get();

    const bookings = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          bookingId: data.bookingId || doc.id,
          ticketId: data.ticketId || "",
          eventId: data.eventId || "",
          eventTitle: data.eventTitle || "",
          attendeeName: data.attendeeName || "",
          attendeeEmail: data.attendeeEmail || "",
          attendeePhone: data.attendeePhone || "",
          quantity: Number(data.quantity || 0),
          totalAmount: Number(data.totalAmount || 0),
          currency: data.currency || "BDT",
          paymentStatus: data.paymentStatus || "UNKNOWN",
          status: data.status || "UNKNOWN",
          checkedInCount: Number(data.checkedInCount || 0),
          createdAt: Number(data.createdAt || 0),
        };
      })
      .filter((booking) => !eventSlug || booking.eventId === eventSlug);

    if (searchParams.get("format") === "csv") {
      const header = [
        "Booking ID", "Ticket ID", "Event", "Attendee", "Email", "Phone",
        "Quantity", "Amount (BDT)", "Payment", "Booking Status", "Checked In", "Created At",
      ];
      const rows = bookings.map((booking) => [
        booking.bookingId, booking.ticketId, booking.eventTitle, booking.attendeeName,
        booking.attendeeEmail, booking.attendeePhone, booking.quantity, booking.totalAmount,
        booking.paymentStatus, booking.status, booking.checkedInCount,
        booking.createdAt ? new Date(booking.createdAt).toISOString() : "",
      ]);
      const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
      return new Response("\uFEFF" + csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="wlc-ticket-bookings${eventSlug ? "-" + eventSlug : ""}.csv"`,
          "Cache-Control": "private, no-store, max-age=0",
        },
      });
    }

    return NextResponse.json({ bookings }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ message: "Unable to load ticket bookings." }, { status: 500 });
  }
}
