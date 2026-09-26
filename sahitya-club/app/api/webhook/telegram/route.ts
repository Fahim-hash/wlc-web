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
        { text: "🖼️ Album", callback_data: "wlc:album_list" },
      ],
      [
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
  data: { state: "awaiting_message" | "preview" | "awaiting_album_caption"; draft?: string; url?: string; albumMessageId?: number; albumChatId?: string }
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
    state?: "awaiting_message" | "preview" | "awaiting_album_caption";
    albumMessageId?: number;
    albumChatId?: string;
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

async function sendAlbumList(chatId: number | string) {
  const snapshot = await getAdminDb().collection("telegram_media").get();
  const items = snapshot.docs
    .map((doc) => doc.data() as {
      messageId?: number;
      chatId?: string;
      caption?: string;
      fileId?: string;
      mimeType?: string;
      updatedAt?: number;
      createdAt?: number;
    })
    .filter((item) => item.messageId && item.fileId && item.mimeType?.startsWith("image/"))
    .sort((a, b) => (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0))
    .slice(0, 12);

  if (!items.length) {
    await sendText(chatId, "🖼️ Album Manager\n\nকোনো image পাওয়া যায়নি।");
    return;
  }

  await sendText(
    chatId,
    "🖼️ Album Manager\n\nRecent " + items.length + " photos — caption দিয়ে যেটা edit করতে চান সেটি select করুন:",
    items.map((item) => [{
      text: "📸 #" + item.messageId + " — " + (item.caption || "No caption").replace(/\s+/g, " ").slice(0, 55),
      callback_data: "wlc:album:" + item.messageId,
    }])
  );
}

async function sendSelectedAlbumPhoto(chatId: number | string, messageId: number) {
  const directDoc = await getAdminDb().collection("telegram_media")
    .doc(String(process.env.TELEGRAM_CHAT_ID) + "_" + messageId)
    .get();

  let doc = directDoc;
  if (!doc.exists) {
    const fallback = await getAdminDb()
      .collection("telegram_media")
      .where("messageId", "==", messageId)
      .limit(1)
      .get();
    doc = fallback.docs[0] ?? directDoc;
  }

  if (!doc.exists) {
    await sendText(chatId, "⚠️ এই photo-র media record পাওয়া যায়নি। /album আবার দিন।");
    return;
  }

  const data = doc.data() as { fileId?: string; caption?: string; chatId?: string };
  if (!data.fileId) {
    await sendText(chatId, "⚠️ এই photo-র Telegram file ID পাওয়া যায়নি।");
    return;
  }

  await telegramApi("sendPhoto", {
    chat_id: chatId,
    photo: data.fileId,
    caption: "🖼️ Telegram #" + messageId + "\n\n" + (data.caption || "No caption"),
    reply_markup: {
      inline_keyboard: [
        [{ text: "✏️ Edit Caption", callback_data: "wlc:album_edit:" + messageId }],
        [{ text: "⬅️ Back to Album", callback_data: "wlc:album_list" }],
      ],
    },
  });
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
    if (action === "wlc:album_list") {
      await answerCallback(callback.id);
      await sendAlbumList(chatId);
      return;
    }

    if (action.startsWith("wlc:album:")) {
      await answerCallback(callback.id);
      const messageId = Number(action.slice("wlc:album:".length));
      if (!Number.isInteger(messageId)) {
        await sendText(chatId, "⚠️ Invalid album selection.");
        return;
      }
      await sendSelectedAlbumPhoto(chatId, messageId);
      return;
    }

    if (action.startsWith("wlc:album_edit:")) {
      await answerCallback(callback.id);
      const messageId = Number(action.slice("wlc:album_edit:".length));
      if (!Number.isInteger(messageId)) {
        await sendText(chatId, "⚠️ Invalid photo selection.");
        return;
      }
      await setControlSession(userId, chatId, {
        state: "awaiting_album_caption",
        albumMessageId: messageId,
        albumChatId: String((await getAdminDb().collection("telegram_media").where("messageId", "==", messageId).limit(1).get()).docs[0]?.data()?.chatId || process.env.TELEGRAM_CHAT_ID || ""),
      });
      await sendText(
        chatId,
        "✏️ Telegram #" + messageId + " selected.\n\nনতুন caption পাঠান।\n\nCaption খালি করতে /clearcaption লিখুন।\n❌ /cancel দিয়ে বাতিল করুন."
      );
      return;
    }

    if (action === "wlc:push") {
      await answerCallback(callback.id);
      await sendText(
        chatId,
        "📢 Push Notification\n\nএখন notification-এর message পাঠান।\n\nOptional link দিতে চাইলে শেষে লিখুন:\n[link:/events]\n\nExample:\nনতুন Event Registration শুরু হয়েছে! [link:/events]\n\n❌ বাতিল করতে /cancel লিখুন।"
      );
      try {
        await setControlSession(userId, chatId, { state: "awaiting_message" });
      } catch (error) {
        console.error("Telegram session setup failed:", error);
      }
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

  if (text === "/album") {
    await sendAlbumList(chatId);
    return;
  }

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

  if (session?.state === "awaiting_album_caption") {
    const messageId = session.albumMessageId;
    if (!messageId) {
      await clearControlSession(userId);
      await sendText(chatId, "⚠️ Photo selection expired. /album দিয়ে আবার select করুন।");
      return;
    }

    const newCaption = text === "/clearcaption" ? "" : text;
    if (newCaption.length > 1024) {
      await sendText(chatId, "⚠️ Telegram caption সর্বোচ্চ 1024 characters হতে পারে।");
      return;
    }

    const mediaQuery = await getAdminDb()
      .collection("telegram_media")
      .where("messageId", "==", messageId)
      .limit(1)
      .get();
    const mediaDoc = mediaQuery.docs[0];
    const mediaData = mediaDoc?.data() as { chatId?: string } | undefined;
    const targetChatId =
      session.albumChatId ||
      mediaData?.chatId ||
      process.env.TELEGRAM_CHAT_ID;

    if (!targetChatId) {
      throw new Error("Album channel ID পাওয়া যায়নি।");
    }

    try {
      await telegramApi("editMessageCaption", {
        chat_id: targetChatId,
        message_id: messageId,
        caption: newCaption,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown Telegram error";
      if (message.includes("message can't be edited")) {
        throw new Error(
          "Telegram এই post edit করতে দিচ্ছে না। Bot-টিকে channel-এর Admin করে “Edit Messages / can_edit_messages” permission দিন, তারপর আবার চেষ্টা করুন."
        );
      }
      throw error;
    }

    if (mediaDoc) {
      await mediaDoc.ref.set(
        { caption: newCaption, updatedAt: Date.now() },
        { merge: true }
      );
    }

    await clearControlSession(userId);
    await sendText(
      chatId,
      "✅ Caption updated!\n\nTelegram #" + messageId + " এখন নতুন caption-এ updated হয়েছে.",
      [[
        { text: "🖼️ Edit Another", callback_data: "wlc:album_list" },
        { text: "🏠 Control Hub", callback_data: "wlc:cancel" },
      ]]
    );
    return;
  }

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
