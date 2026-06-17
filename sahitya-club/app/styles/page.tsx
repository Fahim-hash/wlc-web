// app/styles/page.tsx
"use client";

import React from "react";
import Image from "next/image";

export default function StyleGuidePage() {
  const colors = [
    { name: "Primary Rose", hex: "#9F1239", tailwind: "bg-rose-800", text: "text-white" },
    { name: "Secondary Rose", hex: "#BE123C", tailwind: "bg-rose-700", text: "text-white" },
    { name: "Deep Stone", hex: "#1C1917", tailwind: "bg-stone-900", text: "text-white" },
    { name: "Muted Gray", hex: "#6B7280", tailwind: "bg-gray-500", text: "text-white" },
    { name: "Background Light", hex: "#FAFAFA", tailwind: "bg-[#FAFAFA]", text: "text-gray-800" },
    { name: "Pure White", hex: "#FFFFFF", tailwind: "bg-white", text: "text-gray-800" },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans p-8 md:p-16 max-w-5xl mx-auto">
      
      {/* 🔮 হেডার */}
      <header className="border-b border-gray-200 pb-8 mb-12">
        <span className="text-rose-700 text-sm font-bold uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Design System
        </span>
        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-3 mb-2">Style Guide & UI Tokens</h1>
        <p className="text-gray-500 text-sm md:text-base">উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইটের ভিজ্যুয়াল কন্সিস্টেন্সি বজায় রাখার গাইডলাইন।</p>
      </header>

      {/* 🎨 ১. কালার প্যালেট */}
      <section className="mb-16">
        <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 border-l-4 border-rose-800 pl-3">১. কালার প্যালেট (Brand Colors)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {colors.map((color, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
              <div className={`w-full aspect-square rounded-xl mb-3 ${color.tailwind} flex items-end p-2`}>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 bg-black/20 backdrop-blur-sm rounded ${color.text}`}>
                  {color.hex}
                </span>
              </div>
              <h3 className="font-bold text-xs text-gray-900">{color.name}</h3>
              <p className="text-[10px] text-gray-400 font-mono mt-0.5">{color.tailwind}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ✍️ ২. টাইপোগ্রাফি */}
      <section className="mb-16 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 border-l-4 border-rose-800 pl-3">২. টাইপোগ্রাফি (Fonts & Sizes)</h2>
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-[10px] font-mono text-gray-400">Font Serif (শিরোনামের জন্য)</span>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mt-1">উইলস সাহিত্য ক্লাব ২০২৬</h1>
          </div>
          <div className="border-b border-gray-100 pb-4">
            <span className="text-[10px] font-mono text-gray-400">Font Sans (বডি টেক্সটের জন্য)</span>
            <p className="text-base text-gray-600 mt-1 leading-relaxed">
              সৃজনশীল লেখনী ও সাহিত্যের এক অপূর্ব মেলবন্ধন। আমাদের সব সাধারণ বডি টেক্সট এবং বিবরণ এই ফন্টে রেন্ডার হবে।
            </p>
          </div>
        </div>
      </section>

      {/* 🔘 ৩. বাটন ও ইন্টারঅ্যাকশন */}
      <section className="mb-16">
        <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 border-l-4 border-rose-800 pl-3">৩. বাটনসমূহ (Buttons)</h2>
        <div className="flex flex-wrap gap-4 items-center bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div>
            <span className="block text-[10px] font-mono text-gray-400 mb-2">Primary Button</span>
            <button className="bg-stone-950 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-rose-900 transition-colors shadow-sm">
              Primary Action ➔
            </button>
          </div>
          <div>
            <span className="block text-[10px] font-mono text-gray-400 mb-2">Secondary Button</span>
            <button className="bg-white border border-gray-200 text-stone-800 font-semibold text-xs px-5 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
              Secondary Action
            </button>
          </div>
          <div>
            <span className="block text-[10px] font-mono text-gray-400 mb-2">Status Badge</span>
            <span className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-100 px-3 py-1 rounded-full uppercase">
              রেজিস্ট্রেশন চলছে
            </span>
          </div>
        </div>
      </section>

      {/* 🏷️ ৪. লোগো ও ব্র্যান্ডিং */}
      <section className="mb-16">
        <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 border-l-4 border-rose-800 pl-3">
          ৪. লোগো ও ব্র্যান্ডিং (Logos & Asset)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* ক্লাবের অফিশিয়াল লোগো */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-gray-400 mb-4 self-start">Path: /logo.png</span>
            <div className="relative w-36 h-36 mb-4 bg-[#FAFAFA] rounded-2xl p-4 border border-gray-100 flex items-center justify-center group hover:border-rose-200 transition-colors">
              <Image 
                src="/logo.png" 
                alt="WLC Club Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-sm font-bold text-gray-800">উইলস সাহিত্য ক্লাব লোগো</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              নেভিগেশন বার, ব্র্যান্ডিং এলিমেন্ট এবং মেইন ডক্সের জন্য ব্যবহৃত প্রাথমিক অ্যাসেট।
            </p>
          </div>

          {/* মাদার ইনস্টিটিউশন (স্কুলের) লোগো */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono text-gray-400 mb-4 self-start">Path: /wlfsc.png</span>
            <div className="relative w-36 h-36 mb-4 bg-[#FAFAFA] rounded-2xl p-4 border border-gray-100 flex items-center justify-center group hover:border-rose-200 transition-colors">
              <Image 
                src="/wlfsc.png" 
                alt="WLFSC School Logo"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-sm font-bold text-gray-800">WLFSC অফিশিয়াল মনোগ্রাম</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
              মাদার ইনস্টিটিউশন বা প্রাতিষ্ঠানিক পরিচয় এবং ফুটার সেকশনের ক্রেডিটে ব্যবহারের জন্য।
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}
