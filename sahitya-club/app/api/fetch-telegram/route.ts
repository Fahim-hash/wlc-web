// app/api/fetch-telegram/route.ts
import { NextResponse } from "next/server";
import { collection, getDocs, orderBy, query } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

type TelegramMedia = {
  messageId: number;
  fileId: string;
  fileName?: string;
  mimeType?: string;
  caption?: string;
  createdAt?: number;
};

async function ensureTelegramWebhook(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd";
  const webhookUrl = `${origin}/api/webhook/telegram`;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Telegram webhook setup skipped: TELEGRAM_WEBHOOK_SECRET is not configured.");
    return;
  }

  const body = new URLSearchParams({ url: webhookUrl });
  body.set("secret_token", secret);
  body.set(
    "allowed_updates",
    JSON.stringify(["message", "callback_query", "channel_post", "edited_channel_post"])
  );
  body.set("max_connections", "10");

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/setWebhook`,
    {
      method: "POST",
      body,
      cache: "no-store",
    }
  );

  const result = await response.json();
  if (!result.ok) {
    console.error("Telegram webhook setup failed:", result);
    return;
  }

  const commandsResponse = await fetch(
    `https://api.telegram.org/bot${botToken}/setMyCommands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "start", description: "Open WLC Control Hub" },
          { command: "control", description: "Open WLC Control Hub" },
          { command: "notify", description: "Send a global push notification" },
          { command: "cancel", description: "Cancel the current action" }
        ]
      }),
      cache: "no-store"
    }
  );

  const commandsResult = await commandsResponse.json();
  if (!commandsResult.ok) {
    console.error("Telegram command setup failed:", commandsResult);
  }
}

export async function GET(request: Request) {
  try {
    // Automatically register/repair the webhook using the existing bot token.
    // This makes the album self-healing if the Telegram webhook was missing
    // or pointing at an old deployment.
    await ensureTelegramWebhook(request);

    const mediaQuery = query(
      collection(db, "telegram_media"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(mediaQuery);

    const images = snapshot.docs
      .map((doc) => {
        const data = doc.data() as TelegramMedia;
        if (!data.fileId || !data.messageId) return null;

        return {
          id: doc.id,
          messageId: data.messageId,
          fileId: data.fileId,
          fileName: data.fileName ?? "telegram-image",
          caption: data.caption ?? "",
          url: `/api/telegram-image?fileId=${encodeURIComponent(data.fileId)}`,
          createdAt: data.createdAt ?? 0,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { success: true, images },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Fetch Telegram media error:", error);
    return NextResponse.json(
      { error: "টেলিগ্রাম অ্যালবাম লোড করতে ব্যর্থ।" },
      { status: 500 }
    );
  }
}
