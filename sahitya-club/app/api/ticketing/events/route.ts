import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated } from "@/lib/member-management";
import { publicEvent, slugifyEventTitle, type TicketingEventStatus } from "@/lib/ticketing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDhakaDate(value: string) {
  return new Date(/(?:Z|[+-][0-9]{2}:?[0-9]{2})$/i.test(value) ? value : `${value}+06:00`);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const admin = await isMemberAdminAuthenticated();
    const snapshot = await getAdminDb().collection("ticketing_events").limit(100).get();
    const events = snapshot.docs
      .map((doc) => ({ ...(doc.data() as Record<string, unknown>), id: doc.id }))
      .filter((event) => admin || event.status === "PUBLISHED")
      .filter((event) => !slug || event.slug === slug)
      .map(publicEvent)
      .sort((a, b) => String(a.startAt).localeCompare(String(b.startAt)));

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ message: "Unable to load events." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const summary = typeof body?.summary === "string" ? body.summary.trim() : "";
    const description = typeof body?.description === "string" ? body.description.trim() : "";
    const venue = typeof body?.venue === "string" ? body.venue.trim() : "";
    const startAt = typeof body?.startAt === "string" ? body.startAt : "";
    const endAt = typeof body?.endAt === "string" && body.endAt ? body.endAt : null;
    const capacity = Number(body?.capacity);
    const ticketPrice = Number(body?.ticketPrice);
    const status: TicketingEventStatus = body?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

    if (title.length < 4 || title.length > 120) {
      return NextResponse.json({ message: "Event title must be 4–120 characters." }, { status: 400 });
    }
    if (venue.length < 2 || venue.length > 180) {
      return NextResponse.json({ message: "Please enter a valid venue." }, { status: 400 });
    }
    if (!Number.isFinite(parseDhakaDate(startAt).getTime())) {
      return NextResponse.json({ message: "Please provide a valid event date and time." }, { status: 400 });
    }
    if (endAt && (!Number.isFinite(parseDhakaDate(endAt).getTime()) || parseDhakaDate(endAt).getTime() <= parseDhakaDate(startAt).getTime())) {
      return NextResponse.json({ message: "Event end time must be after its start time." }, { status: 400 });
    }
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 100000) {
      return NextResponse.json({ message: "Capacity must be between 1 and 100,000." }, { status: 400 });
    }
    if (!Number.isInteger(ticketPrice) || ticketPrice < 0 || ticketPrice > 10000000) {
      return NextResponse.json({ message: "Ticket price must be a valid BDT amount." }, { status: 400 });
    }

    const normalizedStartTime = parseDhakaDate(startAt).getTime();
    if (status === "PUBLISHED" && normalizedStartTime <= Date.now()) {
      return NextResponse.json({ message: "A published event must start in the future." }, { status: 400 });
    }

    const slug = slugifyEventTitle(title) || `event-${Date.now().toString(36)}`;

    const db = getAdminDb();
    const eventRef = db.collection("ticketing_events").doc(slug);
    const now = Date.now();
    const normalizedStart = parseDhakaDate(startAt).toISOString();
    const normalizedEnd = endAt ? parseDhakaDate(endAt).toISOString() : null;

    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(eventRef);
      if (existing.exists) throw new Error("An event with this URL already exists. Change the title slightly.");
      transaction.create(eventRef, {
        slug,
        title,
        summary,
        description,
        venue,
        startAt: normalizedStart,
        endAt: normalizedEnd,
        capacity,
        ticketPrice,
        currency: "BDT",
        status,
        reservedCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy: "memberhub",
      });
    });

    return NextResponse.json({
      success: true,
      event: { id: slug, slug, title, summary, description, venue, startAt: normalizedStart, endAt: normalizedEnd, capacity, ticketPrice, currency: "BDT", status, reservedCount: 0 },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create event." },
      { status: 400 }
    );
  }
}
