'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Session track rakhar jonno jate bar bar refresh e user birokto na hoy
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
      
      {/* 🟢 Mockup Structure Container */}
      <div className="relative w-full max-w-md mx-4 transition-all transform animate-in fade-in zoom-in-95 duration-300">
        
        {/* ❌ Top-Right X (Close Button) - Mockup anujayi card er baire top right e positioned */}
        <button 
          onClick={handleClose}
          className="absolute -top-10 right-0 md:-right-6 text-white hover:text-stone-300 text-xl font-light p-2 transition-colors transition-transform hover:scale-110"
          aria-label="Close popup"
        >
          ✕
        </button>

        {/* 🖤 Top Black Box (Theme Design Container) */}
        <div className="w-[86%] mx-auto h-14 bg-stone-950 rounded-t-2xl relative flex items-center justify-center border border-stone-800 border-b-0 overflow-hidden">
          
          {/* Dynamic Theme Design (Gradient Line/Glow effect wrapper inside black box) */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-900/40 via-amber-500/20 to-rose-950/40 opacity-80" />
          <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-rose-700 via-amber-500 to-rose-900" />

          {/* 🏷️ LOGO Overlay Layout (Centrally layered) */}
          <div className="absolute top-1/2 -translate-y-1/2 z-10 bg-stone-950 px-4 py-1.5 rounded-xl border border-stone-800 shadow-lg flex items-center gap-2">
            <div className="relative w-5 h-5">
              <Image 
                src="/logo.png" 
                alt="WLC Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <span className="text-[10px] font-black tracking-widest text-white uppercase font-sans">
              LOGO / WLC
            </span>
          </div>
        </div>

        {/* ⚪ Main Event Details White Card */}
        <div className="w-full bg-white rounded-3xl shadow-2xl p-6 md:p-8 pt-10 text-center border border-stone-100 flex flex-col items-center">
          
          {/* Content Heading */}
          <span className="text-[10px] font-bold text-rose-900 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-md mb-3">
            আসন্ন উৎসব ও নোটিশ 📢
          </span>
          
          <h2 className="text-xl md:text-2xl font-bold text-stone-950 tracking-tight leading-tight mb-3">
            উইল্‌স সাহিত্য উৎসব ২০২৬
          </h2>

          {/* Event Details Here Area */}
          <p className="text-stone-600 text-sm leading-relaxed max-w-sm mb-8 font-medium">
            উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের শিক্ষার্থীদের সৃজনশীল লেখনী প্রকাশের সবচেয়ে বড় উৎসবের নিবন্ধন চলছে। আপনার গল্প, কবিতা বা কুইজে অংশ নিতে আজই যুক্ত হোন!
          </p>

          {/* 🔴 Red Action Button (Mockup ar matching button setup) */}
          <Link 
            href="/register"
            onClick={handleClose}
            className="w-32 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition-all hover:scale-[1.02] text-center block"
          >
            নিবন্ধন করুন ➔
          </Link>
          
        </div>

      </div>
    </div>
  );
}
