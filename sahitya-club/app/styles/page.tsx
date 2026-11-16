"use client";

import Image from "next/image";
import { Check, Palette, Type, MousePointer2, Image as ImageIcon, LayoutGrid } from "lucide-react";

const palette = [
  { name: "WLC Deep Teal", hex: "#154546", role: "Primary brand · headers, primary actions", text: "text-white" },
  { name: "WLC Lime", hex: "#A9DD36", role: "Accent · highlights, active states", text: "text-[#173c3b]" },
  { name: "Teal Shade", hex: "#1D5D5D", role: "Hover and interactive emphasis", text: "text-white" },
  { name: "Soft Sage", hex: "#F5F8F5", role: "Page background and calm surfaces", text: "text-[#173c3b]" },
  { name: "Pure White", hex: "#FFFFFF", role: "Cards and content surfaces", text: "text-[#173c3b]" },
  { name: "Slate Text", hex: "#173C3B", role: "Primary body text", text: "text-white" },
  { name: "Muted Teal", hex: "#718582", role: "Secondary copy and metadata", text: "text-white" },
  { name: "Border Sage", hex: "#E1EAE3", role: "Borders, dividers and outlines", text: "text-[#173c3b]" },
];

const samples = [
  { label: "Primary", className: "bg-[#154546] text-white", detail: "Primary action" },
  { label: "Accent", className: "bg-[#A9DD36] text-[#173c3b]", detail: "Highlighted action" },
  { label: "Secondary", className: "border border-[#dce8df] bg-white text-[#154546]", detail: "Secondary action" },
];

