import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "জেনারেশন-২ প্যানেল | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের GEN-2-এর উপদেষ্টা, প্রশাসনিক ও সম্পাদনা বিভাগের সদস্য পরিচিতি ও দায়িত্বসমূহ।",
  alternates: { canonical: "/panel/GEN-2" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }],
    title: "জেনারেশন-২ প্যানেল | Willes Literary Club",
    description: "উইল্‌স সাহিত্য ক্লাবের দ্বিতীয় প্রজন্মের নেতৃত্ব ও সদস্যদের পরিচিতি।",
    url: "https://wlc.pro.bd/panel/GEN-2",
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "website"
  }
};

export default function GenTwoLayout({ children }: { children: ReactNode }) {
  return children;
}
