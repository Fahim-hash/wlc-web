"use client";

import React from "react";
import Image from "next/image";

const contributors = [
  {
    id: "relax-studio",
    name: "Relax Studio",
    role: "Developer and Creative Support",
    description: "উইল্‌স সাহিত্য ক্লাবের সম্পূর্ণ ডিজিটাল আর্কিটেকচার, ওয়েব প্ল্যাটফর্ম ডেভেলপমেন্ট এবং ভিজ্যুয়াল আইডেন্টিটি ডিজাইন প্যানেল।",
    logo: "/relaxstudio.png",
    instagram: "https://www.instagram.com/relaxstudio__"
  },
  {
    id: "we-are-willians",
    name: "We Are Willians",
    role: "Official Media Partner",
    description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের ছাত্র-ছাত্রীদের সর্ববৃহৎ কমিউনিটি প্ল্যাটফর্ম ও সাহিত্য ক্লাবের অফিশিয়াল মিডিয়া পার্টনার।",
    logo: "/wearewillians.png",
    instagram: "https://www.instagram.com/we_are_willians"
  },
  {
    id: "nirob-creative",
    name: "Nirob Creative Studio",
    role: "Creative Support",
    description: "ক্লাবের বিভিন্ন প্রকাশনা, দেয়ালিকা এবং ব্র্যান্ডিং মেটেরিয়ালসের নান্দনিক গ্রাফিক্স ও ক্রিয়েটিভ ডিজাইন অ্যাসিস্ট্যান্স।",
    logo: "/nirob.jpg",
    instagram: "https://www.instagram.com/visuals_by_nirob"
  },
  {
    id: "shuttered-rakib",
    name: "Shuttered by Rakib",
    role: "Photography and Cinematography",
    description: "উইল্‌স সাহিত্য ক্লাবের সকল অফলাইন ইভেন্ট, স্মৃতির পাতা এবং সিনেমাটিক মুহূর্তগুলোর অফিশিয়াল মিডিয়া ও ভিজ্যুয়াল ক্যাপচারিং পার্টনার।",
    logo: "/rakib.jpg",
    instagram: "https://www.instagram.com/shutteredby_rakib"
  }
];

export default function ContributorPage() {
  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] text-gray-800 font-sans">
      
      <div className="max-w-6xl mx-auto p-6 md:p-16 min-h-screen flex flex-col justify-center">
        
        {/* 🔮 হেডার সেকশন */}
        <header className="border-b border-gray-200/80 pb-8 mb-12 relative">
          <span className="text-rose-700 text-xs md:text-sm font-bold uppercase tracking-widest bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100/60 inline-block">
            Partners & Support
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mt-4 mb-2 tracking-tight">
            Official Contributors
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">
            উইল্‌স সাহিত্য ক্লাবের অগ্রযাত্রায় নিয়োজিত ক্রিয়েটিভ ও মিডিয়া পার্টনারবৃন্দ।
          </p>
        </header>

        {/* 🛠️ প্রিমিয়াম কন্ট্রিবিউটর গ্রিড লেআউট */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 my-4">
          {contributors.map((studio) => (
            <div 
              key={studio.id} 
              className="bg-white border border-gray-200/70 rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-rose-200 hover:shadow-md transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-50/40 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="space-y-5">
                
                {/* টপ বার: লোগো বক্স এবং অ্যারো */}
                <div className="flex items-center justify-between">
                  {/* লোগো বক্স - স্কয়ার এবং কালারড */}
                  <div className="relative w-16 h-16 bg-stone-50 rounded-xl p-1.5 border border-stone-100 flex items-center justify-center shadow-inner select-none transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={studio.logo}
                      alt={`${studio.name} Logo`}
                      width={64}
                      height={64}
                      className="object-contain aspect-square" // লোগো সবসময় স্কয়ার থাকবে এবং অরিজিনাল কালার শো করবে
                      priority
                    />
                  </div>
                  
                  <span className="text-stone-300 group-hover:text-rose-700 font-mono text-lg transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>

                {/* টাইটেল ও রোল */}
                <div className="space-y-1.5">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-rose-900 transition-colors tracking-tight">
                    {studio.name}
                  </h2>
                  <span className="inline-block bg-stone-100 text-stone-600 group-hover:bg-rose-50 group-hover:text-rose-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors">
                    {studio.role}
                  </span>
                </div>

                {/* বিবরণী */}
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-medium">
                  {studio.description}
                </p>
              </div>

              {/* ইন্সটাগ্রাম অ্যাকশন বাটন */}
              <div className="pt-2">
                <a 
                  href={studio.instagram}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center bg-stone-950 hover:bg-rose-900 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all duration-300 shadow-sm gap-2 active:scale-98"
                >
                  📸 Connect on Instagram
                </a>
              </div>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}
