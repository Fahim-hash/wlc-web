"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CalendarPlus, ExternalLink, ShieldCheck } from "lucide-react";

type EventRow = {
  id: string; slug: string; title: string; venue: string; startAt: string;
  capacity: number; reservedCount: number; ticketPrice: number; status: string;
};

const initial = { title: "", summary: "", description: "", venue: "", startAt: "", endAt: "", capacity: "100", ticketPrice: "0", status: "DRAFT" };

export default function TicketingAdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    const auth = await fetch("/api/memberhub/auth", { cache: "no-store" });
    const authData = await auth.json();
    setAuthenticated(Boolean(authData.authenticated));
    if (!authData.authenticated) return;
    const response = await fetch("/api/ticketing/events", { cache: "no-store" });
    const data = await response.json();
    setEvents(data.events || []);
  }

  useEffect(() => { load().catch(() => setNotice("Unable to load ticketing dashboard.")); }, []);

  async function createEvent(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/ticketing/events", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity), ticketPrice: Number(form.ticketPrice), endAt: form.endAt || null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not create event.");
      setNotice(`Event created: ${data.event.title}`);
      setForm(initial);
      await load();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not create event."); }
    finally { setBusy(false); }
  }

  if (authenticated === null) return <main className="min-h-screen bg-[#f5f8f5] p-8 text-[#154546]">Loading ticketing admin…</main>;
  if (!authenticated) return <main className="min-h-screen bg-[#f5f8f5] px-4 py-16 text-[#154546]"><div className="mx-auto max-w-lg rounded-3xl border border-[#e1eae3] bg-white p-8 text-center"><ShieldCheck className="mx-auto text-[#719b51]" size={34}/><h1 className="mt-4 text-2xl font-semibold">Admin access required</h1><p className="mt-2 text-sm text-[#718582]">Sign in to the existing WLC Member Hub first. Ticketing uses the same secure admin session.</p><Link href="/memberhub" className="mt-6 inline-flex rounded-xl bg-[#154546] px-5 py-3 text-sm font-semibold text-white">Open Member Hub</Link></div></main>;

  return <main className="min-h-screen bg-[#f5f8f5] px-4 py-9 text-[#173c3b] sm:px-6"><div className="mx-auto max-w-6xl">
    <Link href="/memberhub" className="inline-flex items-center gap-2 text-sm font-semibold text-[#63817c]"><ArrowLeft size={16}/> Member Hub</Link>
    <header className="mt-5 rounded-[2rem] bg-[#154546] p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c8ec8b]">Willes Literary Club · Admin</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Event Ticketing</h1><p className="mt-2 max-w-xl text-sm leading-6 text-white/70">Create events, publish registration pages and monitor ticket capacity.</p></header>
    <div className="mt-7 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <section className="rounded-3xl border border-[#e1eae3] bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff7e9] text-[#648b45]"><CalendarPlus/></div><div><h2 className="font-semibold">Create an event</h2><p className="text-xs text-[#819690]">Start as a draft or publish immediately.</p></div></div>
        <form onSubmit={createEvent} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">Event title<input required minLength={4} maxLength={120} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 outline-none focus:border-[#719b51]"/></label>
          <label className="block text-sm font-semibold">Short description<input maxLength={240} value={form.summary} onChange={e=>setForm({...form,summary:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 outline-none focus:border-[#719b51]"/></label>
          <label className="block text-sm font-semibold">Full description<textarea rows={4} maxLength={5000} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 outline-none focus:border-[#719b51]"/></label>
          <label className="block text-sm font-semibold">Venue<input required minLength={2} maxLength={180} value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 outline-none focus:border-[#719b51]"/></label>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-semibold">Start date & time<input required type="datetime-local" value={form.startAt} onChange={e=>setForm({...form,startAt:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#719b51]"/></label><label className="block text-sm font-semibold">End date & time<input type="datetime-local" value={form.endAt} onChange={e=>setForm({...form,endAt:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3 py-3 outline-none focus:border-[#719b51]"/></label></div>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-semibold">Ticket capacity<input required type="number" min="1" max="100000" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 outline-none focus:border-[#719b51]"/></label><label className="block text-sm font-semibold">Price per ticket (BDT)<input required type="number" min="0" max="10000000" value={form.ticketPrice} onChange={e=>setForm({...form,ticketPrice:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 outline-none focus:border-[#719b51]"/></label></div>
          <label className="block text-sm font-semibold">Visibility<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="mt-1.5 w-full rounded-xl border border-[#dce8df] bg-[#fbfdfb] px-3.5 py-3 outline-none focus:border-[#719b51]"><option value="DRAFT">Draft — only admins can see</option><option value="PUBLISHED">Published — public can book</option></select></label>
          <button disabled={busy} className="w-full rounded-xl bg-[#154546] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#1d5d5d] disabled:opacity-50">{busy?"Creating…":"Create event"}</button>
        </form>
        {notice&&<p role="status" className="mt-4 rounded-xl bg-[#eff7e9] p-3 text-sm text-[#496d38]">{notice}</p>}
      </section>
      <section className="rounded-3xl border border-[#e1eae3] bg-white p-6 shadow-sm sm:p-7"><div className="flex items-center justify-between gap-3"><div><h2 className="font-semibold">Event directory</h2><p className="mt-1 text-xs text-[#819690]">All drafts and published events.</p></div><span className="rounded-full bg-[#eff7e9] px-3 py-1.5 text-xs font-bold text-[#587b40]">{events.length} total</span></div>
        {events.length===0?<div className="mt-8 rounded-2xl border border-dashed border-[#cbdcd1] p-10 text-center text-sm text-[#819690]">No events created yet.</div>:<div className="mt-5 space-y-3">{events.map(item=><article key={item.id} className="rounded-2xl border border-[#e6eee7] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-xs text-[#819690]">{item.venue} · {new Date(item.startAt).toLocaleString("en-BD")}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.status==="PUBLISHED"?"bg-[#eff7e9] text-[#587b40]":"bg-[#f1f3f1] text-[#6c817b]"}`}>{item.status}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1ed] pt-3 text-xs text-[#6f8882]"><span>{item.reservedCount}/{item.capacity} reserved · {item.ticketPrice===0?"Free":`৳${item.ticketPrice} per ticket`}</span>{item.status==="PUBLISHED"&&<Link href={`/ticketing/${item.slug}`} target="_blank" className="inline-flex items-center gap-1 font-semibold text-[#356d65]">Open page <ExternalLink size={13}/></Link>}</div></article>)}</div>}
      </section>
    </div>
    <p className="mt-7 text-xs leading-5 text-[#819690]">Paid ticket checkout and QR entry scanning are intentionally not enabled yet. Free-ticket reservations are capacity-safe; paid booking remains closed until a payment provider and settlement workflow are configured.</p>
  </div></main>;
}
