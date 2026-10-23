import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "জেনারেশন-১ আর্কাইভ | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের প্রথম প্রজন্মের সদস্য, নেতৃত্ব ও ক্লাবের প্রাথমিক পথচলার স্মৃতি ও তথ্য দেখুন।",
  alternates: { canonical: "/panel/GEN-1" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "জেনারেশন-১ আর্কাইভ | Willes Literary Club", description: "WLC-এর প্রথম প্রজন্মের সদস্য ও ক্লাব আর্কাইভ।", url: "https://wlc.pro.bd/panel/GEN-1", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
