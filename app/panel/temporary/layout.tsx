import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "অস্থায়ী প্যানেল | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের অস্থায়ী কার্যনির্বাহী প্যানেল এবং সংশ্লিষ্ট সদস্যদের পরিচিতি দেখুন।",
  alternates: { canonical: "/panel/temporary" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "অস্থায়ী প্যানেল | Willes Literary Club", description: "Willes Literary Club-এর অস্থায়ী কার্যনির্বাহী প্যানেল।", url: "https://wlc.pro.bd/panel/temporary", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
