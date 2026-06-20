import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google"; 
import Link from "next/link";
import "./globals.css";
import Image from "next/image";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// 🚀 SEO & Metadata Setup
export const metadata: Metadata = {
  title: "উইল্‌স সাহিত্য ক্লাব | Willes Literary Club",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব ওয়েবসাইট। সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে এগিয়ে চলেছে উইলিয়ানদের ভালোবাসার এই প্রাঙ্গণ।",
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
    description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব ওয়েবসাইট।",
    url: "https://wlc.pro.bd",
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
  const desktopLinks = [
    { name: "হোম", path: "/" },
    { name: "আমাদের কথা", path: "/about" },
    { name: "আর্কাইভ ও প্যানেল", path: "/panel" },
    { name: "শিক্ষক মডারেটর", path: "/panel/moderator" },
  ];

  const mobileLinks = [
    { name: "হোম", path: "/" },
    { name: "আমাদের কথা", path: "/about" },
    { name: "অর্জনসমূহ", path: "/achievement" },
    { name: "অ্যালবাম", path: "/album" },
    { name: "যোগাযোগ", path: "/contact" },
    { name: "ইভেন্টস", path: "/events" },
    { name: "সাধারণ জিজ্ঞাসা (FAQ)", path: "/faq" },
    { name: "অফিশিয়াল প্যানেল", path: "/panel" },
    { name: "সদস্য নিবন্ধন", path: "/register" },
    { name: "শব্দকোষ", path: "/shobdo" },
    { name: "মুক্ত লেখনী ডেস্ক", path: "/writing" },
  ];

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
    "description": "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের শিক্ষার্থীদের সৃজনশীল লেখনী ও সাহিত্য চর্চার অফিশিয়াল প্ল্যাটফর্ম।"
  };

  return (
    <html lang="bn" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${hindSiliguri.className} bg-stone-50 text-stone-900 min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-900 antialiased overflow-x-hidden`}>

        {/* ================= GLOBAL HEADER / NAVBAR ================= */}
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/60">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between relative">

            {/* ব্র্যান্ড লোগো */}
            <Link href="/" className="flex items-center gap-3 group z-50">
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
                  Willes Literary Club
                </span>
              </div>
            </Link>

            {/* ডেক্সটপ নেভিগেশন */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/40">
              {desktopLinks.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.path}
                  className="text-stone-600 hover:text-stone-950 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* ================= FIXED PURE CSS HAMBURGER & DROPDOWN SYSTEM ================= */}
            {/* ১. ইনপুট চেক বক্স পিয়ার সিলেক্টরের জন্য সবার প্রথমে থাকবে */}
            <input type="checkbox" id="menu-toggle" className="peer hidden" />
            
            {/* ২. রেসপনসিভ হ্যামবার্গার আইকন বাটন (ক্লিক ট্রিপল লাইন) */}
            <label 
              htmlFor="menu-toggle" 
              className="flex md:hidden flex-col justify-between w-6 h-4 cursor-pointer z-50 relative p-0.5"
            >
              <span className="w-full h-0.5 bg-stone-950 rounded-full transition-all duration-300 transform origin-center peer-checked:bg-stone-950 peer-checked:rotate-45 peer-checked:translate-y-1.5"></span>
              <span className="w-full h-0.5 bg-stone-950 rounded-full transition-all duration-300 peer-checked:opacity-0"></span>
              <span className="w-full h-0.5 bg-stone-950 rounded-full transition-all duration-300 transform origin-center peer-checked:bg-stone-950 peer-checked:-rotate-45 peer-checked:-translate-y-2"></span>
            </label>

            {/* ৩. মোবাইল ড্রপডাউন মেনু প্যানেল (ইনপুট টগল চেকড হলে স্লাইড ডাউন হবে) */}
            <div className="fixed inset-x-0 top-0 h-screen bg-white/95 backdrop-blur-xl border-b border-stone-200 transition-all duration-300 ease-in-out z-40 md:hidden flex flex-col pt-24 px-6 overflow-y-auto pb-8 shadow-xl translate-y-[-100%] opacity-0 invisible peer-checked:translate-y-0 peer-checked:opacity-100 peer-checked:visible">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-900 border-b border-stone-100 pb-2 mb-4">
                ওয়েবসাইট ডিরেক্টরি 📖
              </span>
              <nav className="flex flex-col gap-1">
                {mobileLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.path}
                    className="text-stone-800 hover:text-rose-900 font-semibold text-base py-3 border-b border-stone-50/80 transition-colors flex items-center justify-between group"
                  >
                    <span>{link.name}</span>
                    <span className="text-stone-300 group-hover:text-rose-900 transition-colors text-xs font-mono">➔</span>
                  </Link>
                ))}
              </nav>
            </div>
            {/* =================================================================================== */}

          </div>
        </header>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-grow w-full block relative z-10">
          {children}
        </main>

        {/* ================= GLOBAL FOOTER (DEVELOPER EDITION) ================= */}
        <footer className="w-full bg-white border-t border-stone-200/60 py-10 mt-auto relative z-20">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">

            {/* বাম অংশ: কপিরাইট ও প্রাতিষ্ঠানিক তথ্য */}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-stone-600">
                © ২০২৬ উইল্‌স সাহিত্য ক্লাব। সর্বস্বত্ব সংরক্ষিত।
              </p>
              <p className="text-[11px] text-stone-400">
                উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ, ঢাকা।
              </p>
              <p className="text-[11px] italic text-stone-400 mt-2 max-w-xs mx-auto md:mx-0">
                "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে..."
              </p>
            </div>

            {/* can adjust contact details safely */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex flex-col gap-1 text-xs text-stone-500 font-medium">
                <span className="text-stone-800 font-bold uppercase tracking-wider text-[10px]">যোগাযোগ করুন</span>
                <a href="tel:+8801974745442" className="hover:text-rose-900 transition-colors flex items-center justify-center md:justify-start gap-1.5">
                  📞 +8801974-745442
                </a>
                <a href="mailto:wlfsc.sahittoclub@gmail.com" className="hover:text-rose-900 transition-colors flex items-center justify-center md:justify-start gap-1.5">
                  ✉️ wlfsc.sahittoclub@gmail.com
                </a>
              </div>

              {/* প্রিমিয়াম ডেভেলপার বাটন */}
              <div className="mt-1">
                <a 
                  href="https://www.instagram.com/relaxstudio__" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-100 hover:text-white rounded-lg text-[11px] font-semibold tracking-wide border border-stone-800 transition-all shadow-sm hover:scale-[1.02]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Dev: Relax Studio
                </a>
              </div>
            </div>

            {/* ডান অংশ: সোশ্যাল মিডিয়া পেজ লিঙ্কসমূহ */}
            <div className="flex flex-col md:items-end gap-2">
              <span className="text-stone-800 font-bold uppercase tracking-wider text-[10px]">আমাদের সামাজিক মাধ্যম</span>
              <div className="flex items-center justify-center gap-3">
                <a 
                  href="https://www.facebook.com/profile.php?id=61560572355031" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  title="Facebook Page"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H7v3h2v9h3v-9h2.721L15 8h-3V6.83c0-.855.207-1.291 1.23-1.291H15V3h-2.522C9.914 3 9 4.377 9 6.57V8z"/>
                  </svg>
                </a>

                <a 
                  href="https://www.instagram.com/willes_literary_club/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-pink-50 hover:text-pink-600 transition-all duration-200"
                  title="Instagram Page"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>

                <a 
                  href="https://www.youtube.com/@willes_literary_club" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                  title="YouTube Channel"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
