import { after, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";
import { handleTelegramCmsCommand, handleTelegramCmsCallback, handleTelegramCmsMessage } from "@/lib/telegram-cms";
import { sendGlobalPushNotification, getPushSubscriberCount } from "@/lib/push";

type TelegramUser = { id: number };
type TelegramMessage = { message_id: number; text?: string; from?: TelegramUser; chat?: { id?: number | string }; photo?: TelegramPhoto[]; document?: { file_id: string; mime_type?: string } };
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

function getKothasokhiWebhookUrl() {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd").replace(/\/$/, "");
  return `${origin}/api/telegram-ai/webhook`;
}

function getKothasokhiWebhookSecret(token: string) {
  return (
    process.env.TELEGRAMAI_WEBHOOK_SECRET?.trim() ||
    crypto.createHash("sha256").update(token).digest("hex")
  );
}

async function kothasokhiTelegramApi(method: string, payload: Record<string, unknown> = {}) {
  const token = process.env.TELEGRAMAI_BOT_TOKEN?.trim();
  if (!token) {
    throw new Error("Vercel Production environment-এ TELEGRAMAI_BOT_TOKEN সেট করা নেই।");
  }

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok || !result.ok) {
    throw new Error(`Kothasokhi Telegram ${method} failed: ${result.description || response.status}`);
  }
  return result;
}

async function sendKothasokhiMenu(chatId: number | string) {
  const tokenConfigured = Boolean(process.env.TELEGRAMAI_BOT_TOKEN?.trim());
  return sendText(
    chatId,
    `🤖 Kothasokhi AI Control Center

এখান থেকে আলাদা Kothasokhi AI bot-এর webhook, status ও AI response পরীক্ষা করতে পারবেন।

Token: ${tokenConfigured ? "✅ configured" : "❌ TELEGRAMAI_BOT_TOKEN missing"}

এটি WLC Control Hub bot-এর token/webhook পরিবর্তন করবে না।`,
    [
      [
        { text: "📡 Webhook Status", callback_data: "wlc:kothasokhi:status" },
        { text: "🔧 Setup / Repair", callback_data: "wlc:kothasokhi:setup" },
      ],
      [
        { text: "🧪 Test AI Reply", callback_data: "wlc:kothasokhi:test" },
        { text: "📊 Chat & Knowledge Stats", callback_data: "wlc:kothasokhi:stats" },
      ],
      [
        { text: "📚 Add Knowledge", callback_data: "wlc:cms:new:knowledge" },
        { text: "📋 CMS Records", callback_data: "wlc:cms:list" },
      ],
      [{ text: "⬅️ WLC Control Hub", callback_data: "wlc:kothasokhi:back" }],
    ]
  );
}

async function sendKothasokhiStatus(chatId: number | string) {
  const [me, info] = await Promise.all([
    kothasokhiTelegramApi("getMe"),
    kothasokhiTelegramApi("getWebhookInfo"),
  ]);
  const expectedUrl = getKothasokhiWebhookUrl();
  const actualUrl = String(info.result?.url || "");
  const matching = actualUrl === expectedUrl;
  const username = me.result?.username ? `@${me.result.username}` : "unknown";

  await sendText(
    chatId,
    `🩺 Kothasokhi AI Status

Bot: ${username}
Webhook: ${matching ? "✅ ঠিক আছে" : "⚠️ missing/mismatch"}
Expected URL: ${expectedUrl}
Registered URL: ${actualUrl || "কোনো webhook registered নেই"}
Pending updates: ${info.result?.pending_update_count ?? 0}
Last Telegram error: ${info.result?.last_error_message || "নেই"}${info.result?.last_error_date ? `\nError timestamp: ${new Date(info.result.last_error_date * 1000).toISOString()}` : ""}`,
    [
      [
        { text: "🔧 Setup / Repair", callback_data: "wlc:kothasokhi:setup" },
        { text: "⬅️ Control Center", callback_data: "wlc:kothasokhi:menu" },
      ],
    ]
  );
}

