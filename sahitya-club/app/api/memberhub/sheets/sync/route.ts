import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { isMemberAdminAuthenticated, type RegisteredMember } from "@/lib/member-management";
import { syncRegisteredMemberToGoogleSheet } from "@/lib/google-sheets-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only retry for registrations whose Google Sheets sync is still pending. */
export async function POST() {
  if (!(await isMemberAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const pending = await getAdminDb()
      .collection("registered_members")
      .where("spreadsheetSyncStatus", "==", "PENDING")
      .limit(100)
      .get();

    const results: Array<{ memberId: string; status: "synced" | "pending"; message?: string }> = [];
    for (const doc of pending.docs) {
      const member = doc.data() as RegisteredMember;
      const result = await syncRegisteredMemberToGoogleSheet(member);
      results.push({ memberId: member.memberId || doc.id, ...result });
    }

    return NextResponse.json({
      success: true,
      attempted: results.length,
      synced: results.filter((item) => item.status === "synced").length,
      pending: results.filter((item) => item.status === "pending").length,
      results,
    });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to retry Google Sheets sync." }, { status: 500 });
  }
}
