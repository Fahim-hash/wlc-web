import { NextResponse } from "next/server";
import { finalizeUddoktaPayPayment } from "@/lib/ticketing-payment-finalize";
import { isValidUddoktaPayWebhookKey } from "@/lib/uddoktapay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    if (!isValidUddoktaPayWebhookKey(request.headers.get("rt-uddoktapay-api-key"))) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const body = await request.json().catch(() => null);
    const invoiceId = typeof body?.invoice_id === "string"
      ? body.invoice_id
      : typeof body?.invoiceId === "string" ? body.invoiceId : "";
    if (!invoiceId) return NextResponse.json({ success: false, message: "Missing invoice ID." }, { status: 400 });
    const result = await finalizeUddoktaPayPayment(invoiceId);
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error("[ticketing:payment-webhook]", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unable to process payment notification.",
    }, { status: 400 });
  }
}
