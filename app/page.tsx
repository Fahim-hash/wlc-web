import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "উইল্‌স সাহিত্য ক্লাব | বাংলা সাহিত্য ও সৃজনশীল লেখালেখি",
  description: "উইল্‌স সাহিত্য ক্লাবের অফিসিয়াল ওয়েবসাইটে বাংলা সাহিত্য, সৃজনশীল লেখালেখি, ক্লাবের ইভেন্ট, অর্জন, সদস্যপদ ও উইলিয়ানদের সাহিত্যচর্চা সম্পর্কে জানুন।",
  alternates: {
    canonical: "https://wlc.pro.bd/",
  },
  openGraph: {
    title: "উইল্‌স সাহিত্য ক্লাব | বাংলা সাহিত্য ও সৃজনশীল লেখালেখি",
    description: "বাংলা সাহিত্য, সৃজনশীল লেখালেখি, ক্লাবের ইভেন্ট ও সদস্যদের অর্জন—উইল্‌স সাহিত্য ক্লাবের অফিসিয়াল ওয়েবসাইট।",
    url: "https://wlc.pro.bd/",
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "উইল্‌স সাহিত্য ক্লাব" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "উইল্‌স সাহিত্য ক্লাব | বাংলা সাহিত্য ও সৃজনশীল লেখালেখি",
    description: "উইল্‌স সাহিত্য ক্লাবের অফিসিয়াল ওয়েবসাইট।",
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
