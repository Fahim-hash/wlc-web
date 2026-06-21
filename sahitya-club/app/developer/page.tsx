"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function DevelopersPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans p-8 md:p-16 max-w-5xl mx-auto flex flex-col justify-center">
      
      {/* 🔮 হেডার সেকশন */}
      <header className="border-b border-gray-200 pb-8 mb-12">
        <span className="text-rose-700 text-sm font-bold uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Engineering & Design
        </span>
        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-3 mb-2">Platform Developers</h1>
        <p className="text-gray-500 text-sm md:text-base">উইল্‌স সাহিত্য ক্লাবের ডিজিটাল প্ল্যাটফর্মের পেছনের কারিগর।</p>
      </header>

      {/* 🛠️ মেইন কন্টেন্ট / ডেভেলপার প্রোফাইল */}
      <section className="flex-grow flex items-center justify-center my-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm max-w-2xl w-full text-center space-y-6 relative overflow-hidden">
          {/* কর্নার ডেকোরেশন */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full pointer-events-none border-b border-l border-rose-100/40" />

          {/* 🎯 রিল্যাক্স স্টুডিও ব্ল্যাক লোগো ইমেজিং */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center transform hover:scale-105 hover:rotate-3 transition-transform duration-300 select-none">
            <Image
              src="/relaxstudio.png"
              alt="Relax Studio Logo"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>

          {/* নাম ও টাইটেল */}
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Relax Studio</h2>
            <p className="text-rose-700 text-xs font-bold uppercase tracking-widest">Digital Architecture & Identity</p>
          </div>

          {/* বিবরণী */}
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium">
            উইল্‌স সাহিত্য ক্লাবের অফিশিয়াল ওয়েব অ্যাপ্লিকেশনটি নিখুঁত কোডструкচার, স্টাইল গাইডলাইন এবং মডার্ন ইউজার এক্সপেরিয়েন্সের সমন্বয়ে ডিজাইন ও ডেভেলপ করেছে <strong className="text-gray-900">Relax Studio</strong>।
          </p>

          {/* অ্যাকশন বাটনসমূহ */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://www.instagram.com/relaxstudio__" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-stone-900 text-white font-semibold text-xs px-6 py-3 rounded-xl hover:bg-rose-800 transition-colors shadow-sm text-center"
            >
              📸 Follow on Instagram
            </a>
            <Link 
              href="/" 
              className="w-full sm:w-auto bg-white border border-gray-200 text-stone-800 font-semibold text-xs px-6 py-3 rounded-xl hover:bg-stone-50 transition-colors text-center"
            >
              ← মূল ওয়েবসাইটে ফিরুন
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
