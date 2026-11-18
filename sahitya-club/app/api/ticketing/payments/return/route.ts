import { NextResponse } from "next/server";
import { finalizeUddoktaPayPayment } from "@/lib/ticketing-payment-finalize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get("bookingId") || "";
  const invoiceId = url.searchParams.get("invoice_id") || url.searchParams.get("invoiceId") || "";
  const destination = new URL("/ticketing/payment", url.origin);
  if (!/^[a-f0-9-]{36}$/i.test(bookingId)) {
    destination.searchParams.set("state", "invalid");
    return NextResponse.redirect(destination);
  }
  destination.searchParams.set("bookingId", bookingId);
  if (!invoiceId) {
    destination.searchParams.set("state", "pending");
    return NextResponse.redirect(destination);
  }
  try {
    const result = await finalizeUddoktaPayPayment(invoiceId, bookingId);
    destination.searchParams.set("state", result.completed ? "paid" : "pending");
  } catch (error) {
    console.error("[ticketing:payment-return]", error);
    destination.searchParams.set("state", "verify");
  }
  return NextResponse.redirect(destination);
}
