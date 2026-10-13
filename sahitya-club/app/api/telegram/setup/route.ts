import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function telegramRequest(
  token: string,
  method: string,
  body: URLSearchParams | Record<string, unknown>
) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers:
      body instanceof URLSearchParams
        ? undefined
        : { "Content-Type": "application/json" },
    body: body instanceof URLSearchParams ? body : JSON.stringify(body),
    cache: "no-store",
  });

  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`Telegram ${method} failed: ${result.description || response.status}`);
  }
  return result;
}

function authorized(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const bearer = request.headers.get("authorization") || "";
  const match = bearer.match(/^Bearer\\s+(.+)$/i);
  const supplied = match?.[1]?.trim() || "";
  if (!supplied) return false;

  const cryptoExpected = Buffer.from(expected);
  const cryptoSupplied = Buffer.from(supplied);
  return cryptoExpected.length === cryptoSupplied.length &&
    crypto.timingSafeEqual(cryptoExpected, cryptoSupplied);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN is required." },
      { status: 503 }
    );
  }

  // Keep the webhook secret stable when explicitly configured. If it is not
  // configured, derive one from the current token so token rotation can be
  // repaired with this endpoint without requiring another environment value.
  const secret =
    process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ||
    crypto.createHash("sha256").update(token).digest("hex");
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd").replace(/\/$/, "");
  const webhookUrl = `${origin}/api/webhook/telegram`;
  const webhookBody = new URLSearchParams({
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: JSON.stringify([
      "message",
      "callback_query",
      "channel_post",
      "edited_channel_post",
    ]),
    max_connections: "10",
    drop_pending_updates: "false",
  });

  const webhook = await telegramRequest(token, "setWebhook", webhookBody);
  const commands = await telegramRequest(token, "setMyCommands", {
    commands: [
      { command: "start", description: "Open WLC Control Hub" },
      { command: "cms", description: "Open WLC Telegram CMS" },
      { command: "event", description: "Create an event" },
      { command: "member", description: "Create a member" },
      { command: "achievement", description: "Create an achievement" },
      { command: "announcement", description: "Create an announcement" },
      { command: "writing", description: "Create a writing record" },
      { command: "knowledge", description: "Add Kothasokhi knowledge" },
      { command: "cmslist", description: "List CMS records" },
      { command: "archive", description: "Archive a CMS record" },
      { command: "album", description: "Open Album Control Hub" },
      { command: "notify", description: "Send a global push notification" },
      { command: "cancel", description: "Cancel the current action" },
    ],
  });

  const info = await telegramRequest(token, "getWebhookInfo", new URLSearchParams());
  return NextResponse.json({
    ok: Boolean(webhook.ok && commands.ok),
    webhook: {
      ok: webhook.ok,
      url: info.result?.url || webhookUrl,
      pendingUpdateCount: info.result?.pending_update_count ?? 0,
      lastErrorDate: info.result?.last_error_date ?? null,
      lastErrorMessage: info.result?.last_error_message ?? null,
    },
    commands: { ok: commands.ok },
  });
}
