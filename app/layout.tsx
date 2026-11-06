// app/layout.tsx
import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google"; 
import Link from "next/link";
import "./globals.css";
import Image from "next/image";
import Script from "next/script";
import GlobalPushPrompt from "@/components/GlobalPushPrompt";
import RouteChromeController from "@/components/RouteChromeController";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { VercelToolbar } from "@vercel/toolbar/next";

// ১. নেভিগেশন লিংকের জন্য টাইপস্ক্রিপ্ট ইন্টারফেস
interface NavLink {
  name: string;
  path: string;
  emoji?: string;
}

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// 🚀 SEO & Metadata Setup
export const metadata: Metadata = {
  metadataBase: new URL("https://wlc.pro.bd"),
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.YANDEX_SITE_VERIFICATION
      ? { yandex: process.env.YANDEX_SITE_VERIFICATION }
      : {}),
    ...(process.env.BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } }
      : {}),
  },
  title: { default: "উইল্‌স সাহিত্য ক্লাব | Willes Literary Club", template: "%s" },
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিসিয়াল সাহিত্য ক্লাব। বাংলা সাহিত্য, সৃজনশীল লেখালেখি, ইভেন্ট, অর্জন, সদস্যপদ ও উইলিয়ানদের সাহিত্যচর্চার খবর জানুন।",
  keywords: [
    "উইল্‌স সাহিত্য ক্লাব",
    "Willes Literary Club",
    "WLFSC Literary Club",
    "Willes Little Flower School & College",
    "উইলিয়ান সাহিত্য",
    "Willes Sahitto Club",
    "wlc",
    "WLC"
  ],
  authors: [{ name: "উইল্‌স সাহিত্য ক্লাব প্যানেল" }],
  icons: {
    icon: "/logo.png", 
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "উইল্‌স সাহিত্য ক্লাব | Willes Literary Club",
    description: "বাংলা সাহিত্য, সৃজনশীল লেখালেখি, ক্লাবের ইভেন্ট ও সদস্যদের অর্...[truncated]