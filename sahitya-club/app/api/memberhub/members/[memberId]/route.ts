import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated, type RegisteredMember } from "@/lib/member-management";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ memberId: string }> }
) {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { memberId } = await context.params;
    const body = await request.json();
    const status = body?.status;

    if (status !== "ACTIVE" && status !== "INACTIVE") {
      return NextResponse.json({ message: "Invalid member status." }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = db.collection("registered_members").doc(memberId);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      return NextResponse.json({ message: "Member not found." }, { status: 404 });
    }

    const now = Date.now();
    await ref.update({ status, updatedAt: now });
    await db.collection("audit_logs").add({
      action: status === "INACTIVE" ? "DEACTIVATE" : "RESTORE",
      collection: "registered_members",
      recordId: memberId,
      actor: "memberhub",
      createdAt: now,
    });

    const member = { ...(snapshot.data() as RegisteredMember), status, updatedAt: now };
    return NextResponse.json({ success: true, member });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update member status." },
      { status: 400 }
    );
  }
}
