import { NextResponse } from "next/server";
import { currentMember } from "@/lib/member-portal";
export const runtime = "nodejs";
export async function GET() {
 const member = await currentMember();
 if (!member) return NextResponse.json({ authenticated: false }, { status: 401 });
 return NextResponse.json({ authenticated: true, member });
}
