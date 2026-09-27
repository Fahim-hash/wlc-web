import { getAdminDb } from "@/lib/firebase-admin";
import { writeCmsRecord, archiveCmsRecord, listCollection } from "@/lib/cms";

type CmsType = "event" | "member" | "achievement" | "announcement" | "writing" | "knowledge";
type CmsSession = {
  type: CmsType;
  step: number;
  data: Record<string, unknown>;
  userId: string;
  chatId: string;
};

const titles: Record<CmsType, string> = {
  event: "📅 আয়োজন",
  member: "👤 সদস্য",
  achievement: "🏆 অর্জন",
  announcement: "📢 ঘোষণা",
  writing: "✍️ লেখা",
  knowledge: "🤖 কথাসখী",
};

const questions: Record<CmsType, string[]> = {
  event: ["আয়োজনটির নাম কী?", "তারিখ কী?", "সময় কী? (না থাকলে “নেই” লিখুন)", "স্থান কী? (না থাকলে “নেই” লিখুন)", "আয়োজনটির সংক্ষিপ্ত বিবরণ লিখুন।", "আয়োজনের ব্যানার পাঠান। ছবি না থাকলে “নেই” লিখুন।", "এই আয়োজনের আলাদা কোনো ওয়েবপেজ আছে?"],
  member: ["সদস্যের নাম কী?", "পদ/দায়িত্ব কী?", "ব্যাচ কী?", "সংক্ষিপ্ত পরিচিতি লিখুন।"],
  achievement: ["অর্জনের নাম কী?", "তারিখ কী?", "কোন ধরনের অর্জন? (যেমন: প্রতিযোগিতা, স্বীকৃতি)", "অর্জনের সংক্ষিপ্ত বিবরণ লিখুন।"],
  announcement: ["ঘোষণাটির শিরোনাম কী?", "ঘোষণার মূল বক্তব্য লিখুন।", "কোনো ওয়েব লিংক আছে? না থাকলে “নেই” লিখুন।"],
  writing: ["লেখাটির নাম কী?", "লেখকের নাম কী?", "কোন ধরনের লেখা?", "লেখাটি লিখুন বা পেস্ট করুন।"],
  knowledge: ["জ্ঞানটির বিষয়/শিরোনাম কী?", "কথাসখী কী উত্তর দেবে?", "উৎস/রেফারেন্স কী? না থাকলে “নেই” লিখুন।"],
};

const collections: Record<CmsType, string> = {
  event: "events", member: "members", achievement: "achievements",
  announcement: "announcements", writing: "writing", knowledge: "kothasokhi_knowledge",
};

