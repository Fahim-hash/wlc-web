"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function MaintenancePage() {
  // 🚀 উদ্বোধনের কাঙ্ক্ষিত তারিখ ও সময় (YYYY-MM-DDTHH:mm:ss)
  const targetDate = new Date("2026-06-30T12:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ইউটিলিটি ফাংশন
  const toBengaliNumber = (num: number) => {
    const symbols: { [key: string]: string } = {
      "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", 
      "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
    };
    return String(num).padStart(2, "0").split("").map(digit => symbols[digit] || digit).join("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#fcfbf7] text-stone-900 selection:bg-rose-100 selection:text-rose-900 relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড ক্যালিগ্রাফি/জলছাপ ইফেক্ট */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none font-serif text-[12vw] leading-none text-stone-950 p-10 font-bold overflow-hidden">
        অ আ ই ঈ উ ঊ ঋ এ ঐ ও ঔ ক খ গ ঘ ঙ চ ছ জ ঝ ঞ ট ঠ ড ঢ
      </div>

      <div className="text-center max-w-xl w-full bg-[#fbf9f3] p-8 sm:p-14 rounded-3xl border border-stone-300/60 shadow-[0_20px_50px_rgba(139,92,26,0.05)] relative border-t-4 border-t-rose-900">
        
        {/* ক্লাসিক কর্নার বর্ডার ডিজাইন */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-stone-300 rounded-tl-md"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-stone-300 rounded-tr-md"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-stone-300 rounded-bl-md"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-stone-300 rounded-br-md"></div>

        {/* লোগো সেকশন */}
        <div className="relative w-20 h-20 mx-auto mb-6 transform hover:rotate-3 transition-transform">
          <Image 
            src="/logo.png" 
            alt="WLC Logo" 
            fill 
            className="object-contain filter sepia-[0.2]"
            priority
          />
        </div>

        {/* কাব্যিক মোড়ক */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-stone-100 text-stone-700 text-xs font-medium tracking-wider rounded-md border border-stone-200/60 mb-6 italic font-serif">
          📜 পাণ্ডুলিপি প্রস্তুত হচ্ছে...
        </span>

        {/* সাহিত্যিক হেডলাইন */}
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight leading-relaxed">
          "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে" <br />
          <span className="text-xl sm:text-2xl font-normal block mt-2 text-rose-900 italic font-sans font-medium">
            আসছে নতুন সরণি, নতুন রূপকথা।
          </span>
        </h1>
        
        {/* বিবরণী বা বাণী */}
        <p className="text-stone-600 text-sm mt-6 max-w-md mx-auto leading-relaxed font-serif italic">
          "কিছু শব্দ এখনো অলিখিত, কিছু গল্প এখনো ডানা মেলেনি। উইল্‌স সাহিত্য ক্লাবের নতুন ডিজিটাল মহাফেজখানা খোলার বাকি আর মাত্র কয়েক প্রহর..."
        </p>

        {/* ⏳ সাহিত্যিক কাউন্টডাউন টাইমার (বইয়ের পাতার মতো ডিজাইন) */}
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto my-10 relative">
          {[
            { label: "দিবস", value: toBengaliNumber(timeLeft.days) },
            { label: "প্রহর", value: toBengaliNumber(timeLeft.hours) },
            { label: "পল", value: toBengaliNumber(timeLeft.minutes) },
            { label: "অনুপল", value: toBengaliNumber(timeLeft.seconds) },
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-[#fefefc] border-b-4 border-stone-300 border rounded-xl py-3 px-1 flex flex-col items-center justify-center shadow-md relative group hover:-translate-y-1 transition-transform"
            >
              {/* বইয়ের মাঝখানের ভাঁজের মতো হালকা শ্যাডো লাইনিং */}
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-stone-100 pointer-events-none"></div>
              
              <span className="text-2xl sm:text-3xl font-bold font-serif text-rose-950 tracking-wider">
                {item.value}
              </span>
              <span className="text-[11px] font-medium text-stone-400 mt-1.5 border-t border-stone-100 w-full pt-1 text-center">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* কালির আঁচড় লাইন */}
        <div className="flex items-center justify-center gap-2 my-6 select-none opacity-40">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-stone-400"></div>
          <span className="text-stone-500 text-xs">✒️</span>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-stone-400"></div>
        </div>

        {/* ফুটার সিগনেচার */}
        <div className="pt-4 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400 font-serif">
          <p>© ২০২৬ উইল্‌স সাহিত্য ক্লাব প্যানেল</p>
          <p className="font-sans font-medium tracking-wide">
            লিপিকার: <span className="text-stone-700 font-bold hover:text-rose-900 transition-colors">Relax Studio</span>
          </p>
        </div>

      </div>
    </div>
  );
}
