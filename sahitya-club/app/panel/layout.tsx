// app/panel/layout.tsx
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

export default function PanelLayout({ children }: { children: ReactNode }) {
  const links = [
    { name: "রানিং কমিটি", path: "/panel/running" },
    { name: "জেনারেশন-১", path: "/panel/GEN-1" },
    { name: "অস্থায়ী কার্যনির্বাহী", path: "/panel/temporary" },
    { name: "শিক্ষক মডারেটর", path: "/panel/moderator" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans relative flex flex-col overflow-hidden">
      
      {/* সুক্ষ্ম ব্যাকগ্রাউন্ড মোটিফ - সাহিত্যিক আবহ তৈরি করার জন্য */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 flex-grow w-full">
        
        {/* মিনিমালিস্টিক অ্যান্ড এলিগ্যান্ট টপ হেডার */}
        <header className="flex flex-col items-center text-center mb-12 border-b border-stone-200 pb-8">
          <div className="relative w-24 h-24 mb-4 drop-shadow-sm bg-white rounded-full p-1 border border-stone-100">
            <Image 
              src="/logo.png" 
              alt="উইল্‌স সাহিত্য ক্লাব" 
              fill 
              className="object-contain p-1"
              priority 
            />
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-850 tracking-wide uppercase">
            উইল্‌স সাহিত্য ক্লাব
          </h2>
          <p className="text-xs text-rose-800 font-semibold mt-1 tracking-widest font-serif">
            "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে"
          </p>
        </header>

        {/* মডার্ন অ্যান্ড স্লিক প্যানেল সুইচিং বার (সাইডবারের বিকল্প) */}
        <div className="flex justify-center mb-12">
          <nav className="inline-flex bg-stone-100/80 backdrop-blur-md p-1.5 rounded-full shadow-inner border border-stone-200/60">
            {links.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className="px-6 py-2.5 rounded-full text-sm font-medium text-stone-600 hover:text-rose-900 transition-all duration-300 hover:bg-white hover:shadow-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* মেইন কনটেন্ট এরিয়া (যেখানে ট্রি-স্ট্রাকচার লোড হবে) */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-stone-200/40 shadow-sm">
          {children}
        </div>

      </div>
    </div>
  );
}
