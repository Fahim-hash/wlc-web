import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ছবি ও স্মৃতির অ্যালবাম | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের অনুষ্ঠান, সাহিত্য আয়োজন, সদস্যদের কার্যক্রম এবং স্মরণীয় মুহূর্তের ছবি দেখুন।",
  alternates: { canonical: "/album" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "ছবি ও স্মৃতির অ্যালবাম | Willes Literary Club", description: "WLC-এর অনুষ্ঠান ও সাহিত্য কার্যক্রমের ছবির সংগ্রহ।", url: "https://wlc.pro.bd/album", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
