// app/faq/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function FAQPage() {
  // কোন প্রশ্নটা ওপেন থাকবে তার স্টেট (শুরুতে ১ম প্রশ্নটা ওপেন থাকবে)
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  // সাহিত্য ক্লাবের জন্য বাছাইকৃত দরকারি প্রশ্ন ও উত্তর
  const faqData = [
    {
      id: 1,
      question: "আমি কি উইলস লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের যেকোনো গ্রুপের হয়ে সাহিত্য ক্লাবে যোগ দিতে পারব?",
      answer: "হ্যাঁ, অবশ্যই! তুমি বিজ্ঞান, মানবিক বা ব্যবসায় শিক্ষা—যে কোনো বিভাগের শিক্ষার্থী হও না কেন, সাহিত্যের প্রতি ভালোবাসা এবং সৃজনশীলতা থাকলে তুমি আমাদের ক্লাবের মেম্বার হতে পারবে।"
    },
    {
      id: 2,
      question: "ক্লাবের সদস্য হওয়ার জন্য কি আগে থেকেই ভালো কবিতা বা গল্প লেখা জানতে হবে?",
      answer: "একদমই না। আমাদের ক্লাবের মূল লক্ষ্যই হলো সুপ্ত প্রতিভাকে খুঁজে বের করা এবং তা বিকশিত করা। তোমার যদি স্রেফ আগ্রহ থাকে, তবে আমাদের নিয়মিত সাহিত্য আসর ও কর্মশালার মাধ্যমে তুমি নিজেকে ঝালিয়ে নিতে পারবে।"
    },
    {
      id: 3,
      question: "অনলাইন রেজিস্ট্রেশন করার পর পরবর্তী প্রসেস বা সিলেকশন কীভাবে হবে?",
      answer: "রেজিস্ট্রেশন ফর্ম পূরণ করার পর আমাদের এক্সিকিউটিভ প্যানেল তোমার ফর্মটি রিভিউ করবে। এরপর একটি সংক্ষিপ্ত ইন্টারভিউ বা সেশনের মাধ্যমে তোমাকে অফিসিয়ালি ক্লাবের মেম্বার হিসেবে ইনক্লুড করা হবে এবং ইমেইল/এসএমএসে জানিয়ে দেওয়া হবে।"
    },
    {
      id: 4,
      question: "সাহিত্য ক্লাব থেকে প্রতি বছর কী কী প্রকাশনা বা দেয়ালিকা বের হয়?",
      answer: "আমরা নিয়মিত বিশেষ দিনগুলোতে (যেমন: ভাষা দিবস, স্বাধীনতা দিবস) দেয়ালিকা প্রকাশ করি। এছাড়া ক্লাবের বার্ষিক সাহিত্য ম্যাগাজিন বা পত্রিকা বের করা হয়, যেখানে নির্বাচিত মেম্বারদের সৃজনশীল লেখাগুলো প্রিন্ট করার সুযোগ থাকে।"
    },
    {
      id: 5,
      question: "ক্লাবের মেম্বার হলে আমি কী কী সুবিধা বা সুযোগ পাব?",
      answer: "তুমি নিয়মিত সাহিত্য আসরে অংশ নিতে পারবে, বিভিন্ন আন্তঃকলেজ প্রতিযোগিতায় কলেজের হয়ে প্রতিনিধিত্ব করার সুযোগ পাবে এবং ক্লাবের নিজস্ব প্রকাশনা প্যানেলে কাজ করার চমৎকার অভিজ্ঞতা অর্জন করতে পারবে।"
    }
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
            Common Questions
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mt-4 mb-4">
            সাধারণ জিজ্ঞাসা (FAQ)
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            উইল্‌স সাহিত্য ক্লাব এবং আমাদের মেম্বারশিপ প্রসেস নিয়ে জুনিয়র ও সাধারণ শিক্ষার্থীদের মনে সচরাচর জেগে ওঠা কিছু প্রশ্নের উত্তর।
          </p>
        </div>
      </section>

      {/* ❓ অ্যাকোর্ডিয়ান সেকশন */}
      <section className="max-w-3xl mx-auto px-6 mt-16">
        <div className="space-y-4">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div 
                key={faq.id}
                className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
              >
                {/* প্রশ্ন (বাটন) */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-stone-50 transition-colors"
                >
                  <span className="font-serif font-bold text-base md:text-lg text-gray-900 leading-snug">
                    {faq.question}
                  </span>
                  {/* প্লাস/মাইনাস বাটন অ্যানিমেশন */}
                  <span className={`text-xl font-medium transition-transform duration-300 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full ${
                    isOpen ? "bg-rose-100 text-rose-900 rotate-45" : "bg-stone-100 text-stone-600"
                  }`}>
                    ＋
                  </span>
                </button>

                {/* উত্তর (স্মুথ কোলাপ্সিবল কন্টেইনার) */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-60 border-t border-gray-100" : "max-h-0"
                  }`}
                >
                  <div className="px-6 py-5 bg-stone-50/50 text-gray-600 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 📢 কন্টাক্ট সেকশন রিডাইরেক্ট */}
      <section className="max-w-2xl mx-auto px-6 text-center mt-20">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <p className="text-gray-600 text-sm md:text-base mb-4">
            আপনার মনে কি এমন কোনো প্রশ্ন আছে যা এখানে তালিকাভুক্ত নয়?
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-1.5 text-rose-700 hover:text-rose-900 font-bold text-sm tracking-wide transition-colors"
          >
            সরাসরি আমাদের জিজ্ঞেস করুন (যোগাযোগ পেজ) ➔
          </Link>
        </div>
      </section>

    </main>
  );
}
