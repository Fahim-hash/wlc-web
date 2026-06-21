"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// এফএকিউ (FAQ) ডেটা স্ট্রাকচার
const faqs = [
  { q: "উইল্‌স সাহিত্য ক্লাবের সদস্য কীভাবে হবো?", a: "আমাদের হোমপেজের 'নিবন্ধন' সেকশন থেকে সরাসরি ফর্ম পূরণ করে ক্লাবের অফিশিয়াল সদস্য হওয়া যাবে।" },
  { q: "লেখা জমা দেওয়ার জন্য কি কোনো ফি দিতে হয়?", a: "না, লেখা জমা দেওয়া বা সাহিত্য চর্চার জন্য কোনো প্রকার ফি-র প্রয়োজন নেই। এটি সম্পূর্ণ উন্মুক্ত প্রাঙ্গণ।" },
  { q: "আমি কি গল্প বা কবিতা ছাড়া অন্য কিছু সাবমিট করতে পারি?", a: "অবশ্যই! প্রবন্ধ, অনুবাদ সাহিত্য, অনুভূতির ডায়েরি, বুক রিভিউ কিংবা যেকোনো সৃজনশীল লেখনী সাবমিট করা যাবে।" }
];

export default function WillesSahityaClub() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 🎭 Falling Bangla Characters Effect (Matrix Style but Aesthetic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.85; // হিরো সেকশনের হাইট অনুযায়ী
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // বাংলা অক্ষরের সেট
    const banglaChars = "অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলভশষসহড়ঢ়য়ৎংঃঁ".split("");
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      // ব্যাকগ্রাউন্ডের ট্রেইল ইফেক্ট (আলতো আলফা দেওয়া যাতে ক্যারেক্টারগুলো ফেড আউট হয়)
      ctx.fillStyle = "rgba(250, 250, 250, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ক্যারেক্টারগুলোর কালার (রোজ/স্টোন থিমের সাথে ম্যাচ করে হালকা ও সফ্ট টোন)
      ctx.fillStyle = "rgba(159, 18, 57, 0.12)"; // rose-900 এর সাথে সামঞ্জস্যপূর্ণ আলফা
      ctx.font = `${fontSize}px Hind_Siliguri, sans-serif`;

      for (let i = 0; i < drops.length; i++) {
        const text = banglaChars[Math.floor(Math.random() * banglaChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // র্যান্ডম ইন্টারভালে ক্যারেক্টার আবার টপে ফেরত যাবে
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">

      {/* ================= ১. HERO SECTION (WITH FALLING BANGLA CHARACTERS) ================= */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center bg-white border-b border-stone-200/60 shadow-sm overflow-hidden">
        {/* ক্যানভাস ব্যাকগ্রাউন্ড */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto space-y-6">
          {/* লোগো */}
          <div className="relative w-32 h-32 md:w-36 md:h-36 drop-shadow-sm transition-transform duration-500 hover:scale-105">
            <Image
              src="/logo.png"
              alt="উইল্‌স সাহিত্য ক্লাবের লোগো"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* ক্লাব নাম ও ট্যাগলাইন */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-stone-950">
              উইল্‌স সাহিত্য ক্লাব
            </h1>
            <h3 className="text-xl md:text-2xl text-rose-900 font- italic tracking-wide">
              "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে"
            </h3>
          </div>

          {/* ব্যাজ */}
          <div className="flex items-center gap-3 text-xs md:text-sm text-stone-500 font-bold tracking-widest uppercase bg-stone-100 border border-stone-200/50 px-5 py-2 rounded-full shadow-sm">
            <span>ESTD 2024</span>
            <span className="text-stone-300">•</span>
            <span>WLFSC</span>
          </div>
        </div>
      </section>

      {/* ================= ২. ABOUT SECTION (আমাদের কথা) ================= */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest">পরিচিতি</span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-stone-950">আমাদের কথা</h3>
          <div className="w-12 h-1 bg-rose-900/30 mx-auto rounded-full" />
        </div>
        <p className="text-base md:text-lg text-stone-600 leading-relaxed max-w-3xl mx-auto font-medium">
          ২০২৪ সালে প্রতিষ্ঠিত উইল্‌স সাহিত্য ক্লাব এমন একটি উন্মুক্ত প্রাঙ্গণ,  সাহিত্যে প্রতি অকৃত্রিম ভালোবাসা এবং সৃজনশীলতার মেলবন্ধন ঘটে। আমরা বিশ্বাস করি প্রতিটি শিক্ষার্থীর মাঝেই লুকিয়ে আছে একজন সুপ্ত লেখক, কবি বা দার্শনিক। আমাদের মূল লক্ষ্য হলো সেই প্রতিভাকে খুঁজে বের করা এবং একটি সুস্থ সাহিত্যিক পরিবেশ নিশ্চিত করা।
        </p>
      </section>

      {/* ================= ৩. WRITING & SHOBDO SECTION (সাহিত্য চর্চা ও শব্দকোষ) ================= */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* লেখালেখি ডেস্ক */}
        <div className="bg-white border border-stone-200/60 p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 hover:border-stone-300 transition-all">
          <div className="space-y-3">
            <div className="text-3xl">🖋️</div>
            <h4 className="text-xl font-bold text-stone-950">মুক্ত লেখনী ডেস্ক</h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              তোমার ভেতরের সৃজনশীল সত্ত্বাকে ডানা মেলতে দাও। গল্প, কবিতা কিংবা অনুভূতির ক্যানভাসে যা কিছু আছে, সরাসরি পাঠিয়ে দাও আমাদের প্রকাশনা প্যানেলে।
            </p>
          </div>
          <Link href="/writing/submit" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-stone-950 hover:bg-stone-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
            লেখা জমা দিন ➔
          </Link>
        </div>

        {/* শব্দ (অজানা শব্দের ভাণ্ডার) */}
        <div className="bg-white border border-stone-200/60 p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 hover:border-stone-300 transition-all">
          <div className="space-y-3">
            <div className="text-3xl">📖</div>
            <h4 className="text-xl font-bold text-stone-950">শব্দ (অজানা শব্দের ভাণ্ডার)</h4>
            <p className="text-stone-500 text-sm leading-relaxed">
              বাংলা সাহিত্যের প্রমিত ও হারিয়ে যাওয়া চমৎকার সব শব্দের সংগ্রহশালা। শব্দের অন্তর্নিহিত অর্থ, উৎপত্তি ও বাক্যে এর সঠিক প্রয়োগ জেনে সমৃদ্ধ করো তোমার শব্দভাণ্ডার।
            </p>
          </div>
          <Link href="/shobdo" className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold rounded-xl shadow-sm transition-all border border-rose-100">
            শব্দকোষ অন্বেষণ করুন 🔍
          </Link>
        </div>
      </section>

      {/* ================= ৪. REGISTRATION SECTION (নতুন মেম্বার নিবন্ধন) ================= */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-stone-950 text-stone-100 rounded-3xl p-8 md:p-12 shadow-xl border border-stone-800 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-rose-900/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block px-3 py-1 bg-stone-900 text-rose-400 border border-stone-800 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Recruitment Live
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">নতুন মেম্বার রেজিস্ট্রেশন</h3>
            <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-medium">
              উইলসিয়ানদের সৃজনশীলতার সবচেয়ে বড় পরিবারে যুক্ত হতে তুমি কি প্রস্তুত? ক্লাবের বিভিন্ন ইভেন্ট ম্যানেজমেন্ট, দেয়ালিকা প্রকাশনা কিংবা কো-কারিকুলার লিডারশিপের অংশ হতে আজই তোমার আবেদন সম্পন্ন করো।
            </p>
            <div className="pt-2">
              <Link href="/register" className="inline-block px-8 py-3 bg-white text-stone-950 hover:bg-stone-100 font-bold text-sm rounded-xl transition-all shadow-md">
                অফিশিয়াল মেম্বারশিপ ফর্ম 📝
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ৫. ACHIEVEMENTS SECTION (আমাদের অর্জন) ================= */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest">সফলতার স্মারক</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-stone-950">গৌরব ও অর্জন</h3>
          <div className="w-12 h-1 bg-rose-900/30 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tag: "সাহিত্য উৎসব", title: "আন্তঃকলেজ দেয়ালিকা প্রতিযোগিতা", detail: "ঢাকা শহরের শীর্ষস্থানীয় collegeগুলোর মাঝে সেরা কন্টেন্ট ও ডিজাইনের স্বীকৃতি।" },
            { tag: "কুইজ চ্যাম্পিয়নশিপ", title: "জাতীয় সাহিত্য কুইজ রানার্স-আপ", detail: "বাংলা ভাষা ও সাহিত্যের গভীর জ্ঞান ও মেধার প্রমাণ রেখে গৌরবময় অর্জন।" },
            { tag: "স্বীকৃতি", title: "সেরা উদীয়মান ক্লাব সম্মাননা", detail: "শিক্ষা প্রতিষ্ঠানে সাহিত্য চর্চা ও কন্ট্রিবিউশনে অনন্য অবদানের জন্য বিশেষ স্মারক।" }
          ].map((item, index) => (
            <div key={index} className="bg-white border border-stone-200/60 p-6 rounded-2xl shadow-sm space-y-3">
              <span className="inline-block text-[10px] font-bold text-rose-950 bg-rose-100/60 px-2 py-0.5 rounded">
                {item.tag}
              </span>
              <h4 className="text-base font-bold text-stone-950">{item.title}</h4>
              <p className="text-stone-500 text-xs leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/achievements" className="text-xs font-bold text-stone-600 hover:text-rose-900 transition-colors inline-flex items-center gap-1">
            সকল অর্জনের তালিকা দেখুন →
          </Link>
        </div>
      </section>

      {/* ================= 📸 ৬. ALBUM / FLASHBACKS (স্মৃতির পাতা - UPDATED) ================= */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest">গ্যালারি</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-stone-950">স্মৃতির পাতা</h3>
          <p className="text-stone-400 text-xs font-medium">আমাদের সাম্প্রতিক কার্যক্রমের কিছু খণ্ডচিত্র</p>
        </div>

        {/* 🖼️ /public/album ফোল্ডার থেকে 2.jpg থেকে 6.jpg পর্যন্ত ম্যাপ করা হয়েছে */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {[2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="relative aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 group shadow-sm">
              <Image 
                src={`/album/${num}.jpg`}
                alt={`WLC মুহূর্ত ${num}`}
                fill
                sizes="(max-w-768px) 100vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                <span className="text-white text-[10px] font-bold tracking-wider uppercase bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded">
                  মুহূর্ত ০{num - 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/album" className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs px-6 py-3 rounded-xl border border-stone-200 shadow-sm transition-all">
            সব ছবি দেখুন (অ্যালবাম) ➔
          </Link>
        </div>
      </section>

      {/* ================= ৭. PANEL & ARCHIVE (সাংগঠনিক কাঠামো) ================= */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-rose-50/60 border border-rose-100 rounded-3xl p-8 text-center space-y-6">
          <h3 className="text-2xl font-bold text-stone-950">আমাদের সাংগঠনিক প্যানেল</h3>
          <p className="text-stone-600 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-medium">
            ক্লাবের স্বপ্নযাত্রাকে বাস্তবে রূপ দিতে রানিং কমিটি, শিক্ষক মডারেটর মন্ডলী এবং পূর্ববর্তী জেনারেশনের যেসকল প্যানেল মেম্বাররা নিরলসভাবে কাজ করে যাচ্ছেন, তাদের প্রোফাইল দেখে নিন।
          </p>
          <Link href="/panel" className="inline-block bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm">
            অফিশিয়াল প্যানেল ও আর্কাইভ 📖
          </Link>
        </div>
      </section>

      {/* ================= ৮. FAQ SECTION (সাধারণ জিজ্ঞাসা) ================= */}
      <section className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-rose-900 uppercase tracking-widest">জিজ্ঞাসা</span>
          <h3 className="text-2xl md:text-3xl font-extrabold text-stone-950">প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী</h3>
          <div className="w-12 h-1 bg-rose-900/30 mx-auto rounded-full" />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-stone-200/60 rounded-xl overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-sm md:text-base text-stone-950 hover:bg-stone-50/50"
              >
                <span>{faq.q}</span>
                <span className="text-stone-400 font-mono">{openFaq === idx ? "−" : "+"}</span>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs md:text-sm text-stone-500 leading-relaxed border-t border-stone-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
