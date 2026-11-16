"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Ticket, ArrowUpRight, Sparkles } from "lucide-react";

type EventItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  bannerUrl?: string;
  venue: string;
  startAt: string;
  capacity: number;
  availableCount: number;
  ticketPrice: number;
  currency: string;
};

const money = (amount: number) => amount === 0 ? "Free" : `৳${amount.toLocaleString("en-BD")}`;
const dateLabel = (value: string) => new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function TicketingHomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/ticketing/events", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load events.");
        setEvents(data.events || []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load events."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8f5] px-4 py-10 text-[#173c3b] sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] bg-[#154546] px-6 py-10 text-white shadow-[0_24px_80px_rgba(21,69,70,.18)] sm:px-10 sm:py-14">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-[#c8ec8b]"><Sparkles size={15}/> Willes Literary Club</div>
          <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_.7fr] md:items-end">
            <div>
              <p className="text-sm font-semibold text-[#c8ec8b]">THE WLC EVENT EXPERIENCE</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">Be there for the moments that matter.</h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">Discover upcoming literary gatherings, reserve your place, and keep every event ticket in one place.</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/[.08] p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/55">Made for our community</p>
              <p className="mt-3 text-2xl font-semibold">One club. Every event.</p>
              <p className="mt-2 text-sm leading-6 text-white/65">A simple, secure way to join WLC events.</p>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#6a9290]">Discover</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Upcoming events</h2></div>
            <span className="rounded-full border border-[#dce8df] bg-white px-4 py-2 text-xs font-semibold text-[#426765]">{events.length} published</span>
          </div>

          {loading ? <div className="mt-7 grid gap-5 md:grid-cols-2"><div className="h-64 animate-pulse rounded-3xl bg-[#e5ede7]"/><div className="h-64 animate-pulse rounded-3xl bg-[#e5ede7]"/></div> :
            error ? <p role="alert" className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</p> :
            events.length === 0 ? <div className="mt-7 rounded-3xl border border-dashed border-[#cbdcd1] bg-white/70 px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5e8] text-[#557f43]"><CalendarDays/></div><h3 className="mt-5 text-xl font-semibold">No events published yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718987]">WLC events will appear here as soon as the team publishes them. Check back soon.</p></div> :
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {events.map((event) => <article key={event.id} className="group overflow-hidden rounded-3xl border border-[#e1eae3] bg-white shadow-[0_8px_30px_rgba(23,60,59,.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(23,60,59,.1)]">
                {event.bannerUrl ? <img src={event.bannerUrl} alt={`${event.title} event banner`} className="aspect-[16/7] w-full object-cover" loading="lazy"/> : <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-[#154546] via-[#1d5d5d] to-[#A9DD36]/70"><span className="text-xs font-bold uppercase tracking-[.25em] text-white/80">Willes Literary Club</span></div>}<div className="p-6"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-[#edf6e6] px-3 py-1.5 text-xs font-bold text-[#4d7136]">{money(event.ticketPrice)}</span><span className="text-xs font-medium text-[#7c9791]">{event.availableCount} seats left</span></div>
                <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight">{event.title}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[#718582]">{event.summary || "Join the Willes Literary Club community for a memorable event."}</p>
                <div className="mt-6 space-y-3 border-t border-[#edf1ed] pt-5 text-sm text-[#5d7773]"><p className="flex items-center gap-2"><CalendarDays size={16} className="text-[#719b51]"/>{dateLabel(event.startAt)}</p><p className="flex items-center gap-2"><MapPin size={16} className="text-[#719b51]"/>{event.venue}</p></div>
                <Link href={`/ticketing/${event.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#154546] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d5d5d]">View event & tickets <ArrowUpRight size={16}/></Link></div>
              </article>)}
            </div>}
        </section>
        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-[#dce8df] pt-6 text-xs text-[#79908c]"><span>© {new Date().getFullYear()} Willes Literary Club</span><Link href="/" className="font-semibold hover:text-[#154546]">Back to WLC website ↗</Link></footer>
      </div>
    </main>
  );
}
