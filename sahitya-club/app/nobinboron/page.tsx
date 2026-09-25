"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";

const EVENT_CONFIG = {
  title: "সাহিত্যের নবীনবরণ ২০২৬",
  shortTitle: "নবীনবরণ '২৬",
  date: "TBA",
  dateLabel: "তারিখ শীঘ্রই জানানো হবে",
  tagline: "নতুন মুখ। নতুন গল্প। নতুন অধ্যায়।",
  logo: "/nobinboron26.png",
  host: "Willes Sahitto Club",
};

const EVENT_DATE: string | null = null;
// When confirmed, use e.g. "2026-11-08T10:00:00+06:00"

const QUESTS = [
  {
    id: "word",
    eyebrow: "CHAPTER 01",
    title: "শব্দ বেছে নাও",
    text: "একটি নতুন অধ্যায়ের জন্য কোন শব্দটি রাখবে?",
    options: ["আড্ডা", "অজানা", "অভিযাত্রা"],
    answer: "অভিযাত্রা",
  },
  {
    id: "line",
    eyebrow: "CHAPTER 02",
    title: "একটি লাইন লেখো",
    text: "নতুনদের গল্পের প্রথম লাইন কোনটি?",
    options: ["আজ থেকেই শুরু।", "সব শেষ হয়ে গেছে।", "গল্পটা পরে হবে।"],
    answer: "আজ থেকেই শুরু।",
  },
  {
    id: "door",
    eyebrow: "CHAPTER 03",
    title: "শেষ দরজাটি খোলো",
    text: "নবীনবরণের সবচেয়ে গুরুত্বপূর্ণ জিনিস কী?",
    options: ["স্মৃতি", "শুরু", "শেষ"],
    answer: "শুরু",
  },
];

