import { getAdminDb } from "@/lib/firebase-admin";
import { writeCmsRecord, archiveCmsRecord, listCollection } from "@/lib/cms";

async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), cache: "no-store",
  });
  const result = await response.json();
  if (!result.ok) throw new Error(`Telegram ${method} failed`);
  return result;
}

async function sendText(chatId: number | string, text: string, keyboard?: unknown[][]) {
  return telegramApi("sendMessage", {
    chat_id: chatId, text, disable_web_page_preview: true,
    ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}),
  });
}

const schemas: Record<string, string[]> = {
  events: ["title", "date", "time", "venue", "description"],
  members: ["name", "role", "batch", "bio"],
  achievements: ["title", "date", "category", "description"],
  announcements: ["title", "message", "link"],
  writing: ["title", "author", "category", "body"],
  kothasokhi_knowledge: ["title", "answer", "source"],
};

const labels: Record<string, string> = {
  events: "📅 Events", members: "👥 Members", achievements: "🏆 Achievements",
  announcements: "📢 Announcements", writing: "✍️ Writing", kothasokhi_knowledge: "🤖 Kothasokhi",
};

const commands: Record<string, string> = {
  event: "events", member: "members", achievement: "achievements",
  announcement: "announcements", writing: "writing", knowledge: "kothasokhi_knowledge",
};

export async function sendCmsMenu(chatId: number | string) {
  return sendText(chatId,
    "✨ WLC Content Center\n\nChoose what you want to manage. You can create content, view recent entries, or archive an old one.",
    [
      [{ text: "➕ New Event", callback_data: "wlc:cms:new:event" }, { text: "➕ New Member", callback_data: "wlc:cms:new:member" }],
      [{ text: "🏆 Achievement", callback_data: "wlc:cms:new:achievement" }, { text: "📢 Announcement", callback_data: "wlc:cms:new:announcement" }],
      [{ text: "✍️ Writing", callback_data: "wlc:cms:new:writing" }, { text: "🤖 Knowledge", callback_data: "wlc:cms:new:knowledge" }],
      [{ text: "📋 Recent Content", callback_data: "wlc:cms:list" }, { text: "ℹ️ How it works", callback_data: "wlc:cms:help" }],
      [{ text: "🏠 Main Menu", callback_data: "wlc:cancel" }],
    ]
  );
}

async function sendCommandHelp(chatId: number | string, command: string) {
  const collection = commands[command];
  const fields = schemas[collection];
  await sendText(chatId,
    `➕ ${labels[collection]}\n\nSend one message in this format:\n\n/${command} ${fields.join(" | ")} | publish\n\nThe final “| publish” is optional. Without it, the item stays private as a draft.\n\nExample:\n/${command} Example title | 27 Sep 2026 | 5:00 PM | WLC | Short description | publish`,
    [[{ text: "⬅️ Content Center", callback_data: "wlc:cms:menu" }]]
  );
}

export async function handleTelegramCmsCallback(userId: number, chatId: number | string, action: string) {
  if (!action.startsWith("wlc:cms:")) return false;
  if (action === "wlc:cms:menu") { await sendCmsMenu(chatId); return true; }
  if (action === "wlc:cms:help") {
    await sendText(chatId,
      "ℹ️ Content Center\n\n• Create content from the buttons below\n• Add “| publish” to make it visible on the website\n• Without publish, it remains a draft\n• Recent Content shows the latest entries\n• Old entries can be archived with /archive <collection> <id>",
      [[{ text: "➕ Create Something", callback_data: "wlc:cms:menu" }]]
    );
    return true;
  }
  if (action === "wlc:cms:list") {
    const collections = Object.keys(schemas);
    const records = await Promise.all(collections.map(async (collection) => ({ collection, rows: await listCollection(collection as any, 5) })));
    const lines = records.flatMap(({ collection, rows }) =>
      rows.slice(0, 3).map((item: any) => `${labels[collection]} — ${item.title || item.name || "Untitled"} [${item.status || "DRAFT"}]`)
    );
    await sendText(chatId, lines.length ? "📋 Recent Content\n\n" + lines.join("\n") : "📋 Recent Content\n\nNo content yet.",
      [[{ text: "⬅️ Content Center", callback_data: "wlc:cms:menu" }]]);
    return true;
  }
  const match = action.match(/^wlc:cms:new:(event|member|achievement|announcement|writing|knowledge)$/);
  if (match) { await sendCommandHelp(chatId, match[1]); return true; }
  return false;
}

