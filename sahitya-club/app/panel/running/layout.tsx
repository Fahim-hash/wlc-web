import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "চলমান কার্যনির্বাহী প্যানেল | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের বর্তমান কার্যনির্বাহী প্যানেল, দায়িত্বপ্রাপ্ত সদস্য ও নেতৃত্বের তালিকা দেখুন।",
  alternates: { canonical: "/panel/running" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "চলমান প্যানেল | Willes Literary Club", description: "Willes Literary Club-এর বর্তমান কার্যনির্বাহী সদস্য ও দায়িত্বসমূহ।", url: "https://wlc.pro.bd/panel/running", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
