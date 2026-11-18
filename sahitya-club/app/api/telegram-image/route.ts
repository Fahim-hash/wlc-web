// app/api/telegram-image/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const fileId = new URL(request.url).searchParams.get("fileId");

    if (!botToken || !fileId) {
      return NextResponse.json({ error: "Invalid image request." }, { status: 400 });
    }

    const fileRes = await fetch(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${encodeURIComponent(fileId)}`,
      { cache: "no-store" }
    );
    const fileData = await fileRes.json();

    if (!fileData.ok || !fileData.result?.file_path) {
      return NextResponse.json({ error: "Telegram file unavailable." }, { status: 404 });
    }

    const imageRes = await fetch(
      `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`,
      { cache: "no-store" }
    );

    if (!imageRes.ok || !imageRes.body) {
      return NextResponse.json({ error: "Image download failed." }, { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", imageRes.headers.get("content-type") || "image/jpeg");
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400");

    const contentLength = imageRes.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new Response(imageRes.body, { status: 200, headers });
  } catch (error) {
    console.error("Telegram image proxy error:", error);
    return NextResponse.json({ error: "Image unavailable." }, { status: 500 });
  }
}
