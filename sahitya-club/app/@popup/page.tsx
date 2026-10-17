'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen, CalendarDays, Feather, Sparkles, X } from 'lucide-react';

const NOTICE_KEY = 'wlc_nobinboron_popup_v2_2026';

export default function EventPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setIsOpen(false);
      return;
    }

    try {
      if (window.localStorage.getItem(NOTICE_KEY) !== 'dismissed') {
        setIsOpen(true);
      }
    } catch {
      // If storage is unavailable, still show the announcement.
      setIsOpen(true);
    }
  }, [pathname]);

  const handleClose = useCallback(() => {
    try {
      window.localStorage.setItem(NOTICE_KEY, 'dismissed');
    } catch {
      // Closing the dialog should still work when storage is unavailable.
    }
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen || pathname !== '/') return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-stone-950/70 px-4 py-10 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="nobinboron-title"
        className="relative my-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/60 bg-[#fffdf9] text-left shadow-[0_32px_100px_rgba(0,0,0,0.35)]"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="পপ-আপ বন্ধ করুন"
          className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/90 text-stone-700 shadow-sm transition hover:rotate-90 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700"
        >
          <X size={19} />
        </button>

        <div className="relative isolate overflow-hidden bg-[#4c1027] px-6 pb-8 pt-8 text-white sm:px-10 sm:pb-10 sm:pt-10">
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-25">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[1px] border-rose-100/70" />
            <div className="absolute -right-5 -top-12 h-52 w-52 rounded-full border border-rose-100/60" />
            <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-rose-500/30 blur-2xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(244,190,100,0.2),transparent_35%)]" />
          </div>

          <div className="flex items-center gap-3 pr-10">
            <div className="relative h-12 w-12 shrink-0 rounded-2xl bg-white p-1.5 shadow-lg ring-1 ring-white/50 sm:h-14 sm:w-14">
              <Image src="/logo.png" alt="Willes Literary Club" fill className="object-contain p-1.5" sizes="56px" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-rose-100/80 sm:text-xs">Willes Literary Club presents</p>
              <p className="mt-1 text-sm font-semibold text-white/95 sm:text-base">উইল্‌স সাহিত্য ক্লাব</p>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-100/10 px-3 py-1.5 text-xs font-semibold text-amber-100 sm:text-sm">
            <Sparkles size={15} />
            নতুনদের জন্য বিশেষ আমন্ত্রণ
          </div>

          <h2 id="nobinboron-title" className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.18] tracking-tight sm:text-5xl">
            সাহিত্যের পথে
            <span className="mt-1 block text-amber-200">নতুনের বরণ</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-rose-50/85 sm:text-base sm:leading-8">
            নতুন ভাবনা, নতুন মুখ আর গল্প-কবিতার একসঙ্গে পথচলা—নবীনদের জন্য খুলে যাচ্ছে উইল্‌স সাহিত্য ক্লাবের সৃজনশীল আঙিনা।
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-white/90 ring-1 ring-white/10 sm:text-sm">
              <BookOpen size={15} /> সাহিত্য ও সৃজনশীলতা
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-white/90 ring-1 ring-white/10 sm:text-sm">
              <Feather size={15} /> লেখক-মননের নতুন যাত্রা
            </span>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:px-10 sm:py-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-800">
              <CalendarDays size={15} /> সাহিত্যের নবীনবরণ ২০২৬
            </div>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-600 sm:text-base">
              আমাদের সঙ্গে যুক্ত হও, নিজের প্রতিভাকে প্রকাশ করো এবং সাহিত্যচর্চার নতুন অভিজ্ঞতার অংশ হও।
            </p>
            <p className="mt-3 text-xs text-stone-400">তারিখ ও আয়োজনসংক্রান্ত বিস্তারিত নিবন্ধন পেজে জানানো হবে।</p>
          </div>

          <div className="flex flex-col gap-2 sm:min-w-[185px]">
            <Link
              href="/register"
              onClick={handleClose}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-800 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-900/15 transition hover:-translate-y-0.5 hover:bg-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2"
            >
              নিবন্ধন করুন <ArrowUpRight size={17} />
            </Link>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
            >
              পরে দেখব
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
