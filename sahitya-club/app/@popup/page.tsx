'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Session check jate refresh korle bar bar user birokto na hoy
    const hasSeenNotice = localStorage.getItem('wlc_event_notice_2026');
    if (!hasSeenNotice) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('wlc_event_notice_2026', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/50 backdrop-blur-md transition-all duration-300">
      
      {/* 📦 Main Pop-up Container (Based on Sketch Layout) */}
      <div className="relative w-full max-w-xl mx-4 bg-white border border-stone-200/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in-95 duration-300">
        
        {/* 🟥 Left Section (Sketch er baam pasher rectangular box anujayi button element) */}
        <div className="bg-rose-950 text-stone-100 p-6 flex flex-col justify-center items-center text-center md:w-1/3 border-b md:border-b-0 md:border-r border-stone-100/10">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
            <span className="text-2xl">✨</span>
          </div>
          <h3 className="font-bold text-base mb-1">উৎসব ২০২৬</h3>
          <p className="text-[11px] text-rose-200 leading-snug max-w-[120px]">
            সাহিত্যের বন্ধনে নতুন এক প্রাঙ্গণ
          </p>
          <Link 
            href="/register"
            onClick={handleClose}
            className="mt-5 w-full py-2 bg-white text-rose-950 font-bold text-xs rounded-lg shadow-sm hover:bg-stone-100 transition-all text-center block"
          >
            যুক্ত হোন ➔
          </Link>
        </div>

        {/* 🟦 Right Main Content Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative bg-gradient-to-br from-white to-stone-50/50">
          
          {/* Close Trigger (X Button) */}
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-all"
            aria-label="Close popup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Main Typography & Body text */}
          <div className="pr-4 mt-2">
            <span className="inline-block bg-rose-50 text-rose-900 text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md mb-2.5">
              আসন্ন উৎসব ও নোটিশ 📢
            </span>
            <h2 className="text-xl font-bold text-stone-950 tracking-tight leading-tight mb-2">
              উইল্‌স সাহিত্য উৎসব ২০২৬
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
              উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাবের উদ্যোগে আয়োজিত হতে যাচ্ছে বছরের সবথেকে বড় উৎসব। কবিতা, গল্প এবং কুইজ প্রতিযোগিতায় অংশগ্রহণের জন্য রেজিষ্ট্রেশন চলছে।
            </p>
          </div>

          {/* 🎨 Bottom Buttons Section */}
          <div className="flex gap-2 justify-end mt-6">
            <button 
              onClick={handleClose}
              className="px-4 py-2 text-stone-500 hover:text-stone-800 text-xs font-semibold rounded-lg hover:bg-stone-100 transition-colors"
            >
              পরে দেখবো
            </button>
            <Link 
              href="/events"
              onClick={handleClose}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-all"
            >
              বিস্তারিত জানুন
            </Link>
          </div>
        </div>

        {/* 🏷️ LOGO & Extra Dynamic Theme Bar Panel (Sketch এর ডান পাশের Vertical Layout) */}
        <div className="w-full md:w-16 bg-stone-100 border-t md:border-t-0 md:border-l border-stone-200/60 p-3 flex flex-row md:flex-col items-center justify-between md:justify-start gap-4">
          
          {/* Logo Container */}
          <div className="relative w-8 h-8 md:w-10 md:h-10 shrink-0">
            <Image 
              src="/logo.png" 
              alt="উইল্‌স সাহিত্য ক্লাব লোগো" 
              fill 
              className="object-contain"
            />
          </div>
          
          {/* Vertical 'LOGO' Label or Identifier text */}
          <span className="text-[9px] font-black tracking-widest uppercase text-stone-400 select-none md:[writing-mode:vertical-lr] md:rotate-180">
            WLC PNL
          </span>

          {/* 🌟 Extra Bar / Event Theme Graphic Decor (Sketch Er Niche Jetu Chilo) */}
          <div className="flex-grow w-24 md:w-full h-2 md:h-full mt-0 md:mt-2 bg-gradient-to-r md:bg-gradient-to-b from-rose-900 via-amber-500 to-rose-950 rounded-full opacity-90 relative overflow-hidden" title="Event Theme Color">
            {/* Animated Glow Element over theme bar */}
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
