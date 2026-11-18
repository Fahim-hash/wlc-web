import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "লেখা জমা দিন | মুক্ত লেখনী ডেস্ক",
  description: "উইল্‌স সাহিত্য ক্লাবের মুক্ত লেখনী ডেস্কে কবিতা, গল্প, প্রবন্ধ, অনুবাদ বা আপনার সৃজনশীল লেখা জমা দিন।",
  alternates: { canonical: "/writing/submit" },
  openGraph: { title: "লেখা জমা দিন | Willes Literary Club", description: "WLC-এর মুক্ত লেখনী ডেস্কে নিজের সৃজনশীল লেখা জমা দিন।", url: "https://wlc.pro.bd/writing/submit", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
