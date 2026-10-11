import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "শিক্ষক ও মডারেটর | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের শিক্ষক, উপদেষ্টা ও মডারেটরদের পরিচিতি এবং সাহিত্যচর্চায় তাঁদের সহযোগিতা সম্পর্কে জানুন।",
  alternates: { canonical: "/panel/moderator" },
  openGraph: { title: "শিক্ষক ও মডারেটর | Willes Literary Club", description: "Willes Literary Club-এর শিক্ষক, উপদেষ্টা ও মডারেটরদের পরিচিতি।", url: "https://wlc.pro.bd/panel/moderator", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