async function setupKothasokhiBot(chatId: number | string) {
  const token = process.env.TELEGRAMAI_BOT_TOKEN?.trim();
  if (!token) {
    throw new Error("Vercel Production environment-এ TELEGRAMAI_BOT_TOKEN সেট করে redeploy করুন।");
  }

  const webhookUrl = getKothasokhiWebhookUrl();
  const secret = getKothasokhiWebhookSecret(token);

  await kothasokhiTelegramApi("setWebhook", {
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message"],
    max_connections: 10,
    drop_pending_updates: false,
  });
  await kothasokhiTelegramApi("setMyCommands", {
    commands: [
      { command: "start", description: "Start chatting with Kothasokhi" },
      { command: "help", description: "How to use Kothasokhi" },
    ],
  });
  await kothasokhiTelegramApi("setMyDescription", {
    description: "🌸 Kothasokhi AI — Willes Literary Club-এর AI সাহিত্যসঙ্গী। বাংলা, সাহিত্য, কবিতা, লেখালেখি ও WLC নিয়ে আড্ডা দাও। বাংলা ও Banglish দুটোই বুঝি!",
  });
  await kothasokhiTelegramApi("setMyShortDescription", {
    short_description: "📚 তোমার প্রিয় সাহিত্যসঙ্গী | WLC-এর AI assistant 💚",
  });

  const [me, info] = await Promise.all([
    kothasokhiTelegramApi("getMe"),
    kothasokhiTelegramApi("getWebhookInfo"),
  ]);
  const username = me.result?.username ? `@${me.result.username}` : "username পাওয়া যায়নি";
  const actualUrl = String(info.result?.url || "");

  await sendText(
    chatId,
    `✅ Kothasokhi AI setup complete!

Bot: ${username}
Webhook: ${actualUrl === webhookUrl ? "✅ registered" : "⚠️ verify করুন"}
URL: ${actualUrl || webhookUrl}
Pending updates: ${info.result?.pending_update_count ?? 0}

এখন Kothasokhi bot-এ /start পাঠিয়ে test করুন।`,
    [
      [
        { text: "📡 Check Status", callback_data: "wlc:kothasokhi:status" },
        { text: "🧪 Test AI", callback_data: "wlc:kothasokhi:test" },
      ],
      [{ text: "⬅️ Control Center", callback_data: "wlc:kothasokhi:menu" }],
    ]
  );
}

