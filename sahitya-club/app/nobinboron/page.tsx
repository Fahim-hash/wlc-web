"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const EVENT = {
  title: "সাহিত্যের নবীনবরণ ’২৬",
  tagline: "নতুন মুখ। নতুন গল্প। নতুন অধ্যায়।",
  host: "উইল্‌স সাহিত্য ক্লাব",
  logo: "/nobinboron26.png",
  date: "শীঘ্রই ঘোষণা করা হবে",
};

const chapters = [
  { n: "০১", title: "পরিচয়ের প্রথম পাতা", text: "নতুন মানুষ, নতুন কণ্ঠ—একটি পরিচয় থেকেই কত গল্পের শুরু হয়।", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=85", alt: "খোলা বইয়ের পাতায় পড়ছে নরম আলো" },
  { n: "০২", title: "শব্দের সঙ্গে যাত্রা", text: "সাহিত্য, সৃজনশীলতা আর ছোট ছোট চমকের ভেতর দিয়ে এগিয়ে চলা।", image: "https://images.unsplash.com/photo-1455390582262-044c508f4a2d?auto=format&fit=crop&w=1200&q=85", alt: "লেখার টেবিলে খাতা ও কলম" },
  { n: "০৩", title: "স্মৃতি হয়ে থাকা", text: "অনুষ্ঠান শেষ হলেও কিছু মুহূর্ত থেকে যায় নিজের গল্প হয়ে।", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85", alt: "একসঙ্গে সময় কাটানোর স্মৃতি" },
];

const questions = [
  { q: "একটি নতুন গল্পের প্রথম দরজা কী দিয়ে খোলে?", options: ["কৌতূহল", "অজুহাত", "নীরব বিদায়"], a: "কৌতূহল" },
  { q: "কোনটি শব্দকে জীবন্ত করে তোলে?", options: ["শুধু কাগজ", "ভাবনা ও অনুভব", "একটি বন্ধ দরজা"], a: "ভাবনা ও অনুভব" },
  { q: "নবীনবরণের সবচেয়ে সুন্দর স্মৃতি কোনটি?", options: ["শুধু মঞ্চ", "শুধু ছবি", "একসঙ্গে তৈরি করা মুহূর্ত"], a: "একসঙ্গে তৈরি করা মুহূর্ত" },
];

export default function NobinBoronPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("nobinboron26-best-score");
    if (saved) setBest(Number(saved));
  }, []);

  const score = answers.reduce((sum, answer, index) => sum + (answer === questions[index]?.a ? 100 : 0), 0);
  const done = started && answers.length === questions.length;

  function answer(option: string) {
    if (answers[step] || done) return;
    const next = [...answers, option];
    setAnswers(next);
    if (next.length === questions.length) {
      const total = next.reduce((sum, item, index) => sum + (item === questions[index].a ? 100 : 0), 0);
      const previous = Number(window.localStorage.getItem("nobinboron26-best-score") || 0);
      if (total > previous) {
        window.localStorage.setItem("nobinboron26-best-score", String(total));
        setBest(total);
      }
    } else {
      window.setTimeout(() => setStep((value) => Math.min(value + 1, questions.length - 1)), 350);
    }
  }

  function reset() {
    setStarted(false);
    setStep(0);
    setAnswers([]);
  }

  return (
    <main id="top" className="nobinboron-page overflow-x-clip bg-[#f4f0e8] text-[#171615] selection:bg-[#e43d2f] selection:text-white">
      <style jsx global>{`
        .nobinboron-page { --paper: #f4f0e8; --ink: #171615; --red: #e43d2f; --line: rgba(23,22,21,.2); }
        .nobinboron-page ::selection { background: var(--red); color: white; }
        .nobi-photo { background-size: cover; background-position: center; }
        .nobi-display { font-family: var(--font-hind-siliguri, inherit); letter-spacing: -.055em; }
        @media (prefers-reduced-motion: reduce) { .nobinboron-page *, .nobinboron-page *::before, .nobinboron-page *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; } }
      `}</style>

      <div className="border-b border-black/15 px-5 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between py-4">
          <a href="#top" className="flex items-center gap-3" aria-label="নবীনবরণ শুরুর পাতা">
            <Image src={EVENT.logo} alt="" width={42} height={42} className="h-10 w-10 object-contain" />
            <span className="text-xs font-bold uppercase tracking-[.14em]">Willes Literary Club <span className="ml-1 text-[#e43d2f]">/ ২৬</span></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="নবীনবরণ নেভিগেশন">
            <a className="transition-colors hover:text-[#e43d2f]" href="#story">আয়োজন</a>
            <a className="transition-colors hover:text-[#e43d2f]" href="#journey">অভিজ্ঞতা</a>
            <a className="transition-colors hover:text-[#e43d2f]" href="#quest">নবীন অভিযান</a>
            <a className="border-b border-[#e43d2f] pb-1" href="#details">ইভেন্টের তথ্য ↗</a>
          </nav>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="মোবাইল মেনু" className="border border-black/20 px-3 py-2 text-xs md:hidden">{menuOpen ? "বন্ধ ×" : "মেনু +"}</button>
        </div>
        {menuOpen && <nav className="grid border-t border-black/10 py-2 md:hidden" aria-label="মোবাইল নেভিগেশন">{[["#story","আয়োজন"],["#journey","অভিজ্ঞতা"],["#quest","নবীন অভিযান"],["#details","ইভেন্টের তথ্য"]].map(([href,label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="border-b border-black/10 py-3 text-sm">{label} <span className="float-right text-[#e43d2f]">↗</span></a>)}</nav>}
      </div>

      <section className="relative isolate min-h-[760px] overflow-hidden bg-[#171615] text-[#f4f0e8] sm:min-h-[820px]">
        <div className="nobi-photo absolute inset-0 -z-20 opacity-65" role="img" aria-label="সাহিত্য ও নতুন শুরুর আবহ" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=2200&q=90')" }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
        <div className="mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-between px-5 pb-8 pt-10 sm:min-h-[820px] sm:px-8 sm:pb-10 sm:pt-14 lg:px-14">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[.22em] text-white/70"><span>WLC presents</span><span>সাংস্কৃতিক আয়োজন · ২০২৬</span></div>
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_.85fr]">
            <div className="max-w-4xl">
              <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[.18em] text-[#ff7568]"><span className="h-px w-10 bg-[#e43d2f]" /> নতুনদের জন্য, নতুন করে</p>
              <h1 className="nobi-display max-w-4xl text-[clamp(3.7rem,10vw,9.5rem)] font-bold leading-[.98]">{/* Intentional line breaks create a print-poster composition. */}সাহিত্যের<br /><span className="text-[#f4f0e8]">নবীনবরণ</span><span className="ml-2 inline-block align-top text-[.36em] font-medium tracking-normal text-[#ff5547]">’২৬</span></h1>
              <p className="mt-7 max-w-lg border-l-2 border-[#e43d2f] pl-4 text-base leading-8 text-white/80 sm:text-lg">{EVENT.tagline} শব্দ, মানুষ আর নতুন সম্ভাবনার সঙ্গে পরিচিত হওয়ার এক বিকেল—তারিখ শীঘ্রই ঘোষণা করা হবে।</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#story" className="inline-flex items-center gap-5 bg-[#e43d2f] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#c92f24]">আয়োজনটি আবিষ্কার করো <span aria-hidden="true">↘</span></a>
                <a href="#quest" className="inline-flex items-center gap-5 border border-white/50 px-6 py-4 text-sm text-white transition-colors hover:border-white hover:bg-white/10">ছোট্ট অভিযান খেলো <span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <div className="hidden justify-self-end pb-3 lg:block">
              <p className="max-w-[260px] text-sm leading-7 text-white/75">প্রতিটি নতুন সদস্য নিয়ে আসে নতুন ভাবনা, নতুন প্রশ্ন, নতুন সম্ভাবনা। এই গল্পের পরের পাতাটি তোমার।</p>
              <div className="mt-8 flex items-center gap-3"><span className="h-px w-12 bg-[#e43d2f]" /><span className="text-[10px] uppercase tracking-[.2em] text-white/60">An open invitation</span></div>
            </div>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/30 pt-5 text-xs text-white/65"><span>{EVENT.host}</span><span>{EVENT.date}</span><a href="#story" className="text-[#ff7568]">SCROLL TO DISCOVER ↓</a></div>
        </div>
        <span aria-hidden="true" className="absolute right-[-.06em] top-[22%] hidden select-none text-[22rem] font-bold leading-none text-white/[.045] xl:block">অ</span>
      </section>

      <div aria-hidden="true" className="overflow-hidden border-b border-black/15 bg-[#e43d2f] px-5 py-3 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[.18em] sm:text-xs"><span>নতুন মুখ</span><span>নতুন গল্প</span><span>নতুন অধ্যায়</span><span>শব্দে, ছন্দে ও ভাবনায়</span></div>
      </div>

      <section id="story" className="px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[.7fr_1.3fr] md:gap-20">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e43d2f]">০১ / আয়োজনের কথা</p><h2 className="nobi-display mt-6 text-4xl font-bold leading-[1.12] sm:text-6xl">শুধু স্বাগত নয়।<br /><span className="text-black/40">একসঙ্গে শুরু।</span></h2></div>
          <div className="max-w-3xl md:pt-8"><p className="text-xl leading-[1.9] sm:text-2xl sm:leading-[1.85]">নবীনবরণ মানে নতুনদের শুধু স্বাগত জানানো নয়। এটি সেই মুহূর্ত, যখন অচেনা মুখগুলো পরিচিত হয়, একটি নতুন বন্ধুত্ব শুরু হয়, আর সাহিত্যের জগতে কেউ নিজের প্রথম পাতা খুলে বসে।</p><div className="mt-8 flex items-start gap-5 border-t border-black/20 pt-5"><span className="text-3xl font-bold text-[#e43d2f]">“</span><p className="max-w-xl text-base leading-8 text-black/65">প্রথম পাতায় শেষটা জানা থাকে না। এই আয়োজন সেই অজানা গল্পের প্রথম আমন্ত্রণ।</p></div></div>
        </div>
      </section>

      <section id="journey" className="bg-[#e7e0d5] px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-5 border-b border-black/20 pb-7 sm:flex-row sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#e43d2f]">০২ / তিনটি অধ্যায়</p><h2 className="nobi-display mt-4 text-4xl font-bold sm:text-6xl">যাত্রাটি এমন হতে পারে।</h2></div><p className="max-w-sm text-sm leading-7 text-black/60">মানুষ, শব্দ আর একসঙ্গে কিছু তৈরি করার আনন্দ—প্রতিটি অধ্যায়ের ভেতরে একটি নতুন সম্ভাবনা।</p></div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {chapters.map((chapter, index) => <article key={chapter.n} className={index === 1 ? "md:mt-14" : ""}>
              <div className="nobi-photo relative aspect-[4/5] overflow-hidden bg-[#c9c0b4]" style={{ backgroundImage: `url('${chapter.image}')` }} role="img" aria-label={chapter.alt}><span className="absolute left-4 top-4 bg-[#f4f0e8] px-3 py-2 text-xs font-bold">{chapter.n} / ০৩</span><span className="absolute bottom-4 right-4 text-5xl font-bold text-white/80 drop-shadow-lg">{chapter.n}</span></div>
              <h3 className="nobi-display mt-5 text-2xl font-bold sm:text-3xl">{chapter.title}</h3><p className="mt-3 max-w-sm text-sm leading-7 text-black/60">{chapter.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="quest" className="bg-[#171615] px-5 py-20 text-[#f4f0e8] sm:px-8 sm:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#ff7568]">০৩ / ইন্টারঅ্যাকটিভ অভিজ্ঞতা</p><h2 className="nobi-display mt-5 text-4xl font-bold leading-tight sm:text-6xl">নবীন অভিযান<span className="text-[#e43d2f]">.</span></h2><p className="mt-6 max-w-md text-sm leading-8 text-white/60">তিনটি ছোট প্রশ্নে খুঁজে দেখো—একটি নতুন গল্পের শুরু কোথায়। প্রতিটি সঠিক উত্তরে ১০০ পয়েন্ট। তোমার সেরা স্কোর এই ব্রাউজারে সংরক্ষিত থাকবে।</p><div className="mt-8 flex gap-8 border-t border-white/20 pt-5"><div><p className="text-3xl font-bold">০৩</p><p className="mt-1 text-xs text-white/45">প্রশ্ন</p></div><div><p className="text-3xl font-bold">৩০০</p><p className="mt-1 text-xs text-white/45">সর্বোচ্চ পয়েন্ট</p></div></div></div>
          <div className="border-t-4 border-[#e43d2f] bg-[#211f1d] p-5 sm:p-9">
            {!started ? <div className="flex min-h-[320px] flex-col items-start justify-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#ff7568]">তোমার গল্পের প্রথম ধাপ</p><h3 className="nobi-display mt-4 text-3xl font-bold sm:text-4xl">প্রস্তুত তো?</h3><p className="mt-4 max-w-md text-sm leading-7 text-white/55">এখানে কোনো চাপ নেই—শুধু একটু কৌতূহল আর তিনটি প্রশ্ন।</p><button type="button" onClick={() => setStarted(true)} className="mt-7 inline-flex items-center gap-5 bg-[#e43d2f] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#c92f24]">অভিযান শুরু করো <span>↗</span></button>{best !== null && <p className="mt-5 text-xs text-white/40">তোমার সেরা স্কোর: {best} / ৩০০</p>}</div>
            : done ? <div className="flex min-h-[320px] flex-col items-start justify-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#ff7568]">অভিযান সম্পূর্ণ</p><h3 className="nobi-display mt-4 text-5xl font-bold">{score} / ৩০০</h3><p className="mt-4 max-w-md text-sm leading-7 text-white/55">{score === 300 ? "চমৎকার! তোমার কৌতূহলই তোমাকে সঠিক পথে নিয়ে গেছে।" : "প্রতিটি গল্প শেখার মধ্য দিয়েই এগোয়। আবার চেষ্টা করতে পারো।"}</p><button type="button" onClick={reset} className="mt-7 border border-white/30 px-6 py-3 text-sm transition-colors hover:border-[#ff7568]">আবার খেলো ↻</button></div>
            : <div className="flex min-h-[320px] flex-col justify-center" key={step}><div className="flex items-center justify-between text-xs"><span className="font-bold tracking-[.12em] text-[#ff7568]">প্রশ্ন ০{step + 1} / ০৩</span><span className="text-white/45">{score} পয়েন্ট</span></div><div className="mt-4 h-1 bg-white/15"><div className="h-full bg-[#e43d2f] transition-[width] duration-300" style={{ width: ((step + 1) / questions.length * 100) + "%" }} /></div><h3 className="nobi-display mt-8 text-2xl font-bold leading-snug sm:text-3xl">{questions[step].q}</h3><div className="mt-6 grid gap-2">{questions[step].options.map((option, index) => <button key={option} type="button" onClick={() => answer(option)} className="group flex items-center justify-between gap-4 border border-white/15 px-4 py-4 text-left text-sm transition-colors hover:border-[#ff7568] hover:bg-white/[.04]"><span><span className="mr-3 text-xs text-[#ff7568]">০{index + 1}</span>{option}</span><span className="text-white/40 transition-transform group-hover:translate-x-1">↗</span></button>)}</div></div>}
          </div>
        </div>
      </section>

      <section id="details" className="bg-[#e43d2f] px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1fr_.7fr] md:items-end">
          <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/75">০৪ / ইভেন্টের তথ্য</p><h2 className="nobi-display mt-5 max-w-3xl text-4xl font-bold leading-[1.12] sm:text-6xl">দেখা হবে নতুন<br />একটি গল্পে।</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/85">অনুষ্ঠানের তারিখ, সময় ও অন্যান্য বিস্তারিত আনুষ্ঠানিক ঘোষণার সঙ্গে এখানে জানানো হবে।</p></div>
          <div className="border-t border-white/45 pt-5 md:border-l md:border-t-0 md:pl-8"><p className="text-xs text-white/70">তারিখ</p><p className="mt-2 text-xl font-bold">{EVENT.date}</p><p className="mt-5 text-xs text-white/70">আয়োজনে</p><p className="mt-2 text-base font-bold">{EVENT.host}</p></div>
        </div>
      </section>

      <footer className="bg-[#f4f0e8] px-5 py-8 sm:px-8 lg:px-14"><div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-5 border-t border-black/20 pt-6 sm:flex-row sm:items-end"><div className="flex items-center gap-3"><Image src={EVENT.logo} alt="" width={44} height={44} className="h-11 w-11 object-contain" /><div><p className="font-bold">সাহিত্যের নবীনবরণ ’২৬</p><p className="mt-1 text-xs text-black/55">{EVENT.host}</p></div></div><div className="flex flex-wrap gap-5 text-xs text-black/60"><a href="https://wlc.pro.bd" className="hover:text-[#e43d2f]">WLC ওয়েবসাইট ↗</a><a href="#top" className="hover:text-[#e43d2f]">শুরুতে ফিরে যাও ↑</a></div><p className="text-[10px] text-black/45">© {new Date().getFullYear()} Willes Literary Club</p></div></footer>
    </main>
  );
}
