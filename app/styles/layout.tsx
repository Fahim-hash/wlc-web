import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ডিজাইন স্টাইল গাইড | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের ওয়েব ডিজাইন স্টাইল ও ভিজ্যুয়াল গাইড।",
  robots: { index: false, follow: false }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
