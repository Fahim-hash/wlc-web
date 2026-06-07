// app/layout.tsx
import type { Metadata } from "next";
import { Hind_Siliguri, SolaimanLipi } from "next/font/google"; // যদি ফন্ট কনফিগার করা থাকে
import Link from "next/link";
import "./globals.css"; // তোমার গ্লোবাল সিএসএস ফাইল

export const metadata: Metadata = {
  title: "উইল্‌স সাহিত্য ক্লাব | Wills Literary Club",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব ওয়েবসাইট।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // মেইন ন্যাভিগেশন লিংকসমূহ (এখানে শিক্ষক প্যানেল ও মেইন পেজ সুন্দরভাবে লিঙ্কড)
  const navLinks = [
    { name: "হোম", path: "/" },
    { name: "আমাদের কথা", path: "/about" },
    { name: "আর্কাইভ ও প্যানেল", path: "/panel" },
    { name: "শিক্ষক মডারেটর", path: "/panel/moderator" },
  ];

  return (
    <html lang="bn">
      <body className="bg-stone-50 text-stone-900 min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-900 antialiased">
        
        {/* ================= GLOBAL HEADER / NAVBAR ================= */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/60 transition-all">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* ক্লাবের লোগো ও ব্র্যান্ড নেম */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="text-xl md:text-2xl group-hover:rotate-12 transition-transform duration-300">✒️</span>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base md:text-lg tracking-tight text-stone-950 group-hover:text-rose-900 transition-colors">
                  উইল্‌স সাহিত্য ক্লাব
                </span>
                <span className="text-[10px] uppercase font-sans tracking-widest text-stone-400 font-medium -mt-0.5">
                  Wills Literary Club
                </span>
              </div>
            </Link>

            {/* ডেস্কটপ ন্যাভিগেশন মেনু */}
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

            {/* মোবাইল বাটন (মোবাইলে শুধু অ্যাকশন বাটন বা হ্যামবার্গার ফিট করবে) */}
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
        <main className="flex-grow">
          {children}
        </main>

        {/* ================= GLOBAL FOOTER ================= */}
        <footer className="bg-white border-t border-stone-200/60 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            
            {/* কপিরাইট ও প্রাতিষ্ঠানিক তথ্য */}
            <div>
              <p className="text-xs font-medium text-stone-500">
                © ২০২৬ উইল্‌স সাহিত্য ক্লাব। সর্বস্বত্ব সংরক্ষিত।
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5 font-serif">
                উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ, ঢাকা।
              </p>
            </div>

            {/* ফুটনোট বা ট্যাগলাইন */}
            <div className="text-xs italic font-serif text-stone-400 max-w-xs md:text-right">
              "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে এগিয়ে চলেছে উইলিয়ানদের ভালোবাসার এই প্রাঙ্গণ।"
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