export async function handleTelegramCmsCommand(userId: number, chatId: number | string, text: string) {
  const trimmed = text.trim();
  if (trimmed === "/cms") { await sendCmsMenu(chatId); return true; }

  if (trimmed.startsWith("/cmslist ")) {
    const collection = trimmed.slice(9).trim();
    if (!schemas[collection]) { await sendText(chatId, "⚠️ Unknown section. Use /cms to open the Content Center."); return true; }
    const records = await listCollection(collection as any, 20);
    if (!records.length) {
      await sendText(chatId, `📋 ${labels[collection]}\n\nNo entries yet.`, [[{ text: "⬅️ Content Center", callback_data: "wlc:cms:menu" }]]);
      return true;
    }
    const lines = records.map((item: any) => "• " + item.id + " — " + (item.title || item.name || "Untitled") + " [" + (item.status || "DRAFT") + "]");
    await sendText(chatId, labels[collection] + " — latest 20\n\n" + lines.join("\n"), [[{ text: "⬅️ Content Center", callback_data: "wlc:cms:menu" }]]);
    return true;
  }

  if (trimmed.startsWith("/archive ")) {
    const parts = trimmed.slice(9).trim().split(/\s+/);
    if (parts.length !== 2 || !schemas[parts[0]]) { await sendText(chatId, "Usage: /archive <collection> <id>"); return true; }
    await archiveCmsRecord(parts[0] as any, parts[1], "telegram:" + userId);
    await sendText(chatId, "🗄️ Archived successfully.\n\n" + labels[parts[0]] + " / " + parts[1], [[{ text: "⬅️ Content Center", callback_data: "wlc:cms:menu" }]]);
    return true;
  }

  const match = Object.keys(commands).find((command) => trimmed === "/" + command || trimmed.startsWith("/" + command + " "));
  if (!match) return false;
  const collection = commands[match];
  const raw = trimmed.slice(match.length + 1).trim();
  if (!raw) { await sendCommandHelp(chatId, match); return true; }

  const parts = raw.split("|").map((part) => part.trim());
  const publish = parts.at(-1)?.toLowerCase() === "publish";
  if (publish) parts.pop();
  if (parts.length < schemas[collection].length) {
    await sendText(chatId, "⚠️ Some fields are missing.\n\n" + schemas[collection].join(" | "),
      [[{ text: "⬅️ Content Center", callback_data: "wlc:cms:menu" }]]);
    return true;
  }

  const data: Record<string, unknown> = {};
  schemas[collection].forEach((field, index) => { data[field] = parts[index] || ""; });
  data.status = publish ? "PUBLISHED" : "DRAFT";
  data.sortOrder = Date.now();

  const result = await writeCmsRecord(collection as any, data, undefined, "telegram:" + userId);
  await sendText(chatId,
    "✅ Saved successfully\n\n" + labels[collection] + "\nID: " + result.id + "\nStatus: " + String(data.status) + "\n\n" +
    (publish ? "It is now visible on the website." : "It is saved as a draft and is not public yet."),
    [[{ text: "➕ Add Another", callback_data: "wlc:cms:new:" + match }, { text: "📋 Recent", callback_data: "wlc:cms:list" }]]
  );
  return true;
}

export async function getCmsStats() {
  const db = getAdminDb();
  const result: Record<string, number> = {};
  for (const name of Object.keys(schemas)) result[name] = (await db.collection(name).get()).size;
  return result;
}
