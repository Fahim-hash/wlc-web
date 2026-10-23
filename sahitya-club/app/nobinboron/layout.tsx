import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "নবীনবরণ | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের নবীনবরণ আয়োজন, নতুন সদস্যদের স্বাগত এবং সংশ্লিষ্ট স্মৃতি ও কার্যক্রমের তথ্য দেখুন।",
  alternates: { canonical: "/nobinboron" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "নবীনবরণ | Willes Literary Club", description: "নতুন সদস্যদের স্বাগত জানাতে WLC-এর নবীনবরণ আয়োজন ও স্মৃতি।", url: "https://wlc.pro.bd/nobinboron", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