async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const response = await fetch(\`https://api.telegram.org/bot\${token}/\${method}\`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), cache: "no-store",
  });
  const result = await response.json();
  if (!result.ok) throw new Error(\`Telegram \${method} failed\`);
  return result;
}

async function sendText(chatId: number | string, text: string, keyboard?: unknown[][]) {
  return telegramApi("sendMessage", {
    chat_id: chatId, text, disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
  });
}

async function getSession(userId: number) {
  const snap = await getAdminDb().collection("telegram_cms_sessions").doc(String(userId)).get();
  return snap.exists ? snap.data() as CmsSession : null;
}
async function saveSession(userId: number, chatId: number | string, type: CmsType, step: number, data: Record<string, unknown>) {
  await getAdminDb().collection("telegram_cms_sessions").doc(String(userId)).set({
    userId: String(userId), chatId: String(chatId), type, step, data, updatedAt: Date.now()
  });
}
async function clearSession(userId: number) {
  await getAdminDb().collection("telegram_cms_sessions").doc(String(userId)).delete();
}

export async function sendCmsMenu(chatId: number | string) {
  return sendText(chatId, "✨ উইল্‌স সাহিত্য ক্লাব\n\nকী করতে চান?", [
    [{ text: "➕ নতুন আয়োজন", callback_data: "wlc:cms:new:event" }, { text: "👤 নতুন সদস্য", callback_data: "wlc:cms:new:member" }],
    [{ text: "🏆 নতুন অর্জন", callback_data: "wlc:cms:new:achievement" }, { text: "📢 নতুন ঘোষণা", callback_data: "wlc:cms:new:announcement" }],
    [{ text: "✍️ নতুন লেখা", callback_data: "wlc:cms:new:writing" }, { text: "🤖 কথাসখী জ্ঞান", callback_data: "wlc:cms:new:knowledge" }],
    [{ text: "📋 সাম্প্রতিক বিষয়", callback_data: "wlc:cms:list" }],
    [{ text: "🏠 মূল মেনু", callback_data: "wlc:cancel" }],
  ]);
}

async function startFlow(userId: number, chatId: number | string, type: CmsType) {
  await saveSession(userId, chatId, type, 0, {});
  await sendText(chatId, \`➕ \${titles[type]}\n\nআমি ধাপে ধাপে তথ্য নেব। প্রতিটি প্রশ্নের উত্তর দিলেই পরের ধাপে যাব।\n\n❌ যেকোনো সময় /cancel লিখে বন্ধ করতে পারবেন।\n\nপ্রথম প্রশ্ন:\n\${questions[type][0]}\`);
}

async function finishFlow(userId: number, chatId: number | string, session: CmsSession) {
  const data = { ...session.data, status: "DRAFT", sortOrder: Date.now() };
  const preview = [
    \`📋 \${titles[session.type]}\`,
    "",
    ...Object.entries(data).filter(([key]) => !["status", "sortOrder", "bannerFileId"].includes(key)).map(([key, value]) => \`\${key}: \${String(value || "নেই")}\`),
    "",
    "সব ঠিক আছে?",
  ].join("\n");
  await saveSession(userId, chatId, session.type, questions[session.type].length, data);
  await sendText(chatId, preview, [
    [{ text: "✅ প্রকাশ করুন", callback_data: "wlc:cms:publish" }, { text: "📝 খসড়া রাখুন", callback_data: "wlc:cms:draft" }],
    [{ text: "❌ বাতিল", callback_data: "wlc:cancel" }],
  ]);
}

export async function handleTelegramCmsMessage(userId: number, chatId: number | string, message: {
  text?: string; photo?: Array<{ file_id: string }>; document?: { file_id: string; mime_type?: string };
}) {
  const text = message.text?.trim() || "";
  const session = await getSession(userId);
  if (!session) return false;

  if (text === "/cancel") {
    await clearSession(userId); await sendText(chatId, "❌ বাতিল করা হয়েছে।", [[{ text: "✨ আবার শুরু করুন", callback_data: "wlc:cms:menu" }]]);
    return true;
  }

  let answer: string | undefined = text;
  const currentQuestion = questions[session.type][session.step];

  if (session.type === "event" && session.step === 5) {
    const fileId = message.photo?.at(-1)?.file_id || message.document?.file_id;
    if (fileId) {
      session.data.bannerFileId = fileId;
      answer = "ব্যানার যোগ করা হয়েছে";
    } else if (!text) {
      await sendText(chatId, "🖼️ ব্যানার হিসেবে একটি ছবি পাঠান, অথবা “নেই” লিখুন।");
      return true;
    }
  }

  if (session.type === "event" && session.step === 6) {
    const lower = text.toLowerCase();
    if (["না", "নেই", "no", "না আছে"].includes(lower)) {
      session.data.hasDedicatedPage = false;
      session.data.link = "";
      await clearSession(userId);
      await sendText(chatId, "শেষে একটি বিষয়: ওয়েবসাইটে প্রকাশ করবেন?", [[{ text: "🚀 প্রকাশ", callback_data: "wlc:cms:publish" }, { text: "📝 খসড়া", callback_data: "wlc:cms:draft" }]]);
      await saveSession(userId, chatId, session.type, 7, session.data);
      return true;
    }
    session.data.hasDedicatedPage = true;
    await saveSession(userId, chatId, session.type, 7, session.data);
    await sendText(chatId, "🔗 ওই ওয়েবপেজের লিংক দিন।");
    return true;
  }

  if (session.step === 7 && session.type === "event") {
    session.data.link = text;
    await finishFlow(userId, chatId, session);
    return true;
  }

  if (!answer) {
    await sendText(chatId, \`⚠️ উত্তরটি খালি রাখা যাবে না।\n\n\${currentQuestion}\`);
    return true;
  }

  const fieldNames: Record<CmsType, string[]> = {
    event: ["title", "date", "time", "venue", "description"],
    member: ["name", "role", "batch", "bio"],
    achievement: ["title", "date", "category", "description"],
    announcement: ["title", "message", "link"],
    writing: ["title", "author", "category", "body"],
    knowledge: ["title", "answer", "source"],
  };

  const field = fieldNames[session.type][session.step];
  session.data[field] = answer;
  const nextStep = session.step + 1;

  if (nextStep >= questions[session.type].length) {
    await finishFlow(userId, chatId, { ...session, step: nextStep, data: session.data });
    return true;
  }

  await saveSession(userId, chatId, session.type, nextStep, session.data);
  await sendText(chatId, \`ঠিক আছে ✓\n\nপরের প্রশ্ন:\n\${questions[session.type][nextStep]}\`);
  return true;
}

export async function handleTelegramCmsCallback(userId: number, chatId: number | string, action: string) {
  if (!action.startsWith("wlc:cms:")) return false;
  if (action === "wlc:cms:menu") { await sendCmsMenu(chatId); return true; }

  if (action === "wlc:cms:publish" || action === "wlc:cms:draft") {
    const session = await getSession(userId);
    if (!session) { await sendText(chatId, "⚠️ কোনো অসম্পূর্ণ বিষয় পাওয়া যায়নি।"); return true; }
    const data = { ...session.data, status: action.endsWith("publish") ? "PUBLISHED" : "DRAFT", sortOrder: Date.now() };
    const result = await writeCmsRecord(collections[session.type] as any, data, undefined, "telegram:" + userId);
    await clearSession(userId);
    await sendText(chatId,
      action.endsWith("publish") ? "🎉 প্রকাশ হয়ে গেছে!\n\nওয়েবসাইটে এখন এটি দেখা যাবে।" : "📝 খসড়া হিসেবে সংরক্ষণ করা হয়েছে।\n\nপ্রয়োজনে পরে প্রকাশ করতে পারবেন।",
      [[{ text: "➕ আরেকটি যোগ করুন", callback_data: \`wlc:cms:new:\${session.type}\` }, { text: "🏠 মূল মেনু", callback_data: "wlc:cms:menu" }]]
    );
    return true;
  }

  if (action === "wlc:cms:list") {
    const names = Object.keys(collections) as CmsType[];
    const chunks = await Promise.all(names.map(async type => ({ type, rows: await listCollection(collections[type] as any, 4) })));
    const lines = chunks.flatMap(({ type, rows }) => rows.map((item: any) => \`• \${titles[type]} — \${item.title || item.name || "নামহীন"}\`));
    await sendText(chatId, lines.length ? "📋 সাম্প্রতিক বিষয়\n\n" + lines.join("\n") : "📋 এখনো কোনো বিষয় নেই।", [[{ text: "⬅️ ফিরে যান", callback_data: "wlc:cms:menu" }]]);
    return true;
  }

  const match = action.match(/^wlc:cms:new:(event|member|achievement|announcement|writing|knowledge)$/);
  if (match) { await startFlow(userId, chatId, match[1] as CmsType); return true; }
  return false;
}

export async function handleTelegramCmsCommand(userId: number, chatId: number | string, text: string) {
  const command = text.trim();
  if (command === "/cms") { await sendCmsMenu(chatId); return true; }
  const match = command.match(/^\/(event|member|achievement|announcement|writing|knowledge)$/);
  if (match) { await startFlow(userId, chatId, match[1] as CmsType); return true; }
  if (command.startsWith("/archive ")) {
    const [, collection, id] = command.split(/\s+/);
    if (!collection || !id) { await sendText(chatId, "ব্যবহার: /archive <collection> <id>"); return true; }
    await archiveCmsRecord(collection as any, id, "telegram:" + userId);
    await sendText(chatId, "🗄️ বিষয়টি আর্কাইভ করা হয়েছে।"); return true;
  }
  return false;
}

export async function getCmsStats() {
  const db = getAdminDb(); const result: Record<string, number> = {};
  for (const name of Object.values(collections)) result[name] = (await db.collection(name).get()).size;
  return result;
}
