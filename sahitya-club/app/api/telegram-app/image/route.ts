import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Not found", { status: 404 });
  try {
    const snap = await getAdminDb().collection("telegram_media").doc(id).get();
    if (!snap.exists) return new NextResponse("Not found", { status: 404 });
    const item = snap.data()!;
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    if (!token || !item.fileId) return new NextResponse("Media unavailable", { status: 503 });
    const tgResponse = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(String(item.fileId))}`, { cache: "no-store" });
    const tg = await tgResponse.json();
    if (!tgResponse.ok || !tg.ok || !tg.result?.file_path) return new NextResponse("Telegram media unavailable", { status: 502 });
    const mediaResponse = await fetch(`https://api.telegram.org/file/bot${token}/${tg.result.file_path}`, { cache: "no-store" });
    if (!mediaResponse.ok) return new NextResponse("Telegram media unavailable", { status: 502 });
    return new NextResponse(await mediaResponse.arrayBuffer(), {
      headers: {
        "Content-Type": String(item.mimeType || mediaResponse.headers.get("content-type") || "image/jpeg"),
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("Telegram media proxy failed:", e);
    return new NextResponse("Media unavailable", { status: 500 });
  }
}
