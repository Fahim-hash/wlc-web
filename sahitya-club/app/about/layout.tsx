// app/about/layout.tsx
import { ReactNode } from "react";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন - ওল্ড পেপার টেক্সচার মোটিফ */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-stone-100/50 to-transparent"></div>
      
      {/* সাইড ডেকোরেশন (বইয়ের মার্জিনের মতো) */}
      <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-px bg-stone-200/60 shadow-[20px_0_40px_rgba(0,0,0,0.02)]"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24">
        
        {/* টপ ফ্লোটিং ব্যাজ */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-1 bg-rose-800/20 rounded-full"></div>
        </div>

        {/* মেইন কন্টেন্ট কন্টেইনার - যা একটি খোলা খাতার মতো ভাইব দিবে */}
        <div className="relative">
          {/* সুক্ষ্ম গ্রাফিক এলিমেন্ট: কোণায় একটি পালকের কলমের আইকন (অপশনাল) */}
          <div className="absolute -top-12 -right-4 text-6xl opacity-[0.03] select-none pointer-events-none rotate-12">
            ✒️
          </div>

          <div className="prose prose-stone max-w-none">
            {children}
          </div>
        </div>
      </div>

      {/* নিচের ডান কোণায় একটি হালকা মোটিফ */}
      <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-rose-50/30 rounded-full blur-3xl"></div>
    </div>
  );
}
