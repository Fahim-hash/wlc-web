"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * ============================================================
 * NOBINBORON '26 — EVENT CONFIG
 * Edit these values when the final event details are confirmed.
 * ============================================================
 */
const EVENT_CONFIG = {
  title: "সাহিত্যের নবীনবরণ ২০২৬",
  shortTitle: "নবীনবরণ '২৬",
  date: "TBA",
  dateLabel: "তারিখ শীঘ্রই জানানো হবে",
  tagline: "নতুন মুখ, নতুন গল্প, নতুন অধ্যায়।",
  logo: "/nobinboron26.png",
};

export default function NobinBoronPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  useEffect(() => {
    // Set EVENT_DATE to an ISO date such as "2026-11-08T10:00:00+06:00"
    // once the final event date is confirmed. Until then the UI stays TBA.
    const EVENT_DATE: string | null = null;

    if (!EVENT_DATE) return;

    const updateCountdown = () => {
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

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#faf7f0] text-stone-900 selection:bg-amber-200 selection:text-stone-950">
      {/* Hero */}
      <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden flex items-center justify-center px-5 py-20">
        <div className="absolute inset-0 -z-20 bg-[#faf7f0]" />
        <div className="absolute inset-0 -z-10 opacity-50 [background-image:radial-gradient(circle_at_20%_20%,rgba(154,115,55,.14),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(93,64,35,.12),transparent_30%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(70,50,30,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(70,50,30,.12)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="absolute left-[-8rem] top-16 h-64 w-64 rounded-full border border-amber-900/10" />
        <div className="absolute right-[-10rem] bottom-10 h-96 w-96 rounded-full border border-amber-900/10" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-900/15 bg-white/55 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-stone-600 uppercase backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
            Wiles Sahitto Club presents
          </div>

          <div className="relative mb-8 h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72">
            <div className="absolute inset-5 rounded-full bg-amber-700/10 blur-2xl" />
            <Image
              src={EVENT_CONFIG.logo}
              alt="Nobinboron '26 logo"
              fill
              priority
              sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 288px"
              className="object-contain drop-shadow-[0_18px_28px_rgba(63,43,20,.15)]"
            />
          </div>

          <p className="mb-3 font-serif text-sm tracking-[0.2em] text-stone-500">
            WELCOME, NEW BEGINNINGS
          </p>

          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight tracking-tight text-stone-950 sm:text-5xl md:text-6xl lg:text-7xl">
            {EVENT_CONFIG.title}
          </h1>

          <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-stone-600 sm:text-xl">
            {EVENT_CONFIG.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border border-stone-300 bg-white/65 px-5 py-2.5 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur-sm">
              📅 {EVENT_CONFIG.date}
            </div>
            <div className="rounded-full border border-stone-300 bg-white/65 px-5 py-2.5 text-sm font-semibold text-stone-700 shadow-sm backdrop-blur-sm">
              ✦ {EVENT_CONFIG.shortTitle}
            </div>
          </div>

          <a
            href="#story"
            className="mt-12 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-950 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-stone-800"
          >
            Explore the beginning
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-xs tracking-widest text-stone-400 sm:block">
          SCROLL TO DISCOVER
        </div>
      </section>

      {/* Story */}
      <section id="story" className="border-y border-stone-200/80 bg-white px-5 py-24 sm:py-28">
        <div className="mx-auto grid w-full max-w-6xl gap-12 md:grid-cols-[.8fr_1.2fr] md:items-center">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.25em] text-amber-800 uppercase">A new chapter</p>
            <h2 className="font-serif text-4xl font-bold leading-tight text-stone-950 sm:text-5xl">
              যেখানে পরিচয় হয় গল্পের সঙ্গে।
            </h2>
          </div>

          <div className="font-serif text-base leading-8 text-stone-600 sm:text-lg">
            <p>
              নবীনবরণ শুধু নতুনদের স্বাগত জানানোর একটি অনুষ্ঠান নয়। এটি একটি
              নতুন যাত্রার শুরু—নতুন মানুষ, নতুন বন্ধুত্ব, নতুন সৃষ্টিশীলতা এবং
              সাহিত্যের সঙ্গে আরও গভীরভাবে পরিচিত হওয়ার একটি মুহূর্ত।
            </p>
            <p className="mt-5">
              {EVENT_CONFIG.shortTitle} সেই শুরুর গল্পটাকেই উদযাপন করবে।
              বিস্তারিত আয়োজন ও সময়সূচি খুব শীঘ্রই প্রকাশ করা হবে।
            </p>
          </div>
        </div>
      </section>

      {/* Countdown / TBA */}
      <section className="relative overflow-hidden px-5 py-24">
        <div className="absolute inset-0 bg-[#efe5d1]" />
        <div className="absolute -left-20 top-10 h-52 w-52 rounded-full border border-amber-900/10" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full border border-amber-900/10" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-bold tracking-[0.3em] text-amber-900 uppercase">Mark your calendar</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-stone-950 sm:text-4xl">The date is coming.</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
            {EVENT_CONFIG.dateLabel}. Final date ঘোষণা হলে শুধু EVENT_CONFIG-এর
            date এবং countdown-এর EVENT_DATE পরিবর্তন করলেই হবে।
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [timeLeft.days, "DAYS"],
              [timeLeft.hours, "HOURS"],
              [timeLeft.minutes, "MINUTES"],
              [timeLeft.seconds, "SECONDS"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-stone-300/80 bg-white/65 px-4 py-6 shadow-sm backdrop-blur">
                <div className="font-serif text-3xl font-bold text-stone-950 sm:text-4xl">{value}</div>
                <div className="mt-2 text-[10px] font-bold tracking-[0.22em] text-stone-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience cards */}
      <section className="bg-[#faf7f0] px-5 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.25em] text-amber-800 uppercase">What awaits</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-stone-950 sm:text-5xl">
              একটা দিন। অনেক গল্প।
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "পরিচয়", "নতুন বন্ধু, নতুন মুখ, নতুন পরিচয়ের শুরু।"],
              ["02", "সাহিত্য", "শব্দ, গল্প, কবিতা আর সৃষ্টিশীলতার সঙ্গে সময়।"],
              ["03", "আড্ডা", "সিনিয়র-জুনিয়র মিলিয়ে একসঙ্গে কিছু স্মরণীয় মুহূর্ত।"],
              ["04", "চমক", "কারণ নবীনবরণের গল্পে কিছু surprise থাকতেই পারে।"],
            ].map(([number, title, description]) => (
              <article
                key={number}
                className="group rounded-3xl border border-stone-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="font-mono text-xs text-amber-800">{number}</span>
                <h3 className="mt-10 font-serif text-2xl font-bold text-stone-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-500">{description}</p>
                <div className="mt-8 h-px w-10 bg-stone-300 transition-all duration-300 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative overflow-hidden bg-stone-950 px-5 py-28 text-center text-white sm:py-36">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_50%_20%,rgba(217,173,92,.55),transparent_35%)]" />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-bold tracking-[0.3em] text-amber-300/80 uppercase">Your story starts here</p>
          <h2 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            “আজ তুমি নবীন।
            <br />
            একদিন তোমার গল্পই হবে স্মৃতি।”
          </h2>

          <div className="mx-auto mt-12 h-px w-20 bg-amber-400/50" />

          <div className="mt-10 flex flex-col items-center gap-6">
            <Image
              src={EVENT_CONFIG.logo}
              alt="Nobinboron '26"
              width={150}
              height={150}
              className="object-contain opacity-95"
            />
            <p className="text-sm text-stone-400">Wiles Sahitto Club · Nobinboron '26</p>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-stone-300 transition hover:border-white/30 hover:text-white"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
