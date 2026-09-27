import { NextResponse } from "next/server";
import {
  archiveCmsRecord,
  assertCollection,
  listCollection,
  listPublished,
  writeCmsRecord,
} from "@/lib/cms";

function authorized(request: Request) {
  const expected = process.env.TELEGRAM_CONTROL_SECRET?.trim();
  if (!expected) return false;
  return request.headers.get("x-wlc-control-secret") === expected;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ collection: string }> }
) {
  try {
    const { collection } = await context.params;
    assertCollection(collection);
    const url = new URL(request.url);
    const admin = url.searchParams.get("admin") === "1";
    if (admin && !authorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = admin
      ? await listCollection(collection)
      : await listPublished(collection);
    return NextResponse.json({ success: true, data }, {
      headers: { "Cache-Control": admin ? "no-store" : "s-maxage=30, stale-while-revalidate=120" },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "CMS read failed" },
      { status: 400 }
    );
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ collection: string }> }
) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collection } = await context.params;
    assertCollection(collection);
    const body = await request.json();
    const data = body?.data && typeof body.data === "object" ? body.data : body;
    const result = await writeCmsRecord(
      collection,
      data,
      typeof body?.id === "string" ? body.id : undefined,
      body?.actor || "telegram"
    );
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "CMS write failed" },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ collection: string }> }
) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collection } = await context.params;
    assertCollection(collection);
    const body = await request.json();
    if (!body?.id) throw new Error("Record id is required");
    const result = await writeCmsRecord(collection, body.data || {}, body.id, body.actor || "telegram");
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "CMS update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ collection: string }> }
) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { collection } = await context.params;
    assertCollection(collection);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) throw new Error("Record id is required");
    await archiveCmsRecord(collection, id, "telegram");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "CMS archive failed" },
      { status: 400 }
    );
  }
}
