"use client";

import React from "react";

export default function ComingSoonPage() {
  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] text-gray-800 font-sans flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-6 bg-white border border-gray-200/70 rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
        
        {/* টপ ডেকোরেশন গ্লো */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-stone-900 to-rose-900" />

        {/* ম্যাজিক আইকন বক্স */}
        <div className="w-20 h-20 bg-rose-50 rounded-2xl border border-rose-100/70 flex items-center justify-center mx-auto text-4xl select-none transform hover:rotate-12 transition-transform duration-300">
          ✨
        </div>

        {/* টাইটেল ও সাবটাইটেল */}
        <div className="space-y-2">
          <span className="text-rose-700 text-xs font-bold uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">
            Coming Soon
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 tracking-tight mt-2">
            নতুন চমক আসছে!
          </h1>
        </div>

        {/* বিবরণী */}
        <p className="text-gray-600 text-sm leading-relaxed font-medium max-w-sm mx-auto">
          উইল্‌স সাহিত্য ক্লাবের এই ফিচারটি বর্তমানে চমৎকার সব কন্টেন্ট ও আইডিয়া দিয়ে সাজানো হচ্ছে। খুব দ্রুতই এটি সবার জন্য উন্মুক্ত করা হবে।
        </p>

        {/* অ্যাকশন বাটন - কোনো লিংক ছাড়া, শুধু রিলোড ফাংশন */}
        <div className="pt-4 max-w-xs mx-auto">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-stone-950 hover:bg-rose-900 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-all duration-300 shadow-sm text-center active:scale-98"
          >
            🔄 পেজটি রিফ্রেশ করুন
          </button>
        </div>

      </div>
    </main>
  );
}
