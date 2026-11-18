import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "কথাসখী | বাংলা সাহিত্য AI সহচর",
  description: "কথাসখীর সঙ্গে বাংলা সাহিত্য, লেখালেখি, শব্দের অর্থ এবং উইল্‌স সাহিত্য ক্লাব সম্পর্কে প্রশ্ন করুন ও সৃজনশীল ধারণা খুঁজুন।",
  alternates: { canonical: "/kothasokhi" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "কথাসখী — সাহিত্য AI সহচর | WLC", description: "বাংলা সাহিত্য ও লেখালেখি নিয়ে কথাসখীর সঙ্গে কথা বলুন।", url: "https://wlc.pro.bd/kothasokhi", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
