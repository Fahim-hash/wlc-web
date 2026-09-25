"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * ============================================================
 * NOBINBORON '26 — EDITABLE EVENT CONFIG
 * ============================================================
 */
const EVENT_CONFIG = {
  title: "সাহিত্যের নবীনবরণ ২০২৬",
  shortTitle: "নবীনবরণ '২৬",
  date: "TBA",
  dateLabel: "তারিখ শীঘ্রই জানানো হবে",
  tagline: "নতুন মুখ, নতুন গল্প, নতুন অধ্যায়।",
  logo: "/nobinboron26.png",
  host: "Willes Sahitto Club",
};

const EVENT_DATE: string | null = null;
// Example when confirmed: "2026-11-08T10:00:00+06:00"

export default function NobinBoronPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

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

  const chapters = [
    ["০১", "পরিচয়", "অচেনা মুখগুলো ধীরে ধীরে পরিচিত হয়ে উঠবে।"],
    ["০২", "কবিতা", "শব্দের ভেতর দিয়ে শুরু হবে নতুন এক সাহিত্যযাত্রা।"],
    ["০৩", "আড্ডা", "গল্প, হাসি আর স্মৃতিতে ভরে উঠবে সাহিত্যের উঠোন।"],
    ["০৪", "চমক", "সব গল্প আগে থেকে বলা যায় না। কিছু মুহূর্ত সেদিনের জন্য।"],
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4ecdc] text-[#241914] selection:bg-[#7a1f2b] selection:text-[#fff8ec]">
      {/* Paper grain + manuscript atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.035] [background-image:radial-gradient(#241914_0.7px,transparent_0.7px)] [background-size:5px_5px]" />

      {/* HERO — designed around the 1024x1024 square logo */}
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden border-b border-[#6d1c28]/15">
        <div className="absolute inset-0 bg-[#f4ecdc]" />
        <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_50%_38%,rgba(255,250,239,.98)_0%,rgba(244,236,220,.86)_34%,rgba(244,236,220,0)_70%)]" />
        <div className="absolute left-1/2 top-1/2 h-[min(75vw,760px)] w-[min(75vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7a1f2b]/10" />
        <div className="absolute left-1/2 top-1/2 h-[min(62vw,620px)] w-[min(62vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7a1f2b]/10" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl flex-col items-center justify-center px-5 py-16 text-center">
          <div className="mb-7 flex items-center gap-3 text-[10px] font-bold tracking-[0.35em] text-[#6d1c28] uppercase sm:text-xs">
            <span className="h-px w-10 bg-[#6d1c28]/35" />
            {EVENT_CONFIG.host}
            <span className="h-px w-10 bg-[#6d1c28]/35" />
          </div>

          <div className="relative mb-5 h-[min(72vw,500px)] w-[min(72vw,500px)] sm:h-[430px] sm:w-[430px] md:h-[480px] md:w-[480px]">
            <div className="absolute inset-[13%] rounded-full bg-[#7a1f2b]/12 blur-3xl" />
            <div className="absolute inset-[7%] rounded-full border border-[#7a1f2b]/10" />
            <Image
              src={EVENT_CONFIG.logo}
              alt="Nobinboron '26"
              fill
              priority
              sizes="(max-width: 640px) 72vw, (max-width: 768px) 430px, 480px"
              className="object-contain drop-shadow-[0_24px_34px_rgba(53,26,20,.16)]"
            />
          </div>

          <p className="font-serif text-xs font-semibold tracking-[0.3em] text-[#7a1f2b] uppercase">
            নবীনদের জন্য · সাহিত্যের আয়োজনে
          </p>

          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold leading-[1.08] text-[#291916] sm:text-5xl md:text-6xl">
            {EVENT_CONFIG.title}
          </h1>

          <p className="mt-5 max-w-2xl font-serif text-base leading-8 text-[#66554a] sm:text-lg">
            {EVENT_CONFIG.tagline}
          </p>

          <div className="mt-7 inline-flex items-center gap-3 border-y border-[#7a1f2b]/25 px-7 py-3 font-serif text-sm text-[#7a1f2b]">
            <span>✦</span>
            <span>{EVENT_CONFIG.date}</span>
            <span>✦</span>
          </div>

          <a
            href="#story"
            className="mt-9 font-serif text-sm font-semibold text-[#291916] underline decoration-[#7a1f2b]/45 underline-offset-8 transition hover:text-[#7a1f2b]"
          >
            গল্পের শুরুটা পড়ুন ↓
          </a>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.35em] text-[#6d1c28]/45 uppercase">
          A new chapter begins
        </div>
      </section>

      {/* ORNAMENT */}
      <div className="flex items-center justify-center gap-4 py-5 text-[#7a1f2b]/55">
        <span className="h-px w-16 bg-current sm:w-28" />
        <span className="font-serif text-xl">❦</span>
        <span className="h-px w-16 bg-current sm:w-28" />
      </div>

      {/* STORY */}
      <section id="story" className="px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 md:grid-cols-[.72fr_1.28fr] md:gap-20">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-[#7a1f2b] uppercase">
                নবীনবরণ '২৬
              </p>
              <h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-[#291916] sm:text-5xl">
                একটি নতুন
                <br />
                গল্পের প্রথম পাতা।
              </h2>
            </div>

            <div className="relative border-l border-[#7a1f2b]/20 pl-7 font-serif text-base leading-8 text-[#66554a] sm:pl-10 sm:text-lg">
              <span className="absolute -left-[11px] top-0 font-serif text-2xl text-[#7a1f2b]">“</span>
              <p>
                নবীনবরণ মানে শুধু নতুনদের স্বাগত জানানো নয়। একটি ক্লাবে,
                একটি বন্ধুত্বে, একটি সৃষ্টিশীল জগতে—প্রথমবারের মতো নিজের
                জায়গা খুঁজে নেওয়া।
              </p>
              <p className="mt-6">
                {EVENT_CONFIG.shortTitle} সেই প্রথম পরিচয়ের মুহূর্তটাকে
                স্মরণীয় করে তুলতে Willes Sahitto Club-এর একটি বিশেষ আয়োজন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DATE / TBA */}
      <section className="relative overflow-hidden border-y border-[#7a1f2b]/15 bg-[#2b1718] px-5 py-20 text-[#f8efdf] sm:py-24">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,transparent_49.8%,rgba(248,239,223,.16)_50%,transparent_50.2%),linear-gradient(transparent_49.8%,rgba(248,239,223,.16)_50%,transparent_50.2%)] [background-size:70px_70px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-[10px] font-bold tracking-[0.35em] text-[#d9a96e] uppercase">
            তারিখ
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold sm:text-5xl">
            {EVENT_CONFIG.date}
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-serif text-sm leading-7 text-[#d7c6b0]">
            {EVENT_CONFIG.dateLabel}। আয়োজনের বিস্তারিত তথ্য প্রকাশিত হলে
            এই অংশ থেকেই সহজেই আপডেট করা যাবে।
          </p>

          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-[#d9a96e]/20 bg-[#d9a96e]/20 sm:grid-cols-4">
            {[
              [timeLeft.days, "দিন"],
              [timeLeft.hours, "ঘণ্টা"],
              [timeLeft.minutes, "মিনিট"],
              [timeLeft.seconds, "সেকেন্ড"],
            ].map(([value, label]) => (
              <div key={label} className="bg-[#2b1718] px-4 py-7">
                <div className="font-serif text-3xl font-bold">{value}</div>
                <div className="mt-2 text-[10px] tracking-[0.2em] text-[#bca992]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAPTERS */}
      <section className="px-5 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#7a1f2b] uppercase">
              পাতায় পাতায়
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-[#291916] sm:text-5xl">
              যে গল্পগুলো অপেক্ষায়।
            </h2>
          </div>

          <div className="mt-14 grid border-y border-[#7a1f2b]/15 md:grid-cols-2">
            {chapters.map(([number, title, description], index) => (
              <article
                key={number}
                className={`group relative p-7 sm:p-9 ${index % 2 === 0 ? "md:border-r" : ""} ${index < 2 ? "border-b" : ""} border-[#7a1f2b]/15`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-serif text-sm text-[#7a1f2b]">{number}</span>
                  <span className="font-serif text-xl text-[#7a1f2b]/30 transition group-hover:text-[#7a1f2b]">❧</span>
                </div>
                <h3 className="mt-12 font-serif text-3xl font-bold text-[#291916]">{title}</h3>
                <p className="mt-3 max-w-md font-serif text-sm leading-7 text-[#76655a]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING — book-cover feeling */}
      <section className="relative overflow-hidden bg-[#f9f1e3] px-5 py-24 text-center sm:py-32">
        <div className="absolute inset-5 border border-[#7a1f2b]/10 sm:inset-8" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center">
          <p className="text-[10px] font-bold tracking-[0.35em] text-[#7a1f2b] uppercase">
            The first page is yours
          </p>

          <h2 className="mt-6 font-serif text-4xl font-bold leading-tight text-[#291916] sm:text-5xl md:text-6xl">
            আজ তুমি নবীন,
            <br />
            কাল তুমি গল্প।
          </h2>

          <div className="my-9 flex items-center gap-4 text-[#7a1f2b]/60">
            <span className="h-px w-12 bg-current" />
            <span className="font-serif text-xl">❦</span>
            <span className="h-px w-12 bg-current" />
          </div>

          <div className="relative h-36 w-36 sm:h-44 sm:w-44">
            <Image
              src={EVENT_CONFIG.logo}
              alt="Nobinboron '26 logo"
              fill
              sizes="176px"
              className="object-contain"
            />
          </div>

          <p className="mt-5 font-serif text-sm text-[#76655a]">
            {EVENT_CONFIG.host} · {EVENT_CONFIG.shortTitle}
          </p>

          <Link
            href="/"
            className="mt-8 border-b border-[#7a1f2b]/40 pb-1 font-serif text-sm font-semibold text-[#7a1f2b] transition hover:border-[#7a1f2b] hover:text-[#4d131d]"
          >
            ← মূল ওয়েবসাইটে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}
