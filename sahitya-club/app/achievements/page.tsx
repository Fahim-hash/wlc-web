// app/achievements/page.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AchievementsPage() {
  // টুফি স্টাইল লিস্টের ডেটা (ছবির নামগুলো public/achievement ਫোল্ডারের সাথে মিলিয়ে নেবে)
  const achievements = [
    {
      id: 1,
      title: "সেরা সাহিত্য ক্লাব অ্যাওয়ার্ড ২০২৫",
      category: "আন্তঃকলেজ স্বীকৃতি",
      date: "নভেম্বর ২০২৫",
      description: "জাতীয় সাহিত্য উৎসব ২০২৫-এ সৃজনশীল প্রকাশনা এবং দেয়ালিকা বিভাগে অসাধারণ অবদানের জন্য আমাদের ক্লাবকে এই সম্মাননা দেওয়া হয়। উইলসের ইতিহাসে এটি অন্যতম একটি বড় অর্জন।",
      imageName: "award_2025.jpg" // public/achievement/award_2025.jpg
    },
    {
      id: 2,
      title: "আন্তঃকলেজ দেয়ালিকা প্রতিযোগিতায় ১ম স্থান",
      category: "প্রতিযোগিতা",
      date: "ফেব্রুয়ারি ২০২৬",
      description: "ভাষা দিবস উপলক্ষে আয়োজিত বিশেষ উৎসবে আমাদের যৌথ সম্পাদনা প্যানেলের তৈরি দেয়ালিকা 'স্পন্দন' প্রথম স্থান অধিকার করে। মেম্বারদের কঠোর পরিশ্রমের ফসল ছিল এই ট্রফি।",
      imageName: "wall_mag_2026.jpg" // public/achievement/wall_mag_2026.jpg
    },
    {
      id: 3,
      title: "সৃজনশীল লেখনী ও কুইজ চ্যাম্পিয়নশিপ",
      category: "প্রতিযোগিতা",
      date: "মার্চ ২০২৬",
      description: "ঢাকা অঞ্চলের সেরা ১০টি কলেজের অংশগ্রহণে অনুষ্ঠিত সাহিত্য কুইজে আমাদের কুইজ টিম রানার্স-আপ ট্রফি অর্জন করে। ফাইনালে তুমুল লড়াইয়ের পর আমরা এই গৌরব অর্জন করি।",
      imageName: "quiz_2026.jpg" // public/achievement/quiz_2026.jpg
    }
  ];

  const stats = [
    { value: "০৫+", label: "জাতীয় ট্রফি" },
    { value: "১২+", label: "আন্তঃকলেজ পুরস্কার" },
    { value: "৫০+", label: "প্রকাশিত লেখা" },
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-rose-200 pb-20">
      
      {/* 🧭 মিনিমাল নেভিগেশন বার */}
      <nav className="w-full bg-white border-b border-gray-200/80 px-6 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-xl text-stone-900 hover:text-rose-700 transition-colors">
            উইল্‌স সাহিত্য ক্লাব
          </Link>
          <Link href="/" className="text-sm font-semibold bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-rose-900 transition-colors">
            🏠 হোমপেজ
          </Link>
        </div>
      </nav>

      {/* 🎭 হেডার সেকশন */}
      <section className="bg-white border-b border-gray-200 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900 via-gray-100 to-white"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-rose-700 text-sm font-bold tracking-widest uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Our Glory
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mt-4 mb-4">
            সাফল্য ও গৌরবগাথা
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            উইলিয়ানদের মেধা, ক্লান্তিহীন পরিশ্রম এবং সাহিত্যের প্রতি ভালোবাসার হাত ধরে আসা আমাদের প্রাতিষ্ঠানিক অর্জনসমূহ।
          </p>
        </div>
      </section>

      {/* 📊 কাউন্টার / স্ট্যাটস গ্রিড */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-3 bg-white border border-gray-200 rounded-2xl shadow-md p-6 md:p-8 text-center divide-x divide-gray-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col justify-center">
              <span className="text-2xl md:text-4xl font-extrabold text-stone-900 font-serif block mb-1">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-gray-500 font-medium tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 🎬 Toffee স্টাইল অল্টারনেটিং (জিগ-জ্যাগ) লিস্ট সেকশন */}
      <section className="max-w-5xl mx-auto px-6 mt-20 space-y-16 md:space-y-24">
        {achievements.map((item, index) => {
          // ইভেন্ট বা অড (index) ইনডেক্স চেক করে পিসিতে ডিরেকশন উল্টে দেওয়ার লজিক
          const isEven = index % 2 === 0;

          return (
            <div 
              key={item.id}
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white md:bg-transparent border border-gray-200/60 md:border-none rounded-2xl md:rounded-none overflow-hidden shadow-sm md:shadow-none p-4 md:p-0 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* 📸 ১. ইমেজ কন্টেইনার (পিসিতে অল্টারনেট করবে, মোবাইলে সবসময় উপরে থাকবে) */}
              <div className="w-full md:w-1/2 aspect-[16/10] relative rounded-xl overflow-hidden shadow-md bg-stone-100 flex-shrink-0 group">
                <Image
                  src={`/achievement/${item.imageName}`}
                  alt={item.title}
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index === 0}
                />
                <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {item.category}
                </div>
              </div>

              {/* 📝 ২. টেক্সট কন্টেইনার (হেডলাইন + ডেসক্রিপশন) */}
              <div className="w-full md:w-1/2 flex flex-col justify-center py-2 px-2 md:px-0">
                <span className="text-xs text-rose-700 font-bold tracking-wide uppercase mb-1 block">
                  📅 {item.date}
                </span>
                
                <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-4 tracking-tight leading-tight hover:text-rose-950 transition-colors">
                  {item.title}
                </h2>
                
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="w-16 h-1 bg-stone-900 rounded-full"></div>
              </div>

            </div>
          );
        })}
      </section>

      {/* 📢 ফুটনোট বা কল-টু-অ্যাকশন */}
      <section className="max-w-3xl mx-auto px-6 text-center mt-24">
        <div className="bg-stone-950 text-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-rose-950/40 via-transparent to-transparent"></div>
          <h4 className="text-xl md:text-2xl font-serif font-bold mb-3 relative z-10">
            তুমি কি পরবর্তী অর্জনের অংশ হতে চাও?
          </h4>
          <p className="text-stone-400 text-sm max-w-md mx-auto mb-6 relative z-10 leading-relaxed">
            আমাদের ক্লাবের সদস্য হিসেবে যোগ দিয়ে তোমার সৃজনশীল লেখনী ও প্রতিভাকে মেলে ধরো আন্তর্জাতিক বা জাতীয় মঞ্চে।
          </p>
          <Link 
            href="/registration" 
            className="inline-block bg-white text-stone-950 font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-rose-50 transition-colors relative z-10 shadow-sm"
          >
            আজই মেম্বারশিপ নাও ✒️
          </Link>
        </div>
      </section>

    </main>
  );
}
