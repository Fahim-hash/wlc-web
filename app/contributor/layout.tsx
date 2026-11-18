import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "কনট্রিবিউটর ও সহযোগী | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের লেখক, সৃজনশীল অবদানকারী ও সহযোগীদের পরিচিতি এবং তাঁদের অবদান সম্পর্কে জানুন।",
  alternates: { canonical: "/contributor" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "কনট্রিবিউটর | Willes Literary Club", description: "WLC-এর সাহিত্য ও সৃজনশীল কার্যক্রমে অবদান রাখা ব্যক্তিদের পরিচিতি।", url: "https://wlc.pro.bd/contributor", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
