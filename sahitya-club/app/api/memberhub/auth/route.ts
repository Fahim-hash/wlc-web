import { NextResponse } from "next/server";
import {
  createMemberAdminSession,
  isMemberAdminSecret,
  MEMBER_ADMIN_COOKIE,
  isMemberAdminAuthenticated,
} from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ authenticated: await isMemberAdminAuthenticated() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const gatewayKey = typeof body?.gatewayKey === "string" ? body.gatewayKey.trim() : "";

    if (!isMemberAdminSecret(gatewayKey)) {
      return NextResponse.json(
        { success: false, message: "Invalid admin access key." },
        { status: 401 }
      );
    }

    const session = createMemberAdminSession();
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: MEMBER_ADMIN_COOKIE,
      value: session.value,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: Math.floor((session.expiresAt - Date.now()) / 1000),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: MEMBER_ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
