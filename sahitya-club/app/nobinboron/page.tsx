"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

const EVENT_CONFIG = {
  title: "সাহিত্যের নবীনবরণ ২০২৬",
  shortTitle: "নবীনবরণ ’২৬",
  date: "শীঘ্রই",
  dateLabel: "তারিখ শীঘ্রই জানানো হবে",
  tagline: "নতুন মুখ। নতুন গল্প। নতুন অধ্যায়।",
  logo: "/nobinboron26.png",
  host: "উইল্‌স সাহিত্য ক্লাব",
};

const EVENT_DATE: string | null = null;

const QUESTS = [
  {
    id: "word",
    type: "choice",
    title: "শূন্য পাতায় প্রথম শব্দটি কী?",
    text: "একটি নতুন সাহিত্যযাত্রা কোন শব্দ দিয়ে শুরু করবে?",
    options: ["অভিযাত্রা", "অজুহাত", "বিদায়"],
    answer: "অভিযাত্রা",
    points: 100,
  },
  {
    id: "line",
    type: "choice",
    title: "প্রথম লাইনটি বেছে নাও",
    text: "তোমার গল্পের শুরুটা কোন বাক্যে সবচেয়ে সুন্দর হবে?",
    options: ["আজ থেকেই শুরু।", "একদিন হয়তো শুরু করব।", "গল্পটা এখানেই শেষ।"],
    answer: "আজ থেকেই শুরু।",
    points: 100,
  },
  {
    id: "letters",
    type: "letters",
    title: "ছড়িয়ে থাকা অক্ষরগুলো সাজাও",
    text: "তিনটি টুকরোকে সঠিক ক্রমে সাজিয়ে একটি সাহিত্যিক শব্দ বানাও।",
    letters: ["প", "গ", "ল্"],
    answer: "গল্প",
    points: 150,
  },
  {
    id: "visual",
    type: "visual",
    title: "ছবির ভেতর কবিতাটি পড়ো",
    text: "তিনটি দৃশ্য একসঙ্গে দেখো। এগুলো মিলিয়ে কোন শব্দটি লুকিয়ে আছে?",
    options: ["বই", "চিঠি", "মঞ্চ"],
    answer: "বই",
    points: 175,
    poem: ["পাতা খুললে শব্দ জাগে", "নীরব অক্ষর কথা বলে", "মলাট পেরিয়ে গল্প নামে"],
  },
  {
    id: "door",
    type: "choice",
    title: "শেষ দরজাটি খোলো",
    text: "নবীনবরণের আসল শুরু কোথায়?",
    options: ["শেষে", "শুরুতেই", "কখনোই না"],
    answer: "শুরুতেই",
    points: 200,
  },
];

const LITERARY_MARKS = ["অ", "ক", "গ", "স", "র", "ম", "শ", "প", "ল", "ই", "ত", "❦", "❧", "“", "”"];

