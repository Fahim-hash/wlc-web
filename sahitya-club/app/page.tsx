// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function WillesSahityaClub() {
  // অ্যানিমেশন স্টেট: 
  // 'initial' -> 'line' -> 'show_first' (Logo+WLFSC) -> 'show_second' (Logo+RelaxStudio)
  const [animationStep, setAnimationStep] = useState<"initial" | "line" | "show_first" | "show_second">("initial");

  // ফ্লাশব্যাক ইমেজের ডামি ডাটা (হোমপেজের গ্যালারির জন্য তোমার pic ফোল্ডারের ছবির নামগুলো এখানে বসাতে পারো)
  const flashbackImages: string[] = []; 

  useEffect(() => {
    // ১. সাইট ওপেন হওয়ার সাথে সাথে ডট থেকে লাইন হবে (০.৬ সেকেন্ড পর)
    const timer1 = setTimeout(() => setAnimationStep("line"), 600);
    
    // ২. লাইনের দুই পাশ থেকে প্রথম সেট (Logo + WLFSC) বের হবে (১.২ সেকেন্ড পর)
    const timer2 = setTimeout(() => setAnimationStep("show_first"), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []); // 👈 এখানে টাইপোটা একদম ফিক্সড!

  // ৩. লুপ মেকানিজম: প্রথম সেট এবং দ্বিতীয় সেটের মধ্যে ৪ সেকেন্ডের নিখুঁত অদলবদল
  useEffect(() => {
    if (animationStep === "show_first" || animationStep === "show_second") {
      const loopTimer = setTimeout(() => {
        setAnimationStep((current) => (current === "show_first" ? "show_second" : "show_first"));
      }, 4000); // ঠিক ৪ সেকেন্ড পর পর লুপ চেঞ্জ হবে

      return () => clearTimeout(loopTimer);
    }
  }, [animationStep]);

  const features = [
    { icon: "✍️", title: "নিয়মিত সাহিত্য আসর", desc: "গল্প, কবিতা ও প্রবন্ধের আসর যেখানে সদস্যরা মুক্ত মনে তাদের লেখনী তুলে ধরে।" },
    { icon: "🎨", title: "দেয়ালিকা ও প্রকাশনা", desc: "বিশেষ দিনগুলোতে ক্লাবের নিজস্ব সম্পাদনা প্যানেলের যৌথ উদ্যোগে দেয়ালিকা প্রকাশ।" },
    { icon: "🏆", title: "প্রতিযোগিতা ও কুইজ", desc: "আন্তঃকলেজ সাহিত্য উৎসব, কুইজ এবং সৃজনশীল লেখালেখি প্রতিযোগিতায় অংশগ্রহণ।" }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-rose-200 overflow-x-hidden">
      
      {/* 🛠️ প্রিমিয়াম ও আল্ট্রা-স্মুথ সিএসএস ট্রানজিশন ইফেক্টস */}
      <style dangerouslySetInnerHTML={{__html: `
        .transition-all-custom {
          transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .line-glow {
          box-shadow: 0 0 8px rgba(0,0,0,0.1);
        }
      `}} />

      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center bg-white border-b border-gray-200 shadow-sm">
        <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-white"></div>

        <div className="relative z-10 flex flex-col items-center">
          
          {/* 🎬 সিনেমাটিক অ্যানিমেশন কন্টেইনার */}
          <div className="relative flex items-center justify-center w-full h-36 md:h-44 mb-8">
            
            {/* ⬅️ বাম পাশের লোগো (logo.png) - এটি সবসময় ফিক্সড থাকবে */}
            <div 
              className={`absolute transition-all-custom w-16 h-16 md:w-20 md:h-20 drop-shadow-sm ${
                animationStep === "initial" || animationStep === "line"
                  ? "right-[50%] translate-x-[50%] opacity-0 scale-75"
                  : "right-[calc(50%+45px)] translate-x-0 opacity-1 scale-100"
              }`}
            >
              <Image 
                src="/logo.png" 
                alt="উইল্‌স সাহিত্য ক্লাব Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>

            {/* ⬛ মাঝখানের কুচকুচে কালো ম্যাজিক লাইন ও ডট */}
            <div className="absolute flex items-center justify-center z-20">
              <div 
                className="bg-stone-950 transition-all-custom line-glow" 
                style={{ 
                  width: animationStep === "initial" ? "8px" : animationStep === "line" || animationStep === "show_first" ? "56px" : "20px", 
                  height: animationStep === "initial" ? "8px" : animationStep === "line" || animationStep === "show_first" ? "2px" : "2px",
                  borderRadius: animationStep === "initial" ? "50%" : "0px",
                  transform: animationStep === "show_second" ? "rotate(45deg)" : "rotate(0deg)"
                }}
              ></div>
            </div>

            {/* ➡️ ডান পাশের লোগো মডিউল (WLFSC ও RelaxStudio লুপ) */}
            <div className="absolute left-[calc(50%+45px)] w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
              
              {/* ১. WLFSC Logo */}
              <div 
                className={`absolute inset-0 transition-all-custom ${
                  animationStep === "show_first" 
                    ? "opacity-1 transform scale-100 pointer-events-auto" 
                    : "opacity-0 transform scale-90 pointer-events-none -translate-x-4"
                }`}
              >
                <Image 
                  src="/wlfsc.png" 
                  alt="WLFSC Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>

              {/* ২. RelaxStudio Logo */}
              <div 
                className={`absolute inset-0 transition-all-custom ${
                  animationStep === "show_second" 
                    ? "opacity-1 transform scale-100 pointer-events-auto" 
                    : "opacity-0 transform scale-90 pointer-events-none translate-x-4"
                }`}
              >
                <Image 
                  src="/relaxstudio.png" 
                  alt="RelaxStudio Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>

            </div>

          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4 font-serif">
            উইল্‌স সাহিত্য ক্লাব
          </h1>

          <h2 className="text-xl md:text-2xl text-rose-700 font-medium italic mb-6">
            "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে"
          </h2>

          <div className="flex items-center gap-3 text-sm md:text-base text-gray-500 font-semibold tracking-wider uppercase bg-gray-100 px-6 py-2 rounded-full">
            <span>ESTD 2024</span>
            <span>•</span>
            <span>Dhaka</span>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">আমাদের কথা</h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          ২০২৪ সালে প্রতিষ্ঠিত উইল্‌স সাহিত্য ক্লাব এমন একটি উন্মুক্ত প্রাঙ্গণ, যেখানে সাহিত্যের প্রতি অকৃত্রিম ভালোবাসা এবং সৃজনশীলতার মেলবন্ধন ঘটে। আমরা বিশ্বাস করি প্রতিটি শিক্ষার্থীর মাঝেই লুকিয়ে আছে একজন সুপ্ত লেখক, কবি বা দার্শনিক। আমাদের মূল লক্ষ্য হলো সেই প্রতিভাকে খুঁজে বের করা এবং একটি সুস্থ সাহিত্যিক পরিবেশ নিশ্চিত করা।
        </p>
      </section>

      {/* 3. Features Section */}
      <section className="bg-stone-50 py-20 border-t border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 font-serif mb-3">আমাদের মূল কার্যক্রম</h3>
            <p className="text-gray-500">উইলিয়ানদের সৃজনশীলতার মূল ভিত্তি</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold font-serif text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Flashbacks Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 font-serif mb-3">স্মৃতির পাতা</h3>
            <p className="text-gray-500">আমাদের সাম্প্রতিক কার্যক্রমের কিছু মুহূর্ত</p>
          </div>

          {flashbackImages.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-xl border border-gray-200/60">
              <p className="text-gray-400 italic text-sm">কোনো ছবি পাওয়া যায়নি। public/pic ফোল্ডারে ছবি রাখুন।</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {flashbackImages.slice(0, 6).map((fileName, idx) => (
                  <div key={idx} className="relative group aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gray-100">
                    <Image
                      src={`/pic/${fileName}`}
                      alt={`Club Activity Flashback ${idx + 1}`}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium drop-shadow-md">মুহূর্ত {idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/album"
                  className="inline-flex items-center gap-2 bg-stone-100 hover:bg-rose-50 text-stone-800 hover:text-rose-950 font-semibold text-sm px-6 py-3 rounded-full border border-stone-200 shadow-sm transition-all duration-250"
                >
                  সব ছবি দেখুন (অ্যালবাম) ➔
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 5. Call to Action Section */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif mb-4">
            আমাদের সাংগঠনিক প্যানেল দেখতে চান?
          </h3>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            ক্লাবের স্বপ্নযাত্রাকে বাস্তবে রূপ দিতে রানিং কমিটি এবং পূর্ববর্তী জেনারেশনের যেসকল প্যানেল মেম্বাররা নিরলসভাবে কাজ করে যাচ্ছেন, তাদের সাথে পরিচিত হোন।
          </p>
          <Link 
            href="/panel" 
            className="inline-block bg-stone-900 text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-rose-900 transition-colors shadow-sm"
          >
            অফিশিয়াল প্যানেল দেখুন 📖
          </Link>
        </div>
      </section>

    </main>
  );
}
