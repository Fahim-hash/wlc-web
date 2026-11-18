import { getAdminDb } from "@/lib/firebase-admin";

type CertificateKind = "panel" | "membership" | "event";
type TelegramDocument = { file_id: string; file_unique_id?: string; file_name?: string; mime_type?: string; file_size?: number };
const kinds: Record<CertificateKind, string> = { panel: "Panel Member Certificate", membership: "Membership Certificate", event: "Event Certificate" };

async function telegramApi(method: string, payload: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  const response = await fetch("https://api.telegram.org/bot" + token + "/" + method, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(result.description || ("Telegram " + method + " failed"));
  return result;
}
async function sendText(chatId: number | string, text: string, keyboard?: unknown[][]) {
  return telegramApi("sendMessage", { chat_id: chatId, text, disable_web_page_preview: true, ...(keyboard ? { reply_markup: { inline_keyboard: keyboard } } : {}) });
}
function menuKeyboard() { return [[{ text: "🛡️ Panel Member", callback_data: "wlc:cert:upload:panel" }, { text: "👤 Membership", callback_data: "wlc:cert:upload:membership" }], [{ text: "🎟️ Event Certificate", callback_data: "wlc:cert:upload:event" }], [{ text: "📋 Current Templates", callback_data: "wlc:cert:list" }]]; }

export async function handleTelegramCertificateCallback(userId: number, chatId: number | string, action: string) {
  if (action === "wlc:cert:menu") {
    await getAdminDb().collection("telegram_certificate_sessions").doc(String(userId)).delete().catch(() => undefined); await sendText(chatId, "📜 WLC Certificate Templates\n\nযে blank PDF template upload বা replace করতে চান, সেটি বেছে নিন।", menuKeyboard()); return true; }
  if (action === "wlc:cert:list") {
    const snap = await getAdminDb().collection("certificate_templates").get();
    const byKind = new Map(snap.docs.filter((doc) => doc.data().active === true).map((doc) => [String(doc.data().kind), doc.data()]));
    const lines = (Object.keys(kinds) as CertificateKind[]).map((kind) => { const item = byKind.get(kind); return item ? "✅ " + kinds[kind] + "\n   File: " + String(item.fileName || "certificate.pdf") + " · v" + String(item.version || 1) : "▫️ " + kinds[kind] + "\n   Template not uploaded"; });
    await sendText(chatId, "📋 Active WLC Templates\n\n" + lines.join("\n\n"), [[{ text: "⬅️ Back", callback_data: "wlc:cert:menu" }]]); return true;
  }
  const match = action.match(/^wlc:cert:upload:(panel|membership|event)$/);
  if (!match) return false;
  const kind = match[1] as CertificateKind;
  await getAdminDb().collection("telegram_certificate_sessions").doc(String(userId)).set({ userId: String(userId), chatId: String(chatId), state: "awaiting_pdf", kind, updatedAt: Date.now() });
  await sendText(chatId, "📤 Upload " + kinds[kind] + "\n\nএখন blank certificate template-টি Telegram-এ PDF document হিসেবে পাঠান। Photo হিসেবে পাঠাবেন না।\n\n• শুধু PDF গ্রহণ করা হবে\n• নতুন template active হলে আগের version history-তে থাকবে\n• Cancel করতে /cancel লিখুন", [[{ text: "❌ Cancel upload", callback_data: "wlc:cert:menu" }]]);
  return true;
}
export async function handleTelegramCertificateCommand(chatId: number | string) { await sendText(chatId, "📜 WLC Certificate Template Manager\n\nTelegram থেকেই Panel, Membership ও Event certificate-এর PDF template upload এবং replace করুন।", menuKeyboard()); }

export async function handleTelegramCertificateMessage(userId: number, chatId: number | string, message: { text?: string; document?: TelegramDocument }) {
  const db = getAdminDb(); const sessionRef = db.collection("telegram_certificate_sessions").doc(String(userId)); const sessionSnap = await sessionRef.get();
  if (!sessionSnap.exists) return false;
  const session = sessionSnap.data() as { state?: string; kind?: CertificateKind };
  if (message.text?.trim() === "/cancel") { await sessionRef.delete(); await sendText(chatId, "❌ Certificate template upload বাতিল করা হয়েছে।"); return true; }
  if (session.state !== "awaiting_pdf" || !session.kind || !(session.kind in kinds)) { await sessionRef.delete(); return false; }
  const document = message.document;
  if (!document) { await sendText(chatId, "⚠️ PDF-টি Telegram-এ document/file হিসেবে পাঠান, অথবা /cancel লিখুন।"); return true; }
  const fileName = (document.file_name || "").trim(); const mimeType = (document.mime_type || "").toLowerCase();
  if (mimeType !== "application/pdf" && !fileName.toLowerCase().endsWith(".pdf")) { await sendText(chatId, "⚠️ এই ফাইলটি PDF মনে হচ্ছে না। .pdf document পাঠান।"); return true; }
  if (typeof document.file_size === "number" && document.file_size > 20 * 1024 * 1024) { await sendText(chatId, "⚠️ ফাইলটি ২০ MB-এর বেশি। ছোট PDF export করে আবার পাঠান।"); return true; }
  const kind = session.kind; const templateRef = db.collection("certificate_templates").doc(kind); const historyRef = templateRef.collection("versions").doc(); const now = Date.now();
  await db.runTransaction(async (transaction) => {
    const current = await transaction.get(templateRef); const previous = current.exists ? current.data() : undefined; const version = Number(previous?.version || 0) + 1;
    const templateData = { kind, title: kinds[kind], fileId: document.file_id, fileUniqueId: document.file_unique_id || null, fileName: fileName || (kind + "-certificate-template.pdf"), mimeType: "application/pdf", fileSize: document.file_size || null, storageProvider: "telegram", version, active: true, uploadedByTelegramId: String(userId), uploadedAt: now, updatedAt: now };
    if (previous) transaction.set(historyRef, { ...previous, archivedAt: now, replacedByVersion: version });
    transaction.set(templateRef, templateData);
  });
  await sessionRef.delete(); const saved = await templateRef.get();
  await sendText(chatId, "✅ Template saved\n\nType: " + kinds[kind] + "\nFile: " + (fileName || "certificate-template.pdf") + "\nVersion: v" + String(saved.data()?.version || 1) + "\n\nFirestore-এ template metadata ও Telegram file reference সংরক্ষিত হয়েছে।", [[{ text: "📜 Manage Templates", callback_data: "wlc:cert:menu" }]]);
  return true;
}
