"use client";

import React from "react";
import Image from "next/image";

// ৪টি পার্টনারসহ আপডেটেড ডাটা এরে
const contributors = [
  {
    id: "relax-studio",
    name: "Relax Studio",
    role: "Developer and Creative Support",
    description: "উইল্‌স সাহিত্য ক্লাবের সম্পূর্ণ ডিজিটাল আর্কিটেকচার, ওয়েব প্ল্যাটফর্ম ডেভেলপমেন্ট এবং ভিজ্যুয়াল আইডেন্টিটি ডিজাইন প্যানেল।",
    logo: "/relaxstudio.png",
    instagram: "https://www.instagram.com/relaxstudio__"
  },
  {
    id: "we-are-willians",
    name: "We Are Willians",
    role: "Official Media Partner",
    description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের ছাত্র-ছাত্রীদের সর্ববৃহৎ কমিউনিটি প্ল্যাটফর্ম ও সাহিত্য ক্লাবের অফিশিয়াল মিডিয়া পার্টনার।",
    logo: "/wearewillians.png",
    instagram: "https://www.instagram.com/we_are_willians"
  },
  {
    id: "nirob-creative",
    name: "Nirob Creative Studio",
    role: "Creative Support",
    description: "ক্লাবের বিভিন্ন প্রকাশনা, দেয়ালিকা এবং ব্র্যান্ডিং মেটেরিয়ালসের নান্দনিক গ্রাফিক্স ও ক্রিয়েটিভ ডিজাইন অ্যাসিস্ট্যান্স।",
    logo: "/nirob.jpg",
    instagram: "https://www.instagram.com/visuals_by_nirob"
  },
  {
    id: "shuttered-rakib",
    name: "Shuttered by Rakib",
    role: "Photography and Cinematography",
    description: "উইল্‌স সাহিত্য ক্লাবের সকল অফলাইন ইভেন্ট, স্মৃতির পাতা এবং সিনেমাটিক মুহূর্তগুলোর অফিশিয়াল মিডিয়া ও ভিজ্যুয়াল ক্যাপচারিং পার্টনার।",
    logo: "/rakib.jpg",
    instagram: "https://www.instagram.com/shutteredby_rakib"
  }
];

export default function ContributorPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans p-8 md:p-16 max-w-5xl mx-auto flex flex-col justify-center">
      
      {/* 🔮 হেডার সেকশন */}
      <header className="border-b border-gray-200 pb-8 mb-12">
        <span className="text-rose-700 text-sm font-bold uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          Partners & Support
        </span>
        <h1 className="text-4xl font-bold font-serif text-gray-900 mt-3 mb-2">Official Contributors</h1>
        <p className="text-gray-500 text-sm md:text-base">উইল্‌স সাহিত্য ক্লাবের অগ্রযাত্রায় নিয়োজিত ক্রিয়েটিভ ও মিডিয়া পার্টনারবৃন্দ।</p>
      </header>

      {/* 🛠️ কন্ট্রিবিউটর গ্রিড লেআউট */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
        {contributors.map((studio) => (
          <div 
            key={studio.id} 
            className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-rose-200 transition-all duration-300"
          >
            <div className="space-y-4">
              {/* স্টুডিও লোগো */}
              <div className="relative w-16 h-16 bg-transparent flex items-center justify-start select-none">
                <Image
                  src={studio.logo}
                  alt={`${studio.name} Logo`}
                  width={64}
                  height={64}
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>

              {/* টাইটেল ও রোল */}
              <div className="space-y-1">
                <h2 className="text-base font-bold text-gray-900 group-hover:text-rose-900 transition-colors line-clamp-1">
                  {studio.name}
                </h2>
                <p className="text-rose-700 text-[10px] font-bold uppercase tracking-wider block min-h-[16px]">
                  {studio.role}
                </p>
              </div>

              {/* বর্ণনা */}
              <p className="text-gray-600 text-[11px] leading-relaxed font-medium line-clamp-4">
                {studio.description}
              </p>
            </div>

            {/* ইন্সটাগ্রাম অ্যাকশন বাটন (Deep Stone থিম) */}
            <div className="pt-2">
              <a 
                href={studio.instagram}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center bg-stone-900 hover:bg-rose-800 text-white font-semibold text-[11px] py-2.5 px-4 rounded-xl transition-colors shadow-sm text-center gap-1.5 active:scale-95"
              >
                📸 Connect on Instagram
              </a>
            </div>
          </div>
        ))}
      </section>

    </main>
  );
}
