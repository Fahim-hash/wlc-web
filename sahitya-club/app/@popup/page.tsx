// app/@popup/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check jodi user notice ti eiti session e prothemar dekhche kina
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-900/40 backdrop-blur-md transition-all duration-300">
      
      {/* Pop-up Box Container */}
      <div className="relative w-full max-w-md mx-4 bg-white border border-stone-200 rounded-2xl shadow-2xl p-6 text-center transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button (Top Right Cross) */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
          aria-label="Close popup"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Box */}
        <div className="mt-2">
          <span className="inline-block bg-rose-50 text-rose-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            আসন্ন ইভেন্ট 📢
          </span>
          <h2 className="text-xl font-bold text-stone-950 mb-2">
            উইল্‌স সাহিত্য উৎসব ২০২৬
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            সাহিত্যের বন্ধনে আমাদের আগামী উৎসবের সদস্য নিবন্ধন ও ইভেন্ট রেজিস্ট্রেশন শুরু হয়েছে। আপনার সৃজনশীল প্রতিভা বিকাশে আজই যুক্ত হোন!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={handleClose}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-xl transition-colors"
          >
            পরে দেখবো
          </button>
          <Link 
            href="/register"
            onClick={handleClose}
            className="px-5 py-2.5 bg-rose-900 hover:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-900/10 transition-all"
          >
            নিবন্ধন করুন ➔
          </Link>
        </div>

      </div>
    </div>
  );
}
