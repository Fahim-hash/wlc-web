import { NextResponse } from "next/server";
import { changeMemberUsername, currentMember } from "@/lib/member-portal";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const member = await currentMember();
  if (!member) return NextResponse.json({ success: false, message: "Please sign in again." }, { status: 401 });
  try {
    const body = await request.json();
    const result = await changeMemberUsername({
      memberId: member.memberId,
      currentPassword: String(body?.currentPassword || ""),
      nextUsername: String(body?.username || ""),
    });
    return NextResponse.json({ success: true, username: result.username });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Could not change UID." }, { status: 400 });
  }
}
