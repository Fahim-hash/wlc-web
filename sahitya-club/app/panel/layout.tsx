import Link from "next/link";
import { ReactNode } from "react";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold font-serif">প্যানেল আর্কাইভ</h2>
          <p className="text-sm text-gray-400 mt-1">উইল্‌স সাহিত্য ক্লাব</p>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/panel/running" className="px-4 py-3 bg-rose-800/20 hover:bg-rose-700 hover:text-white text-rose-100 rounded-lg transition-colors border border-rose-800/30">
            রানিং কমিটি (Running)
          </Link>
          <Link href="/panel/GEN-2" className="px-4 py-3 hover:bg-gray-800 text-gray-300 rounded-lg transition-colors">
            জেনারেশন-২ (GEN-2)
          </Link>
          <Link href="/panel/GEN-1" className="px-4 py-3 hover:bg-gray-800 text-gray-300 rounded-lg transition-colors">
            জেনারেশন-১ (GEN-1)
          </Link>
        </nav>
      </aside>

      {/* Page Content Area */}
      <main className="flex-1 p-6 md:p-12">
        {children}
      </main>
      
    </div>
  );
}
