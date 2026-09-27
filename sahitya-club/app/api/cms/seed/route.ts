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

  const memberSeed = [["এহসান আহমেদ সিয়াম","সভাপতি","HSC '26","administrative"],["অনন্যা হাসান বিথি","সহ সভাপতি","HSC '26","administrative"],["আতিক আহরার","সাধারন সম্পাদক","HSC '27","administrative"],["রাফিদুল আমিন সাব্বির","সাংগঠনিক সম্পাদক","SSC '26","administrative"],["শেখ তাসিন","মুখ্য সংগঠক (দিবা শাখা)","SSC '27","administrative"],["নাহিয়ান নূর অহনা","মুখ্য সংগঠক (প্রভাতি শাখা)","SSC '28","administrative"],["অরণ্য আসিফ","নিয়ন্ত্রক (বাংলা সাহিত্য)","SSC '26","administrative"],["সামশিহা পরী","নিয়ন্ত্রক (ইংরেজি সাহিত্য)","SSC '28","administrative"],["দেওয়ান মো: রেজওয়ান","নিয়ন্ত্রক (সুইড শাখা)","SSC '27","administrative"],["আরিয়ান চৌধুরী","সহ নিয়ন্ত্রক (বাংলা সাহিত্য)","SSC '27","administrative"],["ইফতেখার জামান রোহান","সহ নিয়ন্ত্রক (ইংরেজি সাহিত্য)","SSC '27","administrative"],["আলী আল-আমীন","সহ নিয়ন্ত্রক (ধর্মীয় সাহিত্য)","SSC '29","administrative"],["রাফসান জাবির","সহ নিয়ন্ত্রক (সুইড শাখা)","SSC '27","administrative"],["আব্দুল কাইয়ুম ত্বোহা","কোষাধ্যক্ষ","HSC '27","administrative"],["ফারহানা আফরোজ ইপ্তি","প্রচার-প্রচারণা বিষয়ক সম্পাদক","HSC '26","administrative"],["আব্দুল নূর","যোগাযোগ ও ব্যবস্থাপনা বিষয়ক সম্পাদক","SSC '27","administrative"],["সামিন ইয়াসির","গ্রন্থাগার বিষয়ক সম্পাদক","SSC '26","administrative"],["ইয়াসফা রহমান জুঁই","দেয়ালিকা বিষয়ক সম্পাদক","SSC '27","administrative"],["নাবিল আহমেদ","নিয়োগ ও শৃঙ্খলা বিষয়ক সম্পাদক (দিবা শাখা)","SSC '27","administrative"],["জান্নাতুন তাজরি বারিহা","শৃঙ্খলা বিষয়ক সম্পাদক (প্রভাতি শাখা)","SSC '29","administrative"],["আব্দুল্লাহ আল-মাহদি","নথি সংগ্রাহক","SSC '27","administrative"],["নাজমুল সাকিব","সভাপতি (সম্পাদনা বিভাগ)","HSC '26","editorial"],["ইয়ামিন উজ-জামান","সম্পাদক (সম্পাদনা বিভাগ)","HSC '26","editorial"],["রাকিবুল ইসলাম আকাশ","সহ সম্পাদক (চিত্র ও ভিডিওগ্রাফি)","SSC '27","editorial"],["আবিয়াজ বুশাইরি","কার্যনির্বাহী","SSC '26","editorial"]].map(([name, role, batch, department], index) => ({
    collection: "members",
    id: "running-" + String(index + 1).padStart(2, "0"),
    data: { name, role, batch, department, status: "PUBLISHED", sortOrder: index + 1 }
  }));

  seed.push(...memberSeed);

  const results = [];
  for (const item of seed) {
    results.push(await writeCmsRecord(item.collection as any, item.data, item.id, "seed"));
  }

  return NextResponse.json({ success: true, seeded: results.length });
}
