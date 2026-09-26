import { NextResponse } from "next/server";
import { sendGlobalPushNotification } from "@/lib/push";

export const dynamic = "force-dynamic";

function getAuthorizedAdminIds() {
  return (process.env.TELEGRAM_ADMIN_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function isAuthorized(request: Request) {
  const secret = process.env.TELEGRAM_CONTROL_SECRET;
  const received = request.headers.get("x-wlc-control-secret");

  return Boolean(secret && received && received === secret);
}

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (getAuthorizedAdminIds().length === 0) {
      return NextResponse.json(
        { error: "TELEGRAM_ADMIN_IDS is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const url = typeof body?.url === "string" && body.url.startsWith("/") ? body.url : "/";

    if (!title || !message || title.length > 80 || message.length > 300) {
      return NextResponse.json({ error: "Invalid notification." }, { status: 400 });
    }

    const result = await sendGlobalPushNotification(title, message, url);

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Global push send error:", error);
    return NextResponse.json(
      { error: "Global push could not be sent." },
      { status: 500 }
    );
  }
}
