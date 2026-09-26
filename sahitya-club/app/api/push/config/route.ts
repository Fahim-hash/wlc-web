import { NextResponse } from "next/server";
import { getPublicVapidKey } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({
      enabled: true,
      publicKey: getPublicVapidKey(),
    });
  } catch {
    return NextResponse.json(
      { enabled: false, publicKey: null },
      { status: 503 }
    );
  }
}
