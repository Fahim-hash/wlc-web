import { NextResponse } from "next/server";

// Public writing submissions are temporarily disabled.
// Keep this endpoint closed as well so direct API calls cannot bypass the UI.
export async function POST() {
  return NextResponse.json(
    { message: "ওয়েবসাইটের উন্মুক্ত লেখা জমা দেওয়ার পোর্টালটি আপাতত বন্ধ।" },
    { status: 410 }
  );
}
