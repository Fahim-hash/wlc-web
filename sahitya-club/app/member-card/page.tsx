"use client";

import { FormEvent, useState } from "react";

type MemberCardData = { memberId: string; name: string; batch: string; status: string };

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
      if (!response.ok) { setMessage(data.message || "Member not found."); return; }
      setMember(data.member);
    } catch { setMessage("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  async function downloadPdf() {
    if (!member) return;
    setLoading(true);
    setMessage("");
    try {
      const card = document.getElementById("wlc-print-card");
      const images = card ? Array.from(card.querySelectorAll("img")) : [];
      const imageData = await Promise.all(images.map(async (image) => {
        const response = await fetch(image.currentSrc || image.src, { mode: "cors", cache: "force-cache" });
        if (!response.ok) throw new Error("Could not load a card image for PDF export.");
        const blob = await response.blob();
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Could not prepare a card image."));
          reader.readAsDataURL(blob);
        });
      }));
      const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
      const logoData = imageData[0];
      const qrData = imageData[1];
      if (!logoData || !qrData) throw new Error("The card logo or QR code is not ready.");

      const words = member.name.trim().split(/\s+/);
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const next = line ? line + " " + word : word;
        if (next.length > 23 && line) { lines.push(line); line = word; } else line = next;
      }
      if (line) lines.push(line);
      const nameSvg = lines.slice(0, 2).map((part, index) => '<tspan x="58" dy="' + (index === 0 ? "0" : "57") + '">' + escapeXml(part) + "</tspan>").join("");
      const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="856" height="540" viewBox="0 0 856 540">',
        '<rect width="856" height="540" fill="#faf9f6"/><rect width="8" height="540" fill="#9f1239"/>',
        '<image x="52" y="40" width="76" height="76" preserveAspectRatio="xMidYMid meet" href="' + logoData + '" xlink:href="' + logoData + '"/>',
        '<text x="150" y="70" fill="#9f1239" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="3">WILLES LITERARY CLUB</text>',
        '<text x="150" y="99" fill="#292524" font-family="Georgia,serif" font-size="23">Membership identity</text>',
        '<text x="798" y="62" text-anchor="end" fill="#9f1239" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="3">WLC</text>',
        '<text x="798" y="84" text-anchor="end" fill="#78716c" font-family="Arial,sans-serif" font-size="10" letter-spacing="2">OFFICIAL MEMBER</text>',
        '<line x1="52" y1="145" x2="804" y2="145" stroke="#e7d9d9" stroke-width="2"/>',
        '<text x="58" y="193" fill="#9f1239" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="3">MEMBER NAME</text>',
        '<text x="58" y="264" fill="#1c1917" font-family="Georgia,serif" font-size="54">' + nameSvg + '</text>',
        '<text x="58" y="365" fill="#78716c" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="3">MEMBERSHIP ID</text>',
        '<text x="58" y="400" fill="#292524" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="1">' + escapeXml(member.memberId) + '</text>',
        '<text x="58" y="453" fill="#57534e" font-family="Arial,sans-serif" font-size="14" font-weight="600">' + escapeXml(member.batch ? "CLASS / YEAR  ·  " + member.batch : "WILLES LITERARY CLUB") + '</text>',
        '<line x1="58" y1="480" x2="510" y2="480" stroke="#e7d9d9" stroke-width="1.5"/>',
        '<text x="58" y="510" fill="#9f1239" font-family="Arial,sans-serif" font-size="11" font-weight="700" letter-spacing="2">ACTIVE MEMBER</text>',
        '<image x="622" y="218" width="174" height="174" preserveAspectRatio="xMidYMid meet" href="' + qrData + '" xlink:href="' + qrData + '"/>',
        '<text x="709" y="426" text-anchor="middle" fill="#292524" font-family="Arial,sans-serif" font-size="13" font-weight="700" letter-spacing="2">SCAN TO VERIFY</text>',
        '<text x="709" y="448" text-anchor="middle" fill="#78716c" font-family="Arial,sans-serif" font-size="10" letter-spacing="1.5">OFFICIAL WLC PORTAL</text>',
        '<text x="798" y="510" text-anchor="end" fill="#78716c" font-family="Georgia,serif" font-size="13" font-style="italic">Learn · Write · Inspire</text></svg>'
      ].join("");

      const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      try {
        const snapshot = new Image();
        snapshot.src = svgUrl;
        await new Promise<void>((resolve, reject) => { snapshot.onload = () => resolve(); snapshot.onerror = () => reject(new Error("Could not render the member card image.")); });
        const canvas = document.createElement("canvas");
        canvas.width = 856 * 3;
        canvas.height = 540 * 3;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Your browser could not create the card image.");
        context.drawImage(snapshot, 0, 0, canvas.width, canvas.height);
        const pngBlob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Could not export the card PNG.")), "image/png"));
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.create();
        const png = await pdf.embedPng(await pngBlob.arrayBuffer());
        const mmToPt = 72 / 25.4;
        const pageWidth = 85.6 * mmToPt;
        const pageHeight = 54 * mmToPt;
        const page = pdf.addPage([pageWidth, pageHeight]);
        page.drawImage(png, { x: 0, y: 0, width: pageWidth, height: pageHeight });
        const pdfBlob = new Blob([await pdf.save() as BlobPart], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "WLC-Member-Card-" + member.memberId + ".pdf";
        document.body.appendChild(link); link.click(); link.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);
      } finally { URL.revokeObjectURL(svgUrl); }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not generate the PDF. Please try again."); }
    finally { setLoading(false); }
  }

  const verifyUrl = member ? "https://wlc.pro.bd/member-portal/verify?id=" + encodeURIComponent(member.memberId) : "";
  const qrUrl = verifyUrl ? "https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=4&color=111111&bgcolor=faf9f6&data=" + encodeURIComponent(verifyUrl) : "";

  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-10 text-stone-900 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center print:hidden">
          <img src="/logo.png" alt="Willes Literary Club" className="mx-auto h-16 w-16 object-contain" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-rose-900">Willes Literary Club</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Member ID Card</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">Enter your official Member ID to find your membership record and generate a print-ready identity card.</p>
        </header>
        <form onSubmit={searchMember} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 print:hidden">
          <label htmlFor="memberId" className="mb-2 block text-sm font-semibold">Official Member ID</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input id="memberId" value={memberId} onChange={event => setMemberId(event.target.value.toUpperCase())} placeholder="WLC-2026-0001" required maxLength={32} autoCapitalize="characters" className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-3 font-mono outline-none transition focus:border-rose-900 focus:ring-2 focus:ring-rose-100" />
            <button disabled={loading} className="rounded-xl bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-900 disabled:opacity-60">{loading ? "Searching…" : "Search member"}</button>
          </div>
          {message && <p role="status" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
          <p className="mt-3 text-xs text-stone-500">Only active memberships can generate an official card.</p>
        </form>
        {member && (
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between gap-3 print:hidden">
              <div><h2 className="font-semibold">Your digital member card</h2><p className="mt-1 text-xs text-stone-500">Minimal, print-ready WLC identity.</p></div>
              <button onClick={downloadPdf} disabled={loading} className="shrink-0 rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-60">{loading ? "Preparing…" : "Download PDF"}</button>
            </div>
            <div id="wlc-print-card" className="relative mx-auto flex aspect-[85.6/54] w-full max-w-[680px] flex-col overflow-hidden rounded-lg border border-[#e7d9d9] bg-[#FAF9F6] px-[6.1%] pb-[4.2%] pt-[5%] shadow-lg">
              <div className="absolute inset-y-0 left-0 w-[5px] bg-[#9F1239]" />
              <div className="flex shrink-0 items-center gap-[3%]">
                <img src="/logo.png" alt="Willes Literary Club logo" className="h-[clamp(38px,8vw,68px)] w-[clamp(38px,8vw,68px)] shrink-0 object-contain" />
                <div className="min-w-0"><p className="text-[clamp(8px,1.8vw,13px)] font-bold uppercase tracking-[0.18em] text-[#9F1239]">Willes Literary Club</p><p className="mt-1 font-serif text-[clamp(13px,2.8vw,21px)] leading-tight text-stone-800">Membership identity</p></div>
                <div className="ml-auto shrink-0 text-right"><p className="text-[clamp(8px,1.4vw,10px)] font-bold tracking-[0.2em] text-[#9F1239]">WLC</p><p className="mt-1 text-[clamp(6px,1.1vw,8px)] uppercase tracking-[0.13em] text-stone-500">Official member</p></div>
              </div>
              <div className="my-[3.5%] h-px shrink-0 bg-[#E7D9D9]" />
              <div className="flex min-h-0 flex-1 gap-[5%]">
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="text-[clamp(7px,1.35vw,10px)] font-bold uppercase tracking-[0.2em] text-[#9F1239]">Member name</p>
                  <h3 className="mt-2 line-clamp-2 break-words font-serif text-[clamp(21px,5.2vw,39px)] leading-[1.08] tracking-tight text-stone-900">{member.name}</h3>
                  <div className="mt-[5%]"><p className="text-[clamp(6px,1.2vw,9px)] font-bold uppercase tracking-[0.18em] text-stone-500">Membership ID</p><p className="mt-1 break-all font-mono text-[clamp(11px,2.3vw,17px)] font-semibold tracking-wide text-stone-800">{member.memberId}</p></div>
                  <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[#E7D9D9] pt-[3%]">
                    {member.batch && <span className="text-[clamp(7px,1.25vw,9px)] font-semibold text-stone-600">CLASS / YEAR · {member.batch}</span>}
                    <span className="text-[clamp(7px,1.25vw,9px)] font-bold uppercase tracking-[0.14em] text-[#9F1239]">● Active member</span>
                  </div>
                </div>
                <div className="flex w-[27%] min-w-0 shrink-0 flex-col items-center justify-center">
                  <img src={qrUrl} alt="QR code for WLC membership verification" className="aspect-square w-full object-contain" />
                  <span className="mt-[5%] text-center text-[clamp(7px,1.35vw,10px)] font-bold uppercase tracking-[0.13em] text-stone-800">Scan to verify</span>
                  <span className="mt-1 text-center text-[clamp(5px,0.95vw,7px)] uppercase tracking-[0.12em] text-stone-500">Official WLC portal</span>
                </div>
              </div>
              <div className="mt-[2.5%] flex shrink-0 items-center justify-end"><span className="font-serif text-[clamp(8px,1.5vw,11px)] italic text-stone-500">Learn · Write · Inspire</span></div>
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-stone-500 print:hidden">The QR code opens WLC’s official membership verification page. It does not expose your phone number or email.</p>
          </section>
        )}
        <footer className="mt-10 text-center text-xs text-stone-500 print:hidden">Willes Literary Club · Official Member Services</footer>
      </div>
    </main>
  );
}
