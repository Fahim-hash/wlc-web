// app/api/fetch-telegram/route.ts
import { NextResponse } from "next/server";
import { collection, getDocs, orderBy, query } from "firebase/firestore/lite";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

type TelegramMedia = {
  messageId: number;
  fileId: string;
  fileName?: string;
  mimeType?: string;
  caption?: string;
  createdAt?: number;
};

export async function GET() {
  try {
    const mediaQuery = query(
      collection(db, "telegram_media"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(mediaQuery);

    const images = snapshot.docs
      .map((doc) => {
        const data = doc.data() as TelegramMedia;
        if (!data.fileId || !data.messageId) return null;

        return {
          id: doc.id,
          messageId: data.messageId,
          fileId: data.fileId,
          fileName: data.fileName ?? "telegram-image",
          caption: data.caption ?? "",
          // IMPORTANT: never store Telegram's temporary file URL.
          // The proxy resolves a fresh file_path on every request.
          url: `/api/telegram-image?fileId=${encodeURIComponent(data.fileId)}`,
          createdAt: data.createdAt ?? 0,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { success: true, images },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Fetch Telegram media error:", error);
    return NextResponse.json(
      { error: "টেলিগ্রাম অ্যালবাম লোড করতে ব্যর্থ।" },
      { status: 500 }
    );
  }
}