export default function StyleGuidePage() {
  return (
    <main className="min-h-screen bg-[#F5F8F5] px-4 py-8 text-[#173C3B] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#154546] p-7 text-white sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border-[42px] border-white/[.06]" />
          <div className="pointer-events-none absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-[#A9DD36]/10 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.2em] text-[#D5F49A]"><Palette size={13}/> Official brand system</span>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">WLC Visual Identity</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">উইলস সাহিত্য ক্লাবের ওয়েবসাইট, ইভেন্ট, ডিজিটাল কনটেন্ট ও প্রাতিষ্ঠানিক উপকরণে একই ভিজ্যুয়াল পরিচয় বজায় রাখার অফিসিয়াল রঙ ও ডিজাইন নির্দেশিকা।</p>
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-[#A9DD36] px-3 py-2 text-[#173c3b]">#154546 · Primary</span><span className="rounded-full border border-white/20 px-3 py-2">#A9DD36 · Accent</span><span className="rounded-full border border-white/20 px-3 py-2">Updated design tokens</span></div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-[#EAF3E3] p-2.5 text-[#52773D]"><Palette size={19}/></div><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#77918B]">01 · Colour system</p><h2 className="text-2xl font-semibold">Official colour palette</h2></div></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{palette.map((color) => <article key={color.hex} className="overflow-hidden rounded-2xl border border-[#E1EAE3] bg-white p-3 shadow-sm"><div className={`flex h-28 items-end rounded-xl p-3 ${color.text}`} style={{ backgroundColor: color.hex }}><span className="rounded-lg bg-black/15 px-2 py-1 font-mono text-xs font-bold backdrop-blur">{color.hex}</span></div><h3 className="mt-3 text-sm font-bold">{color.name}</h3><p className="mt-1 text-xs leading-5 text-[#718582]">{color.role}</p></article>)}</div>
          <p className="mt-4 rounded-2xl border border-[#DCE8DF] bg-white p-4 text-sm leading-6 text-[#607A75]"><strong className="text-[#154546]">Usage rule:</strong> Deep Teal is the dominant brand colour. Lime is a controlled accent, not a replacement for the primary colour. Keep backgrounds light and use muted teal for supporting text.</p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#E1EAE3] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><Type className="text-[#719B51]"/><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#819690]">02 · Typography</p><h2 className="text-xl font-semibold">Clear, literary, readable</h2></div></div><div className="mt-7 border-b border-[#EDF1ED] pb-5"><p className="text-[10px] font-mono text-[#91A39E]">HEADING · SEMIBOLD</p><p className="mt-2 text-3xl font-semibold tracking-tight">উইলস সাহিত্য ক্লাব</p><p className="mt-2 text-xs text-[#718582]">Use strong, concise headings with generous line-height.</p></div><div className="pt-5"><p className="text-[10px] font-mono text-[#91A39E]">BODY · REGULAR</p><p className="mt-2 text-sm leading-7 text-[#607A75]">সৃজনশীল লেখনী, সাহিত্যচর্চা ও মননশীলতার এক সম্মিলিত পরিসর। Body copy should remain comfortable to read on mobile and desktop.</p></div></article>
          <article className="rounded-3xl border border-[#E1EAE3] bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><MousePointer2 className="text-[#719B51]"/><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#819690]">03 · Components</p><h2 className="text-xl font-semibold">Buttons & status</h2></div></div><div className="mt-7 flex flex-wrap gap-3">{samples.map((sample) => <div key={sample.label} className="min-w-[130px]"><button type="button" className={`rounded-xl px-4 py-3 text-xs font-bold ${sample.className}`}>{sample.label} action</button><p className="mt-2 text-[11px] text-[#819690]">{sample.detail}</p></div>)}</div><div className="mt-6 border-t border-[#EDF1ED] pt-5"><span className="rounded-full border border-[#DCEBCB] bg-[#F0F7E9] px-3 py-1.5 text-xs font-bold text-[#52773D]">REGISTRATION OPEN</span><p className="mt-3 text-xs leading-5 text-[#718582]">Use status colours consistently and always include readable text, not colour alone.</p></div></article>
        </section>

        <section className="mt-12 rounded-3xl border border-[#E1EAE3] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3"><ImageIcon className="text-[#719B51]"/><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#819690]">04 · Brand assets</p><h2 className="text-2xl font-semibold">Official logos</h2></div></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2"><div className="rounded-2xl border border-[#E8EEE9] bg-[#F8FAF8] p-6 text-center"><div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-4"><Image src="/logo.png" alt="Willes Literary Club logo" width={120} height={120} className="h-full w-full object-contain"/></div><p className="mt-4 text-sm font-bold">Willes Literary Club</p><p className="mt-1 text-xs text-[#819690]">/logo.png · Primary club identity</p></div><div className="rounded-2xl border border-[#E8EEE9] bg-[#F8FAF8] p-6 text-center"><div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-4"><Image src="/wlfsc.png" alt="WLFSC institutional monogram" width={120} height={120} className="h-full w-full object-contain"/></div><p className="mt-4 text-sm font-bold">WLFSC Institutional Monogram</p><p className="mt-1 text-xs text-[#819690]">/wlfsc.png · Parent institution identity</p></div></div>
        </section>

        <section className="mt-12 rounded-3xl bg-[#154546] p-6 text-white sm:p-8"><div className="flex items-center gap-3"><LayoutGrid className="text-[#A9DD36]"/><h2 className="text-xl font-semibold">Design principles</h2></div><div className="mt-5 grid gap-4 sm:grid-cols-3">{["Consistency first — reuse the same tokens across every WLC surface.","Accessible contrast — keep text legible and actions easy to identify.","Purposeful simplicity — generous spacing, clear hierarchy, minimal decoration."].map((item) => <p key={item} className="rounded-2xl border border-white/10 bg-white/[.06] p-4 text-sm leading-6 text-white/80"><Check size={16} className="mb-3 text-[#A9DD36]"/>{item}</p>)}</div></section>
        <p className="mt-8 text-center text-xs text-[#8AA09A]">Willes Literary Club · Official digital brand guidelines</p>
      </div>
    </main>
  );
}
