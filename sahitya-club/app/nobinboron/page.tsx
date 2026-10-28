"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EVENT = { title: "সাহিত্যের নবীনবরণ ’২৬", tagline: "নতুন মুখ। নতুন গল্প। নতুন অধ্যায়।", host: "উইল্‌স সাহিত্য ক্লাব", logo: "/nobinboron26.png" };
const chapters = [
  { n: "০১", mark: "অ", title: "পরিচয়ের প্রথম পাতা", text: "নতুন মানুষ, নতুন কণ্ঠ—একটি পরিচয় থেকেই কত গল্পের শুরু হয়।" },
  { n: "০২", mark: "ক", title: "শব্দের সঙ্গে যাত্রা", text: "সাহিত্য, সৃজনশীলতা আর ছোট ছোট চমকের ভেতর দিয়ে এগিয়ে চলা।" },
  { n: "০৩", mark: "গ", title: "স্মৃতি হয়ে থাকা", text: "অনুষ্ঠান শেষ হলেও কিছু মুহূর্ত থেকে যায় নিজের গল্প হয়ে।" },
];
const questions = [
  { q: "একটি নতুন গল্পের প্রথম দরজা কী দিয়ে খোলে?", options: ["কৌতূহল", "অজুহাত", "নীরব বিদায়"], a: "কৌতূহল" },
  { q: "কোনটি শব্দকে জীবন্ত করে তোলে?", options: ["শুধু কাগজ", "ভাবনা ও অনুভব", "একটি বন্ধ দরজা"], a: "ভাবনা ও অনুভব" },
  { q: "নবীনবরণের সবচেয়ে সুন্দর স্মৃতি কোনটি?", options: ["শুধু মঞ্চ", "শুধু ছবি", "একসঙ্গে তৈরি করা মুহূর্ত"], a: "একসঙ্গে তৈরি করা মুহূর্ত" },
];

