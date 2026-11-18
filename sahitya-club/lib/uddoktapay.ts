type UddoktaPayPayload = Record<string, unknown>;

function getConfig() {
  const apiKey = process.env.UDDOKTAPAY_API_KEY?.trim();
  const configuredBase = process.env.UDDOKTAPAY_BASE_URL?.trim();
  if (!apiKey || !configuredBase) {
    throw new Error("UddoktaPay is not configured. Set UDDOKTAPAY_API_KEY and UDDOKTAPAY_BASE_URL.");
  }
  const parsed = new URL(configuredBase);
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
    throw new Error("UDDOKTAPAY_BASE_URL must use HTTPS.");
  }
  const base = configuredBase.replace(/\/+$/, "");
  // Accept the exact endpoint copied from UddoktaPay's API Settings.
  // Paymently-hosted brands expose /api/checkout (not the legacy /api/checkout-v2).
  const isCheckoutEndpoint = /\/api\/(?:checkout|checkout-v2)$/i.test(base);
  const root = base.replace(/\/api\/(?:checkout|checkout-v2)$/i, "").replace(/\/api$/i, "");
  return {
    apiKey,
    checkoutUrl: isCheckoutEndpoint ? base : `${root}/api/checkout`,
    verifyUrl: `${root}/api/verify-payment`,
  };
}

async function request<T extends UddoktaPayPayload>(url: string, body: Record<string, unknown>): Promise<T> {
  const { apiKey } = getConfig();
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "RT-UDDOKTAPAY-API-KEY": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({})) as T;
  if (!response.ok) {
    const message = typeof data.message === "string" ? data.message : `UddoktaPay request failed (HTTP ${response.status}).`;
    throw new Error(message);
  }
  if (data.status === "ERROR" || data.success === false) {
    throw new Error(typeof data.message === "string" ? data.message : "UddoktaPay rejected the payment request.");
  }
  return data;
}

export async function createUddoktaPayCheckout(input: {
  bookingId: string;
  fullName: string;
  email: string;
  amount: number;
  eventTitle: string;
}) {
  const config = getConfig();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd").replace(/\/$/, "");
  const response = await request<UddoktaPayPayload>(config.checkoutUrl, {
    full_name: input.fullName,
    email: input.email,
    amount: input.amount.toFixed(2),
    metadata: {
      booking_id: input.bookingId,
      event_title: input.eventTitle,
      source: "wlc-ticketing",
    },
    redirect_url: `${siteUrl}/api/ticketing/payments/return?bookingId=${encodeURIComponent(input.bookingId)}`,
    return_type: "GET",
    cancel_url: `${siteUrl}/api/ticketing/payments/cancel?bookingId=${encodeURIComponent(input.bookingId)}`,
    webhook_url: `${siteUrl}/api/ticketing/payments/webhook`,
  });

  const nested = response.data && typeof response.data === "object" ? response.data as Record<string, unknown> : {};
  const paymentUrl = [
    response.payment_url, response.paymentUrl, response.checkout_url, response.url,
    nested.payment_url, nested.paymentUrl, nested.checkout_url, nested.url,
  ].find((value): value is string => typeof value === "string" && value.length > 0);
  const invoiceId = [
    response.invoice_id, response.invoiceId, nested.invoice_id, nested.invoiceId,
  ].find((value): value is string => typeof value === "string" && value.length > 0);

  if (!paymentUrl || !invoiceId) {
    throw new Error("UddoktaPay did not return the expected payment URL and invoice ID. Check the API endpoint configured in your dashboard.");
  }
  const parsedPaymentUrl = new URL(paymentUrl);
  if (parsedPaymentUrl.protocol !== "https:") {
    throw new Error("UddoktaPay returned an invalid checkout URL.");
  }
  return { paymentUrl: parsedPaymentUrl.toString(), invoiceId };
}

export async function verifyUddoktaPayPayment(invoiceId: string) {
  const config = getConfig();
  return request<UddoktaPayPayload>(config.verifyUrl, { invoice_id: invoiceId });
}

export function isValidUddoktaPayWebhookKey(value: string | null) {
  const { apiKey } = getConfig();
  return Boolean(value && value.length === apiKey.length && value === apiKey);
}
