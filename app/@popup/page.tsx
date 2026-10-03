'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Session track jate user refresh korle bar bar distrubed na hoy
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/60 backdrop-blur-md transition-all duration-300">
      
      {/* 📂 Main Box Matrix Wrapper */}
      <div className="relative w-full max-w-xl mx-4 transition-all transform animate-in fade-in zoom-in-95 duration-300">
        
        {/* ❌ Absolute Top-Right Close Button (Mockup frame er ekdom baire) */}
        <button 
          onClick={handleClose}
          className="absolute -top-12 right-0 md:-right-6 text-white hover:text-stone-300 text-xl font-light p-2 transition-transform hover:scale-110"
          aria-label="Close popup"
        >
          ✕
        </button>

        {/* 🏷️ FLOATING LOGO OVERLAY (dfghdfh.jpg style anujayi top blank space position) */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-30 w-16 h-16 transition-transform duration-300 hover:scale-105">
          <Image 
            src="/logo.png" 
            alt="WLC Logo" 
            fill 
            className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* 🎨 TOP MULTI-COLOR THEME TAB SYSTEM (Based on dfghdfh.jpg) */}
        <div className="w-[90%] mx-auto flex items-end justify-between relative z-10 -mb-[1px]">
          {/* Left Green Tab */}
          <div className="w-16 h-7 bg-emerald-500 rounded-t-xl border border-emerald-600/20 shadow-sm" />
          
          {/* Center Crimson Red Theme Bar */}
          <div className="flex-1 max-w-[280px] h-9 bg-rose-700 rounded-t-xl border border-rose-800/40 flex items-center justify-center shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
            <span className="text-white font-bold text-xs tracking-wider px-2 font-sans text-center truncate drop-shadow-sm">
              সাহিত্যের নবীনবরণ ২০২৬ 🎉
            </span>
          </div>

          {/* Right Green Tab */}
          <div className="w-16 h-7 bg-emerald-500 rounded-t-xl border border-emerald-600/20 shadow-sm" />
        </div>

        {/* ⚪ MAIN WHITE CARD FRAME */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 pt-12 text-center border-2 border-stone-100 flex flex-col items-center relative z-20">
          
          {/* Main Title / Banner Notice text */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-stone-950 tracking-tight leading-tight mb-4">
            নবীনদের সাহিত্য প্রাঙ্গণে স্বাগতম!
          </h2>

          {/* Event Details Description block */}
          <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-md mb-8 font-medium">
            উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের শিক্ষার্থীদের নতুন সাহিত্যিক মেলবন্ধনে আমন্ত্রণ জানাচ্ছে উইল্‌স সাহিত্য ক্লাব। আমাদের বিশেষ নবীনবরণ উৎসবের আসন সংখ্যা সীমিত হওয়ায় আজই আপনার নিবন্ধন নিশ্চিত করুন।
          </p>

          {/* 🔴 CUSTOM RED ACTION BUTTON (dfghdfh.jpg ar thik bottom base layout matching) */}
          <Link 
            href="/register"
            onClick={handleClose}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs md:text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.03] active:scale-[0.98] text-center"
          >
            নিবন্ধন নিশ্চিত করুন ➔
          </Link>
          
        </div>

      </div>
    </div>
  );
}
