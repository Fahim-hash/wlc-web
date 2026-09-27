import { NextResponse } from "next/server";
import { writeCmsRecord } from "@/lib/cms";

function authorized(request: Request) {
  const expected = process.env.TELEGRAM_CONTROL_SECRET?.trim();
  return Boolean(expected && request.headers.get("x-wlc-control-secret") === expected);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const seed = [
    {
      collection: "events",
      id: "national-wall-magazine-quiz-festival-2026",
      data: {
        title: "জাতীয় দেয়ালিকা ও কুইজ উৎসব ২০২৬",
        date: "2026-07-25",
        time: "09:00–16:00",
        venue: "College Auditorium, WLFSC",
        description: "সারাদেশের ৫০টিরও বেশি কলেজের অংশগ্রহণে দেয়ালিকা প্রদর্শনী, সাহিত্য কুইজ এবং স্ক্রিপ্ট রাইটিং কম্পিটিশন।",
        status: "PUBLISHED",
        sortOrder: 1,
      },
    },
    {
      collection: "achievements",
      id: "best-literary-club-award-2025",
      data: {
        title: "সেরা সাহিত্য ক্লাব অ্যাওয়ার্ড ২০২৫",
        category: "আন্তঃকলেজ স্বীকৃতি",
        date: "2025-11",
        description: "জাতীয় সাহিত্য উৎসব ২০২৫-এ সৃজনশীল প্রকাশনা এবং দেয়ালিকা বিভাগে অবদানের জন্য স্বীকৃতি।",
        status: "PUBLISHED",
        sortOrder: 1,
      },
    },
    {
      collection: "achievements",
      id: "wall-magazine-first-place-2026",
      data: {
        title: "আন্তঃকলেজ দেয়ালিকা প্রতিযোগিতায় ১ম স্থান",
        category: "প্রতিযোগিতা",
        date: "2026-02",
        description: "ভাষা দিবস উপলক্ষে আয়োজিত বিশেষ উৎসবে 'স্পন্দন' দেয়ালিকার প্রথম স্থান অর্জন।",
        status: "PUBLISHED",
        sortOrder: 2,
      },
    },
  ];

  const results = [];
  for (const item of seed) {
    results.push(await writeCmsRecord(item.collection as any, item.data, item.id, "seed"));
  }

  return NextResponse.json({ success: true, seeded: results.length });
}
