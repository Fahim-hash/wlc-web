import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "জেনারেশন-৩ | Executive & Advisor Panel | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের GEN-3 Executive Panel এবং প্রশাসনিক ও সম্পাদনা বিভাগের Advisor Panel-এর সদস্য পরিচিতি।",
  alternates: { canonical: "/panel/GEN-3" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }],
    title: "GEN-3 Executive & Advisor Panel | Willes Literary Club",
    description: "উইল্‌স সাহিত্য ক্লাবের তৃতীয় প্রজন্মের নির্বাহী ও উপদেষ্টা পর্ষদ।",
    url: "https://wlc.pro.bd/panel/GEN-3",
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "website"
  }
};

export default function GenThreeLayout({ children }: { children: ReactNode }) {
  return children;
}
