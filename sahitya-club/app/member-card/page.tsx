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
    if (!member) return;

    setLoading(true);
    setMessage("");
    try {
      // Fetch both card images and convert them to data URLs before drawing.
      // The exported SVG contains no HTML foreignObject, CSS URLs, or remote
      // resources, so its canvas cannot inherit cross-origin taint.
      const card = document.getElementById("wlc-print-card");
      const imageElements = card ? Array.from(card.querySelectorAll("img")) : [];
      const imageData = await Promise.all(imageElements.map(async (image) => {
        const response = await fetch(image.currentSrc || image.src, {
          mode: "cors",
          cache: "force-cache",
        });
        if (!response.ok) throw new Error("Could not load a card image for PDF export.");
        const blob = await response.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Could not prepare a card image."));
          reader.readAsDataURL(blob);
        });
      }));

      const escapeXml = (value: string) => value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
      const logoData = imageData[0];
      const qrData = imageData[1];
      if (!logoData || !qrData) throw new Error("The card logo or QR code is not ready.");

      const nameWords = member.name.trim().split(/\s+/);
      const nameLines: string[] = [];
      let currentLine = "";
      for (const word of nameWords) {
        const candidate = currentLine ? currentLine + " " + word : word;
        if (candidate.length > 25 && currentLine) {
          nameLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = candidate;
        }
      }
      if (currentLine) nameLines.push(currentLine);
      const visibleNameLines = nameLines.slice(0, 2);
      const nameSvg = visibleNameLines.map((line, index) =>
        '<tspan x="82" dy="' + (index === 0 ? "0" : "48") + '">' + escapeXml(line) + "</tspan>"
      ).join("");

      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="856" height="540" viewBox="0 0 856 540">
          <rect width="856" height="540" fill="#ffffff"/>
          <rect x="0" y="0" width="856" height="145" fill="#1c1917"/>
          <rect x="0" y="142" width="856" height="5" fill="#9f1239"/>
          <circle cx="88" cy="72" r="49" fill="#ffffff" stroke="#ffffff" stroke-width="3"/>
          <image x="48" y="32" width="80" height="80" preserveAspectRatio="xMidYMid meet" href="${logoData}" xlink:href="${logoData}"/>
          <text x="158" y="66" fill="#ffffff" font-family="Arial, sans-serif" font-size="31" font-weight="900" letter-spacing="2">WILLES LITERARY CLUB</text>
          <text x="158" y="96" fill="#f5f5f4" font-family="Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="3">OFFICIAL MEMBERSHIP IDENTITY CARD</text>
          <text x="790" y="57" text-anchor="end" fill="#a8a29e" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="3">MEMBER</text>
          <text x="790" y="88" text-anchor="end" fill="#ffffff" font-family="Arial, sans-serif" font-size="23" font-weight="900" letter-spacing="2">WLC</text>

          <rect x="0" y="147" width="856" height="369" fill="#ffffff"/>
          <rect x="72" y="190" width="5" height="270" fill="#9f1239"/>
          <text x="94" y="218" fill="#78716c" font-family="Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="3">MEMBER NAME</text>
          <text x="94" y="270" fill="#1c1917" font-family="Arial, sans-serif" font-size="40" font-weight="900">${nameSvg}</text>
          <text x="94" y="355" fill="#78716c" font-family="Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="2">MEMBERSHIP ID</text>
          <text x="94" y="388" fill="#1c1917" font-family="monospace" font-size="24" font-weight="800">${escapeXml(member.memberId)}</text>
          <text x="94" y="446" fill="#44403c" font-family="Arial, sans-serif" font-size="15" font-weight="800">CLASS / YEAR: ${escapeXml(member.batch || "—")}</text>
          <rect x="94" y="463" width="160" height="30" fill="#ffffff" stroke="#1c1917" stroke-width="2"/>
          <circle cx="111" cy="478" r="5" fill="#1c1917"/>
          <text x="125" y="483" fill="#1c1917" font-family="Arial, sans-serif" font-size="13" font-weight="800" letter-spacing="1">ACTIVE MEMBER</text>

          <rect x="590" y="190" width="205" height="260" fill="#ffffff" stroke="#1c1917" stroke-width="4"/>
          <image x="606" y="206" width="173" height="173" preserveAspectRatio="xMidYMid meet" href="${qrData}" xlink:href="${qrData}"/>
          <text x="692" y="410" text-anchor="middle" fill="#1c1917" font-family="Arial, sans-serif" font-size="15" font-weight="900" letter-spacing="2">SCAN TO VERIFY</text>
          <text x="692" y="432" text-anchor="middle" fill="#78716c" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="2">OFFICIAL WLC PORTAL</text>

          <rect x="0" y="516" width="856" height="24" fill="#1c1917"/>
          <text x="36" y="533" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="2">WILLES LITERARY CLUB</text>
          <text x="820" y="533" text-anchor="end" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="2">LEARN · WRITE · INSPIRE</text>
        </svg>`;

      const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      try {
        const snapshot = new Image();
        snapshot.src = svgUrl;
        await new Promise<void>((resolve, reject) => {
          snapshot.onload = () => resolve();
          snapshot.onerror = () => reject(new Error("Could not render the member card image."));
        });

        const scale = 3;
        const canvas = document.createElement("canvas");
        canvas.width = 856 * scale;
        canvas.height = 540 * scale;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Your browser could not create the card image.");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(snapshot, 0, 0, canvas.width, canvas.height);

        // This canvas is drawn only from a self-contained SVG with embedded
        // data:image resources; no remote image or stylesheet can taint it.
        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Could not export the card PNG.")), "image/png");
        });
        const pngBytes = await pngBlob.arrayBuffer();
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.create();
        const png = await pdf.embedPng(pngBytes);
        const mmToPt = 72 / 25.4;
        const pageWidth = 85.6 * mmToPt;
        const pageHeight = 54 * mmToPt;
        const page = pdf.addPage([pageWidth, pageHeight]);
        page.drawImage(png, { x: 0, y: 0, width: pageWidth, height: pageHeight });
        const pdfBytes = await pdf.save();
        const pdfBlob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "WLC-Member-Card-" + member.memberId + ".pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);
      } finally {
        URL.revokeObjectURL(svgUrl);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not generate the PDF. Please try again.");
    } finally {
      setLoading(false);
    }
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

   </main>
  );
}
