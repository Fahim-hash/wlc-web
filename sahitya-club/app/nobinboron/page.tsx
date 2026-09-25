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

const QUESTS = [
  { id: "word", type: "choice", eyebrow: "LEVEL 01 / THE WORD", title: "শূন্য পাতায় প্রথম শব্দটি কী?", text: "একটি নতুন সাহিত্যযাত্রা কোন শব্দ দিয়ে শুরু করবে?", options: ["অভিযাত্রা", "অজুহাত", "বিদায়"], answer: "অভিযাত্রা" },
  { id: "line", type: "choice", eyebrow: "LEVEL 02 / THE LINE", title: "প্রথম লাইনটি বেছে নাও", text: "তোমার গল্পের opening line কোনটি হবে?", options: ["আজ থেকেই শুরু।", "একদিন হয়তো শুরু করব।", "গল্পটা এখানেই শেষ।"], answer: "আজ থেকেই শুরু." },
  { id: "cipher", type: "cipher", eyebrow: "LEVEL 03 / THE CLUE", title: "গোপন শব্দ খুঁজে বের করো", text: "এই অক্ষরগুলো rearrange করে একটি meaningful শব্দ বানাও।", options: ["গল্প", "স্বপ্ন", "বন্ধু"], answer: "গল্প", letters: ["গ", "ল্প"] },
  { id: "door", type: "choice", eyebrow: "LEVEL 04 / THE DOOR", title: "শেষ দরজাটি খোলো", text: "নবীনবরণের আসল শুরু কোথায়?", options: ["শেষে", "শুরুতেই", "কখনোই না"], answer: "শুরুতেই" },
];

const FEEDBACK = ["ভুল দরজা। আবার ভাবো।", "পাতাটা তোমার জন্য অপেক্ষা করছে।", "একদম ঠিক। Chapter unlocked."];

