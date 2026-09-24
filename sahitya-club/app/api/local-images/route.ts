import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const directory = path.join(process.cwd(), "public", "pic");
    if (!fs.existsSync(directory)) return NextResponse.json({ images: [] });
    const images = fs.readdirSync(directory).filter((file) => /\\.(png|jpe?g|webp|gif)$/i.test(file));
    return NextResponse.json({ images }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Local album images error:", error);
    return NextResponse.json({ images: [] });
  }
}
