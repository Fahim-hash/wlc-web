"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Mail, ShieldCheck, XCircle } from "lucide-react";

type TicketInfo = { bookingId: string; ticketId: string; eventTitle: string; status: string };

export default function TicketPaymentResultPage() {
  const [state, setState] = useState("loading");
  const [ticket, setTicket] = useState<TicketInfo | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingId = params.get("bookingId") || "";
    const paymentState = params.get("state") || "pending";
    setState(paymentState);
    if (!/^[a-f0-9-]{36}$/i.test(bookingId) || paymentState !== "paid") return;
    const token = sessionStorage.getItem(`wlc-ticket-token:${bookingId}`) || "";
    if (!token) { setState("token-missing"); return; }
    fetch(`/api/ticketing/tickets/${encodeURIComponent(bookingId)}?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Ticket is not available yet.");
        setTicket(data.ticket);
      })
      .catch(() => setState("verify"));
  }, []);

  const paid = state === "paid" && Boolean(ticket);
  const cancelled = state === "cancelled";
  const pending = state === "pending" || state === "loading";
  return <main className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4 py-12 text-[#1C1917]">
    <section className="w-full max-w-lg rounded-[2rem] border border-[#E5E7EB] bg-white p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF2F5] text-[#9F1239]">
        {paid ? <CheckCircle2 size={28}/> : cancelled ? <XCircle size={28}/> : pending ? <Clock3 size={28}/> : <ShieldCheck size={28}/>}
      </div>
      <h1 className="mt-5 font-serif text-3xl font-semibold">{paid ? "Payment confirmed" : cancelled ? "Payment cancelled" : pending ? "Payment is being checked" : "Ticket confirmation pending"}</h1>
      <p className="mt-3 text-sm leading-6 text-[#6B7280]">
        {paid ? "Your WLC event pass is ready. A PDF copy has also been sent to your email when delivery is available."
          : cancelled ? "Your payment was cancelled. No ticket has been issued. You can return to the event page and try again."
          : pending ? "We have not received a final confirmation yet. Please allow a moment and check your email before trying another payment."
          : "We could not complete the automatic confirmation in this browser. If money was deducted, contact WLC with your booking reference before paying again."}
      </p>
      {ticket && <div className="mt-6 rounded-2xl border border-dashed border-[#F9A8D4] bg-[#FDF2F5] p-5 text-left"><p className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Ticket ID</p><p className="mt-2 break-all font-mono text-xl font-bold text-[#9F1239]">{ticket.ticketId}</p><p className="mt-2 text-sm text-[#6B7280]">{ticket.eventTitle}</p></div>}
      <div className="mt-7 flex flex-col gap-3">
        {paid && ticket && <Link href={`/ticketing/ticket/${ticket.bookingId}?token=${encodeURIComponent(sessionStorage.getItem(`wlc-ticket-token:${ticket.bookingId}`) || "")}`} className="rounded-xl bg-[#9F1239] px-4 py-3.5 text-sm font-bold text-white">Open your event pass</Link>}
        {paid && <p className="flex items-center justify-center gap-2 text-xs text-[#6B7280]"><Mail size={14}/> Check your inbox for the attached PDF ticket.</p>}
        <Link href="/ticketing" className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#6B7280]">Back to events</Link>
      </div>
    </section>
  </main>;
}