export default function NobinBoronPage() {
  const [timeLeft, setTimeLeft] = useState({ days: "--", hours: "--", minutes: "--", seconds: "--" });
  const [questIndex, setQuestIndex] = useState(0);
  const [questScore, setQuestScore] = useState(0);
  const [questDone, setQuestDone] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [questFeedback, setQuestFeedback] = useState("");
  const [cipherInput, setCipherInput] = useState("");
  const [questStarted, setQuestStarted] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [secretRevealed, setSecretRevealed] = useState(false);

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
      if (distance <= 0) return setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
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
  const progress = Math.round(((questDone ? QUESTS.length : questIndex) / QUESTS.length) * 100);

  const reveal = reducedMotion
    ? {}
    : { initial: { opacity: 0, y: 32 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.7 } };

  function finishAnswer(isCorrect: boolean) {
    if (selected || questDone) return;
    setQuestFeedback(isCorrect ? FEEDBACK[2] : FEEDBACK[0]);
    setSelected(isCorrect ? "correct" : "wrong");
    if (isCorrect) setQuestScore((score) => score + 1);

    window.setTimeout(() => {
      if (questIndex === QUESTS.length - 1) {
        const finalScore = questScore + (isCorrect ? 1 : 0);
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
      setCipherInput("");
    }, 850);
  }

  function answer(option: string) {
    finishAnswer(option === currentQuest.answer);
  }

  function submitCipher() {
    if (!cipherInput.trim()) return;
    finishAnswer(cipherInput.trim() === currentQuest.answer);
  }

  function startQuest() {
    setQuestStarted(true);
    setQuestDone(false);
    setQuestIndex(0);
    setQuestScore(0);
    setSelected(null);
    setQuestFeedback("");
    setCipherInput("");
  }

  function resetQuest() {
    setQuestStarted(false);
    setQuestDone(false);
    setQuestIndex(0);
    setQuestScore(0);
    setSelected(null);
    setQuestFeedback("");
    setCipherInput("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08090b] text-[#f7f0e4] selection:bg-[#d8a45d] selection:text-[#111]">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] [background-image:radial-gradient(#fff_0.7px,transparent_0.7px)] [background-size:5px_5px]" />

      <div className="fixed right-4 top-4 z-40 sm:right-7 sm:top-7">
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[10px] font-semibold tracking-[0.22em] backdrop-blur-xl transition hover:border-white/35" aria-expanded={menuOpen}>
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav initial={reducedMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#101114]/95 p-2 shadow-2xl backdrop-blur-xl">
              {[["#story", "The Story"], ["#journey", "The Journey"], ["#quest", "Nobin Quest"], ["#memories", "Memories"]].map(([href, label]) => (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">{label}</a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#07080a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(184,66,62,.22),transparent_30%),radial-gradient(circle_at_50%_65%,rgba(216,164,93,.12),transparent_42%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:70px_70px] [mask-image:radial-gradient(circle_at_center,black,transparent_72%)]" />
        <motion.div style={{ y: reducedMotion ? 0 : heroY, opacity: reducedMotion ? 1 : heroOpacity }} className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-5 py-24 text-center">
          <p className="text-[10px] font-semibold tracking-[0.38em] text-[#d8a45d] uppercase sm:text-xs">{EVENT_CONFIG.host} presents</p>
          <div className="relative mt-8 h-[min(78vw,560px)] w-[min(78vw,560px)]">
            <div className="absolute inset-[8%] rounded-full bg-[#a83e43]/20 blur-[90px]" />
            <div className="absolute inset-[5%] rounded-full border border-[#d8a45d]/10" />
            <div className="absolute inset-[13%] rounded-full border border-white/5" />
            <Image src={EVENT_CONFIG.logo} alt="Nobinboron '26" fill priority sizes="(max-width: 640px) 78vw, 560px" className="object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,.65)]" />
          </div>
          <div className="mt-3 flex items-center gap-4 text-[9px] tracking-[0.3em] text-white/40 uppercase"><span className="h-px w-10 bg-white/15" />A new story begins<span className="h-px w-10 bg-white/15" /></div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl">নতুন মুখ।<br /><span className="text-[#d8a45d]">নতুন গল্প।</span></h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/55 sm:text-base">{EVENT_CONFIG.tagline} এইবার নবীনবরণ শুধু একটি অনুষ্ঠান নয়—একটি interactive সাহিত্য-অভিজ্ঞতা।</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <a href="#story" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111] transition hover:scale-[1.02]">Enter the story ↓</a>
            <a href="#quest" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-[#d8a45d]/50 hover:text-white">Play Nobin Quest</a>
          </div>
          <div className="mt-10 flex items-center gap-2 text-[9px] tracking-[0.24em] text-white/30 uppercase"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d8a45d]" />{EVENT_CONFIG.date}</div>
        </motion.div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.35em] text-white/25 uppercase">Scroll to begin</div>
      </section>

      <motion.section id="story" {...reveal} className="relative overflow-hidden border-y border-white/8 bg-[#0d0f12] px-5 py-24 sm:py-32">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#7d252b]/15 blur-[100px]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 md:grid-cols-[.8fr_1.2fr] md:gap-24">
          <div><p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">01 / The Story</p><h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">একটি event নয়।<br /><span className="text-white/35">একটি beginning.</span></h2></div>
          <div className="text-base leading-8 text-white/55 sm:text-lg">
            <p>নবীনবরণ মানে নতুনদের শুধু স্বাগত জানানো নয়। এটি সেই মুহূর্ত, যখন অচেনা মুখগুলো পরিচিত হয়, একটি নতুন বন্ধুত্ব শুরু হয়, আর সাহিত্যের জগতে কেউ নিজের প্রথম পাতা খুলে বসে।</p>
            <p className="mt-7">তাই {EVENT_CONFIG.shortTitle} কে আমরা বানাচ্ছি একটি journey—যেখানে তুমি শুধু দর্শক নও। তুমি গল্পের অংশ।</p>
            <div className="mt-10 border-l border-[#d8a45d]/40 pl-5 text-sm italic text-white/35">“The first page is never about knowing the ending.”</div>
          </div>
        </div>
      </motion.section>

      <section id="journey" className="relative bg-[#08090b] px-5 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <motion.div {...reveal}><p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">02 / The Journey</p><h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Before the curtain,<br /><span className="text-white/30">the story has already started.</span></h2></motion.div>
          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {[["01", "Meet", "নতুন মানুষদের সঙ্গে পরিচয়। প্রথম impression, প্রথম conversation."], ["02", "Play", "clues, choices আর Nobin Quest-এর মাধ্যমে গল্প এগোবে।"], ["03", "Remember", "শেষে থাকবে এমন কিছু মুহূর্ত, যেগুলো event-এর পরও থেকে যাবে।"]].map(([number, title, text], index) => (
              <motion.article {...(reducedMotion ? {} : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 }, transition: { delay: index * 0.08, duration: 0.55 } })} key={number} className="group bg-[#0c0e11] p-7 transition hover:bg-[#111419] sm:p-10">
                <span className="text-xs text-[#d8a45d]">{number}</span><h3 className="mt-20 text-3xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mt-4 text-sm leading-7 text-white/45">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="quest" className="relative overflow-hidden border-y border-[#d8a45d]/15 bg-[#11100f] px-5 py-24 sm:py-32">
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8f2e35]/10 blur-[110px]" />
        <div className="relative mx-auto max-w-5xl">
          <motion.div {...reveal} className="text-center">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">03 / Nobin Quest</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">শুধু quiz নয়। একটি mini adventure.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45">চারটি level। Choice, clue আর একটি secret word। শেষে তোমার নিজের chapter title unlock হবে।</p>
          </motion.div>

          <div className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl backdrop-blur-xl sm:p-9">
            {!questStarted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#d8a45d]/30 bg-[#d8a45d]/5 text-3xl">✦</div>
                <p className="mt-7 text-[10px] font-semibold tracking-[0.3em] text-[#d8a45d] uppercase">NOBIN QUEST / 04 LEVELS</p>
                <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">তোমার গল্পের দরজা খুলো।</h3>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/45">কোনো login নেই। প্রতিটি choice তোমাকে পরের chapter-এ নিয়ে যাবে। শেষে score ও title পাবে।</p>
                <div className="mt-7 flex flex-wrap justify-center gap-2 text-[10px] tracking-[0.18em] text-white/30 uppercase"><span className="rounded-full border border-white/10 px-3 py-2">4 Levels</span><span className="rounded-full border border-white/10 px-3 py-2">1 Secret Clue</span><span className="rounded-full border border-white/10 px-3 py-2">Local Best Score</span></div>
                <button onClick={startQuest} className="mt-8 rounded-full bg-[#f7f0e4] px-7 py-3 text-sm font-semibold text-[#111] transition hover:scale-[1.02]">Start Quest →</button>
                {bestScore !== null && <p className="mt-5 text-xs text-white/30">Best score: {bestScore} / {QUESTS.length}</p>}
              </div>
            ) : questDone ? (
              <motion.div initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <div className="text-5xl text-[#d8a45d]">✦</div>
                <p className="mt-5 text-[10px] font-semibold tracking-[0.3em] text-[#d8a45d] uppercase">Quest complete</p>
                <h3 className="mt-3 text-3xl font-semibold sm:text-4xl">{questScore === QUESTS.length ? "The Storyteller" : questScore >= 2 ? "The Explorer" : "The Newcomer"}</h3>
                <p className="mt-3 text-white/45">তোমার score: <span className="text-white">{questScore}</span> / {QUESTS.length}</p>
                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/35">{questScore === QUESTS.length ? "সব clue তুমি ধরতে পেরেছ। তোমার chapter এখনো শুরু হয়নি—এটাই শুধু prologue." : "সব answer ঠিক না হলেও story থেমে যায় না। নবীনবরণে আসল chapter তখনই শুরু হবে।"}</p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={resetQuest} className="rounded-full border border-white/15 px-6 py-3 text-sm transition hover:border-[#d8a45d]/50">Play again</button><a href="#memories" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111]">See the wall →</a></div>
              </motion.div>
            ) : (
              <>
                <div className="mb-8 flex items-center justify-between text-[10px] tracking-[0.22em] text-white/35 uppercase"><span>{currentQuest.eyebrow}</span><span>{questIndex + 1} / {QUESTS.length}</span></div>
                <div className="mb-9 flex gap-1.5">{QUESTS.map((_, index) => <div key={index} className={`h-1.5 flex-1 rounded-full transition ${index <= questIndex ? "bg-[#d8a45d]" : "bg-white/10"}`} />)}</div>
                <AnimatePresence mode="wait">
                  <motion.div key={currentQuest.id} initial={reducedMotion ? false : { opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={reducedMotion ? undefined : { opacity: 0, x: -25 }}>
                    <h3 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{currentQuest.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/45">{currentQuest.text}</p>

                    {currentQuest.type === "cipher" ? (
                      <div className="mt-8">
                        <div className="mb-5 flex justify-center gap-3">{currentQuest.letters?.map((letter) => <span key={letter} className="flex h-14 min-w-14 items-center justify-center rounded-2xl border border-[#d8a45d]/25 bg-[#d8a45d]/5 text-2xl font-semibold">{letter}</span>)}</div>
                        <input value={cipherInput} onChange={(event) => setCipherInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submitCipher()} placeholder="শব্দটি লেখো..." className="w-full rounded-2xl border border-white/10 bg-white/[.03] px-5 py-4 text-center text-base outline-none transition placeholder:text-white/20 focus:border-[#d8a45d]/50" />
                        <button onClick={submitCipher} className="mt-3 w-full rounded-2xl bg-[#f7f0e4] px-5 py-4 text-sm font-semibold text-[#111]">Unlock clue →</button>
                      </div>
                    ) : (
                      <div className="mt-8 grid gap-3">
                        {currentQuest.options.map((option) => {
                          const isCorrect = selected === "correct" && option === currentQuest.answer;
                          return <button key={option} onClick={() => answer(option)} disabled={Boolean(selected)} className={`group flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-sm transition disabled:cursor-default ${isCorrect ? "border-[#d8a45d]/70 bg-[#d8a45d]/10" : selected ? "border-white/5 opacity-45" : "border-white/10 bg-white/[.02] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[.04]"}`}><span>{option}</span><span className="text-white/20 transition group-hover:translate-x-1">→</span></button>;
                        })}
                      </div>
                    )}

                    <AnimatePresence>
                      {questFeedback && <motion.p initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 text-center text-xs ${selected === "correct" ? "text-[#d8a45d]" : "text-white/35"}`}>{questFeedback}</motion.p>}
                    </AnimatePresence>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>

          {secretRevealed && <motion.div initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-5 max-w-3xl rounded-2xl border border-[#d8a45d]/20 bg-[#d8a45d]/5 p-5 text-center text-sm text-[#d8a45d]">Secret unlocked: <strong>তোমার গল্প শুরু হয়েছে।</strong></motion.div>}
          <button onClick={() => setSecretRevealed(true)} className="mx-auto mt-7 block text-[9px] tracking-[0.3em] text-white/15 uppercase transition hover:text-white/40">there is more to the story</button>
        </div>
      </section>

      <section id="memories" className="relative bg-[#e9e1d5] px-5 py-24 text-[#141313] sm:py-32">
        <motion.div {...reveal} className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1fr_.8fr] md:items-end">
            <div><p className="text-[10px] font-semibold tracking-[0.35em] text-[#8d3037] uppercase">04 / Memories</p><h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">The wall is empty.<br /><span className="text-black/35">For now.</span></h2></div>
            <p className="max-w-md text-sm leading-7 text-black/50 md:justify-self-end">Event শুরু হলে এখানেই memories, photographs আর moments-এর living wall তৈরি হবে। এখন এটি শুধু সেই জায়গাটাকে ধরে রাখছে।</p>
          </div>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {["FIRST HELLO", "FIRST PHOTO", "FIRST LAUGH", "FIRST MEMORY"].map((label, index) => <div key={label} className="aspect-[4/5] overflow-hidden rounded-2xl border border-black/10 bg-[#ddd3c5] p-5"><div className="flex h-full flex-col justify-between"><span className="text-[9px] tracking-[0.25em] text-black/30">{String(index + 1).padStart(2, "0")}</span><span className="text-xs font-semibold tracking-[0.2em] text-black/35">{label}</span></div></div>)}
          </div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-[#08090b] px-5 py-28 text-center sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,62,67,.18),transparent_35%)]" />
        <motion.div {...reveal} className="relative mx-auto max-w-4xl">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-[#d8a45d] uppercase">The beginning of our story</p>
          <h2 className="mt-6 text-5xl font-semibold leading-[.98] tracking-[-0.05em] sm:text-7xl md:text-8xl">আজ তুমি নবীন।<br /><span className="text-[#d8a45d]">কাল তুমি গল্প।</span></h2>
          <div className="mx-auto mt-10 h-px w-24 bg-[#d8a45d]/40" />
          <div className="relative mx-auto mt-10 h-32 w-32 sm:h-40 sm:w-40"><Image src={EVENT_CONFIG.logo} alt="Nobinboron '26 logo" fill sizes="160px" className="object-contain" /></div>
          <p className="mt-7 text-sm text-white/35">{EVENT_CONFIG.host} · {EVENT_CONFIG.shortTitle}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/" className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white">← মূল ওয়েবসাইট</Link><a href="#quest" className="rounded-full bg-[#f7f0e4] px-6 py-3 text-sm font-semibold text-[#111]">Play again</a></div>
        </motion.div>
      </section>
    </main>
  );
}
