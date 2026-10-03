import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  isMemberAdminAuthenticated,
  sendMemberEmail,
  updateEmailStatus,
  type RegisteredMember,
} from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  context: { params: Promise<{ memberId: string }> }
) {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { memberId } = await context.params;
    const snap = await getAdminDb().collection("registered_members").doc(memberId).get();

    if (!snap.exists) {
      return NextResponse.json({ message: "Member not found." }, { status: 404 });
    }

    const member = { ...snap.data(), memberId: snap.id } as RegisteredMember;
    if (!member.email) {
      return NextResponse.json({ message: "This member has no email address." }, { status: 400 });
    }

    try {
      const messageId = await sendMemberEmail(member);
      await updateEmailStatus(memberId, "SENT", {
        emailSentAt: Date.now(),
        emailMessageId: messageId || null,
        lastEmailError: null,
      });

      return NextResponse.json({ success: true, messageId: messageId || null });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Email delivery failed.";
      await updateEmailStatus(memberId, "FAILED", { lastEmailError: message });
      return NextResponse.json({ success: false, message }, { status: 502 });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Server error." },
      { status: 500 }
    );
  }
}