async function testKothasokhiAi(chatId: number | string) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || "https://wlc.pro.bd").replace(/\/$/, "");
  const response = await fetch(`${origin}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "তুমি কে? এক বাক্যে পরিচয় দাও।" }],
    }),
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || typeof data.reply !== "string") {
    throw new Error(data.error || `AI chat API failed (HTTP ${response.status})`);
  }
  await sendText(
    chatId,
    `🧪 Kothasokhi AI test successful

${String(data.reply).slice(0, 3500)}`,
    [[{ text: "⬅️ Control Center", callback_data: "wlc:kothasokhi:menu" }]]
  );
}

async function sendKothasokhiStats(chatId: number | string) {
  const db = getAdminDb();
  const [conversations, knowledge] = await Promise.all([
    db.collection("telegram_ai_conversations").count().get(),
    db.collection("kothasokhi_knowledge").where("status", "==", "PUBLISHED").count().get(),
  ]);
  await sendText(
    chatId,
    `📊 Kothasokhi AI Stats

💬 Telegram conversations: ${conversations.data().count}
📚 Published knowledge entries: ${knowledge.data().count}`,
    [[{ text: "⬅️ Control Center", callback_data: "wlc:kothasokhi:menu" }]]
  );
}

async function sendControlMenu(chatId: number | string) {
  return sendText(
    chatId,
    "উইল্‌স সাহিত্য ক্লাব\n\nওয়েবসাইটের নোটিফিকেশন ও অন্যান্য ব্যবস্থাপনা এখান থেকেই করা যাবে।",
    [
      [
        { text: "📢 নোটিফিকেশন পাঠান", callback_data: "wlc:push" },
        { text: "🧪 পরীক্ষা করুন", callback_data: "wlc:test" },
      ],
      [
        { text: "📊 সাবস্ক্রাইবার", callback_data: "wlc:stats" },
        { text: "🖼️ অ্যালবাম", callback_data: "wlc:album_list" },
      ],
      [
        { text: "✨ বিষয় ব্যবস্থাপনা", callback_data: "wlc:cms:menu" },
      ],
      [
        { text: "🤖 Kothasokhi AI Control", callback_data: "wlc:kothasokhi:menu" },
      ],
      [
        { text: "❌ বাতিল", callback_data: "wlc:cancel" },
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
  data: { state: "awaiting_message" | "preview" | "awaiting_album_caption"; draft?: string; url?: string; imageFileId?: string; albumMessageId?: number; albumChatId?: string }
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
    imageFileId?: string;
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

function buildPushPreview(draft: string, url: string, hasImage = false) {
  return `📋 নোটিফিকেশন প্রস্তুত

🔔 উইল্‌স সাহিত্য ক্লাব
${hasImage ? "🖼️ ছবি: যোগ করা হয়েছে\n" : ""}${draft}${url !== "/" ? ` [link:${url}]` : ""}

সব নোটিফিকেশন সাবস্ক্রাইবারকে পাঠানো হবে।`;
}

async function sendPushPreview(chatId: number | string, draft: string, url: string, hasImage = false) {
  await sendText(
    chatId,
    buildPushPreview(draft, url, hasImage),
    [
      [
        { text: "🚀 নোটিফিকেশন পাঠান", callback_data: "wlc:confirm" },
        { text: "✏️ বার্তা বদলান", callback_data: "wlc:edit" },
      ],
      [{ text: "❌ বাতিল", callback_data: "wlc:cancel" }],
    ]
  );
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
    await sendText(chatId, "🖼️ অ্যালবাম Manager\n\nকোনো image পাওয়া যায়নি।");
    return;
  }

  await sendText(
    chatId,
    "🖼️ অ্যালবাম Manager\n\nসাম্প্রতিক " + items.length + " টি ছবি — যেটির ক্যাপশন পরিবর্তন করতে চান সেটি বেছে নিন:",
    items.map((item) => [{
      text: "📸 #" + item.messageId + " — " + (item.caption || "কোনো ক্যাপশন নেই").replace(/\s+/g, " ").slice(0, 55),
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
    caption: "🖼️ টেলিগ্রাম #" + messageId + "\n\n" + (data.caption || "কোনো ক্যাপশন নেই"),
    reply_markup: {
      inline_keyboard: [
        [{ text: "✏️ ক্যাপশন বদলান", callback_data: "wlc:album_edit:" + messageId }],
        [{ text: "⬅️ অ্যালবামে ফিরুন", callback_data: "wlc:album_list" }],
      ],
    },
  });
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
    if (action.startsWith("wlc:cms:")) {
      await answerCallback(callback.id);
      await handleTelegramCmsCallback(userId, chatId, action);
      return;
    }

    if (action === "wlc:kothasokhi:menu") {
      await answerCallback(callback.id);
      await sendKothasokhiMenu(chatId);
      return;
    }

    if (action === "wlc:kothasokhi:back") {
      await answerCallback(callback.id);
      await sendControlMenu(chatId);
      return;
    }

    if (action === "wlc:kothasokhi:status") {
      await answerCallback(callback.id, "Kothasokhi status check করছি...");
      await sendKothasokhiStatus(chatId);
      return;
    }

    if (action === "wlc:kothasokhi:setup") {
      await answerCallback(callback.id, "Kothasokhi setup/repair করছি...");
      await setupKothasokhiBot(chatId);
      return;
    }

    if (action === "wlc:kothasokhi:test") {
      await answerCallback(callback.id, "AI test চলছে...");
      await testKothasokhiAi(chatId);
      return;
    }

    if (action === "wlc:kothasokhi:stats") {
      await answerCallback(callback.id);
      await sendKothasokhiStats(chatId);
      return;
    }

    if (action === "wlc:album_list") {
      await answerCallback(callback.id);
      await sendAlbumList(chatId);
      return;
    }

    if (action.startsWith("wlc:album:")) {
      await answerCallback(callback.id);
      const messageId = Number(action.slice("wlc:album:".length));
      if (!Number.isInteger(messageId)) {
        await sendText(chatId, "⚠️ ভুল অ্যালবাম নির্বাচন হয়েছে।");
        return;
      }
      await sendSelectedAlbumPhoto(chatId, messageId);
      return;
    }

    if (action.startsWith("wlc:album_edit:")) {
      await answerCallback(callback.id);
      const messageId = Number(action.slice("wlc:album_edit:".length));
      if (!Number.isInteger(messageId)) {
        await sendText(chatId, "⚠️ ভুল ছবি নির্বাচন হয়েছে।");
        return;
      }
      await setControlSession(userId, chatId, {
        state: "awaiting_album_caption",
        albumMessageId: messageId,
        albumChatId: String((await getAdminDb().collection("telegram_media").where("messageId", "==", messageId).limit(1).get()).docs[0]?.data()?.chatId || process.env.TELEGRAM_CHAT_ID || ""),
      });
      await sendText(
        chatId,
        "✏️ টেলিগ্রাম #" + messageId + " selected.\n\nনতুন caption পাঠান।\n\nক্যাপশন খালি করতে /clearcaption লিখুন।\n❌ /cancel দিয়ে বাতিল করুন."
      );
      return;
    }

    if (action === "wlc:push") {
      await answerCallback(callback.id);
      await sendText(
        chatId,
        "📢 ওয়েবসাইট নোটিফিকেশন\n\nচাইলে আগে একটি ছবি পাঠান। ছবি না চাইলে সরাসরি বার্তা পাঠান।\n\nলিংক দিতে চাইলে বার্তার শেষে লিখুন:\n[link:/events]\n\n❌ বাতিল করতে /cancel লিখুন।"
      );
      try {
        await setControlSession(userId, chatId, { state: "awaiting_message" });
      } catch (error) {
        console.error("Telegram session setup failed:", error);
      }
      return;
    }

    if (action === "wlc:test") {
      await answerCallback(callback.id, "পরীক্ষামূলক নোটিফিকেশন পাঠানো হচ্ছে...");
      const result = await sendGlobalPushNotification(
        "উইল্‌স সাহিত্য ক্লাব",
        "পরীক্ষামূলক নোটিফিকেশন",
        "/"
      );
      await sendText(
        chatId,
        `🧪 পরীক্ষা করুন Complete\n\n📨 পাঠানো হয়েছে: ${result.sent}\n🗑️ মেয়াদোত্তীর্ণ সরানো হয়েছে: ${result.removed}\n⚠️ ব্যর্থ: ${result.failed}`
      );
      return;
    }

    if (action === "wlc:stats") {
      await answerCallback(callback.id);
      const count = await getPushSubscriberCount();
      await sendText(
        chatId,
        `📊 নোটিফিকেশন সাবস্ক্রাইবার\n\n👥 সক্রিয় সাবস্ক্রিপশন: ${count}\n\nনোটিফিকেশন অনুমতি দেওয়া ব্যবহারকারীদের এখানে গণনা করা হয়।`
      );
      return;
    }

    if (action === "wlc:edit") {
      await answerCallback(callback.id);
      await setControlSession(userId, chatId, { state: "awaiting_message" });
      await sendText(chatId, "✏️ নতুন বার্তা পাঠান। আগের খসড়া বদলে যাবে।");
      return;
    }

    if (action === "wlc:cancel") {
      await answerCallback(callback.id, "বাতিল করা হয়েছে");
      await sendControlMenu(chatId);
      try {
        await clearControlSession(userId);
      } catch (error) {
        console.error("Telegram session cleanup failed:", error);
      }
      return;
    }

    if (action === "wlc:confirm") {
      await answerCallback(callback.id, "পাঠানো হচ্ছে...");
      const session = await getControlSession(userId);

      if (!session?.draft) {
        await answerCallback(callback.id, "খসড়া পাওয়া যায়নি। আবার নোটিফিকেশন পাঠানোর চেষ্টা করুন।");
        return;
      }

      const image = session.imageFileId
        ? `https://wlc.pro.bd/api/telegram/media/${encodeURIComponent(session.imageFileId)}`
        : undefined;
      const result = await sendGlobalPushNotification(
        "উইল্‌স সাহিত্য ক্লাব",
        session.draft,
        session.url || "/",
        image
      );

      await clearControlSession(userId);

      await sendText(
        chatId,
        `✅ নোটিফিকেশন পাঠানো হয়েছে\n\n📨 পাঠানো হয়েছে: ${result.sent}\n🗑️ মেয়াদোত্তীর্ণ সরানো হয়েছে: ${result.removed}\n⚠️ ব্যর্থ: ${result.failed}`,
        [
          [
            { text: "📢 আরেকটি পাঠান", callback_data: "wlc:push" },
            { text: "📊 সাবস্ক্রাইবার", callback_data: "wlc:stats" },
          ],
        ]
      );
      return;
    }
  } catch (error) {
    console.error("Telegram control action error:", error);
    await answerCallback(callback.id, "কিছু একটা সমস্যা হয়েছে।");
    await sendText(
      chatId,
      `❌ কাজটি সম্পন্ন করা যায়নি।\n\n${error instanceof Error ? error.message : "অজানা সমস্যা"}`
    );
  }
}

