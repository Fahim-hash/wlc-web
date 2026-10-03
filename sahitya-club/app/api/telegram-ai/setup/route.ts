import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const urlKey = new URL(request.url).searchParams.get("key");
  const bearer = request.headers.get("authorization");
  return urlKey === expected || bearer === `Bearer ${expected}`;
}

async function telegramApi(token: string, method: string, payload: Record<string, unknown>) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`Telegram ${method} failed: ${result.description || response.status}`);
  }
  return result;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.TELEGRAMAI_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ ok: false, error: "TELEGRAMAI_BOT_TOKEN is required." }, { status: 503 });
  }

  const secret = process.env.TELEGRAMAI_WEBHOOK_SECRET?.trim()
    || crypto.createHash("sha256").update(token).digest("hex");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd";
  const webhookUrl = `${origin.replace(/\/$/, "")}/api/telegram-ai/webhook`;

  const webhook = await telegramApi(token, "setWebhook", {
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message"],
    max_connections: 10,
    drop_pending_updates: false,
  });

  const commands = await telegramApi(token, "setMyCommands", {
    commands: [
      { command: "start", description: "Start chatting with Kothasokhi" },
      { command: "help", description: "How to use Kothasokhi" },
    ],
  });

  await telegramApi(token, "setMyDescription", {
    description: "🌸 Kothasokhi AI — Willes Literary Club-এর AI সাহিত্যসঙ্গী। বাংলা, সাহিত্য, কবিতা, লেখালেখি ও WLC নিয়ে আড্ডা দাও। বাংলা ও Banglish দুটোই বুঝি!",
  });
  await telegramApi(token, "setMyShortDescription", {
    short_description: "📚 তোমার প্রিয় সাহিত্যসঙ্গী | WLC-এর AI assistant 💚",
  });

  const info = await telegramApi(token, "getWebhookInfo", {});
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
    profile: { description: true },
    note: "Uses TELEGRAMAI_BOT_TOKEN only; the existing WLC Control Hub bot is unchanged.",
  });
}
