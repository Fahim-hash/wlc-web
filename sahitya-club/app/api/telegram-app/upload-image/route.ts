import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getVerifiedTelegramMiniAppAdmin } from "@/lib/telegram-mini-app-auth-v2";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const admin = getVerifiedTelegramMiniAppAdmin(request);
  if (!admin) return NextResponse.json({ ok: false, error: "Telegram admin verification failed." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    const target = String(form.get("target") || "image");
    if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "Choose an image first." }, { status: 400 });
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      return NextResponse.json({ ok: false, error: "Use a JPG, PNG, WEBP, or GIF image." }, { status: 400 });
    }
    if (file.size <= 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Image must be smaller than 5 MB." }, { status: 400 });
    }
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    if (!token || !chatId) return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be configured in Vercel." }, { status: 503 });

    const upload = new FormData();
    upload.append("chat_id", chatId);
    upload.append("photo", new Blob([await file.arrayBuffer()], { type: file.type }), file.name.slice(0, 150));
    upload.append("caption", `🖼️ WLC Control Hub • ${target === "notice" ? "Notification image" : target === "cms" ? "Event / CMS cover" : "Image"}\nUploaded by Telegram admin: ${String(admin.id)}\nFile: ${file.name.slice(0, 180)}`);
    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", body: upload, cache: "no-store" });
    const tg = await tgResponse.json();
    if (!tgResponse.ok || !tg.ok || !tg.result?.photo?.length) {
      console.error("Telegram image send failed:", tg);
      return NextResponse.json({ ok: false, error: tg.description || "Could not save image to the configured Telegram chat. Check that the bot can post there." }, { status: 502 });
    }

    const sent = tg.result;
    const photo = sent.photo[sent.photo.length - 1];
    const id = crypto.randomUUID();
    const imageUrl = `${new URL(request.url).origin}/api/telegram-app/image?id=${id}`;
    await getAdminDb().collection("telegram_media").doc(id).set({
      fileId: photo.file_id,
      uniqueFileId: photo.file_unique_id || "",
      messageId: sent.message_id,
      chatId: String(sent.chat?.id || chatId),
      mimeType: file.type,
      caption: String(sent.caption || ""),
      imageUrl,
      originalName: file.name.slice(0, 180),
      size: file.size,
      source: "telegram-mini-app",
      uploadedBy: String(admin.id),
      target,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await getAdminDb().collection("audit_logs").add({ action: "MINI_APP_TELEGRAM_IMAGE_UPLOAD", actor: "telegram:" + admin.id, mediaId: id, chatId: String(sent.chat?.id || chatId), messageId: sent.message_id, size: file.size, target, createdAt: Date.now() });
    return NextResponse.json({ ok: true, imageUrl, telegramFileId: photo.file_id, messageId: sent.message_id, name: file.name, size: file.size });
  } catch (e) {
    console.error("Telegram Mini App image upload failed:", e);
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "Image upload failed." }, { status: 500 });
  }
}
