// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-gray-800 font-sans">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* টপ আইকন বা আর্ট */}
        <div className="relative justify-center flex">
          <span className="text-6xl animate-pulse">✒️</span>
          <div className="absolute -bottom-2 text-[10px] font-mono tracking-widest text-gray-400 uppercase">
            Page Not Found
          </div>
        </div>

        {/* তোমার দেওয়া ওড়াধোড়া এরর মেসেজ */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold font-serif text-gray-950">
            ভুল ঠিকানা!
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto font-medium">
            "সাহিত্যচর্চার এই গলিতে কোনো লেখা নেই ভাই! সম্ভবত তুমি ভুল ঠিকানায় চলে এসেছ।"
          </p>
        </div>

        {/* ব্যাক টু হোম বাটন */}
        <div className="pt-4">
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-stone-950 text-white text-xs font-semibold px-6 py-3.5 rounded-xl hover:bg-rose-900 transition-colors shadow-md tracking-wide"
          >
            ← মূল বৈঠকখানায় ফিরে চলো
          </Link>
        </div>

        {/* ফুটার ব্র্যান্ডিং */}
        <div className="text-[10px] text-gray-400 pt-6 border-t border-gray-200">
          Willes Little Flower School & College Literature Club
        </div>

      </div>
    </main>
  );
}
