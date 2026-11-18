import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "প্ল্যাটফর্ম ডেভেলপার | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের ডিজিটাল প্ল্যাটফর্মের ডিজাইন ও উন্নয়নে যুক্ত ডেভেলপারদের পরিচিতি।",
  alternates: { canonical: "https://wlc.pro.bd/developer" },
  openGraph: {
    title: "প্ল্যাটফর্ম ডেভেলপার | উইল্‌স সাহিত্য ক্লাব",
    description: "উইল্‌স সাহিত্য ক্লাবের ডিজিটাল প্ল্যাটফর্মের পেছনের কারিগরদের পরিচিতি।",
    url: "https://wlc.pro.bd/developer",
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }],
  },
};

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return children;
}
