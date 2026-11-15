import { NextResponse } from "next/server";
import { listPublished } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await listPublished("events", 50);
    const event = events
      .filter((item: any) => item.title && item.status === "PUBLISHED")
      .sort((a: any, b: any) => {
        const dateA = new Date(a.date || a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      })[0] || null;

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
