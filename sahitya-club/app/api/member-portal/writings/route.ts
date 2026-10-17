import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase-admin";
import { currentMember } from "@/lib/member-portal";
import { enforceRateLimit, rateLimitResponse } from "@/lib/api-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().trim().min(2).max(100),
  category: z.enum(["poetry", "story", "essay"]),
  content: z.string().trim().min(10).max(5000),
  penName: z.string().trim().max(50).optional().default(""),
});

export async function GET(request: Request) {
  try {
    const member = await currentMember();
    if (!member) return NextResponse.json({ authenticated: false, message: "Please sign in to view your submissions." }, { status: 401 });
    const limit = await enforceRateLimit({ request, namespace: "member-writing-list", limit: 30, windowMs: 60_000 });
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);
    const snapshot = await getAdminDb().collection("writings")
      .where("memberId", "==", member.memberId)
      .limit(100)
      .get();
    const submissions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: String(data.title || ""),
        category: String(data.category || "poetry"),
        status: String(data.status || "pending"),
        date: String(data.date || ""),
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt instanceof Date ? data.createdAt.toISOString() : ""),
        penName: String(data.penName || ""),
      };
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json({ authenticated: true, submissions });
  } catch {
    return NextResponse.json({ message: "Unable to load your writing submissions right now." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const member = await currentMember();
    if (!member) return NextResponse.json({ message: "Sign in to your Member Portal before submitting writing." }, { status: 401 });
    const limit = await enforceRateLimit({ request, namespace: "member-writing-submit", limit: 5, windowMs: 60 * 60 * 1000 });
    if (!limit.allowed) return rateLimitResponse(limit.retryAfterSeconds);
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ message: "Invalid content type." }, { status: 400 });
    }
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ message: "Please check the title, category and writing length." }, { status: 422 });
    const db = getAdminDb();
    const now = new Date();
    const date = now.toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
    const ref = await db.collection("writings").add({
      ...parsed.data,
      penName: parsed.data.penName || "অজ্ঞাতনামা",
      memberId: member.memberId,
      memberName: member.name,
      memberEmail: member.email,
      submitterType: "member",
      status: "pending",
      date,
      createdAt: now,
    });
    return NextResponse.json({ success: true, id: ref.id, message: "Your writing has been submitted for review." }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "The server could not save your submission. Please try again." }, { status: 500 });
  }
}
