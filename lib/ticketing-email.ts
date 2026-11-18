type TicketEmailInput = {
  email: string;
  attendeeName: string;
  eventTitle: string;
  bookingId: string;
  ticketId: string;
  pdf: Buffer;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function sendTicketEmail(input: TicketEmailInput) {
  const name = escapeHtml(input.attendeeName);
  const title = escapeHtml(input.eventTitle);
  const bookingId = escapeHtml(input.bookingId);
  const ticketId = escapeHtml(input.ticketId);
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd").replace(/\/$/, "");
  const text = `Your WLC event ticket is confirmed.\n\nEvent: ${input.eventTitle}\nAttendee: ${input.attendeeName}\nTicket ID: ${input.ticketId}\nBooking reference: ${input.bookingId}\n\nYour PDF ticket is attached. Keep it private and present its QR code at the event desk.\n\nWilles Literary Club — ${baseUrl}`;
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#fafafa;padding:28px 12px;font-family:Arial,sans-serif;color:#1c1917"><main style="max-width:600px;margin:auto;background:#fff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden"><header style="background:#9f1239;color:#fff;padding:28px"><p style="margin:0;font-size:11px;letter-spacing:2px;font-weight:bold">WILLES LITERARY CLUB</p><h1 style="margin:16px 0 0;font-size:26px">Your ticket is confirmed</h1></header><section style="padding:28px"><p>Dear ${name},</p><p style="line-height:1.7;color:#52525b">Your booking is confirmed. Your event ticket is attached to this email as a PDF.</p><div style="background:#fdf2f5;border:1px solid #f9a8d4;border-radius:12px;padding:18px"><p style="margin:0 0 8px;font-size:12px;color:#6b7280">EVENT</p><strong>${title}</strong><p style="margin:14px 0 4px;font-size:12px;color:#6b7280">TICKET ID</p><strong style="color:#9f1239">${ticketId}</strong><p style="margin:14px 0 4px;font-size:12px;color:#6b7280">BOOKING REFERENCE</p><span style="font-family:monospace;font-size:12px;overflow-wrap:anywhere">${bookingId}</span></div><p style="line-height:1.7;color:#52525b">Download and keep the attached PDF safe. Present its QR code at the event desk for entry verification.</p><p style="margin-top:28px">With regards,<br><strong style="color:#9f1239">Willes Literary Club</strong></p></section><footer style="background:#1c1917;color:#d6d3d1;text-align:center;padding:18px;font-size:12px">Willes Literary Club · <a href="${baseUrl}" style="color:#f9a8d4">wlc.pro.bd</a></footer></main></body></html>`;
  const attachment = { filename: `WLC-Ticket-${input.ticketId}.pdf`, content: input.pdf.toString("base64") };
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const resendFromName = process.env.RESEND_FROM_NAME?.trim() || "Willes Literary Club";
  const mailerSendToken = process.env.MAILERSEND_API_TOKEN?.trim();
  const mailerSendFromEmail = process.env.MAILERSEND_FROM_EMAIL?.trim();
  const mailerSendFromName = process.env.MAILERSEND_FROM_NAME?.trim() || "Willes Literary Club";
  const providers: Array<{ name: string; send: () => Promise<string> }> = [];

  if (resendKey && resendFromEmail) providers.push({
    name: "Resend",
    send: async () => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: `${resendFromName} <${resendFromEmail}>`,
          to: [input.email],
          subject: `WLC Ticket Confirmed — ${input.eventTitle}`,
          text, html,
          attachments: [{ filename: attachment.filename, content: attachment.content }],
        }),
        cache: "no-store",
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body?.message === "string" ? body.message : `HTTP ${response.status}`);
      return typeof body?.id === "string" ? body.id : "";
    },
  });

  if (mailerSendToken && mailerSendFromEmail) providers.push({
    name: "MailerSend",
    send: async () => {
      const response = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: { Authorization: `Bearer ${mailerSendToken}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          from: { email: mailerSendFromEmail, name: mailerSendFromName },
          to: [{ email: input.email, name: input.attendeeName }],
          subject: `WLC Ticket Confirmed — ${input.eventTitle}`,
          text, html,
          attachments: [{ filename: attachment.filename, content: attachment.content, disposition: "attachment" }],
        }),
        cache: "no-store",
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof body?.message === "string" ? body.message : typeof body?.errors?.[0]?.message === "string" ? body.errors[0].message : `HTTP ${response.status}`);
      return response.headers.get("x-message-id") || (typeof body?.message_id === "string" ? body.message_id : "");
    },
  });

  if (!providers.length) throw new Error("Email service is not configured. Set RESEND_API_KEY + RESEND_FROM_EMAIL and/or MAILERSEND_API_TOKEN + MAILERSEND_FROM_EMAIL in Vercel.");
  const errors: string[] = [];
  for (const provider of providers) {
    try { return { provider: provider.name, messageId: await provider.send() }; }
    catch (error) { errors.push(`${provider.name}: ${error instanceof Error ? error.message : "delivery failed"}`); }
  }
  throw new Error(`Ticket email delivery failed. ${errors.join(" | ")}`);
}
