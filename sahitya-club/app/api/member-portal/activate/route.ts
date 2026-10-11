import { NextResponse } from "next/server";
import { activateMemberAccount } from "@/lib/member-portal";
export const runtime = "nodejs";
export async function POST(request: Request) {
 try { const body = await request.json(); const member = await activateMemberAccount({ token: String(body?.token || ""), username: String(body?.username || ""), password: String(body?.password || "") }); return NextResponse.json({ success: true, member }); }
 catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Activation failed." }, { status: 400 }); }
}
