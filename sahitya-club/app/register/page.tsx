// app/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
  const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/1FfHREivkfK2dncPiuw1hGALNmvw3bysmzY05uEWOgQ4/viewform";
  const [timeLeft, setTimeLeft] = useState(3); // ৩ সেকেন্ড কাউন্টডাউন

  useEffect(() => {
    // ১. টাইমার কাউন্টডাউন লজিক
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    // ২. ৩ সেকেন্ড পর অটোমেটিক রিডাইরেক্ট লজিক
    const redirectTimeout = setTimeout(() => {
      window.location.href = GOOGLE_FORM_URL;
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-3xl shadow-xl p-8 md:p-10 relative overflow-hidden text-center animate-fade-in">
        
        {/* টপ প্রিমিয়াম টপ-বার */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-800 via-rose-600 to-amber-500"></div>

        {/* লোগো সেকশন */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Image src="/logo.png" alt="WLC Logo" fill className="object-contain" priority />
        </div>

        {/* লোডিং ও রিডাইরেক্ট টেক্সট */}
        <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 mb-2">
          নিবন্ধন ফরমে নিয়ে যাওয়া হচ্ছে
        </h1>
        
        <p className="text-sm text-stone-500 mb-6">
          আপনাকে অফিশিয়াল গুগল ফর্মে রিডাইরেক্ট করা হচ্ছে। দয়া করে একটু অপেক্ষা করুন...
        </p>

        {/* ⏳ ডাইনামিক স্পিনার ও টাইমার */}
        <div className="flex flex-col items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 border-4 border-stone-100 border-t-rose-800 rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            {timeLeft > 0 ? `${timeLeft} সেকেন্ড বাকি` : "প্রবেশ করা হচ্ছে..."}
          </span>
        </div>

        {/* সেফটি ম্যানুয়াল বাটন */}
        <div className="border-t border-stone-100 pt-6">
          <p className="text-[11px] text-stone-400 mb-3">
            স্বয়ংক্রিয়ভাবে ফর্মটি ওপেন না হলে নিচের বাটনে ক্লিক করুন:
          </p>
          <a
            href={GOOGLE_FORM_URL}
            className="inline-flex items-center justify-center gap-2 w-full bg-stone-900 hover:bg-stone-800 text-white font-medium py-3 px-4 rounded-xl text-xs transition-all shadow-sm"
          >
            সরাসরি ফর্মে যান ➔
          </a>
        </div>

      </div>
    </main>
  );
}
