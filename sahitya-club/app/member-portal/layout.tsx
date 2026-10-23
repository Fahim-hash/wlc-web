import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "মেম্বার পোর্টাল | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের সদস্যদের জন্য ব্যক্তিগত পোর্টাল।",
  robots: { index: false, follow: false },
};

export default function MemberPortalLayout({ children }: { children: ReactNode }) {
  return children;
}
