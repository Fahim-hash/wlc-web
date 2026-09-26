import { NextResponse } from "next/server";

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

  return response.json();
}

function authorized(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const urlKey = new URL(request.url).searchParams.get("key");
  const bearer = request.headers.get("authorization");

  return urlKey === expected || bearer === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd";

  if (!token || !secret) {
    return NextResponse.json(
      {
        ok: false,
        error: "TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET are required.",
      },
      { status: 503 }
    );
  }

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
  });

  const webhook = await telegramRequest(token, "setWebhook", webhookBody);
  const info = await telegramRequest(token, "getWebhookInfo", new URLSearchParams());

  const commands = await telegramRequest(token, "setMyCommands", {
    commands: [
      { command: "start", description: "Open WLC Control Hub" },
      { command: "album", description: "Open Album Control Hub" },
      { command: "notify", description: "Send a global push notification" },
      { command: "cancel", description: "Cancel the current action" },
    ],
  });

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
