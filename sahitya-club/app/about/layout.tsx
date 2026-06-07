// app/about/layout.tsx
import { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden flex flex-col">
      
      {/* ১. ব্যাকগ্রাউন্ড ডেকোরেশন - ওল্ড পেপার টেক্সচার মোটিফ */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-stone-100/50 to-transparent pointer-events-none"></div>
      
      {/* ২. সাইড ডেকোরেশন (বইয়ের মার্জিনের মতো) */}
      <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-px bg-stone-200/60 shadow-[20px_0_40px_rgba(0,0,0,0.02)] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20 flex-grow w-full">
        
        {/* টপ ফ্লোটিং ব্যাজ */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-1 bg-rose-800/20 rounded-full"></div>
        </div>

        {/* মেইন কন্টেন্ট কন্টেইনার */}
        <div className="relative">
          {/* সুক্ষ্ম গ্রাফিক এলিমেন্ট: পালকের কলম */}
          <div className="absolute -top-12 -right-4 text-6xl opacity-[0.03] select-none pointer-events-none rotate-12">
            ✒️
          </div>

          <div className="prose prose-stone max-w-none">
            {children}
          </div>
        </div>

        {/* ৩. নিচের সিগনেচার এলিমেন্ট (ঐচ্ছিক, সৌন্দর্যের জন্য যোগ করা হয়েছে) */}
        <div className="mt-16 flex flex-col items-center opacity-40">
          <div className="w-16 h-px bg-stone-300 mb-4"></div>
          <p className="text-[10px] tracking-[0.2em] text-stone-500 uppercase font-sans">
            Wills Literary Club
          </p>
        </div>
      </div>

      {/* ৪. ফিক্সড মোটিফ: এটি এখন আর কালো গ্যাপ তৈরি করবে না */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-100/20 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/4 translate-y-1/4"></div>
    </div>
  );
}
