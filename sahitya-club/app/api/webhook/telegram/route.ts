import { after, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { sendGlobalPushNotification, getPushSubscriberCount } from "@/lib/push";

type TelegramUser = { id: number };
type TelegramMessage = { message_id: number; text?: string; from?: TelegramUser; chat?: { id?: number | string } };
type TelegramCallbackQuery = { id: string; data?: string; from: TelegramUser; message?: { chat?: { id?: number | string }; text?: string } };
type TelegramPhoto = { file_id: string; file_unique_id?: string; width?: number; height?: number };
type TelegramPost = {
  message_id: number;
  date?: number;
  chat?: { id?: number | string; username?: string; title?: string };
  document?: { file_id: string; file_unique_id?: string; file_name?: string; mime_type?: string };
  photo?: TelegramPhoto[];
  caption?: string;
  media_group_id?: string;
};

type TelegramUpdate = {
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
  channel_post?: TelegramPost;
  edited_channel_post?: TelegramPost;
};

function getExpectedWebhookSecret() {
  const configured = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (configured) return configured;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return "";
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getWebhookSecret(request: Request) {
  return (
    request.headers.get("x-telegram-bot-api-secret-token") ||
    request.headers.get("x-telegram-webhook-secret")
  );
}

function isAdmin(userId: number) {
  const admins = (process.env.TELEGRAM_ADMIN_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return admins.includes(String(userId));
}

async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = await response.json();
  if (!result.ok) {
    throw new Error(`Telegram ${method} failed: ${JSON.stringify(result)}`);
  }
  return result;
}

async function sendText(chatId: number | string, text: string, keyboard?: unknown[][]) {
  return telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
  });
}

async function answerCallback(callbackId: string, text?: string) {
  try {
    return await telegramApi("answerCallbackQuery", {
      callback_query_id: callbackId,
      ...(text ? { text } : {}),
    });
  } catch (error) {
    console.warn("Telegram callback acknowledgement skipped:", error);
    return null;
  }
}

async function sendControlMenu(chatId: number | string) {
  return sendText(
    chatId,
    "WLC Control Hub\n\nGlobal browser push notifications এবং ভবিষ্যৎ website controls এখান থেকেই পরিচালনা করা যাবে।",
    [
      [
        { text: "📢 Send Push", callback_data: "wlc:push" },
        { text: "🧪 Test Push", callback_data: "wlc:test" },
      ],
      [
        { text: "📊 Subscribers", callback_data: "wlc:stats" },
        { text: "❌ Cancel", callback_data: "wlc:cancel" },
      ],
    ]
  );
}

function parseNotificationDraft(text: string) {
  const linkMatch = text.match(/\[link:(\/[^\]]*)\]\s*$/i);
  const url = linkMatch ? linkMatch[1] : "/";
  const message = text.replace(/\s*\[link:\/[^\]]*\]\s*$/i, "").trim();
  return { message, url };
}

