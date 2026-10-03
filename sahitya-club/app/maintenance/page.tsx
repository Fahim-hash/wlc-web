"use client";

import React from "react";

export default function MaintenancePage() {
  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] text-gray-800 font-sans flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center space-y-6 bg-white border border-gray-200/80 rounded-[2rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
        
        {/* টপ ডেকোরেশন গ্লো */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500" />
        
        {/* অ্যানিমেটেড আইকন বক্স */}
        <div className="w-20 h-20 bg-amber-50 rounded-2xl border border-amber-100/70 flex items-center justify-center mx-auto text-4xl select-none animate-pulse">
          🛠️
        </div>

        {/* টাইটেল ও সাবটাইটেল */}
        <div className="space-y-2">
          <span className="text-amber-700 text-xs font-bold uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100 inline-block">
            Under Maintenance
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 tracking-tight mt-2">
            সাময়িক বিরতি
          </h1>
        </div>

        {/* বিবরণী */}
        <p className="text-gray-600 text-sm leading-relaxed font-medium max-w-sm mx-auto">
          ওয়েবসাইটটিকে আরও সুন্দর ও দ্রুততর করার জন্য কিছু টেকনিক্যাল আপগ্রেডের কাজ চলছে। আমরা খুব শীঘ্রই আবার ফিরে আসছি!
        </p>

        {/* প্রгнозы ইন্ডিকেটর */}
        <div className="w-full bg-stone-100 rounded-full h-1.5 max-w-xs mx-auto overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-rose-600 h-1.5 rounded-full w-3/4" />
        </div>

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
