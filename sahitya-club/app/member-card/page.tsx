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

  async function downloadPdf() {
    const card = document.getElementById("wlc-print-card");
    if (!card) return;

    // Wait for the logo and verification QR image before opening the print dialog.
    const images = Array.from(card.querySelectorAll("img"));
    await Promise.all(images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) {
        try { await img.decode(); } catch { /* Keep the already loaded image. */ }
        return;
      }

      await new Promise<void>((resolve) => {
        const finish = () => resolve();
        img.addEventListener("load", finish, { once: true });
        img.addEventListener("error", finish, { once: true });
        window.setTimeout(finish, 10000);
      });

      if (img.complete && img.naturalWidth > 0) {
        try { await img.decode(); } catch { /* Continue to print if decode is unsupported. */ }
      }
    }));

    if ("fonts" in document) {
      try { await document.fonts.ready; } catch { /* Fonts are non-blocking for export. */ }
    }

    // Give the browser one frame to apply the print layout after assets are ready.
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  }

  const verifyUrl = member
    ? "https://wlc.pro.bd/member-portal/verify?id=" + encodeURIComponent(member.memberId)
    : "";
  const qrUrl = verifyUrl
    ? "https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=4&color=111111&bgcolor=ffffff&data=" + encodeURIComponent(verifyUrl)
    : "";

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-10 text-stone-900 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center print:hidden">
          <img src="/logo.png" alt="Willes Literary Club" className="mx-auto h-16 w-16 object-contain" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-rose-900">Willes Literary Club</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Member ID Card</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
            Enter your official Member ID to find your membership record and generate a print-ready identity card.
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
            <button disabled={loading} className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-900 disabled:opacity-60">
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
                <p className="mt-1 text-xs text-stone-500">Designed for clear colour and black-and-white printing.</p>
              </div>
              <button onClick={downloadPdf} className="shrink-0 rounded-xl bg-stone-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-900">
                Download PDF
              </button>
            </div>

            <div
              id="wlc-print-card"
              className="mx-auto flex aspect-[85.6/54] w-full max-w-[680px] flex-col overflow-hidden rounded-xl border-2 border-stone-900 bg-white shadow-xl"
            >
              <div className="flex min-h-0 items-center gap-3 border-b-[3px] border-rose-900 bg-stone-950 px-[4.2%] py-[3.2%] text-white">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white p-1.5 sm:h-16 sm:w-16">
                  <img src="/logo.png" alt="Willes Literary Club logo" className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[clamp(10px,2.3vw,17px)] font-black uppercase leading-tight tracking-[0.08em]">Willes Literary Club</p>
                  <p className="mt-1 text-[clamp(7px,1.35vw,10px)] font-semibold uppercase tracking-[0.17em] text-white/85">Official Membership Identity Card</p>
                </div>
                <div className="ml-auto hidden shrink-0 text-right sm:block">
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/65">Member</p>
                  <p className="mt-1 text-xs font-black tracking-wider">WLC</p>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 items-stretch gap-[3.5%] px-[4.2%] py-[3.5%]">
                <div className="flex min-w-0 flex-1 flex-col justify-center border-l-[3px] border-rose-900 pl-[3.5%]">
                  <p className="text-[clamp(7px,1.45vw,10px)] font-extrabold uppercase tracking-[0.2em] text-stone-500">Member name</p>
                  <h3 className="mt-1 break-words text-[clamp(16px,4.1vw,29px)] font-black leading-[1.08] tracking-tight text-stone-950">{member.name}</h3>
                  <div className="mt-3">
                    <p className="text-[clamp(6px,1.2vw,9px)] font-bold uppercase tracking-[0.16em] text-stone-500">Membership ID</p>
                    <p className="mt-0.5 break-all font-mono text-[clamp(10px,2.3vw,16px)] font-extrabold tracking-wide text-stone-950">{member.memberId}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[clamp(7px,1.4vw,10px)] font-bold text-stone-700">
                    {member.batch && <span>CLASS / YEAR: {member.batch}</span>}
                    <span className="inline-flex items-center gap-1.5 border border-stone-900 px-2 py-1 uppercase tracking-[0.08em]">
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-900" /> Active Member
                    </span>
                  </div>
                </div>

                <div className="flex w-[30%] min-w-0 shrink-0 flex-col items-center justify-center border-2 border-stone-900 bg-white p-[2.2%]">
                  <div className="flex aspect-square w-full items-center justify-center bg-white p-[3%]">
                    <img
                      src={qrUrl}
                      alt="QR code for WLC membership verification"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="mt-1.5 text-center text-[clamp(7px,1.45vw,10px)] font-black uppercase tracking-[0.12em] text-stone-950">Scan to verify</span>
                  <span className="mt-0.5 text-center text-[clamp(5px,1vw,7px)] font-semibold uppercase tracking-wider text-stone-500">Official WLC Portal</span>
                </div>
              </div>

              <div className="flex h-[4.5%] shrink-0 items-center justify-between bg-stone-950 px-[4.2%] text-[clamp(6px,1.1vw,8px)] font-bold uppercase tracking-[0.15em] text-white">
                <span>Willes Literary Club</span>
                <span>Learn · Write · Inspire</span>
              </div>
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
          display: flex !important; flex-direction: column !important;
          position: fixed !important; left: 0 !important; top: 0 !important; right: auto !important; bottom: auto !important;
          width: 85.6mm !important; height: 54mm !important; max-width: none !important;
          aspect-ratio: auto !important; box-sizing: border-box !important; margin: 0 !important;
          border-radius: 0 !important; box-shadow: none !important;
          background: #fff !important; border: 0.45mm solid #111 !important;
          print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important;
        }
        #wlc-print-card > div:first-child {
          background: #111 !important; color: #fff !important; border-bottom: 0.7mm solid #555 !important;
        }
        #wlc-print-card > div:last-child {
          background: #111 !important; color: #fff !important;
        }
        #wlc-print-card img { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
        #wlc-print-card h3, #wlc-print-card p, #wlc-print-card span { text-shadow: none !important; }
      }`}</style>
    </main>
  );
}
