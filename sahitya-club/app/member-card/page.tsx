"use client";

import { FormEvent, useState } from "react";

type MemberCardData = {
  memberId: string;
  name: string;
  batch: string;
  status: string;
};

export default function MemberCardPage() {
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState<MemberCardData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMember(null);
    setMessage("");
    try {
      const response = await fetch("/api/member-card?id=" + encodeURIComponent(memberId.trim()), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Member not found.");
        return;
      }
      setMember(data.member);
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadPdf() {
    // The print stylesheet outputs only the card at CR80 ID-1 dimensions.
    // On the print dialog, choose “Save as PDF” to download a PDF copy.
    window.print();
  }

  const verifyUrl = member
    ? "https://wlc.pro.bd/member-portal/verify?id=" + encodeURIComponent(member.memberId)
    : "";

  return (
    <main className="min-h-screen bg-[#f7f5f2] px-4 py-10 text-stone-900 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <img src="/logo.png" alt="Willes Literary Club" className="mx-auto h-16 w-16 object-contain" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-rose-900">Willes Literary Club</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Member ID Card</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
            Enter your official Member ID to find your membership record and generate a printable digital ID card.
          </p>
        </header>

        <form onSubmit={searchMember} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 print:hidden">
          <label htmlFor="memberId" className="mb-2 block text-sm font-semibold">Official Member ID</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="memberId"
              value={memberId}
              onChange={event => setMemberId(event.target.value.toUpperCase())}
              placeholder="WLC-2026-0001"
              required
              maxLength={32}
              autoCapitalize="characters"
              className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3 font-mono outline-none transition focus:border-rose-900 focus:ring-2 focus:ring-rose-100"
            />
            <button disabled={loading} className="rounded-xl bg-rose-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-900 disabled:opacity-60">
              {loading ? "Searching…" : "Search member"}
            </button>
          </div>
          {message && <p role="status" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
          <p className="mt-3 text-xs text-stone-500">Only active memberships can generate an official card.</p>
        </form>

        {member && (
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between gap-3 print:hidden">
              <div>
                <h2 className="font-semibold">Your digital member card</h2>
                <p className="mt-1 text-xs text-stone-500">Check the details before saving your PDF.</p>
              </div>
              <button onClick={downloadPdf} className="shrink-0 rounded-xl bg-rose-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-900">
                Download PDF
              </button>
            </div>

            <div id="wlc-print-card" className="mx-auto aspect-[85.6/54] w-full max-w-[680px] overflow-hidden rounded-2xl border border-rose-950/20 bg-gradient-to-br from-white via-stone-50 to-rose-100 p-[4.2%] shadow-xl">
              <div className="flex h-full items-stretch justify-between gap-3 sm:gap-5">
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="" className="h-10 w-10 shrink-0 object-contain sm:h-14 sm:w-14" />
                    <div className="min-w-0">
                      <p className="text-[clamp(9px,2.1vw,15px)] font-extrabold uppercase tracking-[0.12em] text-rose-950">Willes Literary Club</p>
                      <p className="mt-1 text-[clamp(7px,1.4vw,10px)] font-semibold uppercase tracking-[0.2em] text-stone-500">Official Membership Identity Card</p>
                    </div>
                  </div>
                  <div className="mt-auto min-w-0 pb-1">
                    <p className="text-[clamp(7px,1.5vw,10px)] font-bold uppercase tracking-[0.18em] text-stone-500">Member name</p>
                    <h3 className="mt-1 break-words text-[clamp(15px,4vw,27px)] font-bold leading-tight text-stone-950">{member.name}</h3>
                    <p className="mt-2 font-mono text-[clamp(10px,2.5vw,17px)] font-bold tracking-wide text-rose-950">{member.memberId}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[clamp(8px,1.7vw,11px)] font-medium text-stone-600">
                      {member.batch && <span>Class / Year: {member.batch}</span>}
                      <span className="font-bold text-emerald-800">● ACTIVE MEMBER</span>
                    </div>
                  </div>
                </div>
                <div className="flex w-[29%] shrink-0 flex-col items-center justify-center rounded-xl border border-stone-200 bg-white p-2 sm:p-3">
                  <img
                    src={"https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=4&data=" + encodeURIComponent(verifyUrl)}
                    alt="QR code for WLC membership verification"
                    className="aspect-square w-full max-w-[170px] object-contain"
                  />
                  <span className="mt-1 text-center text-[clamp(7px,1.5vw,10px)] font-extrabold tracking-wider text-stone-700">SCAN TO VERIFY</span>
                </div>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-rose-950/80" />
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-stone-500 print:hidden">
              The QR code opens WLC’s official membership verification page. It does not expose your phone number or email.
            </p>
          </section>
        )}

        <footer className="mt-10 text-center text-xs text-stone-500 print:hidden">Willes Literary Club · Official Member Services</footer>
      </div>

      <style jsx global>{`@media print {
        @page { size: 85.6mm 54mm; margin: 0; }
        html, body { width: 85.6mm !important; height: 54mm !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
        body * { visibility: hidden !important; }
        #wlc-print-card, #wlc-print-card * { visibility: visible !important; }
        #wlc-print-card {
          position: absolute !important; inset: 0 auto auto 0 !important;
          width: 85.6mm !important; height: 54mm !important; max-width: none !important;
          aspect-ratio: auto !important; box-sizing: border-box !important; margin: 0 !important;
          padding: 3.5mm !important; border-radius: 0 !important; box-shadow: none !important;
          print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important;
        }
        #wlc-print-card img { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
      }`}</style>
    </main>
  );
}
