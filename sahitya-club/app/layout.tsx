// app/layout.tsx
import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google"; 
import Link from "next/link";
import "./globals.css";
import Image from "next/image";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// 🚀 SEO & Metadata Setup (Premium Style)
export const metadata: Metadata = {
  title: "উইল্‌স সাহিত্য ক্লাব | Willes Literary Club",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব ওয়েবসাইট। সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে এগিয়ে চলেছে উইলিয়ানদের ভালোবাসার এই প্রাঙ্গণ।",
  keywords: [
    "উইল্‌স সাহিত্য ক্লাব",
    "Willes Literary Club",
    "WLFSC Literary Club",
    "Willes Little Flower School & College",
    "উইলিয়ান সাহিত্য",
    "ঢাকা কলেজ সাহিত্য ক্লাব"
  ],
  authors: [{ name: "উইল্‌স সাহিত্য ক্লাব প্যানেল" }],
  // 🎯 লোগো হিসেবে সরাসরি logo.png কনফিগারেশন
  icons: {
    icon: "/logo.png", 
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "উইল্‌স সাহিত্য ক্লাব | Willes Literary Club",
    description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব ওয়েবসাইট।",
    url: "https://wlfsc-literary.vercel.app", // তোমার অরিজিনাল ইউআরএল থাকলে এখানে বসিয়ে দিও
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "উইল্‌স সাহিত্য ক্লাব লোগো প্রিভিউ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "উইল্‌স সাহিত্য ক্লাব | Willes Literary Club",
    description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব ওয়েবসাইট।",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navLinks = [
    { name: "হোম", path: "/" },
    { name: "আমাদের কথা", path: "/about" },
    { name: "নবীনবরণ '২৫", path: "/nobinboron" },
    { name: "আর্কাইভ ও প্যানেল", path: "/panel" },
    { name: "শিক্ষক মডারেটর", path: "/panel/moderator" },
  ];

  // 🧠 Structured Data (গুগল সার্চকে প্রাতিষ্ঠানিক ডেটা দেওয়ার জন্য)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "উইল্‌স সাহিত্য ক্লাব",
    "alternateName": "Willes Literary Club",
    "url": "https://wlc.pro.bd/",
    "logo": "https://wlc.pro.bd/logo.png",
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "name": "Willes Little Flower School & College"
    },
    "foundingDate": "2024",
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kakrail",
        "addressRegion": "Dhaka",
        "addressCountry": "Bangladesh"
      }
    },
    "description": "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের শিক্ষার্থীদের সৃজনশীল লেখনী ও সাহিত্য চর্চার অফিশিয়াল প্ল্যাটফর্ম।"
  };

  return (
    <html lang="bn" className="h-full">
      <head>
        {/* JSON-LD for Google Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${hindSiliguri.className} bg-stone-50 text-stone-900 min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-900 antialiased overflow-x-hidden`}>
        
        {/* ================= GLOBAL HEADER / NAVBAR ================= */}
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/60 transition-all">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* ব্র্যান্ড লোগো */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-11 md:h-11 transition-transform duration-300 group-hover:scale-110">
                <Image 
                  src="/logo.png" 
                  alt="উইল্‌স সাহিত্য ক্লাব লোগো" 
                  fill 
                  className="object-contain"
                />
              </div>
              
              <div className="flex flex-col">
                <span className="font-bold text-base md:text-lg tracking-tight text-stone-950 group-hover:text-rose-900 transition-colors">
                  উইল্‌স সাহিত্য ক্লাব
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium -mt-0.5">
                  Wills Literary Club
                </span>
              </div>
            </Link>

            {/* ডেক্সটপ নেভিগেশন */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/40">
              {navLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.path}
                  className="text-stone-600 hover:text-stone-950 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* মোবাইল বাটন */}
            <div className="flex md:hidden items-center">
              <Link 
                href="/panel" 
                className="text-xs font-bold bg-stone-900 text-white px-3 py-1.5 rounded-lg border border-stone-800"
              >
                প্যানেল 📖
              </Link>
            </div>

          </div>
        </header>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-grow w-full block relative z-10">
          {children}
        </main>

        {/* ================= GLOBAL FOOTER ================= */}
        <footer className="w-full bg-white border-t border-stone-200/60 py-8 mt-auto relative z-20">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            <div>
              <p className="text-xs font-medium text-stone-500">
                © ২০২৬ উইল্‌স সাহিত্য ক্লাব। সর্বস্বত্ব সংরক্ষিত।
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ, ঢাকা।
              </p>
            </div>

            <div className="text-xs italic text-stone-400 max-w-xs md:text-right">
              "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে এগিয়ে চলেছে উইলিয়ানদের ভালোবাসার এই প্রাঙ্গণ।"
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
