"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays, CheckCircle2, Printer, ShieldCheck } from "lucide-react";

type TicketInfo = {
  bookingId: string; ticketId: string; eventTitle: string; eventStartAt: string;
  venue: string; attendeeName: string; quantity: number; status: string; checkedInCount: number;
};

export default function SecureTicketPage() {
  const params = useParams<{ bookingId: string }>();
  const [ticket, setTicket] = useState<TicketInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    if (!params.bookingId || !token) {
      setError("This ticket link is incomplete."); setLoading(false); return;
    }
    fetch(`/api/ticketing/tickets/${encodeURIComponent(params.bookingId)}?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Ticket verification failed.");
        setTicket(data.ticket);
      })
      .catch(reason => setError(reason instanceof Error ? reason.message : "Ticket verification failed."))
      .finally(() => setLoading(false));
  }, [params.bookingId]);

  if (loading) return <main className="min-h-screen bg-[#f5f8f5] p-8 text-[#154546]">Verifying your ticket…</main>;
  if (!ticket) return <main className="min-h-screen bg-[#f5f8f5] px-4 py-16 text-[#154546]"><div className="mx-auto max-w-lg rounded-3xl border border-[#e1eae3] bg-white p-8 text-center"><ShieldCheck className="mx-auto text-[#9a7442]" size={36}/><h1 className="mt-4 text-2xl font-semibold">Ticket unavailable</h1><p className="mt-2 text-sm text-[#718582]">{error || "This ticket could not be verified."}</p><Link href="/ticketing" className="mt-6 inline-flex rounded-xl bg-[#154546] px-4 py-3 text-sm font-semibold text-white">Back to events</Link></div></main>;

  return <main className="min-h-screen bg-[#f5f8f5] px-4 py-10 text-[#173c3b] sm:px-6"><div className="mx-auto max-w-xl">
    <div className="mb-5 flex items-center justify-between gap-3 print:hidden"><Link href="/ticketing" className="inline-flex items-center gap-2 text-sm font-semibold text-[#63817c]"><ArrowLeft size={16}/> Events</Link><button onClick={()=>window.print()} className="inline-flex items-center gap-2 rounded-xl border border-[#dce8df] bg-white px-4 py-2.5 text-sm font-semibold"><Printer size={15}/> Print ticket</button></div>
    <article className="overflow-hidden rounded-[2rem] border border-[#dce8df] bg-white shadow-[0_18px_60px_rgba(23,60,59,.08)]">
      <header className="bg-[#154546] p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[.22em] text-[#c8ec8b]">Willes Literary Club · Admission</p><h1 className="mt-5 text-3xl font-semibold">{ticket.eventTitle}</h1><p className="mt-3 flex items-center gap-2 text-sm text-white/70"><CalendarDays size={15}/>{new Intl.DateTimeFormat("en-BD",{dateStyle:"full",timeStyle:"short"}).format(new Date(ticket.eventStartAt))}</p><p className="mt-2 text-sm text-white/70">{ticket.venue}</p></header>
      <div className="p-7 sm:p-9"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-[#eff7e9] px-3 py-1.5 text-xs font-bold text-[#587b40]">CONFIRMED</span><span className="text-xs font-medium text-[#8aa09a]">Keep this ticket private</span></div>
        <div className="mt-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#8aa09a]">Attendee</p><p className="mt-2 text-xl font-semibold">{ticket.attendeeName}</p><p className="mt-1 text-sm text-[#718582]">{ticket.quantity} {ticket.quantity===1?"ticket":"tickets"}</p></div>
        <div className="mt-7 rounded-2xl border border-dashed border-[#b9d1b5] bg-[#f7fbf4] p-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#8aa09a]">Ticket ID</p><p className="mt-2 break-all font-mono text-2xl font-bold text-[#154546]">{ticket.ticketId}</p><p className="mt-3 text-xs text-[#819690]">Booking reference: {ticket.bookingId}</p></div>
        <div className="mt-7 grid gap-5 rounded-2xl border border-[#e5eee5] bg-[#fbfdfb] p-5 sm:grid-cols-[180px_1fr] sm:items-center"><div className="mx-auto rounded-xl border border-[#e5eee5] bg-white p-2"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(ticket.bookingId)}`} alt="Ticket entry QR code" width="164" height="164" referrerPolicy="no-referrer"/></div><div><p className="text-sm font-semibold text-[#154546]">Entry QR code</p><p className="mt-2 text-xs leading-5 text-[#718582]">Show this QR code at the WLC event desk. Staff can scan it to verify your booking and record each attendee's entry. The QR contains only your random booking reference.</p><p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#5d8650]"><ShieldCheck size={14}/> Secure staff-side verification</p></div></div>
        <p className="mt-6 text-center text-[11px] text-[#9aaca5]">Willes Literary Club · wlc.pro.bd</p>
      </div>
    </article>
  </div><style jsx global>{`@media print { @page { margin: 10mm; } body { background: white !important; } body * { visibility: hidden !important; } article, article * { visibility: visible !important; } article { position: absolute !important; inset: 0 auto auto 0 !important; width: 100% !important; box-shadow: none !important; border: 1px solid #dce8df !important; } }`}</style></main>;
}