async function setControlSession(
  userId: number,
  chatId: number | string,
  data: { state: "awaiting_message" | "preview"; draft?: string; url?: string }
) {
  await getAdminDb().collection("telegram_control_sessions").doc(String(userId)).set(
    {
      userId: String(userId),
      chatId: String(chatId),
      ...data,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

async function getControlSession(userId: number) {
  const snap = await getAdminDb()
    .collection("telegram_control_sessions")
    .doc(String(userId))
    .get();

  return snap.exists ? (snap.data() as {
    userId?: string;
    chatId?: string;
    state?: "awaiting_message" | "preview";
    draft?: string;
    url?: string;
  }) : null;
}

async function clearControlSession(userId: number) {
  await getAdminDb()
    .collection("telegram_control_sessions")
    .doc(String(userId))
    .delete();
}

function buildPushPreview(draft: string, url: string) {
  return `Preview:

🔔 উইল্‌স সাহিত্য ক্লাব
${draft}${url !== "/" ? ` [link:${url}]` : ""}

সব subscribed website users-কে পাঠানো হবে।`;
}

async function sendPushPreview(chatId: number | string, draft: string, url: string) {
  await sendText(
    chatId,
    buildPushPreview(draft, url),
    [
      [
        { text: "🚀 SEND TO EVERYONE", callback_data: "wlc:confirm" },
        { text: "✏️ EDIT", callback_data: "wlc:edit" },
      ],
      [
        { text: "❌ CANCEL", callback_data: "wlc:cancel" },
      ],
    ]
  );
}

async function handleCallback(callback: TelegramCallbackQuery) {
  const userId = callback.from.id;
  const chatId = callback.message?.chat?.id;
  if (!chatId) return;

  if (!isAdmin(userId)) {
    await answerCallback(callback.id, "অনুমতি নেই।");
    return;
  }

  const action = callback.data || "";

  try {
    if (action === "wlc:push") {
      await answerCallback(callback.id);
      await sendText(
        chatId,
        "📢 Push Notification\n\nএখন notification-এর message পাঠান।\n\nOptional link দিতে চাইলে শেষে লিখুন:\n[link:/events]\n\nExample:\nনতুন Event Registration শুরু হয়েছে! [link:/events]\n\n❌ বাতিল করতে /cancel লিখুন।"
      );
      return;
    }

    if (action === "wlc:test") {
      await answerCallback(callback.id, "Test push পাঠানো হচ্ছে...");
      const result = await sendGlobalPushNotification(
        "উইল্‌স সাহিত্য ক্লাব",
        "WLC global push system is working.",
        "/"
      );
      await sendText(
        chatId,
        `🧪 Test Push Complete\n\n📨 Sent: ${result.sent}\n🗑️ Expired removed: ${result.removed}\n⚠️ Failed: ${result.failed}`
      );
      return;
    }

    if (action === "wlc:stats") {
      await answerCallback(callback.id);
      const count = await getPushSubscriberCount();
      await sendText(
        chatId,
        `📊 Push Subscribers\n\n👥 Active subscriptions: ${count}\n\nUsers who allowed browser notifications are counted here.`
      );
      return;
    }

    if (action === "wlc:edit") {
      await answerCallback(callback.id);
      await setControlSession(userId, chatId, { state: "awaiting_message" });
      await sendText(chatId, "✏️ নতুন message পাঠান। আগের draft replace হবে।");
      return;
    }

    if (action === "wlc:cancel") {
      await answerCallback(callback.id, "Cancelled");
      await sendControlMenu(chatId);
      try {
        await clearControlSession(userId);
      } catch (error) {
        console.error("Telegram session cleanup failed:", error);
      }
      return;
    }

    if (action === "wlc:confirm") {
      await answerCallback(callback.id, "Sending...");
      const session = await getControlSession(userId);

      if (!session?.draft) {
        await answerCallback(callback.id, "Draft পাওয়া যায়নি। আবার Send Push চাপুন।");
        return;
      }

      const result = await sendGlobalPushNotification(
        "উইল্‌স সাহিত্য ক্লাব",
        session.draft,
        session.url || "/"
      );

      await clearControlSession(userId);

      await sendText(
        chatId,
        `✅ Global Push Sent\n\n📨 Sent: ${result.sent}\n🗑️ Expired removed: ${result.removed}\n⚠️ Failed: ${result.failed}`,
        [
          [
            { text: "📢 Send Another", callback_data: "wlc:push" },
            { text: "📊 Subscribers", callback_data: "wlc:stats" },
          ],
        ]
      );
      return;
    }
  } catch (error) {
    console.error("Telegram control action error:", error);
    await answerCallback(callback.id, "Something went wrong.");
    await sendText(
      chatId,
      `❌ Action failed.\n\n${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

async function handleMessage(message: TelegramMessage) {
  const userId = message.from?.id;
  const chatId = message.chat?.id;
  const text = message.text?.trim();

  if (!userId || !chatId || !text) return;

  if (text === "/start" || text === "/id") {
    if (!isAdmin(userId)) {
      await sendText(
        chatId,
        `⛔ WLC Control Hub access is not enabled for this Telegram account.\n\nYour Telegram ID: ${userId}\n\nAdd this number to Vercel → TELEGRAM_ADMIN_IDS, then redeploy.\n\nIf you already added it, run /start again after the latest deployment.`
      );
      return;
    }

    await sendControlMenu(chatId);
    try {
      await clearControlSession(userId);
    } catch (error) {
      console.error("Telegram session cleanup failed:", error);
    }
    return;
  }

  if (text === "/control") {
    if (!isAdmin(userId)) {
      await sendText(
        chatId,
        `⛔ Access denied.\n\nYour Telegram ID: ${userId}\nAdd it to TELEGRAM_ADMIN_IDS in Vercel and redeploy.`
      );
      return;
    }

    await sendControlMenu(chatId);
    try {
      await clearControlSession(userId);
    } catch (error) {
      console.error("Telegram session cleanup failed:", error);
    }
    return;
  }

  if (!isAdmin(userId)) return;

  if (text === "/cancel") {
    await clearControlSession(userId);
    await sendText(chatId, "❌ Cancelled.", [
      [
        { text: "📢 Send Push", callback_data: "wlc:push" },
        { text: "📊 Subscribers", callback_data: "wlc:stats" },
      ],
    ]);
    return;
  }

  const session = await getControlSession(userId);

  if (session?.state === "awaiting_message") {
    const { message: draft, url } = parseNotificationDraft(text);

    if (!draft || draft.length > 300) {
      await sendText(chatId, "⚠️ Message 1–300 characters হতে হবে। আবার পাঠান অথবা /cancel লিখুন।");
      return;
    }

    await setControlSession(userId, chatId, {
      state: "preview",
      draft,
      url,
    });

    await sendPushPreview(chatId, draft, url);
    return;
  }

  if (text.startsWith("/notify")) {
    const draftText = text.slice("/notify".length).trim();

    if (!draftText) {
      await setControlSession(userId, chatId, { state: "awaiting_message" });
      await sendText(chatId, "📢 Notification message পাঠান।\n\nOptional: [link:/events]\n\n/cancel দিয়ে বাতিল করতে পারবেন।");
      return;
    }

    const { message: draft, url } = parseNotificationDraft(draftText);

    if (!draft || draft.length > 300) {
      await sendText(chatId, "⚠️ Message 1–300 characters হতে হবে।");
      return;
    }

    await setControlSession(userId, chatId, {
      state: "preview",
      draft,
      url,
    });

    await sendPushPreview(chatId, draft, url);
    return;
  }
}

function getImageFromPost(post: TelegramPost) {
  if (post.document?.file_id && post.document.mime_type?.startsWith("image/")) {
    return {
      fileId: post.document.file_id,
      fileUniqueId: post.document.file_unique_id ?? "",
      fileName: post.document.file_name ?? "telegram-image",
      mimeType: post.document.mime_type ?? "image/*",
    };
  }

  if (post.photo && post.photo.length > 0) {
    const photo = post.photo[post.photo.length - 1];
    return {
      fileId: photo.file_id,
      fileUniqueId: photo.file_unique_id ?? "",
      fileName: `telegram-${post.message_id}.jpg`,
      mimeType: "image/jpeg",
    };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const expectedSecret = getExpectedWebhookSecret();
    const receivedSecret = getWebhookSecret(request);

    if (!receivedSecret || receivedSecret !== expectedSecret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const body = (await request.json()) as TelegramUpdate;

    // Telegram retries webhooks when the endpoint takes too long. Acknowledge
    // immediately and do the Firestore/Telegram work after the response.
    after(async () => {
      try {
        if (body.callback_query) {
          await handleCallback(body.callback_query);
          return;
        }

        if (body.message) {
          await handleMessage(body.message);
          return;
        }

        const post = (body.channel_post || body.edited_channel_post) as TelegramPost | undefined;

        if (!post?.message_id) return;

        const image = getImageFromPost(post);
        if (!image) return;

        const chatId = post.chat?.id ?? process.env.TELEGRAM_CHAT_ID;
        const documentId = `${String(chatId)}_${post.message_id}`;

        await getAdminDb().collection("telegram_media").doc(documentId).set(
          {
            messageId: post.message_id,
            chatId: String(chatId ?? ""),
            fileId: image.fileId,
            fileUniqueId: image.fileUniqueId,
            fileName: image.fileName,
            mimeType: image.mimeType,
            caption: post.caption ?? "",
            mediaGroupId: post.media_group_id ?? null,
            createdAt: (post.date ?? Math.floor(Date.now() / 1000)) * 1000,
            updatedAt: Date.now(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Telegram background webhook error:", error);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
