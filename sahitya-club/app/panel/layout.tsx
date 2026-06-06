// app/panel/layout.tsx
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

export default function PanelLayout({ children }: { children: ReactNode }) {
  const links = [
    { name: "রানিং কমিটি", path: "/panel/running" },
    { name: "জেনারেশন-২ (GEN-2)", path: "/panel/GEN-2" },
    { name: "জেনারেশন-১ (GEN-1)", path: "/panel/GEN-1" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row font-sans relative overflow-hidden">
      
      {/* Background Motifs */}
      <div className="absolute inset-0 z-0 opacity-[0.03] text-gray-900 font-serif text-[12vw] leading-none select-none pointer-events-none p-10">
        অ ক ক ক ব ফ ব ত ল ন শ শ ক ক ক ব ল ব র ন ত শ ন
      </div>

      {/* Modern Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col shadow-2xl relative z-10">
        <div className="p-8 border-b border-gray-800 flex flex-col items-center gap-4 text-center">
          <div className="relative w-20 h-20 bg-white rounded-full p-2">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif text-white">প্যানেল আর্কাইভ</h2>
            <p className="text-sm text-gray-400 mt-1">উইল্‌স সাহিত্য ক্লাব</p>
          </div>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-3">
          {links.map((link) => (
            <Link key={link.path} href={link.path} className="group relative px-5 py-3.5 hover:text-white rounded-lg transition-colors overflow-hidden border border-gray-800 hover:border-rose-900 bg-gray-800/20 hover:bg-rose-950/20">
              <span className="relative z-10 font-medium text-gray-100">{link.name}</span>
              <div className="absolute inset-y-0 left-0 w-1.5 bg-rose-700 -translate-x-full group-hover:translate-x-0 transition-transform"></div>
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} WSC. All rights reserved.</p>
          <p className="mt-1">Dhaka, Bangladesh</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 xl:p-16 relative z-10">
        {children}
      </main>
      
    </div>
  );
}
