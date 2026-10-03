import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  buildMemberMessage,
  buildWhatsAppUrl,
  createRegisteredMember,
  isMemberAdminAuthenticated,
  sendMemberEmail,
  updateEmailStatus,
  type MemberNotification,
  type RegisteredMember,
} from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const snapshot = await getAdminDb()
    .collection("registered_members")
    .orderBy("createdAt", "desc")
    .limit(500)
    .get();

  const members = snapshot.docs.map((doc) => {
    const data = doc.data() as RegisteredMember;
    return {
      ...data,
      id: doc.id,
      whatsappUrl: data.phone ? buildWhatsAppUrl(data.phone, buildMemberMessage(data)) : null,
    };
  });

  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const notification: MemberNotification =
      body?.notification === "email" ||
      body?.notification === "whatsapp" ||
      body?.notification === "both"
        ? body.notification
        : "none";

    const member = await createRegisteredMember({
      name: body?.name,
      email: body?.email,
      phone: body?.phone,
      batch: body?.batch,
      notes: body?.notes,
      actor: "memberhub",
    });

    let emailResult: { status: "not_requested" | "sent" | "failed"; message?: string } = {
      status: "not_requested",
    };

    if ((notification === "email" || notification === "both") && member.email) {
      try {
        const messageId = await sendMemberEmail(member);
        await updateEmailStatus(member.memberId, "SENT", {
          emailSentAt: Date.now(),
          emailMessageId: messageId || null,
          lastEmailError: null,
        });
        emailResult = { status: "sent" };
      } catch (error) {
        const message = error instanceof Error ? error.message : "Email delivery failed.";
        await updateEmailStatus(member.memberId, "FAILED", { lastEmailError: message });
        emailResult = { status: "failed", message };
      }
    }

    return NextResponse.json(
      {
        success: true,
        member: {
          ...member,
          whatsappUrl: member.phone
            ? buildWhatsAppUrl(member.phone, buildMemberMessage(member))
            : null,
          whatsappText: member.phone ? buildMemberMessage(member) : null,
        },
        email: emailResult,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to add member." },
      { status: 400 }
    );
  }
}
