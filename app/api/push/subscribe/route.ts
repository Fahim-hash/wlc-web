import { NextResponse } from "next/server";
import { savePushSubscription } from "@/lib/push";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const subscription = body?.subscription;

    if (!subscription) {
      return NextResponse.json({ error: "Subscription is required" }, { status: 400 });
    }

    const id = await savePushSubscription(subscription);

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json(
      { error: "Push subscription could not be saved." },
      { status: 500 }
    );
  }
}
