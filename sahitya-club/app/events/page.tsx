// app/events/page.tsx
"use client";

import React from "react";
import Link from "next/link";

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "জাতীয় দেয়ালিকা ও কুইজ উৎসব ২০২৬",
      date: "২৫ জুলাই, ২০২৬",
      time: "সকাল ০৯:০০ - বৈকাল ০৪:০০",
      venue: "কলেজ অডিটোরিয়াম, WLFSC",
      status: "রেজিস্ট্রেশন চলছে",
      description: "সারাদেশের ৫০টিরও বেশি কলেজের অংশগ্রহণে অনুষ্ঠিত হতে যাচ্ছে এই মেগা উৎসব। যেখানে থাকবে দেয়ালিকা প্রদর্শনী, সাহিত্য কুইজ এবং স্ক্রিপ্ট রাইটিং কম্পিটিশন।"
    }
  ];

  const pastEvents = [
    {
      id: 2,
      title: "অমর একুশে সাহিত্য আসর ও বসন্ত উৎসব",
      date: "২১ ফেব্রুয়ারি, ২০২৬",
      venue: "শহীদ মিনার প্রাঙ্গণ, উইলস ক্যাম্পাস",
      summary: "ভাষা শহীদদের স্মরণে বিশেষ স্বরচিত কবিতা আবৃত্তি, স্মৃতিচারণ এবং ক্লাবের বার্ষিক দেয়ালিকা 'স্পন্দন'-এর মোড়ক উন্মোচন করা হয়।"
    },
    {
      id: 3,
      title: "সৃজনশীল লেখনী ও কন্টেন্ট রাইটিং কর্মশালা",
      date: "১৫ জানুয়ারি, ২০২৬",
      venue: "ডিজিটাল ক্লাসরুম, college শাখা",
      summary: "শিক্ষার্থীদের লেখার মান উন্নয়ন এবং আধুনিক কন্টেন্ট রাইটিংয়ের বেসিক শেখাতে দিনব্যাপী একটি এক্সক্লুসিভ ওয়ার্কশপ আয়োজন করা হয়।"
    },
    {
      id: 4,
      title: "বিজয় দিবস বিশেষ কুইজ প্রতিযোগিতা",
      date: "১৬ ডিসেম্বর, ২০২৫",
      venue: "অনলাইন প্ল্যাটফর্ম",
      summary: "বাংলাদেশের মুক্তিযুদ্ধ এবং বাংলা সাহিত্যের ইতিহাসের ওপর ভিত্তি করে একটি মেগা অনলাইন কুইজ প্রতিযোগিতা, যেখানে ৩০০+ উইরিয়ান অংশ নেয়।"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-rose-200 pb-20">
      
      {/* 🎭 হেডার সেকশন */}
      <section className="bg-white border-b border-gray-200 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950 via-gray-100 to-white"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-rose-700 text-sm font-bold tracking-widest uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Timeline
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mt-4 mb-4">
            ইভেন্ট ও নোটিশ বোর্ড
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            ক্যাম্পাসে আমাদের নিয়মিত পথচলা। আপকামিং উৎসবের আপডেট এবং পার হয়ে আসা সোনালী দিনগুলোর আর্কাইভ।
          </p>
        </div>
      </section>

      {/* 🚀 আসন্ন উৎসব */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
          আসন্ন উৎসব ও আয়োজন
        </h2>

        {upcomingEvents.map((event) => (
          <div key={event.id} className="bg-white border-2 border-stone-900 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 bg-stone-900 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              {event.status}
            </div>
            <div className="max-w-2xl">
              <span className="text-xs text-rose-700 font-bold block mb-2">
                📅 {event.date} | ⏰ {event.time}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-4 group-hover:text-rose-900 transition-colors">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                {event.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-gray-500 font-medium mb-6">
                <span className="flex items-center gap-1 bg-stone-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                  📍 {event.venue}
                </span>
              </div>
              <Link href="/registration" className="inline-block bg-stone-950 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-rose-900 transition-colors shadow-sm">
                সীট বুক করো এখনই ➔
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ⏳ অতীতের স্মৃতিপট */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-12">
          অতীতের গৌরবময় স্মৃতিপট
        </h2>
        <div className="relative border-l-2 border-gray-200/80 pl-6 md:pl-8 ml-3 space-y-12">
          {pastEvents.map((event) => (
            <div key={event.id} className="relative group">
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-stone-950 group-hover:bg-rose-700 group-hover:border-rose-700 transition-colors duration-300 z-10"></div>
              <div className="bg-white border border-gray-200/70 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <span className="text-xs text-gray-400 font-semibold block mb-1">
                  {event.date}
                </span>
                <h3 className="text-xl font-bold font-serif text-gray-900 mb-2 group-hover:text-rose-700 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {event.summary}
                </p>
                <div className="text-xs text-stone-500 font-medium inline-block bg-stone-50 px-2.5 py-1 rounded-md border border-stone-100">
                  📍 {event.venue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