export default function NobinBoronPage() {
  const [timeLeft, setTimeLeft] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });
  const [questIndex, setQuestIndex] = useState(0);
  const [questScore, setQuestScore] = useState(0);
  const [questDone, setQuestDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [questFeedback, setQuestFeedback] = useState("");
  const [questStarted, setQuestStarted] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [countdownExpired, setCountdownExpired] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [letterOrder, setLetterOrder] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(15);
  const [hintUsed, setHintUsed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [draggedLetter, setDraggedLetter] = useState<number | null>(null);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, 130]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.15]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduced);
    const stored = window.localStorage.getItem("nobinboron26-best-score");
    if (stored) setBestScore(Number(stored));
  }, []);

  useEffect(() => {
    if (!EVENT_DATE) return;
    const update = () => {
      const distance = new Date(EVENT_DATE).getTime() - Date.now();
      if (distance <= 0) { setCountdownExpired(true); setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" }); return; }
      setCountdownExpired(false);
      setTimeLeft({
        days: String(Math.floor(distance / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((distance / 3600000) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((distance / 60000) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((distance / 1000) % 60)).padStart(2, "0"),
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const currentQuest = QUESTS[questIndex];
  const progress = Math.round((questDone ? 100 : ((questIndex + 1) / QUESTS.length) * 100));

  const reveal = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 32 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7 },
      };

  useEffect(() => {
    if (!questStarted || questDone || selected) return;
    setSeconds(15);
    setHintUsed(false);
    setLetterOrder(currentQuest.type === "letters" ? [...currentQuest.letters!] : []);
  }, [questIndex, questStarted, questDone]);

  useEffect(() => {
    if (!questStarted || questDone || selected || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [questStarted, questDone, selected, seconds]);

  useEffect(() => {
    if (seconds === 0 && questStarted && !questDone && !selected) {
      finishAnswer(false, true);
    }
  }, [seconds, questStarted, questDone, selected]);

  function finishAnswer(isCorrect: boolean, timedOut = false) {
    if (selected || questDone) return;

    const earned = isCorrect
      ? Math.max(25, currentQuest.points - (hintUsed ? 40 : 0) + Math.min(seconds * 3, 45) + streak * 10)
      : 0;

    setQuestFeedback(
      isCorrect
        ? `দারুণ! তুমি ${earned} পয়েন্ট পেয়েছ।`
        : timedOut
          ? "সময় শেষ। গল্প থেমে নেই—পরের পাতায় চলো।"
          : "এই দরজাটি নয়। গল্পের আরেকটি পথ আছে।"
    );
    setSelected(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setQuestScore((score) => score + earned);
      setStreak((value) => value + 1);
    } else {
      setStreak(0);
    }

    window.setTimeout(() => {
      if (questIndex === QUESTS.length - 1) {
        const finalScore = questScore + earned;
        setQuestDone(true);
        const previous = Number(window.localStorage.getItem("nobinboron26-best-score") || 0);
        if (finalScore > previous) {
          window.localStorage.setItem("nobinboron26-best-score", String(finalScore));
          setBestScore(finalScore);
        }
        return;
      }
      setQuestIndex((index) => index + 1);
      setSelected(null);
      setQuestFeedback("");
      setLetterOrder([]);
    }, 900);
  }

  function answer(option: string) {
    finishAnswer(option === currentQuest.answer);
  }

  function chooseLetter(index: number) {
    if (selected || currentQuest.type !== "letters") return;
    setLetterOrder((order) => {
      if (order.includes(currentQuest.letters![index])) return order;
      return [...order, currentQuest.letters![index]];
    });
  }

  function removeLetter(letter: string) {
    if (selected) return;
    setLetterOrder((order) => order.filter((item) => item !== letter));
  }

  function moveLetter(from: number, to: number) {
    if (selected || from === to || from < 0 || to < 0) return;
    setLetterOrder((order) => {
      const next = [...order];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function clearLetters() {
    if (selected) return;
    setLetterOrder([]);
  }

  function submitLetters() {
    if (!letterOrder.length) return;
    finishAnswer(letterOrder.join("") === currentQuest.answer);
  }

  function useHint() {
    if (hintUsed || selected) return;
    setHintUsed(true);
    setQuestFeedback("ইঙ্গিত: উত্তরটি নতুন কিছু শুরু করার সঙ্গে জড়িত।");
  }

  function startQuest() {
    setQuestStarted(true);
    setQuestDone(false);
    setQuestIndex(0);
    setQuestScore(0);
    setSelected(null);
    setQuestFeedback("");
    setLetterOrder([]);
    setStreak(0);
  }

  function resetQuest() {
    setQuestStarted(false);
    setQuestDone(false);
    setQuestIndex(0);
    setQuestScore(0);
    setSelected(null);
    setQuestFeedback("");
    setLetterOrder([]);
    setStreak(0);
  }

  return (
    <main className="nobinboron-page min-h-screen overflow-x-hidden bg-[#08090b] text-[#f7f0e4] selection:bg-[#d8a45d] selection:text-[#111]">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] [background-image:radial-gradient(#fff_0.7px,transparent_0.7px)] [background-size:5px_5px]" />

      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
        {LITERARY_MARKS.map((mark, index) => (
          <span
            key={`${mark}-${index}`}
            className="nobi-literary-mark absolute select-none font-serif"
            style={{
              left: `${6 + ((index * 17) % 88)}%`,
              top: `${8 + ((index * 23) % 82)}%`,
              animationDelay: `${index * -1.7}s`,
              fontSize: `${18 + (index % 5) * 8}px`,
            }}
          >
            {mark}
          </span>
        ))}
        <div className="absolute left-[8%] top-[22%] h-40 w-40 rounded-full bg-[#8f2e35]/10 blur-[80px]" />
        <div className="absolute right-[6%] top-[54%] h-52 w-52 rounded-full bg-[#d8a45d]/[0.06] blur-[100px]" />
        <div className="absolute bottom-[8%] left-[38%] h-44 w-44 rounded-full bg-[#8f2e35]/[0.08] blur-[90px]" />
      </div>

      <div className="fixed right-4 top-4 z-40 sm:right-7 sm:top-7">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] backdrop-blur-xl transition hover:border-white/35"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "বন্ধ" : "মেনু"}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={reducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#101114]/95 p-2 shadow-2xl backdrop-blur-xl"
            >
              {[
                ["#story", "গল্প"],
                ["#journey", "যাত্রা"],
                ["#quest", "নবীন অভিযান"],
                ["#memories", "স্মৃতির দেয়াল"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <section className="relative z-[2] flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#07080a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(184,66,62,.22),transparent_30%),radial-gradient(circle_at_50%_65%,rgba(216,164,93,.12),transparent_42%)]" />
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
        <motion.div style={{ y: reducedMotion ? 0 : heroY, opacity: reducedMotion ? 1 : heroOpacity }} className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-24 text-center">
          <p className="text-[10px] font-semibold tracking-[0.28em] text-[#d8a45d] sm:text-xs">{EVENT_CONFIG.host} উপস্থাপন করছে</p>
          <div className="relative mt-8 h-[min(78vw,560px)] w-[min(78vw,560px)]">
            <div className="absolute inset-[8%] rounded-full bg-[#a83e43]/20 blur-[90px]" />
            <div className="absolute inset-[5%] rounded-full border border-[#d8a45d]/10" />
            <div className="absolute inset-[13%] rounded-full border border-white/5" />
            <Image src={EVENT_CONFIG.logo} alt="নবীনবরণ ২০২৬" fill priority sizes="(max-width: 640px) 78vw, 560px" className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,.65)]" />
          </div>
          <div className="mt-3 flex items-center gap-4 text-[9px] tracking-[0.24em] text-white/35"><span className="h-px w-10 bg-white/15" />একটি নতুন গল্পের শুরু<span className="h-px w-10 bg-white/15" /></div>
          <div className="mb-6 w-full max-w-xl">
            <div className="flex items-center justify-center gap-2 text-[9px] tracking-[0.2em] text-[#d8a45d]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d8a45d]" />অনুষ্ঠানের কাউন্টডাউন</div>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
              {(["দিন", "ঘণ্টা", "মিনিট", "সেকেন্ড"] as const).map((label, index) => { const value = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][index]; return <div key={label} className="rounded-2xl border border-white/10 bg-black/25 px-2 py-3 backdrop-blur-xl sm:px-4 sm:py-4"><div className="text-2xl font-semibold tabular-nums tracking-[-0.04em] sm:text-4xl">{value}</div><div className="mt-1 text-[9px] text-white/30">{label}</div></div>; })}
            </div>
            <p className="mt-3 text-[10px] text-white/30">{countdownExpired ? "অনুষ্ঠানের সময় এসে গেছে।" : EVENT_DATE ? EVENT_CONFIG.dateLabel : "তারিখ শীঘ্রই জানানো হবে · তারিখ সেট করলেই কাউন্টডাউন শুরু হবে"}</p>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">নতুন মুখ।<br /><span className="text-[#d8a45d]">নতুন গল্প।</span></h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">{EVENT_CONFIG.tagline} এবার নবীনবরণ শুধু একটি অনুষ্ঠান নয়—একটি জীবন্ত সাহিত্য-অভিজ্ঞতা।</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a href="#story" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111] transition hover:scale-[1.02]">গল্পে প্রবেশ ↓</a>
            <a href="#quest" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-[#d8a45d]/50 hover:text-white">নবীন অভিযান খেলো</a>
          </div>
        </motion.div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.25em] text-white/25">নিচে এগিয়ে চলো</div>
      </section>

      <motion.section id="story" {...reveal} className="relative z-[2] overflow-hidden border-y border-white/8 bg-[#0d0f12] px-5 py-24 sm:py-32">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#7d252b]/15 blur-[100px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[.8fr_1.2fr] md:gap-24">
          <div><p className="text-[10px] font-semibold tracking-[0.25em] text-[#d8a45d]">০১ / গল্প</p><h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">একটি অনুষ্ঠান নয়।<br /><span className="text-white/35">একটি শুরু।</span></h2></div>
          <div className="text-base leading-8 text-white/55 sm:text-lg">
            <p>নবীনবরণ মানে নতুনদের শুধু স্বাগত জানানো নয়। এটি সেই মুহূর্ত, যখন অচেনা মুখগুলো পরিচিত হয়, একটি নতুন বন্ধুত্ব শুরু হয়, আর সাহিত্যের জগতে কেউ নিজের প্রথম পাতা খুলে বসে।</p>
            <p className="mt-7">তাই {EVENT_CONFIG.shortTitle}-কে আমরা বানাচ্ছি একটি যাত্রা—যেখানে তুমি শুধু দর্শক নও। তুমি গল্পের অংশ।</p>
            <div className="mt-10 border-l border-[#d8a45d]/40 pl-5 text-sm italic text-white/35">“প্রথম পাতায় শেষটা জানা থাকে না।”</div>
          </div>
        </div>
      </motion.section>

      <section className="relative z-[2] overflow-hidden border-y border-[#d8a45d]/15 bg-[#0b0c0f] px-5 py-16 sm:py-20">
  <div className="mx-auto max-w-5xl text-center">
    <p className="text-[10px] font-semibold tracking-[0.25em] text-[#d8a45d]">তারিখের অপেক্ষা</p>
    <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">নতুন অধ্যায়ের আগে আর কতক্ষণ?</h2>
    <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-4">
      {(["দিন", "ঘণ্টা", "মিনিট", "সেকেন্ড"] as const).map((label, index) => { const value = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][index]; return <div key={label} className="rounded-2xl border border-[#d8a45d]/15 bg-[#d8a45d]/[0.03] px-2 py-4 sm:px-5 sm:py-6"><div className="text-3xl font-semibold tabular-nums text-[#f7f0e4] sm:text-5xl">{value}</div><div className="mt-2 text-[9px] text-white/30">{label}</div></div>; })}
    </div>
    <p className="mt-5 text-xs text-white/30">{EVENT_DATE ? EVENT_CONFIG.dateLabel : "তারিখ এখনো ঘোষণা হয়নি · কোডে EVENT_DATE সেট করলেই এটি স্বয়ংক্রিয়ভাবে চলবে"}</p>
  </div>
</section>

<section id="journey" className="relative z-[2] bg-[#08090b] px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal}><p className="text-[10px] font-semibold tracking-[0.25em] text-[#d8a45d]">০২ / যাত্রা</p><h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">পর্দা ওঠার আগেই<br /><span className="text-white/30">গল্প শুরু হয়ে যায়।</span></h2></motion.div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              ["০১", "পরিচয়", "নতুন মানুষদের সঙ্গে পরিচয়। প্রথম কথা, প্রথম হাসি, প্রথম স্মৃতি।"],
              ["০২", "অভিযান", "ইঙ্গিত, পছন্দ আর নবীন অভিযানের মধ্য দিয়ে গল্প এগোবে।"],
              ["০৩", "স্মৃতি", "শেষে থাকবে এমন কিছু মুহূর্ত, যেগুলো অনুষ্ঠান পেরিয়েও থেকে যাবে।"],
            ].map(([number, title, text], index) => (
              <motion.article {...(reducedMotion ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { delay: index * 0.08, duration: 0.55 } })} key={number} className="group bg-[#0c0e11] p-7 transition hover:bg-[#111419] sm:p-10">
                <span className="text-xs text-[#d8a45d]">{number}</span><h3 className="mt-20 text-3xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mt-4 text-sm leading-7 text-white/45">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="quest" className="relative z-[2] overflow-hidden border-y border-[#d8a45d]/15 bg-[#11100f] px-5 py-24 sm:py-32">
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8f2e35]/10 blur-[110px]" />
        <div className="relative mx-auto max-w-5xl">
          <motion.div {...reveal} className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-[#d8a45d]">০৩ / নবীন অভিযান</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">শুধু প্রশ্ন নয়।<br />একটি ছোট্ট সাহিত্য-অভিযান।</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45">পাঁচটি ধাপ। পছন্দ, অক্ষর, ধাঁধা আর সময়ের চাপ। যত দ্রুত ও নির্ভুলভাবে এগোবে, তত বেশি পয়েন্ট।</p>
          </motion.div>

          <div className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-xl sm:p-9">
            {!questStarted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d8a45d]/30 bg-[#d8a45d]/5 text-3xl">✦</div>
                <p className="mt-7 text-[10px] font-semibold tracking-[0.25em] text-[#d8a45d]">নবীন অভিযান · ৫ ধাপ</p>
                <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">তোমার গল্পের দরজা খুলো।</h3>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/45">প্রতিটি ধাপের জন্য ১৫ সেকেন্ডের দৃশ্যমান টাইমার। ইঙ্গিত নিলে পয়েন্ট কমবে। ধারাবাহিকভাবে সঠিক উত্তর দিলে অতিরিক্ত পয়েন্ট পাবে।</p>
                <div className="mt-7 flex flex-wrap justify-center gap-2 text-[10px] tracking-[0.12em] text-white/30"><span className="rounded-full border border-white/10 px-3 py-2">৫ ধাপ</span><span className="rounded-full border border-white/10 px-3 py-2">১৫ সেকেন্ড</span><span className="rounded-full border border-white/10 px-3 py-2">ইঙ্গিত</span><span className="rounded-full border border-white/10 px-3 py-2">সেরা স্কোর</span></div>
                <button onClick={startQuest} className="mt-8 rounded-full bg-[#f7f0e4] px-7 py-3 text-sm font-semibold text-[#111] transition hover:scale-[1.02]">অভিযান শুরু করো →</button>
                {bestScore !== null && <p className="mt-5 text-xs text-white/30">তোমার সেরা স্কোর: {bestScore}</p>}
              </div>
            ) : questDone ? (
              <motion.div initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <div className="text-5xl text-[#d8a45d]">✦</div>
                <p className="mt-5 text-[10px] font-semibold tracking-[0.25em] text-[#d8a45d]">অভিযান সম্পূর্ণ</p>
                <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">{questScore >= 600 ? "গল্পকার" : questScore >= 350 ? "অনুসন্ধানী" : "নবীন পাঠক"}</h3>
                <p className="mt-3 text-white/45">তোমার স্কোর: <span className="text-white">{questScore}</span></p>
                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/35">{questScore >= 600 ? "সব দরজা তুমি খুলেছ। এবার বাস্তব গল্পের প্রথম পাতায় তোমার নাম লেখার পালা।" : "সব উত্তর ঠিক না হলেও গল্প থেমে যায় না। আসল অধ্যায় শুরু হবে নবীনবরণে।"}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={resetQuest} className="rounded-full border border-white/15 px-6 py-3 text-sm transition hover:border-[#d8a45d]/50">আবার খেলো</button><a href="#memories" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111]">স্মৃতির দেয়াল দেখো →</a></div>
              </motion.div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div><p className="text-[10px] tracking-[0.16em] text-white/35">ধাপ {questIndex + 1} / {QUESTS.length}</p><p className="mt-1 text-[10px] text-white/20">এই ধাপের সময়</p></div>
                  <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border ${seconds <= 5 ? "border-[#e18b74]/70 bg-[#e18b74]/10 text-[#e18b74]" : "border-[#d8a45d]/35 bg-[#d8a45d]/[.06] text-[#d8a45d]"}`}>
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeOpacity=".12" strokeWidth="2" /><circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="169.6" strokeDashoffset={169.6 * (1 - seconds / 15)} strokeLinecap="round" className="transition-all duration-1000" /></svg>
                    <span className="text-sm font-bold tabular-nums">{seconds}</span>
                  </div>
                </div>
                <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#d8a45d] transition-all duration-300" style={{ width: `${progress}%` }} /></div>
                <div className="mb-8 flex items-center justify-between text-[10px] text-white/35"><span>স্কোর: {questScore}</span><span>ধারাবাহিক সঠিক: {streak}</span></div>

                <AnimatePresence mode="wait">
                  <motion.div key={currentQuest.id} initial={reducedMotion ? false : { opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? undefined : { opacity: 0, x: -25 }}>
                    <h3 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{currentQuest.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/45">{currentQuest.text}</p>

                    {currentQuest.type === "letters" ? (
                      <div className="mt-8">
                        <p className="mb-3 text-center text-[10px] tracking-[0.16em] text-white/25">টেনে সাজাও · অথবা ট্যাপ করে অক্ষর যোগ করো</p>
                        <div className="mb-6 flex min-h-20 flex-wrap justify-center gap-2 rounded-2xl border border-[#d8a45d]/20 bg-[#d8a45d]/[0.04] p-3">
                          {letterOrder.length ? letterOrder.map((letter, index) => <button key={letter + index} type="button" draggable={!selected} onDragStart={() => setDraggedLetter(index)} onDragOver={(event) => { event.preventDefault(); if (draggedLetter !== null && draggedLetter !== index) { moveLetter(draggedLetter, index); setDraggedLetter(index); } }} onDragEnd={() => setDraggedLetter(null)} onClick={() => removeLetter(letter)} className="flex h-14 min-w-14 cursor-grab touch-none items-center justify-center rounded-xl border border-[#d8a45d]/40 bg-[#d8a45d]/10 px-3 text-2xl font-semibold transition active:cursor-grabbing hover:-translate-y-0.5">{letter}</button>) : <span className="py-4 text-xs text-white/20">এখানে অক্ষরগুলো এনে শব্দ তৈরি করো</span>}
                        </div>
                        <div className="flex justify-center gap-3">
                          {currentQuest.letters!.map((letter, index) => { const used = letterOrder.includes(letter); return <button key={letter + index} onClick={() => chooseLetter(index)} disabled={used || Boolean(selected)} className={`flex h-16 min-w-16 items-center justify-center rounded-2xl border text-2xl font-semibold transition ${used ? "border-white/5 bg-white/5 text-white/15" : "border-white/10 bg-white/[.03] hover:-translate-y-1 hover:border-[#d8a45d]/50"}`}>{letter}</button>; })}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={clearLetters} className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-xs text-white/50 transition hover:text-white">আবার সাজাও</button>
                          <button onClick={submitLetters} disabled={!letterOrder.length} className="flex-1 rounded-2xl bg-[#f7f0e4] px-4 py-3 text-xs font-semibold text-[#111] disabled:opacity-30">উত্তর দাও →</button>
                        </div>
                      </div>
                    ) : currentQuest.type === "visual" ? (
                      <div className="mt-8">
                        <div className="grid grid-cols-3 gap-2">
                          {["পাতা", "মলাট", "অক্ষর"].map((label, index) => <div key={label} className="relative overflow-hidden rounded-2xl border border-[#d8a45d]/15 bg-[#d8a45d]/[.04] p-4 text-center"><div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/20 text-2xl text-[#d8a45d]">{["▤", "▥", "অ"][index]}</div><p className="text-xs text-white/45">{label}</p></div>)}
                        </div>
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.025] p-5 text-center">
                          {currentQuest.poem!.map((line, index) => <p key={line} className="text-sm leading-8 text-white/55"><span className="mr-2 text-[#d8a45d]/60">{index + 1}</span>{line}</p>)}
                        </div>
                        <div className="mt-5 grid gap-3">{currentQuest.options!.map((option) => <button key={option} onClick={() => answer(option)} disabled={Boolean(selected)} className={`rounded-2xl border px-5 py-4 text-left text-sm transition ${selected === "correct" && option === currentQuest.answer ? "border-[#d8a45d]/70 bg-[#d8a45d]/10" : selected ? "border-white/5 opacity-45" : "border-white/10 bg-white/[.02] hover:border-white/25 hover:bg-white/[.04]"}`}>{option}</button>)}</div>
                      </div>
                    ) : (
                      <div className="mt-8 grid gap-3">
                        {currentQuest.options!.map((option) => {
                          const isCorrect = selected === "correct" && option === currentQuest.answer;
                          return <button key={option} onClick={() => answer(option)} disabled={Boolean(selected)} className={`group flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition disabled:cursor-default ${isCorrect ? "border-[#d8a45d]/70 bg-[#d8a45d]/10" : selected ? "border-white/5 opacity-45" : "border-white/10 bg-white/[.02] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[.04]"}`}><span>{option}</span><span className="text-white/20 transition group-hover:translate-x-1">→</span></button>;
                        })}
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <button onClick={useHint} disabled={hintUsed || Boolean(selected)} className="text-xs text-white/25 transition hover:text-[#d8a45d] disabled:opacity-20">ইঙ্গিত নাও (-৪০)</button>
                      {hintUsed && <span className="text-xs text-[#d8a45d]/70">ইঙ্গিত: নতুন শুরুর কথা ভাবো।</span>}
                    </div>

                    <AnimatePresence>
                      {questFeedback && <motion.p initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 text-center text-xs ${selected === "correct" ? "text-[#d8a45d]" : "text-white/35"}`}>{questFeedback}</motion.p>}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>

          {secretRevealed && <motion.div initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-5 max-w-3xl rounded-2xl border border-[#d8a45d]/20 bg-[#d8a45d]/5 p-5 text-center text-sm text-[#d8a45d]">গোপন বার্তা: <strong>তোমার গল্প শুরু হয়েছে।</strong></motion.div>}
          <button onClick={() => setSecretRevealed(true)} className="mx-auto mt-7 block text-[9px] tracking-[0.2em] text-white/15 transition hover:text-white/40">এখানে আরও একটি গল্প লুকিয়ে আছে</button>
        </div>
      </section>

      <section id="memories" className="relative z-[2] bg-[#e9e1d5] px-5 py-24 text-[#141313] sm:py-32">
        <motion.div {...reveal} className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_.8fr] md:items-end">
            <div><p className="text-[10px] font-semibold tracking-[0.25em] text-[#8d3037]">০৪ / স্মৃতির দেয়াল</p><h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">দেয়ালটি এখনো ফাঁকা।<br /><span className="text-black/35">এখনও।</span></h2></div>
            <p className="max-w-md text-sm leading-7 text-black/50 md:justify-self-end">অনুষ্ঠান শুরু হলে এখানেই ছবি, মুহূর্ত আর ছোট ছোট গল্প জমা হবে। আজ এটি শুধু সেই জায়গাটাকে ধরে রাখছে।</p>
          </div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {["প্রথম পরিচয়", "প্রথম ছবি", "প্রথম হাসি", "প্রথম স্মৃতি"].map((label, index) => <div key={label} className="aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-[#ddd3c5] p-5"><div className="flex h-full flex-col justify-between"><span className="text-[9px] tracking-[0.2em] text-black/30">{String(index + 1).padStart(2, "0")}</span><span className="text-xs font-semibold tracking-[0.14em] text-black/35">{label}</span></div></div>)}
          </div>
        </motion.div>
      </section>

      <section className="relative z-[2] overflow-hidden bg-[#08090b] px-5 py-28 text-center sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,62,67,.18),transparent_35%)]" />
        <motion.div {...reveal} className="relative mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-[#d8a45d]">আমাদের গল্পের শুরু</p>
          <h2 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-7xl md:text-8xl">আজ তুমি নবীন।<br /><span className="text-[#d8a45d]">কাল তুমি গল্প।</span></h2>
          <div className="mx-auto mt-10 h-px w-24 bg-[#d8a45d]/40" />
          <div className="relative mx-auto mt-10 h-32 w-32 sm:h-40 sm:w-40"><Image src={EVENT_CONFIG.logo} alt="নবীনবরণ ২০২৬ লোগো" fill sizes="160px" className="object-contain" /></div>
          <p className="mt-7 text-sm text-white/35">{EVENT_CONFIG.host} · {EVENT_CONFIG.shortTitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><a href="#quest" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111]">আবার অভিযান খেলো</a><a href="#story" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white">↑ শুরুতে ফিরো</a></div>
        </motion.div>
      </section>
    </main>
  );
}
