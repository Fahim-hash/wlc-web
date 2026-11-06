import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "সাময়িক রক্ষণাবেক্ষণ | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইটে সাময়িক রক্ষণাবেক্ষণের কাজ চলছে। সদস্য পোর্টাল ও প্রয়োজনীয় সেবা চালু রয়েছে।",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <section className="relative isolate flex min-h-[75vh] items-center justify-center overflow-hidden bg-[#faf9f6] px-4 py-14 text-stone-900 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" />
      </div>
      <div className="w-full max-w-2xl rounded-[2rem] border border-stone-200/80 bg-white/90 p-7 text-center shadow-xl backdrop-blur sm:p-12">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 p-3 shadow-sm">
          <Image src="/logo.png" alt="উইল্‌স সাহিত্য ক্লাব" width={64} height={64} priority className="h-full w-full object-contain" />
        </div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-800">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
          Website maintenance
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">আমরা সাময়িক বিরতিতে আছি</h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-stone-600 sm:text-base">
          উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইটে প্রয়োজনীয় উন্নয়ন ও রক্ষণাবেক্ষণের কাজ চলছে।
          কাজ শেষ হলেই আমরা আবার ফিরে আসব। এই সময়ের জন্য আপনাদের ধৈর্য ও সহযোগিতার জন্য ধন্যবাদ।
        </p>
        <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 text-left">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">✦</span>
          <div>
            <p className="text-sm font-semibold text-stone-800">সদস্যদের প্রয়োজনীয় সেবা চালু আছে</p>
            <p className="mt-0.5 text-xs leading-5 text-stone-500">Member Portal এবং Telegram App ব্যবহার করা যাবে।</p>
          </div>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/member-portal" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800">Member Portal</Link>
          <Link href="/telegram-app" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">Telegram App</Link>
        </div>
        <p className="mt-9 text-xs font-medium tracking-wide text-stone-400">উইল্‌স সাহিত্য ক্লাব · Willes Literary Club</p>
      </div>
    </section>
  );
}
