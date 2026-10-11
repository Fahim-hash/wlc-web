import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "জেনারেশন-৩ (আসন্ন) | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের GEN-3 প্যানেলের নির্বাচন শুরু হয়েছে। নতুন প্যানেলের সদস্য তালিকা ও বিস্তারিত শিগগির প্রকাশিত হবে।",
  alternates: { canonical: "/panel/GEN-3" },
  openGraph: {
    title: "GEN-3 — Coming Soon | Willes Literary Club",
    description: "নতুন প্রজন্মের প্যানেল নির্বাচনের আপডেট ও আসন্ন GEN-3 প্যানেলের তথ্য।",
    url: "https://wlc.pro.bd/panel/GEN-3",
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "website"
  }
};

export default function GenThreeLayout({ children }: { children: ReactNode }) {
  return children;
}
