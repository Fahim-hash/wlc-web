import { NextResponse } from "next/server";
import { listPublished } from "@/lib/cms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PublishedEvent = {
  id: string;
  title?: unknown;
  status?: string;
  date?: string | number | null;
  updatedAt?: string | number | null;
  createdAt?: string | number | null;
};

export async function GET() {
  try {
    const events = await listPublished("events", 50) as unknown as PublishedEvent[];
    const event = events
      .filter((item) => typeof item.title === "string" && item.title.trim() && item.status === "PUBLISHED")
      .sort((a, b) => {
        const dateA = new Date(String(a.date ?? a.updatedAt ?? a.createdAt ?? 0)).getTime();
        const dateB = new Date(String(b.date ?? b.updatedAt ?? b.createdAt ?? 0)).getTime();
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
