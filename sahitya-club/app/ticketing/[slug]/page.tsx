"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, ShieldCheck, Ticket } from "lucide-react";

type EventItem = {
  id: string; slug: string; title: string; summary: string; description: string;
  venue: string; startAt: string; endAt: string | null; capacity: number;
  bannerUrl?: string;
  availableCount: number; ticketPrice: number; currency: string;
};

export default function TicketingEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState("");
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [ticket, setTicket] = useState<{ticketId:string;ticketToken:string;bookingId:string;quantity:number;emailSent:boolean;attendeeEmail:string}|null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", quantity: "1" });

  useEffect(() => { params.then((value) => setSlug(value.slug)); }, [params]);
  useEffect(() => {
    if (!slug) return;
    fetch(`/api/ticketing/events?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to load event."); setEvent(data.events?.[0] || null); })
      .catch((error) => setNotice(error instanceof Error ? error.message : "Unable to load event."))
      .finally(() => setLoading(false));
  }, [slug]);

  async function reserve(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice(""); setTicket(null);
    try {
      const response = await fetch("/api/ticketing/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventSlug: slug, ...form, quantity: Number(form.quantity) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Booking failed.");
      setTicket(data.booking); setNotice("Your free ticket has been confirmed.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Booking failed."); }
    finally { setBusy(false); }
  }

  if (loading) return <main className="min-h-screen bg-[#FAFAFA] p-8 text-[#9F1239]">Loading event…</main>;
  if (!event) return <main className="min-h-screen bg-[#FAFAFA] px-4 py-16 text-[#9F1239]"><div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center"><h1 className="text-2xl font-semibold">Event not found</h1><p className="mt-2 text-sm text-[#6B7280]">This event may be unpublished or no longer available.</p><Link href="/ticketing" className="mt-6 inline-flex rounded-xl bg-[#9F1239] px-4 py-3 text-sm font-semibold text-white">Back to events</Link></div></main>;

  const date = new Intl.DateTimeFormat("en-BD", { dateStyle: "full", timeStyle: "short" }).format(new Date(event.startAt));
  return <main className="min-h-screen bg-[#FAFAFA] px-4 py-10 text-[#1C1917] sm:px-6"><div className="mx-auto max-w-5xl">
    <Link href="/ticketing" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#9F1239]"><ArrowLeft size={16}/> All events</Link>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <section className="overflow-hidden rounded-[2rem] bg-[#9F1239] text-white"><div className="relative">{event.bannerUrl ? <img src={event.bannerUrl} alt={`${event.title} event banner`} className="aspect-[16/7] w-full object-cover" /> : <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-[#BE123C] to-[#BE123C]/60"><span className="text-xs font-bold uppercase tracking-[.25em] text-white/80">Willes Literary Club</span></div>}<span className="absolute left-6 top-6 rounded-full bg-[#9F1239]/85 px-3 py-1.5 text-xs font-bold text-[#FCE7EF] backdrop-blur">WLC EVENT</span></div><div className="p-7 sm:p-10"><h1 className="mt-7 font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{event.title}</h1><p className="mt-5 text-sm leading-7 text-white/70">{event.description || event.summary}</p><div className="mt-9 space-y-4 border-t border-white/15 pt-6 text-sm text-white/80"><p className="flex items-center gap-3"><CalendarDays className="text-[#FCE7EF]"/>{date}</p><p className="flex items-center gap-3"><MapPin className="text-[#FCE7EF]"/>{event.venue}</p><p className="flex items-center gap-3"><Ticket className="text-[#FCE7EF]"/>{event.ticketPrice === 0 ? "Free entry" : `৳${event.ticketPrice.toLocaleString("en-BD")} per ticket`}</p></div></div></section>
      <section className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_40px_rgba(23,60,59,.05)] sm:p-8">
        {ticket ? <div className="text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FCE7EF] text-[#9F1239]"><CheckCircle2 size={28}/></div><h2 className="mt-5 font-serif text-2xl font-semibold">You're on the list!</h2><p className="mt-2 text-sm text-[#6B7280]">Your booking is confirmed. Keep this ticket reference safe.</p><div className={`mt-4 rounded-xl p-3 text-left text-sm ${ticket.emailSent ? "bg-[#FDF2F5] text-[#9F1239]" : "bg-[#fff7e8] text-[#805d2d]"}`}>{ticket.emailSent ? `PDF ticket sent to ${ticket.attendeeEmail}` : `We could not send the email to ${ticket.attendeeEmail}. Download your ticket below.`}</div><div className="mt-6 rounded-2xl border border-dashed border-[#F9A8D4] bg-[#FDF2F5] p-5"><p className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Ticket ID</p><p className="mt-2 break-all font-mono text-xl font-bold text-[#9F1239]">{ticket.ticketId}</p><p className="mt-3 text-xs text-[#6B7280]">Booking reference: {ticket.bookingId}</p></div><p className="mt-4 text-xs leading-5 text-[#6B7280]">Your secure digital ticket is ready. Save the ticket link and keep it private.</p><Link href={`/ticketing/ticket/${ticket.bookingId}?token=${encodeURIComponent(ticket.ticketToken)}`} className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#9F1239] px-4 py-3.5 text-sm font-bold text-white">Open secure digital ticket</Link><a href={`/api/ticketing/tickets/${ticket.bookingId}/pdf?token=${encodeURIComponent(ticket.ticketToken)}`} className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#9F1239] px-4 py-3.5 text-sm font-bold text-[#9F1239]">Download ticket PDF</a><Link href="/ticketing" className="mt-3 inline-flex text-sm font-semibold text-[#6B7280]">Explore more events</Link></div> :
        <><p className="text-xs font-bold uppercase tracking-[.2em] text-[#6B7280]">Reserve your place</p><h2 className="mt-2 text-2xl font-semibold">Get your ticket</h2><p className="mt-2 text-sm text-[#6B7280]">{event.availableCount} tickets currently available</p>
          <form onSubmit={reserve} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Full name<input required minLength={2} maxLength={120} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 outline-none focus:border-[#9F1239]"/></label><label className="block text-sm font-semibold">Email address<input required type="email" maxLength={254} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 outline-none focus:border-[#9F1239]"/></label><label className="block text-sm font-semibold">Phone number<input required type="tel" maxLength={30} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+8801XXXXXXXXX" className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 outline-none focus:border-[#9F1239]"/></label><label className="block text-sm font-semibold">Number of tickets<select value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 outline-none focus:border-[#9F1239]">{[1,2,3,4,5].map(n=><option key={n} value={n}>{n} {n===1?"ticket":"tickets"}</option>)}</select></label>
          <div className="rounded-2xl bg-[#FDF2F5] p-4"><div className="flex justify-between text-sm"><span className="text-[#6B7280]">Total</span><strong className="text-[#9F1239]">{event.ticketPrice===0?"Free":`৳${(event.ticketPrice*Number(form.quantity)).toLocaleString("en-BD")}`}</strong></div>{event.ticketPrice>0&&<p className="mt-2 text-xs leading-5 text-[#8a6b3b]">Paid booking is not available until a payment provider is connected.</p>}</div>
          <button disabled={busy||event.availableCount<1||event.ticketPrice>0} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9F1239] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#BE123C] disabled:cursor-not-allowed disabled:opacity-45">{busy?"Reserving…":event.ticketPrice>0?"Paid booking coming soon":"Confirm free booking"}</button>
          <p className="flex items-center justify-center gap-2 text-center text-xs text-[#6B7280]"><ShieldCheck size={14}/> Your details are used only for event registration.</p></form>
        </>}
        {notice&&!ticket&&<p role="alert" className="mt-4 rounded-xl bg-[#fff7e8] p-3 text-sm text-[#805d2d]">{notice}</p>}
      </section>
    </div>
  </div></main>;
}
