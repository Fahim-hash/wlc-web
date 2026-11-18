"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";

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
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-10 text-[#1C1917] sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#6B7280]"><h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Upcoming events</h1></div>
            <span className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#6B7280]">{events.length} published</span>
          </div>

          {loading ? <div className="mt-7 grid gap-5 md:grid-cols-2"><div className="h-64 animate-pulse rounded-3xl bg-[#F3F4F6]"/><div className="h-64 animate-pulse rounded-3xl bg-[#F3F4F6]"/></div> :
            error ? <p role="alert" className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</p> :
            events.length === 0 ? <div className="mt-7 rounded-3xl border border-dashed border-[#D1D5DB] bg-white/70 px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf5e8] text-[#557f43]"><CalendarDays/></div><h3 className="mt-5 text-xl font-semibold">No events published yet</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#718987]">WLC events will appear here as soon as the team publishes them. Check back soon.</p></div> :
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {events.map((event) => <article key={event.id} className="group overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(23,60,59,.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(23,60,59,.1)]">
                {event.bannerUrl ? <img src={event.bannerUrl} alt={`${event.title} event banner`} className="aspect-[16/7] w-full object-cover" loading="lazy"/> : <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-[#9F1239] via-[#BE123C] to-[#1C1917]"><span className="text-xs font-bold uppercase tracking-[.25em] text-white/80">Willes Literary Club</span></div>}<div className="p-6"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-[#FCE7EF] px-3 py-1.5 text-xs font-bold text-[#4d7136]">{money(event.ticketPrice)}</span><span className="text-xs font-medium text-[#6B7280]">{event.availableCount} seats left</span></div>
                <h3 className="mt-6 font-serif text-2xl font-semibold leading-tight tracking-tight">{event.title}</h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-[#6B7280]">{event.summary || "Join the Willes Literary Club community for a memorable event."}</p>
                <div className="mt-6 space-y-3 border-t border-[#F3F4F6] pt-5 text-sm text-[#6B7280]"><p className="flex items-center gap-2"><CalendarDays size={16} className="text-[#9F1239]"/>{dateLabel(event.startAt)}</p><p className="flex items-center gap-2"><MapPin size={16} className="text-[#9F1239]"/>{event.venue}</p></div>
                <Link href={`/ticketing/${event.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#9F1239] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#BE123C]">View event & tickets <ArrowUpRight size={16}/></Link></div>
              </article>)}
            </div>}
        </section>
      </div>
    </main>
  );
}
