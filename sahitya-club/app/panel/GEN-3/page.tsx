"use client";

import Link from "next/link";

export default function GenThreeUpcomingPage() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center px-4 py-12">
      <section className="relative w-full overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-white via-violet-50 to-indigo-100 p-7 text-center shadow-sm sm:p-12">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-indigo-200/60 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-800">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            GEN-3 · Upcoming Panel
          </span>

          <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-200 bg-white text-4xl shadow-sm">
            🌱
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold text-stone-900 sm:text-5xl">
            জেনারেশন - ৩
          </h1>
          <p className="mt-3 text-lg font-semibold text-violet-800">
            নতুন প্রজন্মের যাত্রা শুরু হচ্ছে
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            GEN-3-এর নির্বাচন প্রক্রিয়া শুরু হয়েছে। নতুন প্যানেলের সদস্য তালিকা,
            দায়িত্ব ও বিস্তারিত তথ্য প্রস্তুত করা হচ্ছে। আনুষ্ঠানিকভাবে প্রকাশের
            সঙ্গে সঙ্গেই এই পেজে আপডেট দেওয়া হবে।
          </p>

          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-violet-200/80 bg-white/75 p-5 text-left">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-xl" aria-hidden="true">⏳</span>
              <div>
                <h2 className="font-bold text-stone-900">Coming Soon</h2>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  প্যানেলটি এখনো প্রকাশের জন্য প্রস্তুত নয়। নির্বাচনের আপডেট ও
                  চূড়ান্ত সদস্য তালিকার জন্য চোখ রাখুন উইল্‌স সাহিত্য ক্লাবের
                  অফিসিয়াল ওয়েবসাইটে।
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/panel"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-violet-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-900"
          >
            ← প্যানেল আর্কাইভে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}