async function handleMessage(message: TelegramMessage) {
  const userId = message.from?.id;
  const chatId = message.chat?.id;
  const text = message.text?.trim();

  if (!userId || !chatId) return;

  if (text && (text === "/start" || text === "/id")) {
    if (!isAdmin(userId)) {
      await sendText(
        chatId,
        `⛔ উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইট নিয়ন্ত্রন করার অনুমতি নেই।\n\nআপনার টেলিগ্রাম আইডি: ${userId}। আপনি যদি উইল্‌স সাহিত্য ক্লাবের কোন প্যানেল সদস্য হয়ে থাকেন তাহলে ওয়েবসাইট নিয়ন্ত্রন করার অনুমতি পেতে RelaxStudio কর্তৃপক্ষ বা ক্লাবের বর্তমান সম্পাদনা বিভাগ প্রধানের সঙ্গে যোগাযোগ করুন। ধন্যবাদ ।`
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
        `⛔ উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইট নিয়ন্ত্রন করার অনুমতি নেই।\n\nআপনার টেলিগ্রাম আইডি: ${userId}। আপনি যদি উইল্‌স সাহিত্য ক্লাবের কোন প্যানেল সদস্য হয়ে থাকেন তাহলে ওয়েবসাইট নিয়ন্ত্রন করার অনুমতি পেতে RelaxStudio কর্তৃপক্ষ বা ক্লাবের বর্তমান সম্পাদনা বিভাগ প্রধানের সঙ্গে যোগাযোগ করুন। ধন্যবাদ ।`
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

  if (text === "/kothasokhi") {
    await sendKothasokhiMenu(chatId);
    return;
  }

  if (text === "/kothasokhi_status") {
    await sendKothasokhiStatus(chatId);
    return;
  }

  if (text === "/kothasokhi_setup") {
    await setupKothasokhiBot(chatId);
    return;
  }

  if (await handleTelegramCmsMessage(userId, chatId, message)) return;

  if (text && await handleTelegramCmsCommand(userId, chatId, text)) return;

  if (text === "/album") {
    await sendAlbumList(chatId);
    return;
  }

  if (text === "/cancel") {
    await clearControlSession(userId);
    await sendText(chatId, "❌ বাতিলled.", [
      [
        { text: "📢 নোটিফিকেশন পাঠান", callback_data: "wlc:push" },
        { text: "📊 সাবস্ক্রাইবার", callback_data: "wlc:stats" },
      ],
    ]);
    return;
  }

  const session = await getControlSession(userId);

  if (session?.state === "awaiting_album_caption") {
    const messageId = session.albumMessageId;
    if (!messageId) {
      await clearControlSession(userId);
      await sendText(chatId, "⚠️ ছবি নির্বাচনটি শেষ হয়ে গেছে। /album দিয়ে আবার নির্বাচন করুন।");
      return;
    }

    const newCaption = text === "/clearcaption" ? "" : (text ?? "");
    if (newCaption.length > 1024) {
      await sendText(chatId, "⚠️ টেলিগ্রামের ক্যাপশন সর্বোচ্চ ১০২৪ অক্ষর হতে পারে।");
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
      throw new Error("অ্যালবামের চ্যানেল আইডি পাওয়া যায়নি।");
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
          "টেলিগ্রাম এই পোস্টটি সম্পাদনা করতে দিচ্ছে না। বটটিকে চ্যানেলের প্রশাসক করে বার্তা সম্পাদনার অনুমতি দিন, তারপর আবার চেষ্টা করুন।"
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
      "✅ ক্যাপশন পরিবর্তন হয়েছে!\n\nটেলিগ্রাম #" + messageId + " এখন নতুন caption-এ পরিবর্তন হয়েছে।",
      [[
        { text: "🖼️ আরেকটি পরিবর্তন করুন", callback_data: "wlc:album_list" },
        { text: "🏠 ব্যবস্থাপনা", callback_data: "wlc:cancel" },
      ]]
    );
    return;
  }

  if (session?.state === "awaiting_message") {
    const photoFileId = message.photo?.at(-1)?.file_id || message.document?.file_id;
    if (photoFileId) {
      await setControlSession(userId, chatId, {
        state: "awaiting_message",
        imageFileId: photoFileId,
      });
      if (!text) {
        await sendText(chatId, "🖼️ ছবি যোগ হয়েছে।\n\nএখন নোটিফিকেশনের বার্তা লিখুন.");
        return;
      }
    }

    const { message: draft, url } = parseNotificationDraft(text || "");
    if (!draft || draft.length > 300) {
      await sendText(chatId, "⚠️ বার্তাটি ১–৩০০ অক্ষরের হতে হবে। আবার পাঠান অথবা /cancel লিখুন।");
      return;
    }

    const currentSession = await getControlSession(userId);
    await setControlSession(userId, chatId, {
      state: "preview",
      draft,
      url,
      ...(currentSession?.imageFileId ? { imageFileId: currentSession.imageFileId } : {}),
    });

    await sendPushPreview(chatId, draft, url, Boolean(currentSession?.imageFileId));
    return;
  }

  if (text?.startsWith("/notify")) {
    const draftText = text.slice("/notify".length).trim();

    if (!draftText) {
      await setControlSession(userId, chatId, { state: "awaiting_message" });
      await sendText(chatId, "📢 চাইলে আগে ছবি পাঠান, অথবা সরাসরি নোটিফিকেশনের বার্তা পাঠান।\n\nলিংক: [link:/events]\n\n/cancel দিয়ে বাতিল করতে পারবেন।");
      return;
    }

    const { message: draft, url } = parseNotificationDraft(draftText);

    if (!draft || draft.length > 300) {
      await sendText(chatId, "⚠️ বার্তাটি ১–৩০০ অক্ষরের হতে হবে।");
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

        await getAdminDb().collection("media").doc(documentId).set({
          messageId: post.message_id,
          chatId: String(chatId ?? ""),
          telegramFileId: image.fileId,
          telegramFileUniqueId: image.fileUniqueId,
          type: image.mimeType,
          fileName: image.fileName,
          caption: post.caption ?? "",
          albumId: post.media_group_id ? String(post.media_group_id) : null,
          status: "PUBLISHED",
          updatedAt: Date.now(),
        }, { merge: true });

        if (post.media_group_id) {
          await getAdminDb().collection("albums").doc(String(post.media_group_id)).set({
            telegramChatId: String(chatId ?? ""),
            telegramMediaGroupId: String(post.media_group_id),
            status: "PUBLISHED",
            updatedAt: Date.now(),
          }, { merge: true });
        }

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
