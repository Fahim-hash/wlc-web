import { getAdminDb } from "@/lib/firebase-admin";
import { writeCmsRecord, archiveCmsRecord, listCollection } from "@/lib/cms";

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
  if (!result.ok) throw new Error(`Telegram ${method} failed`);
  return result;
}

async function sendText(chatId: number | string, text: string) {
  return telegramApi("sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
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

const commands: Record<string, string> = {
  event: "events",
  member: "members",
  achievement: "achievements",
  announcement: "announcements",
  writing: "writing",
  knowledge: "kothasokhi_knowledge",
};

export async function handleTelegramCmsCommand(
  userId: number,
  chatId: number | string,
  text: string
) {
  const trimmed = text.trim();

  if (trimmed === "/cms") {
    await sendText(chatId,
      "WLC CMS CONTROL HUB\n\n" +
      "Create:\n" +
      "/event title | date | time | venue | description | publish\n" +
      "/member name | role | batch | bio | publish\n" +
      "/achievement title | date | category | description | publish\n" +
      "/announcement title | message | /link | publish\n" +
      "/writing title | author | category | body | publish\n" +
      "/knowledge title | answer | source | publish\n\n" +
      "Manage:\n" +
      "/cmslist <collection>\n" +
      "/archive <collection> <id>\n\n" +
      "Without 'publish', records stay DRAFT."
    );
    return true;
  }

  if (trimmed.startsWith("/cmslist ")) {
    const collection = trimmed.slice(9).trim();
    if (!schemas[collection]) {
      await sendText(chatId, "Unsupported collection. Use events, members, achievements, announcements, writing, or kothasokhi_knowledge.");
      return true;
    }
    const records = await listCollection(collection as any, 20);
    if (!records.length) {
      await sendText(chatId, "No records in " + collection + ".");
      return true;
    }
    const lines = records.map((item: any) =>
      "• " + item.id + " — " + (item.title || item.name || "Untitled") + " [" + (item.status || "DRAFT") + "]"
    );
    await sendText(chatId, collection + " (latest 20)\n\n" + lines.join("\n"));
    return true;
  }

  if (trimmed.startsWith("/archive ")) {
    const parts = trimmed.slice(9).trim().split(/\s+/);
    if (parts.length !== 2 || !schemas[parts[0]]) {
      await sendText(chatId, "Usage: /archive <collection> <id>");
      return true;
    }
    await archiveCmsRecord(parts[0] as any, parts[1], "telegram:" + userId);
    await sendText(chatId, "🗄️ Archived " + parts[0] + " / " + parts[1]);
    return true;
  }

  const match = Object.keys(commands).find((command) =>
    trimmed === "/" + command || trimmed.startsWith("/" + command + " ")
  );
  if (!match) return false;

  const collection = commands[match];
  const raw = trimmed.slice(match.length + 1).trim();

  if (!raw) {
    await sendText(chatId, "Format:\n/" + match + " " + schemas[collection].join(" | ") + " | publish");
    return true;
  }

  const parts = raw.split("|").map((part) => part.trim());
  const publish = parts.at(-1)?.toLowerCase() === "publish";
  if (publish) parts.pop();

  if (parts.length < schemas[collection].length) {
    await sendText(chatId, "⚠️ Missing fields.\n\n/" + match + " " + schemas[collection].join(" | ") + " | publish");
    return true;
  }

  const data: Record<string, unknown> = {};
  schemas[collection].forEach((field, index) => {
    data[field] = parts[index] || "";
  });
  data.status = publish ? "PUBLISHED" : "DRAFT";
  data.sortOrder = Date.now();

  const result = await writeCmsRecord(collection as any, data, undefined, "telegram:" + userId);
  await sendText(chatId,
    "✅ " + collection + " created\n\n" +
    "ID: " + result.id + "\n" +
    "Status: " + String(data.status) + "\n\n" +
    "Website reads PUBLISHED records automatically."
  );
  return true;
}

export async function getCmsStats() {
  const db = getAdminDb();
  const names = Object.keys(schemas);
  const result: Record<string, number> = {};
  for (const name of names) {
    const snapshot = await db.collection(name).get();
    result[name] = snapshot.size;
  }
  return result;
}
