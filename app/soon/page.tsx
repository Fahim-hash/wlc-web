"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function ComingSoonPage() {
  // ১. লাইভ কাউন্টডাউন স্টেট
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isSurprised, setIsSurprised] = useState(false);
  const [fallingElements, setFallingElements] = useState<any[]>([]);

  // ২. ক্লাবের ভাইব অনুযায়ী পেজ লোড হলে ব্যাকগ্রাউন্ডের এলিমেন্টগুলো জেনারেট করা
  useEffect(() => {
    const items = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${6 + Math.random() * 8}s`,
      size: `${12 + Math.random() * 16}px`,
      opacity: 0.15 + Math.random() * 0.3,
      // সাহিত্য ক্লাবের জন্য বই, কলম, তারা ও ফুলের পাপড়ির ইমোজি মিক্স
      content: ["🌸", "✨", "✒️", "📄", "✨"][Math.floor(Math.random() * 5)],
    }));
    setFallingElements(items);
  }, []);

  useEffect(() => {
    const targetDate = new Date("2026-08-08T16:30:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] text-stone-800 font-sans flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      
      {/* 🍂 Falling Elements Layer (Decoration) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {fallingElements.map((item) => (
          <div
            key={item.id}
            className="absolute animate-fall"
            style={{
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
              fontSize: item.size,
              opacity: item.opacity,
              top: "-5%",
            }}
          >
            {item.content}
          </div>
        ))}
      </div>

      {/* ব্যাকগ্রাউন্ড ক্রিয়েটিভ গ্লো আর্ট (WLC ক্লাসিক রোজ থিম) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-100/30 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-stone-200/40 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-3xl w-full text-center bg-white border border-stone-200/80 rounded-[2.5rem] p-8 md:p-16 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-rose-200/50 z-10">

        {/* টপ মেটালিক অ্যান্ড নিওন এক্সেন্ট */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-900 via-stone-900 to-rose-700" />

        {/* 🎯 উইল্‌স সাহিত্য ক্লাব অফিশিয়াল স্কয়ার লোগো বক্স */}
        <div className="relative w-24 h-24 mx-auto mb-6 bg-stone-50 rounded-2xl p-2 border border-stone-200/60 flex items-center justify-center shadow-md select-none transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-rose-900/10 group">
          <Image
            src="/logo.png" 
            alt="Willes Literary Club Logo"
            width={80}
            height={80}
            className="object-contain aspect-square"
            priority
          />
          <div className="absolute inset-0 border border-transparent group-hover:border-rose-900/20 rounded-2xl transition-colors duration-500" />
        </div>

        {/* ক্লাবের নাম ও স্লোগান */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 text-rose-900 text-xs font-bold uppercase tracking-widest bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100/80 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-rose-800 animate-pulse"></span>
            নতুন চমক আসছে
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-stone-950 tracking-tight mt-2">
            উইল্‌স সাহিত্য ক্লাব
          </h1>
          <p className="text-rose-900/80 text-xs md:text-sm font-semibold tracking-wide italic">
            "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে..."
          </p>
          <p className="text-stone-500 text-xs md:text-sm font-medium max-w-md mx-auto leading-relaxed pt-2">
            আমাদের অফিশিয়াল ওয়েব প্ল্যাটফর্মটি চমৎকার সব কন্টেন্ট ও ইন্টারঅ্যাক্টিভ ফিচার দিয়ে সাজানো হচ্ছে।
          </p>
        </div>

        {/* ⏳ লাইভ কাউন্টডাউন টাইমার */}
        <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-lg mx-auto my-8">
          {[
            { label: "দিন", value: timeLeft.days },
            { label: "ঘণ্টা", value: timeLeft.hours },
            { label: "মিনিট", value: timeLeft.minutes },
            { label: "সেকেন্ড", value: timeLeft.seconds },
          ].map((item, index) => (
            <div 
              key={index} 
              className="bg-stone-50/80 border border-stone-200/60 rounded-2xl p-3 md:p-4 flex flex-col justify-center items-center shadow-inner group/time transition-all duration-300 hover:bg-rose-900 hover:text-white"
            >
              <span className="text-xl md:text-3xl font-bold font-mono tracking-tight text-stone-900 group-hover/time:text-white transition-colors">
                {String(item.value).padStart(2, "0")}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-stone-400 group-hover/time:text-rose-200 transition-colors mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 🛠️ ইন্টারঅ্যাক্টিভ অ্যাকশন বাটন এরিয়া */}
        <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto">
          <button 
            onClick={() => {
              setIsSurprised(true);
              setTimeout(() => setIsSurprised(false), 3000);
            }}
            className="w-full bg-stone-950 hover:bg-rose-900 text-white font-semibold text-xs py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md text-center active:scale-95 flex items-center justify-center gap-2 select-none"
          >
            {isSurprised ? "🎉 প্রস্তুত তো উইলিয়ান?" : "✨ একটু ছোঁয়া দিয়ে দেখুন"}
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 font-semibold text-xs py-3.5 px-6 rounded-xl transition-all duration-300 text-center active:scale-95 shadow-sm"
          >
            পেজ রিফ্রেশ করুন
          </button>
        </div>

        {/* সারপ্রাইজ টেক্সট পপ-আপ */}
        <div className={`mt-6 text-xs font-semibold text-rose-900 bg-rose-50 border border-rose-100 rounded-xl py-2.5 px-4 inline-block transition-all duration-500 transform ${isSurprised ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"}`}>
          ✨ সাহিত্যের ডিজিটাল মঞ্চ সাজাতে দিন-রাত কাজ করছে আমাদের ক্রিয়েটিভ টিম!
        </div>

      </div>

      {/* 🎨 Falling Animation Keyframes CSS */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }
        .animate-fall {
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </main>
  );
}
