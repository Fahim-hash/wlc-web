import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { buildMemberMessage, buildWhatsAppUrl, isMemberAdminAuthenticated } from "@/lib/member-management";
import { createActivationLink } from "@/lib/member-portal";

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
    if (member.status !== "ACTIVE") {
      return NextResponse.json({ message: "Restore this membership before sending portal activation." }, { status: 400 });
    }
    if (!member.phone) {
      return NextResponse.json({ message: "This member has no WhatsApp phone number." }, { status: 400 });
    }
    if (!member.email) {
      return NextResponse.json({ message: "Add the member's active email address before generating a portal activation link." }, { status: 400 });
    }
    if (member.portalStatus === "ACTIVE") {
      return NextResponse.json({ message: "This member has already activated their portal account." }, { status: 409 });
    }

    const activation = await createActivationLink(memberId);
    const text = buildMemberMessage({ memberId, name: String(member.name || "") }, activation.url);
    const whatsappUrl = buildWhatsAppUrl(String(member.phone), text);
    if (!whatsappUrl) return NextResponse.json({ message: "Unable to create a WhatsApp link for this phone number." }, { status: 400 });

    return NextResponse.json({ success: true, whatsappUrl, whatsappText: text, portalStatus: "PENDING" });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Unable to prepare WhatsApp activation message.",
    }, { status: 400 });
  }
}
