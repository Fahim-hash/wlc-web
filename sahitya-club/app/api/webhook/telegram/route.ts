// app/api/webhook/telegram/route.ts
import { NextResponse } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

type TelegramPhoto = {
  file_id: string;
  file_unique_id?: string;
  width?: number;
  height?: number;
};

type TelegramPost = {
  message_id: number;
  date?: number;
  chat?: { id?: number | string; username?: string; title?: string };
  document?: {
    file_id: string;
    file_unique_id?: string;
    file_name?: string;
    mime_type?: string;
  };
  photo?: TelegramPhoto[];
  caption?: string;
  media_group_id?: string;
};

function getWebhookSecret(request: Request) {
  return (
    request.headers.get("x-telegram-bot-api-secret-token") ||
    request.headers.get("x-telegram-webhook-secret")
  );
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
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (expectedSecret) {
      const receivedSecret = getWebhookSecret(request);
      if (!receivedSecret || receivedSecret !== expectedSecret) {
        return NextResponse.json({ ok: false }, { status: 401 });
      }
    }

    const body = await request.json();
    const post = (body.channel_post || body.edited_channel_post) as TelegramPost | undefined;

    if (!post?.message_id) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const image = getImageFromPost(post);
    if (!image) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const chatId = post.chat?.id ?? process.env.TELEGRAM_CHAT_ID;
    const documentId = `${String(chatId)}_${post.message_id}`;

    await setDoc(
      doc(collection(db, "telegram_media"), documentId),
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
