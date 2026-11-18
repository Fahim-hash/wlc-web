import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "জেনারেশন-২ প্যানেল | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের GEN-2 প্যানেলের সদস্য পরিচিতি ও দায়িত্বসমূহ।",
  alternates: { canonical: "/panel/GEN-2" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "জেনারেশন-২ প্যানেল | Willes Literary Club", description: "Willes Literary Club-এর GEN-2 সদস্য ও দায়িত্বসমূহ।", url: "https://wlc.pro.bd/panel/GEN-2", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
