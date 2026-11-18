"use client";

import Image from "next/image";
import { useState } from "react";

const EVENT = {
  title: "সাহিত্যের নবীনবরণ ’২৬",
  host: "উইল্‌স সাহিত্য ক্লাব",
  logo: "/nobinboron26.png",
};

const chapters = [
  { no: "01", title: "প্রথম পরিচয়", note: "নাম জানা থেকে শুরু হয় গল্প।", body: "একই জায়গায় এসে মেলে ভিন্ন ভিন্ন মানুষ, অভ্যাস আর স্বপ্ন। পরিচয়ের ছোট্ট মুহূর্ত থেকেই তৈরি হয় নতুন বন্ধন।" },
  { no: "02", title: "শব্দের আড্ডা", note: "কথা হোক, লেখা হোক, নিজের মতো।", body: "কবিতা, গল্প, ভাবনা কিংবা এক কাপ আড্ডা—সাহিত্য এখানে কোনো দূরের বিষয় নয়; আমাদের প্রতিদিনের কথারই আরেক রূপ।" },
  { no: "03", title: "স্মৃতির খাতা", note: "দিন শেষে থেকে যায় কিছু মানুষ।", body: "অনুষ্ঠান একদিনের, কিন্তু পরিচয় আর স্মৃতি সঙ্গে থাকে আরও অনেক দিন। নবীনবরণ সেই শুরুর জন্যই।" },
];

const wordNotes: Record<string, string> = {
  "কৌতূহল": "প্রশ্ন করো। নতুন কিছু জানার দরজাটা সেখানেই।",
  "বন্ধুত্ব": "একটা পরিচয় কখন যে প্রিয় আড্ডা হয়ে যায়, বোঝাই যায় না।",
  "সৃজনশীলতা": "মাথায় আসা অদ্ভুত ভাবনাটাও বলো—সেখান থেকেই হয়তো গল্প শুরু হবে।",
};

