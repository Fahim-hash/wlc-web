// app/events/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ইভেন্টের টাইপ ডিফাইন করা (টাইপ সেফটির জন্য)
interface PastEvent {
  id: number;
  title: string;
  date: string;
  venue: string;
  summary: string;
  description: string;
  thumbnail: string;
  images: string[];
}

export default function EventsPage() {
  // আগের করা কন্ডিশনাল রেন্ডারিংয়ের জন্য আপকামিং ইভেন্ট অ্যারে
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

  // বিগত ইভেন্টের ডেটা (থাম্বনেইল ও মাল্টিপল ইমেজ গ্যালারি সহ)
  const pastEvents: PastEvent[] = [
    {
      id: 2,
      title: "অমর একুশে সাহিত্য আসর ও বসন্ত উৎসব",
      date: "২১ ফেব্রুয়ারি, ২০২৬",
      venue: "শহীদ মিনার প্রাঙ্গণ, উইলস ক্যাম্পাস",
      summary: "ভাষা শহীদদের স্মরণে বিশেষ স্বরচিত কবিতা আবৃত্তি, স্মৃতিচারণ এবং ক্লাবের বার্ষিক দেয়ালিকা 'স্পন্দন'-এর মোড়ক উন্মোচন করা হয়।",
      description: "মহান শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে উইলস সাহিত্য ক্লাব আয়োজন করে এই বিশেষ আসর। অনুষ্ঠানে প্রধান অতিথি হিসেবে উপস্থিত ছিলেন আমাদের শ্রদ্ধেয় অধ্যক্ষ মহোদয়। শিক্ষার্থীরা স্বরচিত কবিতা পাঠ ও দেশাত্মবোধক গান পরিবেশন করে। একই সাথে ক্লাবের প্রথম অফিশিয়াল দেয়ালিকা 'স্পন্দন' উন্মোচন করা হয়, যা পুরো ক্যাম্পাসে ব্যাপক প্রশংসিত হয়েছে।",
      thumbnail: "/images/events/ekushey-thumb.jpg", // public/images/events/ ফোল্ডারে ইমেজ রাখবে
      images: [
        "/images/events/ekushey-1.jpg",
        "/images/events/ekushey-2.jpg",
        "/images/events/ekushey-3.jpg"
      ]
    },
    {
      id: 3,
      title: "সৃজনশীল লেখনী ও কন্টেন্ট রাইটিং কর্মশালা",
      date: "১৫ জানুয়ারি, ২০২৬",
      venue: "ডিজিটাল ক্লাসরুম, কলেজ শাখা",
      summary: "শিক্ষার্থীদের লেখার মান উন্নয়ন এবং আধুনিক কন্টেন্ট রাইটিংয়ের বেসিক শেখাতে দিনব্যাপী একটি এক্সক্লুসিভ ওয়ার্কশপ আয়োজন করা হয়।",
      description: "ডিজিটাল যুগে কন্টেন্ট রাইটিং এবং ক্রিয়েটিভ রাইটিংয়ের গুরুত্ব তুলে ধরতে এই কর্মশালার আয়োজন করা হয়। দেশের শীর্ষস্থানীয় একজন কন্টেন্ট স্ট্র্যাটেজিস্ট মেন্টর হিসেবে সেশনটি পরিচালনা করেন। যেখানে প্রায় ৮০ জন উইরিয়ান স্ক্রিপ্ট রাইটিং, ব্লগিং এবং সোশ্যাল মিডিয়া কপিরাইটিংয়ের খুঁটিনাটি হাতে-কলমে শেখার সুযোগ পায়।",
      thumbnail: "/images/events/workshop-thumb.jpg",
      images: [
        "/images/events/workshop-1.jpg",
        "/images/events/workshop-2.jpg"
      ]
    },
    {
      id: 4,
      title: "বিজয় দিবস বিশেষ কুইজ প্রতিযোগিতা",
      date: "১৬ ডিসেম্বর, ২০২৫",
      venue: "অনлайн প্ল্যাটফর্ম",
      summary: "বাংলাদেশের মুক্তিযুদ্ধ এবং বাংলা সাহিত্যের ইতিহাসের ওপর ভিত্তি করে একটি মেগা অনলাইন কুইজ প্রতিযোগিতা, যেখানে ৩০০+ উইরিয়ান অংশ নেয়।",
      description: "৫৪তম মহান বিজয় দিবস উপলক্ষে আয়োজিত এই কুইজ প্রতিযোগিতাটি সম্পূর্ণ অনলাইনে আমাদের নিজস্ব পোর্টালে অনুষ্ঠিত হয়। কুইজের মূল বিষয়বস্তু ছিল বাংলাদেশের গৌরবময় মুক্তিযুদ্ধ ও বাংলা সাহিত্যের ইতিহাস। তীব্র প্রতিদ্বন্দ্বিতাপূর্ণ এই আসরে টপ ৩ জন বিজয়ীকে আকর্ষণীয় বইয়ের সেট এবং সার্টিফিকেট প্রদান করা হয়।",
      thumbnail: "/images/events/quiz-thumb.jpg",
      images: [
        "/images/events/quiz-1.jpg"
      ]
    }
  ];

  // পপআপ/মোডাল স্টেট ম্যানেজমেন্ট
  const [selectedEvent, setSelectedEvent] = useState<PastEvent | null>(null);

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

      {/* 🚀 আসন্ন উৎসব সেকশন */}
      <section className="max-w-4xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
          আসন্ন উৎসব ও আয়োজন
        </h2>

        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
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
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
            <span className="text-3xl block mb-3">⏳</span>
            <h3 className="text-xl font-bold font-serif text-gray-950 mb-2">নতুন কিছুর প্রস্তুতি চলছে!</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
              এই মুহূর্তে অফিশিয়াল কোনো ইভেন্ট লাইভ নেই। খুব শীঘ্রই নতুন আপডেট এখানে দেখতে পাবেন!
            </p>
          </div>
        )}
      </section>

      {/* ⏳ অতীতের স্মৃতিপট (ফটো ও পপআপ ট্রিগার সহ) */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        <h2 className="text-2xl font-bold font-serif text-gray-900 mb-12">
          অতীতের গৌরবময় স্মৃতিপট
        </h2>
        
        {/* টাইমলাইন ট্র্যাক */}
        <div className="relative border-l-2 border-gray-200/80 pl-6 md:pl-10 ml-3 space-y-12">
          {pastEvents.map((event) => (
            <div key={event.id} className="relative group">
              
              {/* টাইমলাইন পয়েন্টার */}
              <div className="absolute -left-[31px] md:-left-[43px] top-6 w-4 h-4 rounded-full bg-white border-2 border-stone-950 group-hover:bg-rose-700 group-hover:border-rose-700 transition-colors duration-300 z-10"></div>
              
              {/* ইভেন্ট কার্ড (ক্লিকেবল) */}
              <div 
                onClick={() => setSelectedEvent(event)}
                className="bg-white border border-gray-200/70 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {/* ইভেন্ট থাম্বনেইল ইমেজ */}
                <div className="w-full md:w-40 aspect-[4/3] md:aspect-square relative rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                  <Image 
                    src={event.thumbnail} 
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* টেক্সট ডিটেইলস */}
                <div className="flex-1">
                  <span className="text-xs text-gray-400 font-semibold block mb-1">
                    {event.date}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-gray-900 mb-2 group-hover:text-rose-700 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
                    {event.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-stone-500 font-medium bg-stone-50 px-2.5 py-1 rounded-md border border-stone-100">
                      📍 {event.venue}
                    </div>
                    <span className="text-xs font-bold text-rose-700 group-hover:underline flex items-center gap-1">
                      গ্যালারি ও বিস্তারিত ➔
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🖼️ আল্ট্রা-প্রিমিয়াম ডিটেইলড পপআপ মোডাল */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
          
          {/* ব্যাকগ্রাউন্ডে ক্লিক করলে পপআপ ক্লোজ হবে */}
          <div className="absolute inset-0" onClick={() => setSelectedEvent(null)}></div>
          
          {/* মেইন পপআপ বডি */}
          <div className="bg-white border border-gray-200 w-full max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl custom-scrollbar animate-slideUp">
            
            {/* ক্লোজ বাটন */}
            <button 
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-stone-900 border border-gray-200 shadow-sm w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg z-50 transition-colors"
            >
              ✕
            </button>

            {/* পপআপ কন্টেন্ট */}
            <div className="p-6 md:p-8">
              <span className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {selectedEvent.date}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mt-3 mb-2">
                {selectedEvent.title}
              </h2>
              <p className="text-sm text-stone-500 font-medium mb-6 flex items-center gap-1">
                📍 ভেন্যুর স্থান: {selectedEvent.venue}
              </p>

              {/* বিস্তারিত বিবরণ */}
              <div className="border-t border-gray-100 pt-4 mb-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">ইভেন্টের বিবরণ</h4>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              {/* ইভেন্ট ফটো গ্যালারি গ্রিড */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">ইভেন্ট মেমোরিজ ও গ্যালারি</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedEvent.images.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className={`relative aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 border border-gray-150 shadow-sm group ${
                        selectedEvent.images.length === 1 ? "sm:col-span-2" : ""
                      }`}
                    >
                      <Image 
                        src={imgUrl} 
                        alt={`Gallery ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}
