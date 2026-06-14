// app/contact/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে পরবর্তীতে ব্যাকএন্ড বা ইমেইল এপিআই কানেক্ট করতে পারবে
    console.log("Form Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-rose-200 pb-20">
      
      

      {/* 🎭 হেডার সেকশন */}
      <section className="bg-white border-b border-gray-200 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900 via-gray-100 to-white"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-rose-700 text-sm font-bold tracking-widest uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mt-4 mb-4">
            যোগাযোগ করুন
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            কোনো জিজ্ঞাসা, পরামর্শ, কোলাবরেশন বা স্পনসরশিপের বিষয়ে সরাসরি আমাদের টিমকে মেইল বা মেসেজ পাঠান।
          </p>
        </div>
      </section>

      {/* 📬 মেইন কন্টেন্ট গ্রিড (পিসিতে পাশাপাশি, মোবাইলে নিচে নিচে) */}
      <section className="max-w-6xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* ⬅️ বাম পাশ: সোশ্যাল মিডিয়া ও কুইক অ্যাকশন কার্ডস (৪ কলাম) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">কুইক কানেক্ট</h2>
          <p className="text-gray-500 text-sm mb-6">আমাদের অফিশিয়াল সোশ্যাল হ্যান্ডেল এবং প্ল্যাটফর্মসমূহ।</p>

          {/* ১. ফেসবুক কমিউনিটি কার্ড */}
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                f
              </div>
              <div>
                <h3 className="font-bold text-gray-900 font-serif">অফিশিয়াল ফেসবুক গ্রুপ</h3>
                <p className="text-xs text-gray-400 mt-0.5">সবচেয়ে দ্রুত আপডেট ও আড্ডার জায়গা</p>
              </div>
            </div>
          </a>

          {/* ২. অফিশিয়াল মেইল কার্ড */}
          <a 
            href="mailto:contact@wlc.pro.bd"
            className="block bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center text-xl group-hover:bg-rose-700 group-hover:text-white transition-colors duration-300">
                ✉️
              </div>
              <div>
                <h3 className="font-bold text-gray-900 font-serif">অফিশিয়াল ইমেইল</h3>
                <p className="text-xs text-gray-400 mt-0.5">contact@wlc.pro.bd</p>
              </div>
            </div>
          </a>

          {/* ৩. ক্যাম্পাস লোকেশন কার্ড */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 text-stone-700 rounded-xl flex items-center justify-center text-xl">
                📍
              </div>
              <div>
                <h3 className="font-bold text-gray-900 font-serif">আমাদের ক্যাম্পাস</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  উইলস লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ<br />
                  ৮৫, কাকরাইল, ঢাকা-১০০০।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ➡️ ডান পাশ: ইন্টারঅ্যাক্টিভ মেসেজ বক্স / ফর্ম (৭ কলাম) */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">সরাসরি ইনবক্স করুন</h2>
          <p className="text-gray-500 text-sm mb-8">নিচের ফর্মটি পূরণ করে আপনার বার্তাটি আমাদের কাছে পাঠিয়ে দিন।</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 text-center animate-fade-in">
              <span className="text-3xl block mb-2">🎉</span>
              <h4 className="font-bold font-serif text-lg mb-1">বার্তাটি সফলভাবে পাঠানো হয়েছে!</h4>
              <p className="text-sm opacity-90">আমাদের প্যানেল মেম্বাররা খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">আপনার নাম</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                    placeholder="Fahim Muddasir"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">ইমেইল অ্যাড্রেস</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">বিষয় (Subject)</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
                  placeholder="মেম্বারশিপ সংক্রান্ত / কোলাবরেশন"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">আপনার বার্তা</label>
                <textarea 
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-900 focus:bg-white transition-colors resize-none"
                  placeholder="আপনার বক্তব্যটি এখানে বিস্তারিত লিখুন..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-stone-950 text-white font-semibold text-sm py-4 rounded-xl hover:bg-rose-900 transition-colors shadow-sm tracking-wide"
              >
                বার্তা পাঠান ✉️
              </button>
            </form>
          )}
        </div>

      </section>
      
    </main>
  );
}
