import { NextResponse } from "next/server";
import { listPublished } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await listPublished("events", 50);
    const event = events.find((item: any) => item.title && item.status === "PUBLISHED") || null;

    return NextResponse.json({
      event: event
        ? {
            title: String(event.title).trim().slice(0, 100),
            date: event.date ?? null,
          }
        : null,
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Discord presence event lookup failed:", error);
    return NextResponse.json({ event: null }, { status: 200 });
  }
}
