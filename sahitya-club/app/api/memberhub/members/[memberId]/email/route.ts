import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated, updateEmailStatus } from "@/lib/member-management";
import { createActivationLink, sendActivationEmail } from "@/lib/member-portal";

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
    if (!snap.exists) return NextResponse.json({ message: "Member not found." }, { status: 404 });

    const member = snap.data()!;
    if (!member.email) return NextResponse.json({ message: "This member has no email address." }, { status: 400 });
    if (member.status !== "ACTIVE") return NextResponse.json({ message: "This membership is inactive. Restore it before sending activation." }, { status: 400 });
    if (member.portalStatus === "ACTIVE") return NextResponse.json({ message: "This member has already activated their portal account." }, { status: 409 });

    const activation = await createActivationLink(memberId);
    const messageId = await sendActivationEmail({
      name: String(member.name || ""),
      email: String(member.email),
      memberId,
    }, activation.url);
    await updateEmailStatus(memberId, "SENT", {
      emailSentAt: Date.now(),
      emailMessageId: messageId || null,
      lastEmailError: null,
    });
    return NextResponse.json({ success: true, messageId: messageId || null, message: "Portal activation email sent." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Activation email delivery failed.";
    try {
      const { memberId } = await context.params;
      await updateEmailStatus(memberId, "FAILED", { lastEmailError: message });
    } catch {
      // Preserve the original delivery error.
    }
    return NextResponse.json({ success: false, message }, { status: 502 });
  }
}
