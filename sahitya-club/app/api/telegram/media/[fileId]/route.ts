export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Telegram is not configured" }, { status: 503 });
    }

    const { fileId } = await params;
    const decodedFileId = decodeURIComponent(fileId);

    const fileResponse = await fetch(
      `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(decodedFileId)}`,
      { cache: "no-store" }
    );
    const fileResult = await fileResponse.json();

    if (!fileResult.ok || !fileResult.result?.file_path) {
      return NextResponse.json({ error: "Telegram media not found" }, { status: 404 });
    }

    const mediaResponse = await fetch(
      `https://api.telegram.org/file/bot${token}/${fileResult.result.file_path}`,
      { cache: "force-cache" }
    );

    if (!mediaResponse.ok) {
      return NextResponse.json({ error: "Telegram media could not be loaded" }, { status: 502 });
    }

    const contentType =
      mediaResponse.headers.get("content-type") ||
      (fileResult.result.file_path.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");

    return new Response(await mediaResponse.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Telegram media proxy error:", error);
    return NextResponse.json({ error: "Media could not be loaded" }, { status: 500 });
  }
}