export default function NobinBoronPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });
  const [questIndex, setQuestIndex] = useState(0);
  const [questScore, setQuestScore] = useState(0);
  const [questDone, setQuestDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, 130]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.15]);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!EVENT_DATE) return;
    const update = () => {
      const distance = new Date(EVENT_DATE).getTime() - Date.now();
      if (distance <= 0) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
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
  const progress = useMemo(
    () => Math.round(((questDone ? QUESTS.length : questIndex) / QUESTS.length) * 100),
    [questDone, questIndex],
  );

  function answer(option: string) {
    if (selected || questDone) return;
    setSelected(option);
    if (option === currentQuest.answer) setQuestScore((score) => score + 1);

    window.setTimeout(() => {
      if (questIndex === QUESTS.length - 1) {
        setQuestDone(true);
        return;
      }
      setQuestIndex((index) => index + 1);
      setSelected(null);
    }, 650);
  }

  function resetQuest() {
    setQuestIndex(0);
    setQuestScore(0);
    setQuestDone(false);
    setSelected(null);
  }

  const reveal = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.7 } };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08090b] text-[#f7f0e4] selection:bg-[#d8a45d] selection:text-[#111]">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] [background-image:radial-gradient(#fff_0.7px,transparent_0.7px)] [background-size:5px_5px]" />

      <div className="fixed right-4 top-4 z-40 sm:right-7 sm:top-7">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.22em] backdrop-blur-xl transition hover:border-white/35"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "CLOSE" : "MENU"}
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
                ["#story", "The Story"],
                ["#journey", "The Journey"],
                ["#quest", "Nobin Quest"],
                ["#memories", "Memories"],
              ].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                  {label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#07080a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(184,66,62,.22),transparent_30%),radial-gradient(circle_at_50%_65%,rgba(216,164,93,.12),transparent_42%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />

        <motion.div style={{ y: reducedMotion ? 0 : heroY, opacity: reducedMotion ? 1 : heroOpacity }} className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-24 text-center">
          <motion.p {...(reducedMotion ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.15, duration: 0.6 } })} className="text-[10px] font-semibold tracking-[0.38em] text-[#d8a45d] uppercase sm:text-xs">
            {EVENT_CONFIG.host} presents
          </motion.p>

          <div className="relative mt-8 h-[min(78vw,560px)] w-[min(78vw,560px)]">
            <div className="absolute inset-[10%] rounded-full bg-[#a83e43]/20 blur-[80px]" />
            <div className="absolute inset-[5%] rounded-full border border-[#d8a45d]/10" />
            <div className="absolute inset-[13%] rounded-full border border-white/5" />
            <Image
              src={EVENT_CONFIG.logo}
              alt="Nobinboron '26"
              fill
              priority
              sizes="(max-width: 640px) 78vw, 560px"
              className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,.65)]"
            />
          </div>

          <div className="mt-3 flex items-center gap-4 text-[9px] tracking-[0.3em] text-white/40 uppercase">
            <span className="h-px w-10 bg-white/15" />
            A new story begins
            <span className="h-px w-10 bg-white/15" />
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">
            নতুন মুখ।
            <br />
            <span className="text-[#d8a45d]">নতুন গল্প।</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            {EVENT_CONFIG.tagline} এইবার নবীনবরণ শুধু একটি অনুষ্ঠান নয়—একটি
            interactive সাহিত্য-অভিজ্ঞতা।
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a href="#story" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111] transition hover:scale-[1.02]">
              Enter the story ↓
            </a>
            <a href="#quest" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-[#d8a45d]/50 hover:text-white">
              Play Nobin Quest
            </a>
          </div>

          <div className="mt-10 flex items-center gap-2 text-[9px] tracking-[0.24em] text-white/30 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d8a45d]" />
            {EVENT_CONFIG.date}
          </div>
        </motion.div>

        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.35em] text-white/25 uppercase">
          Scroll to begin
        </div>
      </section>

      <motion.section id="story" {...reveal} className="relative overflow-hidden border-y border-white/8 bg-[#0d0f12] px-5 py-24 sm:py-32">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#7d252b]/15 blur-[100px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[.8fr_1.2fr] md:gap-24">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">01 / The Story</p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
              একটি event নয়।
              <br />
              <span className="text-white/35">একটি beginning.</span>
            </h2>
          </div>
          <div className="text-base leading-8 text-white/55 sm:text-lg">
            <p>
              নবীনবরণ মানে নতুনদের শুধু স্বাগত জানানো নয়। এটি সেই মুহূর্ত,
              যখন অচেনা মুখগুলো পরিচিত হয়, একটি নতুন বন্ধুত্ব শুরু হয়, আর
              সাহিত্যের জগতে কেউ নিজের প্রথম পাতা খুলে বসে।
            </p>
            <p className="mt-7">
              তাই {EVENT_CONFIG.shortTitle} কে আমরা বানাচ্ছি একটি journey—
              যেখানে তুমি শুধু দর্শক নও। তুমি গল্পের অংশ।
            </p>
            <div className="mt-10 border-l border-[#d8a45d]/40 pl-5 text-sm italic text-white/35">
              “The first page is never about knowing the ending.”
            </div>
          </div>
        </div>
      </motion.section>

      <section id="journey" className="relative bg-[#08090b] px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal}>
            <p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">02 / The Journey</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Before the curtain,
              <br />
              <span className="text-white/30">the story has already started.</span>
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              ["01", "Meet", "নতুন মানুষদের সঙ্গে পরিচয়। প্রথম impression, প্রথম conversation."],
              ["02", "Play", "ছোট ছোট challenge, clues আর Nobin Quest-এর মাধ্যমে গল্প এগোবে।"],
              ["03", "Remember", "শেষে থাকবে এমন কিছু মুহূর্ত, যেগুলো event শেষ হওয়ার পরও থেকে যাবে।"],
            ].map(([number, title, text], index) => (
              <motion.article
                {...(reducedMotion ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { delay: index * 0.08, duration: 0.55 } })}
                key={number}
                className="group bg-[#0c0e11] p-7 transition hover:bg-[#111419] sm:p-10"
              >
                <span className="text-xs text-[#d8a45d]">{number}</span>
                <h3 className="mt-20 text-3xl font-semibold tracking-[-0.03em]">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/45">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="quest" className="relative overflow-hidden border-y border-[#d8a45d]/15 bg-[#11100f] px-5 py-24 sm:py-32">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8f2e35]/10 blur-[100px]" />
        <div className="relative mx-auto max-w-5xl">
          <motion.div {...reveal} className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">03 / Nobin Quest</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">তোমার প্রথম chapter.</h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/45">
              তিনটি ছোট challenge। কোনো account নেই। কোনো pressure নেই।
              শুধু play করে দেখো তোমার story কোথায় যায়।
            </p>
          </motion.div>

          <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-black/20 p-5 backdrop-blur-xl sm:p-8">
            <div className="mb-7 flex items-center justify-between text-[10px] tracking-[0.22em] text-white/35 uppercase">
              <span>{questDone ? "Quest complete" : currentQuest.eyebrow}</span>
              <span>{progress}%</span>
            </div>
            <div className="mb-9 h-1 overflow-hidden rounded-full bg-white/8">
              <motion.div animate={{ width: `${Math.max(progress, 8)}%` }} className="h-full bg-[#d8a45d]" />
            </div>

            {questDone ? (
              <div className="py-8 text-center">
                <div className="text-5xl">✦</div>
                <h3 className="mt-5 text-3xl font-semibold">Chapter unlocked.</h3>
                <p className="mt-3 text-sm text-white/45">তোমার score: {questScore} / {QUESTS.length}</p>
                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/35">
                  Event-এর দিন এই journey আরও বড় হবে। আজকের জন্য এটুকুই তোমার first mark.
                </p>
                <button onClick={resetQuest} className="mt-7 rounded-full border border-white/15 px-5 py-2.5 text-sm transition hover:border-[#d8a45d]/50">
                  Play again
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuest.id}
                  initial={reducedMotion ? false : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, x: -18 }}
                >
                  <p className="text-sm text-[#d8a45d]">{currentQuest.eyebrow}</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">{currentQuest.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/45">{currentQuest.text}</p>
                  <div className="mt-7 grid gap-2">
                    {currentQuest.options.map((option) => {
                      const isSelected = selected === option;
                      const isCorrect = selected && option === currentQuest.answer;
                      return (
                        <button
                          key={option}
                          onClick={() => answer(option)}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left text-sm transition ${isCorrect ? "border-[#d8a45d]/70 bg-[#d8a45d]/10" : isSelected ? "border-red-300/30 bg-red-300/5" : "border-white/10 bg-white/[.02] hover:border-white/25 hover:bg-white/[.04]"}`}
                        >
                          <span>{option}</span>
                          <span className="text-white/20">→</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

      <section id="memories" className="relative bg-[#e9e1d5] px-5 py-24 text-[#141313] sm:py-32">
        <motion.div {...reveal} className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_.8fr] md:items-end">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.35em] text-[#8d3037] uppercase">04 / Memories</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                The wall is empty.
                <br />
                <span className="text-black/35">For now.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-black/50 md:justify-self-end">
              Event শুরু হলে এখানেই memories, photographs আর moments-এর
              living wall তৈরি হবে। এখন এটি শুধু সেই জায়গাটাকে ধরে রাখছে।
            </p>
          </div>

          <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {["FIRST HELLO", "FIRST PHOTO", "FIRST LAUGH", "FIRST MEMORY"].map((label, index) => (
              <div key={label} className="aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-[#ddd3c5] p-5">
                <div className="flex h-full flex-col justify-between">
                  <span className="text-[9px] tracking-[0.25em] text-black/30">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-xs font-semibold tracking-[0.2em] text-black/35">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-[#08090b] px-5 py-28 text-center sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,62,67,.18),transparent_35%)]" />
        <motion.div {...reveal} className="relative mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">The beginning of our story</p>
          <h2 className="mt-6 text-5xl font-semibold leading-[.98] tracking-[-0.05em] sm:text-7xl md:text-8xl">
            আজ তুমি নবীন।
            <br />
            <span className="text-[#d8a45d]">কাল তুমি গল্প।</span>
          </h2>
          <div className="mx-auto mt-10 h-px w-24 bg-[#d8a45d]/40" />
          <div className="relative mx-auto mt-10 h-32 w-32 sm:h-40 sm:w-40">
            <Image src={EVENT_CONFIG.logo} alt="Nobinboron '26 logo" fill sizes="160px" className="object-contain" />
          </div>
          <p className="mt-7 text-sm text-white/35">{EVENT_CONFIG.host} · {EVENT_CONFIG.shortTitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white">
              ← মূল ওয়েবসাইট
            </Link>
            <a href="#quest" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111]">
              Play again
            </a>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
