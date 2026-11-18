import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "বাংলা শব্দকোষ | শব্দের অর্থ ও ব্যবহার",
  description: "বাংলা শব্দের অর্থ, ব্যাখ্যা, ব্যবহার ও ভাষার সৌন্দর্য আবিষ্কার করুন উইল্‌স সাহিত্য ক্লাবের শব্দকোষে।",
  alternates: { canonical: "/shobdo" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "শব্দকোষ | উইল্‌স সাহিত্য ক্লাব", description: "বাংলা শব্দের অর্থ ও ব্যবহার জানার সাহিত্যভিত্তিক শব্দকোষ।", url: "https://wlc.pro.bd/shobdo", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
