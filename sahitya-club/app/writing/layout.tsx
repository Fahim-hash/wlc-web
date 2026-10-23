import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "মুক্ত লেখনী ডেস্ক | উইল্‌স সাহিত্য ক্লাব",
  description: "কবিতা, গল্প, প্রবন্ধ ও সৃজনশীল লেখা পড়ুন এবং উইল্‌স সাহিত্য ক্লাবের মুক্ত লেখনী ডেস্কে নিজের লেখা জমা দিন।",
  alternates: { canonical: "/writing" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "মুক্ত লেখনী ডেস্ক | Willes Literary Club", description: "শিক্ষার্থীদের কবিতা, গল্প, প্রবন্ধ ও সৃজনশীল লেখার সাহিত্য মঞ্চ।", url: "https://wlc.pro.bd/writing", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
