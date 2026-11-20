import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated } from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Choose a banner image first." }, { status: 400 });
    }
    if (file.type !== "image/jpeg" || file.size <= 0 || file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "Upload a cropped JPG banner smaller than 5 MB." }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
    if (!token || !chatId) {
      return NextResponse.json({ message: "Banner storage is not configured. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel." }, { status: 503 });
    }

    const upload = new FormData();
    upload.append("chat_id", chatId);
    upload.append("photo", new Blob([await file.arrayBuffer()], { type: file.type }), "wlc-event-banner.jpg");
    upload.append("caption", "WLC Event Ticketing • Event banner");
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      body: upload,
      cache: "no-store",
    });
    const telegram = await telegramResponse.json();
    if (!telegramResponse.ok || !telegram.ok || !telegram.result?.photo?.length) {
      console.error("WLC event banner Telegram upload failed:", telegram);
      return NextResponse.json({ message: telegram.description || "Could not store the banner in the configured media chat." }, { status: 502 });
    }

    const sent = telegram.result;
    const photo = sent.photo[sent.photo.length - 1];
    const id = crypto.randomUUID();
    const imageUrl = `${new URL(request.url).origin}/api/telegram-app/image?id=${id}`;
    await getAdminDb().collection("telegram_media").doc(id).set({
      fileId: photo.file_id,
      uniqueFileId: photo.file_unique_id || "",
      messageId: sent.message_id,
      chatId: String(sent.chat?.id || chatId),
      mimeType: "image/jpeg",
      caption: String(sent.caption || ""),
      imageUrl,
      originalName: "wlc-event-banner.jpg",
      size: file.size,
      source: "ticketing-event-banner",
      target: "ticketing",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    await getAdminDb().collection("audit_logs").add({
      action: "TICKETING_EVENT_BANNER_UPLOAD",
      actor: "memberhub-admin",
      mediaId: id,
      chatId: String(sent.chat?.id || chatId),
      messageId: sent.message_id,
      size: file.size,
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("WLC event banner upload failed:", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Unable to upload the event banner.",
    }, { status: 500 });
  }
}
