"use client";

import Link from "next/link";

const executives = [
  { name: "হাসনাত আযান", role: "সভাপতি", group: "leadership" },
  { name: "তৌসিফ মাহমুদ গুঞ্জন", role: "সহ সভাপতি", group: "leadership" },
  { name: "সুদিঠি বিনতে সাখাওয়াত", role: "সাধারণ সম্পাদক", group: "leadership" },
  { name: "আয়েশা খান", role: "সম্পাদক (সম্পাদনা বিভাগ)" },
  { name: "ফারহানা তাসনিম রাইসা", role: "সাংগঠনিক সম্পাদক" },
  { name: "উম্মে ওয়াকিয়া জারা", role: "মুখ্য সংগঠক" },
  { name: "ওয়ালিন হোসেন সিকদার", role: "নিয়ন্ত্রক (বাংলা সাহিত্য)" },
  { name: "সামশিহা পরী", role: "নিয়ন্ত্রক (ইংরেজি সাহিত্য)" },
  { name: "সায়েম আহমেদ", role: "নিয়ন্ত্রক (ধর্মীয় সাহিত্য)" },
  { name: "আব্দুল কাইয়ুম ত্বোহা", role: "নিয়ন্ত্রক (বিশেষ শিশু শাখা)" },
  { name: "শেখ তাসিন", role: "যোগাযোগ বিষয়ক সম্পাদক" },
  { name: "আতিক আহরার", role: "প্রকাশনা বিষয়ক সম্পাদক" },
  { name: "সুরাইয়া আক্তার", role: "গ্রন্থাগার বিষয়ক সম্পাদক" },
  { name: "রাকিবুল ইসলাম আকাশ", role: "চলচ্চিত্র বিষয়ক সম্পাদক" },
  { name: "তানভীর আহমেদ", role: "স্থিরচিত্র বিষয়ক সম্পাদক" },
  { name: "মেঘলা আহসান", role: "দেয়ালিকা বিষয়ক সম্পাদক" },
  { name: "মেহরাব জামান আরিয়ান", role: "দেয়ালিকা বিষয়ক সহ-সম্পাদক" },
  { name: "আহনাফ অমি", role: "নথিসংগ্রাহক" },
  { name: "সুমাইয়া আল-আমিন ইশা", role: "কার্যনির্বাহী" },
  { name: "মিশকাত রহমান", role: "কার্যনির্বাহী" },
  { name: "আব্দুল্লাহ আহমেদ", role: "কার্যনির্বাহী" },
];

const advisors = [
  {
    department: "প্রশাসনিক বিভাগ",
    members: [
      { name: "আরিয়ান আজমাইন মিয়ন", role: "উপদেষ্টা" },
      { name: "এহসান আহমেদ সিয়াম", role: "উপদেষ্টা" },
      { name: "মোল্লা সৌম্য রহমান", role: "পরামর্শদাতা" },
      { name: "রাফিদুল আমিন সাব্বির", role: "পরামর্শদাতা" },
    ],
  },
  {
    department: "সম্পাদনা বিভাগ",
    members: [
      { name: "আইশান শান", role: "উপদেষ্টা" },
      { name: "সৈয়দ ফাহিম মুদ্দাসির", role: "পরামর্শদাতা" },
      { name: "নাজমুস সাকিব", role: "পরামর্শদাতা" },
    ],
  },
];

function MemberCard({ name, role, index }: { name: string; role: string; index: number }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-800 via-amber-600 to-rose-300 opacity-80" />
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 font-serif text-lg font-bold text-rose-900 ring-1 ring-rose-100">
          {String(index + 1).padStart(2, "০")}
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="font-serif text-lg font-bold leading-snug text-stone-900">{name}</h3>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-rose-800">{role}</p>
        </div>
      </div>
    </article>
  );
}

export default function GenThreePage() {
  return (
    <main className="mx-auto max-w-6xl px-1 py-4 sm:px-2 sm:py-8">
      <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-rose-200/70 bg-gradient-to-br from-[#fffaf5] via-white to-rose-50 px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-900 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            GEN-3 · Executive Committee
          </span>
          <div className="mx-auto mt-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-100 bg-white text-4xl shadow-sm">✒️</div>
          <p className="mt-6 text-sm font-semibold tracking-[0.18em] text-rose-800">উইল্‌স সাহিত্য ক্লাব</p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-stone-950 sm:text-5xl">প্রজন্ম — ০৩</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            শব্দে, ছন্দে ও ভাবনায়—নতুন প্রজন্মের নেতৃত্ব, সৃজনশীলতা এবং সাহিত্যের অভিযাত্রায়
            একসঙ্গে এগিয়ে চলার প্রত্যয়ে গঠিত GEN-3 প্যানেল।
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs font-semibold text-stone-600">
            <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">২১ জন নির্বাহী সদস্য</span>
            <span className="rounded-full border border-stone-200 bg-white/80 px-4 py-2">৭ জন উপদেষ্টা ও পরামর্শদাতা</span>
          </div>
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-7 flex flex-col gap-2 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-800">The Executive Body</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-stone-950 sm:text-3xl">Executive Panel</h2>
            <p className="mt-1 text-sm text-stone-500">নির্বাহী পর্ষদ · GEN-3</p>
          </div>
          <span className="w-fit rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-900 ring-1 ring-rose-100">২১ সদস্য</span>
        </div>
        <div className="mb-5 grid gap-4 md:grid-cols-3">
          {executives.filter((member) => member.group === "leadership").map((member) => (
            <div key={member.name} className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 text-center shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-700">{member.role}</span>
              <h3 className="mt-2 font-serif text-xl font-bold text-stone-950">{member.name}</h3>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {executives.filter((member) => member.group !== "leadership").map((member, index) => (
            <MemberCard key={member.name} name={member.name} role={member.role} index={index} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-7 border-b border-stone-200 pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Guidance & Counsel</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-stone-950 sm:text-3xl">Advisor Panel</h2>
          <p className="mt-1 text-sm text-stone-500">উপদেষ্টা ও পরামর্শদাতা পর্ষদ · GEN-3</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {advisors.map((department) => (
            <div key={department.department} className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-[#fffdf8] to-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl font-bold text-stone-900">{department.department}</h3>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{department.members.length} জন</span>
              </div>
              <div className="space-y-3">
                {department.members.map((member, index) => (
                  <div key={member.name} className="flex items-center justify-between gap-4 rounded-xl border border-stone-200/80 bg-white p-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900">{member.name}</p>
                      <p className="mt-1 text-xs font-medium text-amber-800">{member.role}</p>
                    </div>
                    <span className="shrink-0 font-serif text-sm text-stone-300">{String(index + 1).padStart(2, "০")}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="rounded-2xl border border-stone-200 bg-stone-50/80 px-5 py-7 text-center">
        <p className="font-serif text-base italic text-stone-700">“সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে।”</p>
        <p className="mt-2 text-xs text-stone-500">উইল্‌স সাহিত্য ক্লাব · GEN-3</p>
        <Link href="/panel" className="mt-5 inline-flex rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-900">
          ← প্যানেল আর্কাইভে ফিরে যান
        </Link>
      </footer>
    </main>
  );
}
