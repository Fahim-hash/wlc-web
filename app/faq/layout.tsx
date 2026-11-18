import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "সাধারণ জিজ্ঞাসা (FAQ) | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাব, সদস্যপদ, নিবন্ধন, ইভেন্ট, সাহিত্য জমা এবং ওয়েবসাইট ব্যবহার সম্পর্কে সাধারণ প্রশ্নের উত্তর পড়ুন।",
  alternates: { canonical: "/faq" },
  openGraph: {
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Willes Literary Club" }], title: "সাধারণ জিজ্ঞাসা | Willes Literary Club", description: "WLC-এর সদস্যপদ, কার্যক্রম ও ওয়েবসাইট নিয়ে প্রয়োজনীয় প্রশ্নোত্তর।", url: "https://wlc.pro.bd/faq", siteName: "Willes Literary Club", locale: "bn_BD", type: "website" }
};

import type { ReactNode } from "react";

export default function MetadataLayout({ children }: { children: ReactNode }) {
  return children;
}