export default function NobinBoronPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chosenWord, setChosenWord] = useState("কৌতূহল");
  const [openChapter, setOpenChapter] = useState<number | null>(0);

  const navItems = [
    ["#about", "আয়োজন"],
    ["#chapters", "কী থাকছে"],
    ["#word", "একটি শব্দ"],
    ["#details", "তথ্য"],
  ];

  return (
    <main className="nobinboron-page min-h-screen overflow-x-clip bg-[#171012] text-[#f8f0e6] selection:bg-[#d7a6a0] selection:text-[#241719]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.045]" aria-hidden="true" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")" }} />

      <header className="relative z-30 mx-auto flex max-w-[1360px] items-center justify-between border-b border-[#f8f0e6]/15 px-5 py-5 sm:px-8 lg:px-14">
        <a href="#top" className="flex items-center gap-3" aria-label="নবীনবরণ, শুরুতে ফিরে যাও">
          <span className="relative h-11 w-11 shrink-0">
            <Image src={EVENT.logo} alt="" fill sizes="44px" className="object-contain" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">নবীনবরণ ’২৬</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[.22em] text-[#f8f0e6]/45">Willes Literary Club</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex" aria-label="প্রধান নেভিগেশন">
          {navItems.map(([href, label]) => <a key={href} href={href} className="text-sm text-[#f8f0e6]/65 transition-colors hover:text-white">{label}</a>)}
          <a href="#details" className="border border-[#d7a6a0]/65 px-4 py-2 text-sm text-[#f3c9c0] transition-colors hover:bg-[#d7a6a0] hover:text-[#241719]">বিস্তারিত <span aria-hidden="true">↗</span></a>
        </nav>
        <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="মোবাইল নেভিগেশন" className="border border-[#f8f0e6]/25 px-3 py-2 text-xs md:hidden">{menuOpen ? "বন্ধ ×" : "মেনু +"}</button>
        {menuOpen && <nav className="absolute left-4 right-4 top-[76px] z-40 border border-[#f8f0e6]/20 bg-[#211719] p-2 shadow-xl md:hidden" aria-label="মোবাইল নেভিগেশন">{navItems.map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-[#f8f0e6]/80 hover:bg-white/5">{label} ↗</a>)}</nav>}
      </header>

      <section id="top" className="relative z-10 mx-auto grid max-w-[1360px] gap-10 px-5 pb-20 pt-12 sm:px-8 sm:pt-16 md:grid-cols-[1.08fr_.92fr] md:items-center md:pb-28 lg:px-14 lg:pt-20">
        <div className="relative">
          <p className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.24em] text-[#d7a6a0] sm:text-xs"><span className="h-px w-9 bg-[#d7a6a0]" /> একটি ক্লাবের নতুন মুখদের জন্য</p>
          <h1 className="max-w-4xl text-[clamp(3.6rem,9vw,8.2rem)] font-semibold leading-[.98] tracking-[-.07em]">
            <span className="block">সাহিত্যের</span>
            <span className="mt-2 block font-serif font-normal italic text-[#d7a6a0]">নবীনবরণ</span>
            <span className="mt-4 block text-lg font-normal tracking-normal text-[#f8f0e6]/55 sm:text-2xl">’২৬ <span className="mx-2 text-[#d7a6a0]/70">/</span> নতুনদের সঙ্গে প্রথম দেখা</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-8 text-[#f8f0e6]/68 sm:text-lg sm:leading-9">এটা শুধু একটা অনুষ্ঠান নয়—নতুন মুখ চেনা, গল্প শোনা, নিজের কথা বলা আর একসঙ্গে কিছু স্মৃতি বানানোর অজুহাত।</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#about" className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#f3e8da] px-6 py-3 text-sm font-semibold text-[#281b1c] transition-colors hover:bg-white">আয়োজনটা চিনে নাও <span aria-hidden="true">↓</span></a>
            <a href="#details" className="inline-flex min-h-12 items-center justify-center border border-[#f8f0e6]/25 px-6 py-3 text-sm text-[#f8f0e6]/80 transition-colors hover:border-[#d7a6a0] hover:text-white">তারিখ ও তথ্য</a>
          </div>
          <div className="mt-12 grid max-w-lg grid-cols-2 border-t border-[#f8f0e6]/20 pt-5">
            <div><p className="text-[10px] uppercase tracking-[.2em] text-[#f8f0e6]/40">আয়োজনে</p><p className="mt-2 text-sm">{EVENT.host}</p></div>
            <div className="border-l border-[#f8f0e6]/20 pl-5"><p className="text-[10px] uppercase tracking-[.2em] text-[#f8f0e6]/40">অনুষ্ঠানের তারিখ</p><p className="mt-2 text-sm">শীঘ্রই জানানো হবে</p></div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -right-1 top-5 z-20 rotate-6 border border-[#2b1a1d]/15 bg-[#e9c9b9] px-4 py-2 text-xs font-semibold text-[#2b1a1d] shadow-sm sm:right-3 sm:top-8">নতুনদের জন্য, মন থেকে</div>
          <div className="relative aspect-[4/5] overflow-hidden border border-[#f8f0e6]/20 bg-[#3a2026]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_45%_35%,rgba(215,166,160,.22),transparent_45%),linear-gradient(160deg,#48272e_0%,#28181c_58%,#171012_100%)]" />
            <div className="absolute left-5 top-5 h-10 w-10 border-l border-t border-[#f3e8da]/50 sm:left-8 sm:top-8" />
            <div className="absolute bottom-5 right-5 h-10 w-10 border-b border-r border-[#f3e8da]/50 sm:bottom-8 sm:right-8" />
            <div className="absolute inset-x-0 top-[13%] text-center text-[9px] uppercase tracking-[.34em] text-[#f3e8da]/50">WLC · Presents</div>
            <div className="absolute inset-x-[10%] top-[19%] bottom-[19%]">
              <Image src={EVENT.logo} alt="সাহিত্যের নবীনবরণ ’২৬-এর লোগো" fill priority sizes="(max-width: 768px) 90vw, 520px" className="object-contain p-3" />
            </div>
            <div className="absolute inset-x-0 bottom-[11%] text-center">
              <p className="font-serif text-2xl italic text-[#f3e8da] sm:text-3xl">চলো, পরিচিত হই।</p>
              <p className="mt-3 text-[9px] uppercase tracking-[.3em] text-[#f3e8da]/45">A new page begins here</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] tracking-[.12em] text-[#f8f0e6]/40"><span>POSTER / ০১</span><span>উইল্‌স সাহিত্য ক্লাব</span></div>
        </div>
      </section>

      <section id="about" className="relative z-10 border-y border-[#2a1d20] bg-[#f1e7da] px-5 py-16 text-[#281b1c] sm:px-8 sm:py-24 lg:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-9 md:grid-cols-[.7fr_1.3fr] md:gap-20">
          <div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#8e414c]">কেন নবীনবরণ?</p><h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-.055em] sm:text-6xl">প্রথম দিনটা<br /><span className="font-serif font-normal italic text-[#8e414c]">আপন হোক।</span></h2></div>
          <div className="md:pt-3"><p className="max-w-3xl text-lg leading-9 sm:text-[1.35rem] sm:leading-10">ক্লাবে নতুন যোগ দেওয়া মানে শুধু একটা নামের তালিকায় জায়গা পাওয়া নয়। এটা নিজের মতো মানুষ খুঁজে পাওয়া, নতুন কিছু চেষ্টা করা, আর সাহিত্যের সঙ্গে আরও কাছের সম্পর্ক গড়ে তোলার শুরু।</p><div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#281b1c]/20 pt-5 text-xs text-[#281b1c]/60"><span>01 — পরিচয়</span><span>02 — আড্ডা</span><span>03 — স্মৃতি</span></div></div>
        </div>
      </section>

      <section id="chapters" className="relative z-10 px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col justify-between gap-5 border-b border-[#f8f0e6]/20 pb-7 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#d7a6a0]">অনুষ্ঠানের ভাবনা</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] sm:text-6xl">তিনটে ছোট অধ্যায়।</h2></div><p className="max-w-sm text-sm leading-7 text-[#f8f0e6]/50">নির্দিষ্ট সূচি পরে জানানো হবে। আপাতত, নবীনবরণের মনের কথাটা জেনে নাও।</p></div>
          <div className="mt-4 divide-y divide-[#f8f0e6]/15 border-b border-[#f8f0e6]/15">
            {chapters.map((chapter, index) => <article key={chapter.no} className="grid gap-3 py-6 sm:grid-cols-[72px_1fr_auto] sm:items-start sm:gap-6 sm:py-8">
              <span className="pt-1 font-serif text-sm italic text-[#d7a6a0]">{chapter.no}</span>
              <div><button type="button" onClick={() => setOpenChapter(openChapter === index ? null : index)} aria-expanded={openChapter === index} className="flex w-full items-start justify-between gap-4 text-left"><span className="text-2xl font-medium tracking-tight sm:text-3xl">{chapter.title}</span><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center border border-[#f8f0e6]/25 text-sm text-[#d7a6a0]">{openChapter === index ? "−" : "+"}</span></button><p className="mt-2 text-sm text-[#f8f0e6]/45">{chapter.note}</p>{openChapter === index && <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f8f0e6]/70">{chapter.body}</p>}</div>
              <span className="hidden pt-2 text-[10px] uppercase tracking-[.18em] text-[#f8f0e6]/30 sm:block">Chapter {chapter.no}</span>
            </article>)}
          </div>
        </div>
      </section>

      <section id="word" className="relative z-10 bg-[#321e23] px-5 py-16 sm:px-8 sm:py-20 lg:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-9 md:grid-cols-[.9fr_1.1fr] md:items-center md:gap-16">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#d7a6a0]">তোমার পালা</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">এই শুরুটা কোন শব্দে?</h2><p className="mt-4 max-w-md text-sm leading-7 text-[#f8f0e6]/55">একটা শব্দ বেছে নাও। নতুনদের জন্য আমাদের ছোট্ট বার্তাটা বদলে যাবে।</p></div>
          <div className="border border-[#f8f0e6]/20 bg-[#211619] p-5 sm:p-8">
            <div className="flex flex-wrap gap-2" role="group" aria-label="একটি শব্দ বেছে নাও">{Object.keys(wordNotes).map((word) => <button type="button" key={word} onClick={() => setChosenWord(word)} aria-pressed={chosenWord === word} className={"border px-4 py-2.5 text-sm transition-colors " + (chosenWord === word ? "border-[#e8c7b5] bg-[#e8c7b5] text-[#281b1c]" : "border-[#f8f0e6]/20 text-[#f8f0e6]/75 hover:border-[#e8c7b5]/70")}>{word}</button>)}</div>
            <div className="mt-7 min-h-24 border-l-2 border-[#d7a6a0] pl-5" aria-live="polite"><p className="text-[10px] uppercase tracking-[.2em] text-[#d7a6a0]">{chosenWord}</p><p className="mt-3 text-lg leading-8 text-[#f8f0e6] sm:text-xl">{wordNotes[chosenWord]}</p></div>
          </div>
        </div>
      </section>

      <section id="details" className="relative z-10 px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1200px] overflow-hidden border border-[#f8f0e6]/20 md:grid-cols-[1.2fr_.8fr]">
          <div className="bg-[#f1e7da] px-6 py-9 text-[#281b1c] sm:px-10 sm:py-12">
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#8e414c]">ক্যালেন্ডারে রাখো</p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-[-.055em] sm:text-6xl">দেখা হবে<br /><span className="font-serif font-normal italic text-[#8e414c]">খুব শিগগির।</span></h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-[#281b1c]/65">তারিখ, সময় ও অংশগ্রহণ-সংক্রান্ত তথ্য নিশ্চিত হলে এই পেজেই আপডেট দেওয়া হবে।</p>
          </div>
          <div className="flex flex-col justify-between gap-8 bg-[#24171a] px-6 py-9 sm:px-9 sm:py-12">
            <div><p className="text-[10px] uppercase tracking-[.2em] text-[#f8f0e6]/40">তারিখ ও সময়</p><p className="mt-3 text-xl font-medium">শীঘ্রই ঘোষণা করা হবে</p></div>
            <div className="border-t border-[#f8f0e6]/20 pt-5"><p className="text-[10px] uppercase tracking-[.2em] text-[#f8f0e6]/40">আয়োজক</p><p className="mt-3 text-base">{EVENT.host}</p></div>
            <a href="https://wlc.pro.bd" className="inline-flex w-fit items-center gap-3 border-b border-[#d7a6a0]/60 pb-2 text-sm text-[#f3c9c0] hover:text-white">ক্লাবের ওয়েবসাইট <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#f8f0e6]/15 px-5 py-8 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><span className="relative h-10 w-10 shrink-0"><Image src={EVENT.logo} alt="" fill sizes="40px" className="object-contain" /></span><div><p className="text-sm font-semibold">সাহিত্যের নবীনবরণ ’২৬</p><p className="mt-1 text-[10px] text-[#f8f0e6]/40">{EVENT.host}</p></div></div>
          <p className="text-xs text-[#f8f0e6]/35">নতুন মুখ। নতুন গল্প। একসঙ্গে নতুন শুরু।</p>
          <div className="flex items-center gap-5 text-xs text-[#f8f0e6]/45"><a href="https://wlc.pro.bd" className="hover:text-white">WLC ↗</a><a href="#top" className="hover:text-white">শুরুতে ↑</a><span>© {new Date().getFullYear()}</span></div>
        </div>
      </footer>
    </main>
  );
}
