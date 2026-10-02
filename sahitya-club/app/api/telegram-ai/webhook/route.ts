import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramMessage = {
  message_id: number;
  text?: string;
  from?: { id: number; is_bot?: boolean };
  chat?: { id: number; type?: string };
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
};

type ChatMessage = { role: "user" | "assistant"; content: string };

function expectedSecret() {
  const configured = process.env.TELEGRAMAI_WEBHOOK_SECRET?.trim();
  if (configured) return configured;
  const token = process.env.TELEGRAMAI_BOT_TOKEN;
  return token ? crypto.createHash("sha256").update(token).digest("hex") : "";
}

async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAMAI_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAMAI_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(`Telegram ${method} failed`);
  return result;
}

async function sendReply(chatId: number, reply: string) {
  // The web chatbot's optional button syntax is converted to a Telegram inline button.
  const buttonMatch = reply.match(/\[BUTTON:([^|\]]+)\|(https?:\/\/[^\]]+)\]/);
  const text = reply.replace(/\n?\[BUTTON:[^|\]]+\|https?:\/\/[^\]]+\]/g, "").trim();
  const keyboard = buttonMatch
    ? { inline_keyboard: [[{ text: buttonMatch[1].slice(0, 64), url: buttonMatch[2] }]] }
    : undefined;

  const chunks = text.match(/[\s\S]{1,4000}/g) || ["দুঃখিত, এই মুহূর্তে কোনো উত্তর পাওয়া যায়নি।"];
  for (let index = 0; index < chunks.length; index++) {
    await telegramApi("sendMessage", {
      chat_id: chatId,
      text: chunks[index],
      disable_web_page_preview: true,
      ...(index === chunks.length - 1 && keyboard ? { reply_markup: keyboard } : {}),
    });
  }
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAMAI_BOT_TOKEN;
  if (!token) return NextResponse.json({ ok: false }, { status: 503 });

  const suppliedSecret = request.headers.get("x-telegram-bot-api-secret-token") || "";
  const secret = expectedSecret();
  if (!secret || suppliedSecret !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    const message = update.message;
    const text = message?.text?.trim();
    const chatId = message?.chat?.id;
    const userId = message?.from?.id;

    if (!message || !text || !chatId || !userId || message.from?.is_bot) {
      return NextResponse.json({ ok: true });
    }

    const db = getAdminDb();
    const updateRef = db.collection("telegram_ai_updates").doc(String(update.update_id));
    const updateSnap = await updateRef.get();
    if (updateSnap.exists) return NextResponse.json({ ok: true });

    if (text === "/start" || text === "/help") {
      await telegramApi("sendMessage", {
        chat_id: chatId,
        text: "🌸 স্বাগতম Kothasokhi AI-তে!\n\nআমি Willes Literary Club-এর AI সাহিত্যসঙ্গী। বাংলা, Banglish বা English-এ WLC, সাহিত্য, কবিতা ও লেখালেখি নিয়ে প্রশ্ন করতে পারো।\n\nআড্ডা শুরু করতে তোমার প্রশ্নটি লিখে পাঠাও।",
        disable_web_page_preview: true,
      });
      await updateRef.set({ processedAt: Date.now(), chatId: String(chatId), command: text });
      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/")) {
      await telegramApi("sendMessage", {
        chat_id: chatId,
        text: "এই command-টি চিনি না। Kothasokhi-র সঙ্গে কথা বলতে সরাসরি প্রশ্ন লিখে পাঠাও। /help",
      });
      await updateRef.set({ processedAt: Date.now(), chatId: String(chatId), command: text });
      return NextResponse.json({ ok: true });
    }

    const conversationRef = db.collection("telegram_ai_conversations").doc(String(chatId));
    const conversationSnap = await conversationRef.get();
    const previous = (conversationSnap.data()?.messages || []) as ChatMessage[];
    const messages: ChatMessage[] = [
      ...previous.slice(-7),
      { role: "user", content: text },
    ];

    const origin = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
    const chatResponse = await fetch(`${origin}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      cache: "no-store",
    });
    const data = await chatResponse.json();
    if (!chatResponse.ok || typeof data.reply !== "string") {
      throw new Error("Kothasokhi chat API returned an error");
    }

    await sendReply(chatId, data.reply);
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "assistant", content: data.reply },
    ].slice(-8);

    await conversationRef.set({
      chatId: String(chatId),
      userId: String(userId),
      messages: nextMessages,
      updatedAt: Date.now(),
    });
    await updateRef.set({ processedAt: Date.now(), chatId: String(chatId) });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Kothasokhi Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
