import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "সদস্য নিবন্ধন | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের সদস্য হওয়ার জন্য নিবন্ধন-সংক্রান্ত তথ্য জানুন এবং সদস্যপদের আবেদন প্রক্রিয়া সম্পন্ন করুন।",
  alternates: { canonical: "/register" },
  openGraph: { title: "সদস্য নিবন্ধন | Willes Literary Club", description: "Willes Literary Club-এর সদস্যপদের জন্য নিবন্ধন করুন।", url: "https://wlc.pro.bd/register", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
