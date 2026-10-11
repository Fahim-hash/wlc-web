import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "সদস্য পোর্টাল | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের সদস্য পোর্টালে প্রবেশ করে সদস্যপদ, ডিজিটাল সদস্য কার্ড, QR যাচাই এবং সদস্য-সংক্রান্ত তথ্য পরিচালনা করুন।",
  robots: { index: false, follow: false },
  alternates: { canonical: "/memberhub" },
  openGraph: { title: "সদস্য পোর্টাল | Willes Literary Club", description: "WLC সদস্যদের জন্য নিরাপদ সদস্য পোর্টাল।", url: "https://wlc.pro.bd/memberhub", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
