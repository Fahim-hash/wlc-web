import { getAdminDb } from "@/lib/firebase-admin";
import { createTicketPdf } from "@/lib/ticketing-pdf";
import { sendTicketEmail } from "@/lib/ticketing-email";
import { verifyUddoktaPayPayment } from "@/lib/uddoktapay";

function money(value: unknown) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toFixed(2) : "";
}

export async function finalizeUddoktaPayPayment(invoiceId: string, expectedBookingId?: string) {
  if (!invoiceId || invoiceId.length > 160) throw new Error("Invalid payment invoice.");
  const db = getAdminDb();
  let bookingRef = expectedBookingId
    ? db.collection("ticketing_bookings").doc(expectedBookingId)
    : null;

  if (!bookingRef) {
    const matches = await db.collection("ticketing_bookings").where("paymentInvoiceId", "==", invoiceId).limit(1).get();
    if (matches.empty) throw new Error("No WLC booking matches this payment invoice.");
    bookingRef = matches.docs[0].ref;
  }

  const before = await bookingRef.get();
  if (!before.exists) throw new Error("WLC booking not found.");
  const bookingBefore = before.data()!;
  if (bookingBefore.paymentInvoiceId !== invoiceId) {
    throw new Error("Payment invoice does not match this booking.");
  }

  const payment = await verifyUddoktaPayPayment(invoiceId);
  const returnedInvoice = typeof payment.invoice_id === "string" ? payment.invoice_id : invoiceId;
  if (returnedInvoice !== invoiceId) throw new Error("UddoktaPay returned a mismatched invoice.");
  if (String(payment.status || "").toUpperCase() !== "COMPLETED") {
    return { completed: false, bookingId: bookingRef.id, paymentStatus: String(payment.status || "PENDING").toUpperCase() };
  }

  const metadata = payment.metadata && typeof payment.metadata === "object"
    ? payment.metadata as Record<string, unknown>
    : {};
  if (metadata.booking_id && String(metadata.booking_id) !== bookingRef.id) {
    throw new Error("Payment metadata does not match the WLC booking.");
  }
  if (money(payment.amount) !== money(bookingBefore.totalAmount)) {
    throw new Error("The verified payment amount does not match the WLC booking total.");
  }

  const now = Date.now();
  const transition = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(bookingRef!);
    if (!snapshot.exists) throw new Error("WLC booking not found.");
    const booking = snapshot.data()!;
    if (booking.paymentInvoiceId !== invoiceId) throw new Error("Payment invoice does not match this booking.");
    if (booking.status === "CANCELLED") throw new Error("This booking was cancelled and cannot be confirmed.");
    if (booking.paymentStatus === "PAID" && booking.status === "CONFIRMED") {
      const emailStatus = String(booking.ticketEmailStatus || "");
      if (emailStatus === "SENT" || emailStatus === "PROCESSING") {
        return { shouldSendEmail: false, booking };
      }
      transaction.update(bookingRef!, { ticketEmailStatus: "PROCESSING", updatedAt: now });
      return { shouldSendEmail: true, booking };
    }
    if (booking.paymentStatus !== "PENDING") throw new Error("This booking is not awaiting payment.");
    transaction.update(bookingRef!, {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      paymentTransactionId: typeof payment.transaction_id === "string" ? payment.transaction_id : null,
      paymentMethod: typeof payment.payment_method === "string" ? payment.payment_method : null,
      paymentSenderNumber: typeof payment.sender_number === "string" ? payment.sender_number : null,
      paidAt: now,
      ticketEmailStatus: "PROCESSING",
      updatedAt: now,
    });
    return { shouldSendEmail: true, booking: { ...booking, paymentStatus: "PAID", status: "CONFIRMED" } };
  });

  if (!transition.shouldSendEmail) {
    return { completed: true, bookingId: bookingRef.id, emailSent: transition.booking.ticketEmailStatus === "SENT" };
  }

  const booking = transition.booking;
  try {
    const pdf = await createTicketPdf({
      eventTitle: String(booking.eventTitle || "WLC Event"),
      eventStartAt: String(booking.eventStartAt || ""),
      venue: String(booking.venue || ""),
      eventSummary: String(booking.eventSummary || ""),
      eventDescription: String(booking.eventDescription || ""),
      bannerUrl: typeof booking.bannerUrl === "string" ? booking.bannerUrl : undefined,
      ticketPrice: Number(booking.ticketPrice || 0),
      currency: String(booking.currency || "BDT"),
      attendeeName: String(booking.attendeeName || ""),
      attendeeEmail: String(booking.attendeeEmail || ""),
      attendeePhone: String(booking.attendeePhone || ""),
      quantity: Number(booking.quantity || 1),
      ticketId: String(booking.ticketId || ""),
      bookingId: bookingRef.id,
    });
    const delivery = await sendTicketEmail({
      email: String(booking.attendeeEmail || ""),
      attendeeName: String(booking.attendeeName || ""),
      eventTitle: String(booking.eventTitle || "WLC Event"),
      bookingId: bookingRef.id,
      ticketId: String(booking.ticketId || ""),
      pdf,
    });
    await bookingRef.update({
      ticketEmailStatus: "SENT",
      ticketEmailSentAt: Date.now(),
      ticketEmailMessageId: delivery.messageId || null,
      ticketEmailError: null,
      updatedAt: Date.now(),
    });
    return { completed: true, bookingId: bookingRef.id, emailSent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ticket email delivery failed.";
    await bookingRef.update({ ticketEmailStatus: "FAILED", ticketEmailError: message, updatedAt: Date.now() });
    return { completed: true, bookingId: bookingRef.id, emailSent: false, emailError: message };
  }
}
