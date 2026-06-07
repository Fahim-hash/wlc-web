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

export const metadata: Metadata = {
  title: "উইল্‌স সাহিত্য ক্লাব | Wills Literary Club",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব ওয়েবসাইট।",
  // [FIX] এখানে টপ বারের লোগো কনফিগারেশন যুক্ত করা হয়েছে
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
    { name: "নবীনবরণ '২৫", path: "/nobinboron" }, // [NEW] নবীনবরণ পেজের লিংক
    { name: "আর্কাইভ ও প্যানেল", path: "/panel" },
    { name: "শিক্ষক মডারেটর", path: "/panel/moderator" },
  ];

  return (
    <html lang="bn" className="h-full">
      <body className={`${hindSiliguri.className} bg-stone-50 text-stone-900 min-h-screen flex flex-col selection:bg-rose-100 selection:text-rose-900 antialiased overflow-x-hidden`}>
        
        {/* ================= GLOBAL HEADER / NAVBAR ================= */}
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-stone-200/60 transition-all">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* ব্র্যান্ড লোগো */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* লোগো কন্টেইনার */}
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

        {/* ================= GLOBAL FOOTER (FIXED) ================= */}
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
              "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে এগিয়ে চলেছে উইলিয়ানদের ভালোবাসার এই prangon।"
            </div>

          </div>
        </footer>

      </body>
    </html>
  );
}
