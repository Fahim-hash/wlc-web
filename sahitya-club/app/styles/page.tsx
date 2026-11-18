"use client";

import Image from "next/image";
import { Check, Palette, Type, MousePointer2, Image as ImageIcon, LayoutGrid } from "lucide-react";

const palette = [
  { name: "Primary Rose", hex: "#9F1239", role: "Primary brand colour · key highlights and brand accents", text: "text-white" },
  { name: "Secondary Rose", hex: "#BE123C", role: "Secondary accent · hover and supporting emphasis", text: "text-white" },
  { name: "Deep Stone", hex: "#1C1917", role: "Headings, strong text and primary button surfaces", text: "text-white" },
  { name: "Muted Gray", hex: "#6B7280", role: "Supporting copy, labels and metadata", text: "text-white" },
  { name: "Background Light", hex: "#FAFAFA", role: "Main page background and quiet surfaces", text: "text-gray-800" },
  { name: "Pure White", hex: "#FFFFFF", role: "Cards and content surfaces", text: "text-gray-800" },
];

const samples = [
  { label: "Primary Button", className: "bg-stone-950 text-white hover:bg-rose-900", detail: "Dark stone surface · rose hover" },
  { label: "Secondary Button", className: "border border-gray-200 bg-white text-stone-800 hover:bg-stone-50", detail: "White surface · subtle border" },
];

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-8 font-sans text-gray-800 sm:px-8 sm:py-12 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-7 shadow-sm sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border-[38px] border-rose-50" />
          <div className="pointer-events-none absolute -bottom-24 right-40 h-56 w-56 rounded-full bg-rose-50/80 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-rose-800"><Palette size={13} /> Official design system</span>
            <h1 className="mt-6 max-w-3xl font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">Style Guide &amp; UI Tokens</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">উইলস সাহিত্য ক্লাবের ওয়েবসাইটের ভিজ্যুয়াল কনসিস্টেন্সি বজায় রাখার অফিসিয়াল গাইডলাইন। ওয়েবসাইট, ইভেন্ট ও ডিজিটাল কনটেন্টে এই রঙ, টাইপোগ্রাফি ও UI pattern অনুসরণ করতে হবে।</p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-rose-800 px-3 py-2 text-white">#9F1239 · Primary Rose</span>
              <span className="rounded-full bg-rose-700 px-3 py-2 text-white">#BE123C · Secondary Rose</span>
              <span className="rounded-full bg-stone-900 px-3 py-2 text-white">#1C1917 · Deep Stone</span>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 p-2.5 text-rose-800"><Palette size={19} /></div>
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-gray-400">01 · Brand colours</p><h2 className="font-serif text-2xl font-bold text-stone-900">Official colour palette</h2></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {palette.map((color) => <article key={color.hex} className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className={`flex h-32 items-end rounded-xl p-3 ${color.text}`} style={{ backgroundColor: color.hex }}>
                <span className="rounded-md bg-black/20 px-2 py-1 font-mono text-xs font-bold backdrop-blur-sm">{color.hex}</span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">{color.name}</h3>
              <p className="mt-1 text-xs leading-5 text-gray-500">{color.role}</p>
            </article>)}
          </div>
          <p className="mt-4 rounded-2xl border border-rose-100 bg-white p-4 text-sm leading-6 text-gray-600"><strong className="text-rose-800">Usage rule:</strong> Rose is the brand accent, Deep Stone anchors strong text and primary actions, and the light background keeps pages clean. White is reserved for cards and content surfaces. Do not introduce a replacement brand palette.</p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3"><Type className="text-rose-800" /><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gray-400">02 · Typography</p><h2 className="font-serif text-xl font-bold text-stone-900">Serif headings, sans body</h2></div></div>
            <div className="mt-7 border-b border-gray-100 pb-5"><p className="font-mono text-[10px] text-gray-400">FONT SERIF · HEADINGS</p><h3 className="mt-2 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">উইলস সাহিত্য ক্লাব ২০২৬</h3><p className="mt-2 text-xs text-gray-500">Use serif typography for page and section headings.</p></div>
            <div className="pt-5"><p className="font-mono text-[10px] text-gray-400">FONT SANS · BODY TEXT</p><p className="mt-2 text-base leading-relaxed text-gray-600">সৃজনশীল লেখনী ও সাহিত্যের এক অপূর্ব মেলবন্ধন। সাধারণ বডি টেক্সট, বিবরণ ও সহায়ক তথ্যের জন্য sans-serif ব্যবহার করতে হবে।</p></div>
          </article>

          <article className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3"><MousePointer2 className="text-rose-800" /><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gray-400">03 · UI components</p><h2 className="font-serif text-xl font-bold text-stone-900">Buttons &amp; status</h2></div></div>
            <div className="mt-7 flex flex-wrap gap-5">{samples.map((sample) => <div key={sample.label}><p className="mb-2 font-mono text-[10px] text-gray-400">{sample.label}</p><button type="button" className={`rounded-xl px-5 py-3 text-xs font-semibold shadow-sm transition-colors ${sample.className}`}>{sample.label === "Primary Button" ? "Primary Action →" : "Secondary Action"}</button><p className="mt-2 max-w-40 text-[11px] leading-5 text-gray-400">{sample.detail}</p></div>)}</div>
            <div className="mt-6 border-t border-gray-100 pt-5"><p className="mb-2 font-mono text-[10px] text-gray-400">STATUS BADGE</p><span className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-bold uppercase text-rose-700">রেজিস্ট্রেশন চলছে</span><p className="mt-3 text-xs leading-5 text-gray-500">Status labels should remain clear, compact and readable.</p></div>
          </article>
        </section>

        <section className="mt-12 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3"><ImageIcon className="text-rose-800" /><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-gray-400">04 · Logos & assets</p><h2 className="font-serif text-2xl font-bold text-stone-900">Official brand assets</h2></div></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-6 text-center"><p className="mb-4 text-left font-mono text-[10px] text-gray-400">PATH: /logo.png</p><div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl border border-gray-100 bg-white p-4"><Image src="/logo.png" alt="Willes Literary Club logo" width={120} height={120} className="h-full w-full object-contain" priority /></div><p className="mt-4 text-sm font-bold text-gray-800">উইলস সাহিত্য ক্লাব লোগো</p><p className="mt-1 text-xs leading-5 text-gray-500">Primary club identity for navigation, branding and official documents.</p></div>
            <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] p-6 text-center"><p className="mb-4 text-left font-mono text-[10px] text-gray-400">PATH: /wlfsc.png</p><div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl border border-gray-100 bg-white p-4"><Image src="/wlfsc.png" alt="WLFSC institutional monogram" width={120} height={120} className="h-full w-full object-contain" priority /></div><p className="mt-4 text-sm font-bold text-gray-800">WLFSC অফিশিয়াল মনোগ্রাম</p><p className="mt-1 text-xs leading-5 text-gray-500">Parent institution identity for institutional references and credits.</p></div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-rose-100 bg-rose-800 p-6 text-white sm:p-8">
          <div className="flex items-center gap-3"><LayoutGrid className="text-rose-100" /><h2 className="font-serif text-xl font-bold">Design principles</h2></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">{["Keep the official rose, stone, gray and neutral palette consistent.", "Use serif for headings and sans-serif for body copy.", "Prefer clear hierarchy, restrained decoration and generous spacing."].map((item) => <p key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/90"><Check size={16} className="mb-3 text-white" />{item}</p>)}</div>
        </section>
        <p className="mt-8 text-center text-xs text-gray-400">Willes Literary Club · Official design guidelines</p>
      </div>
    </main>
  );
}
