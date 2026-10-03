// app/about/page.tsx
import React from "react";
import { Metadata } from "next";

// 🚀 এই পেজের জন্য প্রিমিয়াম এসইও সেটআপ
export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর ইতিহাস, উদ্দেশ্য এবং আমাদের গৌরবময় পথচলার গল্পকথা।",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-stone-50 py-16 min-h-screen font-sans text-stone-800">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* 🎭 পেজ হেডার */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-950 mb-3 tracking-tight">
            আমাদের গল্পকথা 📖
          </h1>
          <p className="text-sm md:text-base text-stone-600 leading-relaxed">
            শব্দে, ছнде ও ভাবনায় উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের তরুণ সাহিত্যপ্রেমীদের এক মিলনমেলা।
          </p>
          <div className="w-16 h-1 bg-rose-800 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 🏛️ ক্লাবের মূল পরিচিতি */}
        <div className="bg-white border border-stone-200/60 rounded-2xl p-6 md:p-8 shadow-sm mb-10 transition-shadow hover:shadow-md">
          <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span className="text-rose-800">✨</span> উইল্‌স সাহিত্য ক্লাব কী?
          </h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-4">
            উইল্‌স সাহিত্য ক্লাব (Willes Literary Club) শুধুমাত্র একটি প্রথাগত ক্লাব নয়; এটি আমাদের ক্যাম্পাসের ছাত্র-ছাত্রীদের সৃজনশীল মননবিকাশ, সাহিত্যচর্চা এবং সুপ্ত প্রতিভা প্রকাশের একটি উন্মুক্ত প্ল্যাটফর্ম। আমরা বিশ্বাস করি, প্রতিটি শিক্ষার্থীর ভেতরেই একটি নিজস্ব গল্প, কবিতা বা ইউনিক কোনো সৃষ্টিশীল ভাবনা লুকিয়ে থাকে। আমাদের লক্ষ্য সেই ভাবনাগুলোকে ডানা মেলার সুযোগ করে দেওয়া।
          </p>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed">
            নিয়মিত সাহিত্য আড্ডা, দেয়াল পত্রিকা প্রকাশনী, কুইজ প্রতিযোগিতা, বিতর্ক ও বার্ষিক সাহিত্য উৎসবের মধ্য দিয়ে আমরা শিক্ষার্থীদের বাংলা ভাষা ও সংস্কৃতির গভীর মনস্তত্ত্বের সাথে যুক্ত করার নিরলস প্রচেষ্টা চালিয়ে যাচ্ছি।
          </p>
        </div>

        {/* 🎯 ভিশন ও মিশন (২ কলাম গ্রিড) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* আমাদের লক্ষ্য */}
          <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm">
            <div className="text-2xl mb-3 text-rose-800">🎯</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">আমাদের লক্ষ্য</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              শিক্ষার্থীদের মাঝে সুস্থ ও মননশীল সাহিত্যচর্চার প্রসার ঘটানো। প্রাতিষ্ঠানিক পড়াশোনার পাশাপাশি যেন প্রতিটি উইলিয়ান তাদের সৃজনশীল চিন্তাভাবনাকে লেখার মাধ্যমে সবার সামনে তুলে ধরতে পারে, সেই পরিবেশ নিশ্চিত করা।
            </p>
          </div>

          {/* আমাদের স্বপ্ন */}
          <div className="bg-white border border-stone-200/60 rounded-2xl p-6 shadow-sm">
            <div className="text-2xl mb-3 text-amber-600">🚀</div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">আমাদের স্বপ্ন</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              এমন একটি প্রজন্ম গড়ে তোলা, যারা প্রযুক্তির আধুনিকতার সাথে সাথে নিজেদের শিকড়, ভাষা এবং শুদ্ধ সাহিত্যিক মূল্যবোধকে বুকে ধারণ করবে। উইল্‌স ক্যাম্পাস ছাড়িয়ে দেশজুড়ে আমাদের সৃষ্টিশীল কাজের পদচিহ্ন রাখা।
            </p>
          </div>

        </div>

        {/* 📜 গৌরবময় কার্যক্রমের সংক্ষিপ্ত তালিকা */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 md:p-8 shadow-inner relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
            📌 আমাদের নিয়মিত আয়োজনসমূহ
          </h3>
          
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-300">
            <li className="flex items-center gap-2">
              <span className="text-rose-500">✔</span> পাক্ষিক ও মাসিক সাহিত্য আড্ডা
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">✔</span> দেয়ালিকা ও বার্ষিক ম্যাগাজিন প্রকাশ
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">✔</span> আবৃত্তি ও সৃজনশীল লিখন কর্মশালা
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">✔</span> অন্তঃকলেজ সাহিত্য ও সাংস্কৃতিক উৎসব
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">✔</span> বই পড়া ও বুক রিভিউ প্রতিযোগিতা
            </li>
            <li className="flex items-center gap-2">
              <span className="text-rose-500">✔</span> কুইজ ও শব্দজট অলিম্পিয়াড
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