export default function NobinBoronPage() {
  const reduceMotion = useReducedMotion();
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
  const reveal = reduceMotion ? {} : { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.6 } };

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

  function reset() { setStarted(false); setStep(0); setAnswers([]); }

  return (
    <main className="nobinboron-page relative min-h-screen overflow-x-clip bg-[#100d0e] text-[#f8f3ec] selection:bg-rose-700 selection:text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-rose-900/20 blur-[120px]" />
        <div className="absolute -right-32 top-[45%] h-[30rem] w-[30rem] rounded-full bg-amber-700/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#fff_0.7px,transparent_0.7px)] [background-size:5px_5px]" />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
        <a href="#top" className="flex items-center gap-3" aria-label="নবীনবরণ শুরুর পাতা">
          <span className="relative h-11 w-11 overflow-hidden rounded-full border border-rose-200/20 bg-white/[0.04]"><Image src={EVENT.logo} alt="" fill sizes="44px" className="object-contain p-1.5" /></span>
          <span className="leading-tight"><span className="block text-sm font-semibold">নবীনবরণ ’২৬</span><span className="mt-1 block text-[10px] tracking-[0.16em] text-white/40">WILLES LITERARY CLUB</span></span>
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="প্রধান নেভিগেশন">
          <a className="text-sm text-white/55 transition hover:text-white" href="#story">আয়োজন</a><a className="text-sm text-white/55 transition hover:text-white" href="#journey">অভিজ্ঞতা</a><a className="text-sm text-white/55 transition hover:text-white" href="#quest">নবীন অভিযান</a><a className="rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-rose-300/60 hover:bg-rose-950/30" href="#details">ইভেন্টের তথ্য ↗</a>
        </nav>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="মোবাইল মেনু" className="rounded-full border border-white/15 px-4 py-2 text-sm md:hidden">{menuOpen ? "বন্ধ ×" : "মেনু ☰"}</button>
        <AnimatePresence>{menuOpen && <motion.nav initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} className="absolute left-4 right-4 top-[76px] rounded-2xl border border-white/10 bg-[#171113]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden">{[["#story", "আয়োজন"], ["#journey", "অভিজ্ঞতা"], ["#quest", "নবীন অভিযান"], ["#details", "ইভেন্টের তথ্য"]].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white/75 hover:bg-white/5">{label} ↗</a>)}</motion.nav>}</AnimatePresence>
      </header>

      <section id="top" className="relative z-10 mx-auto grid min-h-[calc(100svh-80px)] w-full max-w-[1440px] items-center gap-8 px-5 pb-20 pt-10 sm:px-8 md:grid-cols-[1.05fr_.95fr] md:pb-28 lg:px-14">
        <div className="relative z-10 max-w-3xl">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="inline-flex items-center gap-3 rounded-full border border-rose-200/15 bg-rose-950/20 px-4 py-2"><span className="h-1.5 w-1.5 rounded-full bg-rose-300 shadow-[0_0_12px_#fda4af]" /><span className="text-[10px] font-semibold tracking-[0.2em] text-rose-100/80 sm:text-xs">একটি নতুন অধ্যায়ের সূচনা</span></motion.div>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }} className="mt-8 text-[clamp(3.3rem,10vw,7.8rem)] font-semibold leading-[1.03] tracking-[-0.065em]">সাহিত্যের<br /><span className="bg-gradient-to-r from-[#fff5e8] via-[#f4c9bd] to-[#d97787] bg-clip-text text-transparent">নবীনবরণ</span><span className="ml-2 align-top text-[0.35em] font-normal tracking-normal text-rose-200">’২৬</span></motion.h1>
          <motion.p initial={reduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mt-7 max-w-xl text-base leading-8 text-white/55 sm:text-lg sm:leading-9">{EVENT.tagline} পরিচিত গণ্ডির বাইরে এসে, শব্দ আর সৃজনশীলতার ভেতর দিয়ে একসঙ্গে পথচলার আমন্ত্রণ।</motion.p>
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#story" className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#f8f3ec] px-7 py-4 text-sm font-semibold text-[#201416] transition hover:-translate-y-0.5 hover:bg-white">আয়োজনটি আবিষ্কার করো <span className="transition group-hover:translate-x-1">↗</span></a><a href="#quest" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 px-7 py-4 text-sm text-white/80 transition hover:border-rose-200/40 hover:bg-white/[0.04]">ছোট্ট অভিযান খেলো <span>✳</span></a></motion.div>
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-xs text-white/35"><span>{EVENT.host}</span><span className="hidden h-1 w-1 rounded-full bg-rose-300/60 sm:block" /><span>তারিখ ও সময় শীঘ্রই ঘোষণা করা হবে</span></div>
        </div>
        <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.12 }} className="relative mx-auto flex w-full max-w-[620px] items-center justify-center py-8 md:py-0">
          <div aria-hidden="true" className="absolute aspect-square w-[92%] rounded-full border border-rose-100/10" /><div aria-hidden="true" className="absolute aspect-square w-[76%] rounded-full border border-dashed border-amber-100/15" /><div aria-hidden="true" className="absolute aspect-square w-[58%] rounded-full bg-rose-900/20 blur-[70px]" />
          <div className="relative aspect-square w-full max-w-[560px]"><div className="absolute inset-[9%] overflow-hidden rounded-[48%_52%_50%_50%/42%_43%_57%_58%] border border-white/15 bg-gradient-to-br from-[#3c2028] via-[#21151a] to-[#111012] shadow-[0_40px_120px_rgba(0,0,0,.45)]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(244,201,189,.16),transparent_40%),linear-gradient(145deg,transparent_30%,rgba(190,18,60,.12))]" /><div className="absolute inset-[8%] rounded-[48%_52%_50%_50%/42%_43%_57%_58%] border border-white/[0.08]" /><Image src={EVENT.logo} alt="সাহিত্যের নবীনবরণ ’২৬-এর লোগো" fill priority sizes="(max-width: 768px) 80vw, 540px" className="z-10 object-contain p-[14%] drop-shadow-[0_20px_45px_rgba(0,0,0,.45)]" /></div>
            <motion.div animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute right-[1%] top-[17%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-[#1d1519]/80 text-3xl text-rose-100 shadow-2xl backdrop-blur-xl sm:h-20 sm:w-20 sm:text-4xl">অ</motion.div>
            <motion.div animate={reduceMotion ? undefined : { y: [0, 9, 0], rotate: [0, -4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[13%] left-[1%] flex h-14 w-14 items-center justify-center rounded-full border border-amber-100/20 bg-[#21191a]/90 text-2xl text-amber-100 shadow-2xl backdrop-blur-xl sm:h-[4.5rem] sm:w-[4.5rem] sm:text-3xl">✳</motion.div><span className="absolute left-[12%] top-[14%] text-xs tracking-[0.3em] text-white/30">WLC / ২৬</span><span className="absolute bottom-[15%] right-[8%] text-[10px] tracking-[0.2em] text-white/35">A NEW CHAPTER</span>
          </div>
        </motion.div>
        <a href="#story" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] tracking-[0.22em] text-white/30 md:flex"><span className="h-8 w-px bg-gradient-to-b from-rose-200/60 to-transparent" />আরও নিচে আবিষ্কার করো</a>
      </section>

      <div aria-hidden="true" className="relative z-10 overflow-hidden border-y border-white/10 bg-[#f5eee5] py-4 text-[#2b1a1d]"><div className="flex min-w-max items-center gap-8 text-xs font-semibold tracking-[0.18em] sm:gap-12 sm:text-sm">{Array.from({ length: 4 }, (_, index) => <span key={index} className="flex items-center gap-8 sm:gap-12"><span>নতুন মুখ</span><span className="text-rose-700">✳</span><span>নতুন গল্প</span><span className="text-rose-700">✳</span><span>নতুন অধ্যায়</span><span className="text-rose-700">✳</span></span>)}</div></div>

      <section id="story" className="relative z-10 px-5 py-24 sm:px-8 sm:py-32 lg:px-14"><motion.div {...reveal} className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[.75fr_1.25fr] md:gap-20"><div><p className="text-[10px] font-semibold tracking-[0.25em] text-rose-200">এই আয়োজনের কথা</p><h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">শুধু স্বাগত নয়।<br /><span className="text-white/35">একসঙ্গে শুরু।</span></h2></div><div className="max-w-3xl md:pt-8"><p className="text-lg leading-9 text-white/70 sm:text-xl sm:leading-10">প্রতিটি নতুন সদস্য নিয়ে আসে নতুন ভাবনা, নতুন প্রশ্ন, নতুন সম্ভাবনা। নবীনবরণ সেই সব গল্পকে একই জায়গায় মিলিয়ে দেওয়ার আয়োজন—যেখানে সাহিত্য কেবল পড়া হয় না, অনুভবও করা হয়।</p><p className="mt-6 text-sm leading-8 text-white/40">একটি পরিচয় থেকে বন্ধুত্ব, একটি শব্দ থেকে কবিতা, একটি মুহূর্ত থেকে স্মৃতি—এই যাত্রা সবার জন্য।</p><a href="#journey" className="mt-8 inline-flex items-center gap-3 border-b border-rose-200/30 pb-2 text-sm text-rose-100 transition hover:border-rose-200/70">এই যাত্রা দেখো <span>↓</span></a></div></motion.div></section>

      <section id="journey" className="relative z-10 border-y border-white/[0.08] bg-[#171113] px-5 py-24 sm:px-8 sm:py-32 lg:px-14"><div className="mx-auto max-w-7xl"><motion.div {...reveal} className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-[10px] font-semibold tracking-[0.25em] text-rose-200">তিনটি অধ্যায়</p><h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">যাত্রাটি এমন হতে পারে।</h2></div><p className="max-w-md text-sm leading-7 text-white/40">প্রতিটি মুহূর্তের পেছনে আছে মানুষ, শব্দ আর একসঙ্গে কিছু তৈরি করার আনন্দ।</p></motion.div><div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-3">{chapters.map((chapter, index) => <motion.article {...(reduceMotion ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { delay: index * 0.1, duration: 0.55 } })} key={chapter.n} className="group relative flex min-h-[310px] flex-col overflow-hidden rounded-[1.7rem] border border-white/10 bg-gradient-to-br from-white/[0.055] to-transparent p-7 transition duration-300 hover:-translate-y-1 hover:border-rose-200/25 sm:p-9"><div className="flex items-start justify-between"><span className="text-xs tracking-[0.2em] text-rose-200/70">{chapter.n} / ০৩</span><span className="text-4xl font-serif text-rose-100/25 transition group-hover:scale-110 group-hover:text-rose-100/60">{chapter.mark}</span></div><div className="mt-auto"><h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{chapter.title}</h3><p className="mt-4 text-sm leading-7 text-white/45">{chapter.text}</p></div><div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-rose-200/70 to-transparent transition-all duration-500 group-hover:w-full" /></motion.article>)}</div></div></section>

      <section id="quest" className="relative z-10 px-5 py-24 sm:px-8 sm:py-32 lg:px-14"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><motion.div {...reveal}><p className="text-[10px] font-semibold tracking-[0.25em] text-rose-200">ইন্টারঅ্যাকটিভ অভিজ্ঞতা</p><h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">নবীন অভিযান<span className="text-rose-200">.</span></h2><p className="mt-6 max-w-md text-sm leading-8 text-white/45">তিনটি ছোট প্রশ্নে খুঁজে দেখো—একটি নতুন গল্পের শুরু কোথায়। প্রতিটি সঠিক উত্তরে ১০০ পয়েন্ট।</p><div className="mt-8 flex flex-wrap gap-3 text-xs text-white/45"><span className="rounded-full border border-white/10 px-4 py-2">০৩টি প্রশ্ন</span><span className="rounded-full border border-white/10 px-4 py-2">সর্বোচ্চ ৩০০ পয়েন্ট</span></div></motion.div>
        <motion.div {...reveal} className="min-h-[390px] rounded-[2rem] border border-white/10 bg-[#191416] p-6 sm:p-9">
          {!started ? <div className="flex min-h-[330px] flex-col items-start justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-200/10 text-2xl text-rose-100">✳</span><p className="mt-7 text-xs tracking-[0.2em] text-rose-200/70">তোমার গল্পের প্রথম ধাপ</p><h3 className="mt-3 text-3xl font-semibold">প্রস্তুত তো?</h3><p className="mt-3 max-w-md text-sm leading-7 text-white/45">এখানে কোনো চাপ নেই—শুধু একটু কৌতূহল আর তিনটি প্রশ্ন।</p><button type="button" onClick={() => setStarted(true)} className="mt-7 rounded-full bg-[#f8f3ec] px-6 py-3 text-sm font-semibold text-[#201416] transition hover:bg-white">অভিযান শুরু করো ↗</button>{best !== null && <p className="mt-5 text-xs text-white/30">তোমার সেরা স্কোর: {best} / ৩০০</p>}</div>
          : done ? <div className="flex min-h-[330px] flex-col items-start justify-center"><span className="text-4xl text-rose-200">✦</span><p className="mt-6 text-xs tracking-[0.2em] text-rose-200/70">অভিযান সম্পূর্ণ</p><h3 className="mt-3 text-4xl font-semibold">{score} / ৩০০</h3><p className="mt-4 max-w-md text-sm leading-7 text-white/50">{score === 300 ? "চমৎকার! তোমার কৌতূহলই তোমাকে সঠিক পথে নিয়ে গেছে।" : "প্রতিটি গল্প শেখার মধ্য দিয়েই এগোয়। আবার চেষ্টা করতে পারো।"}</p><button type="button" onClick={reset} className="mt-7 rounded-full border border-white/20 px-6 py-3 text-sm transition hover:border-rose-200/50">আবার খেলো ↻</button></div>
          : <AnimatePresence mode="wait"><motion.div key={step} initial={reduceMotion ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -12 }} className="flex min-h-[330px] flex-col justify-center"><div className="flex items-center justify-between"><span className="text-xs tracking-[0.15em] text-rose-200/70">প্রশ্ন ০{step + 1} / ০৩</span><span className="text-xs text-white/30">{score} পয়েন্ট</span></div><div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="অভিযানের অগ্রগতি" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step + (answers[step] ? 1 : 0)}><div className="h-full rounded-full bg-rose-200 transition-[width] duration-300" style={{ width: ((step + (answers[step] ? 1 : 0)) / questions.length * 100) + "%" }} /></div><h3 className="mt-8 text-2xl font-semibold leading-snug sm:text-3xl">{questions[step].q}</h3><div className="mt-6 grid gap-3">{questions[step].options.map((option, index) => <button key={option} type="button" onClick={() => answer(option)} aria-pressed={answers[step] === option} disabled={Boolean(answers[step])} className={`group flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-left text-sm transition-colors disabled:cursor-default ${answers[step] === option ? "border-rose-200/70 bg-rose-200/10 text-white" : "border-white/10 bg-white/[0.02] hover:border-rose-200/35 hover:bg-rose-100/[0.04]"}`}><span><span className="mr-3 text-xs text-white/25">০{index + 1}</span>{option}</span><span className="text-white/25 transition group-hover:translate-x-1 group-hover:text-rose-100">↗</span></button>)}</div></motion.div></AnimatePresence>}
        </motion.div></div></section>

      <section id="details" className="relative z-10 overflow-hidden border-y border-white/10 bg-[#f5eee5] px-5 py-20 text-[#251719] sm:px-8 sm:py-28 lg:px-14"><div aria-hidden="true" className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-rose-900/10" /><div className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-[10px] font-bold tracking-[0.25em] text-rose-800">ইভেন্টের তথ্য</p><h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">দেখা হবে নতুন<br />একটি গল্পে।</h2><p className="mt-5 max-w-xl text-sm leading-7 text-black/55">অনুষ্ঠানের তারিখ, সময় ও অন্যান্য বিস্তারিত আনুষ্ঠানিক ঘোষণার সঙ্গে এখানে জানানো হবে।</p></div><div className="min-w-[230px] border-t border-black/15 pt-5 md:min-w-[270px]"><p className="text-xs text-black/40">তারিখ</p><p className="mt-2 text-xl font-semibold">শীঘ্রই ঘোষণা করা হবে</p><p className="mt-5 text-xs text-black/40">আয়োজনে</p><p className="mt-2 text-base font-semibold">{EVENT.host}</p></div></div></section>

      <footer className="relative z-10 px-5 py-12 sm:px-8 lg:px-14"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end"><div className="flex items-center gap-3"><div className="relative h-12 w-12"><Image src={EVENT.logo} alt="" fill sizes="48px" className="object-contain" /></div><div><p className="font-semibold">সাহিত্যের নবীনবরণ ’২৬</p><p className="mt-1 text-xs text-white/35">{EVENT.host}</p></div></div><div className="flex flex-wrap gap-5 text-xs text-white/40"><a href="https://wlc.pro.bd" className="transition hover:text-white">WLC ওয়েবসাইট ↗</a><a href="#top" className="transition hover:text-white">শুরুতে ফিরে যাও ↑</a></div><p className="text-[10px] text-white/25">© {new Date().getFullYear()} Willes Literary Club</p></div></footer>
    </main>
  );
}
