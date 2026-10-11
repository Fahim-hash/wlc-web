import { NextResponse } from "next/server";
import { MEMBER_SESSION_COOKIE } from "@/lib/member-portal";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(MEMBER_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
  return response;
}
