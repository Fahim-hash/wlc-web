// app/api/controlhub-auth/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { gatewayKey } = await request.json();
    
    // Vercel-এ CONTROL_GATEWAY_KEY সেট করবে (অথবা এখানে ডেভলপমেন্টের জন্য ডিরেক্ট চেক)
    const SECRET_KEY = process.env.CONTROL_GATEWAY_KEY || "WLC_Control_2026";

    if (gatewayKey === SECRET_KEY) {
      return NextResponse.json({ success: true, token: "session_valid_2026_authorized" });
    }

    return NextResponse.json({ success: false, message: "ভুল গেটওয়ে অ্যাক্সেস কি!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "সার্ভার এরর ভাই!" }, { status: 500 });
  }
}
