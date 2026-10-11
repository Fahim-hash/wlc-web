import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "সাহিত্য ক্লাবের ইভেন্ট ও আয়োজন | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের সাহিত্যসভা, প্রতিযোগিতা, কর্মশালা, সাংস্কৃতিক আয়োজন এবং আসন্ন ও সম্পন্ন ইভেন্টের খবর দেখুন।",
  alternates: { canonical: "/events" },
  openGraph: { title: "ইভেন্ট ও আয়োজন | Willes Literary Club", description: "WLC-এর সাহিত্যসভা, প্রতিযোগিতা, কর্মশালা ও ক্লাব আয়োজনের আপডেট।", url: "https://wlc.pro.bd/events", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
