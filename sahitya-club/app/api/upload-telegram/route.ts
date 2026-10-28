import { NextResponse } from "next/server";

// Bulk Telegram uploads are intentionally disabled.
export async function POST() {
  return NextResponse.json(
    { error: "এই আপলোড সিস্টেমটি বর্তমানে বন্ধ আছে।" },
    { status: 410 }
  );
}
