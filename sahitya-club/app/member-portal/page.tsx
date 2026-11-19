"use client";

import { useCallback, useEffect, useState } from "react";

type Activity = { events: Array<{id:string|null;title:string|null;date:string|number|null;time:string|number|null;venue:string|null;description:string|null;link:string|null}>; announcements: Array<{id:string|null;title:string|null;date:string|number|null;summary:string|null;link:string|null}>; attendance: Array<{id:string;eventId:string|number|null;eventTitle:string|number|null;eventDate:string|number|null;status:string|number|null;checkedInAt:string|number|null}>; certificates: Array<{id:string;title:string|number|null;certificateId:string|number|null;issuedAt:string|number|null;downloadUrl:string|number|null}>; };

type Member = {
  memberId: string;
  name: string;
  email: string | null;
  phone: string | null;
  batch: string | null;
  username: string;
  status: string;
  portalStatus: string;
  portalActivatedAt: number | null;
};

export default function MemberPortalPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [activity, setActivity] = useState<Activity>({ events: [], announcements: [], attendance: [], certificates: [] });
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextUsername, setNextUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/member-portal/profile", { cache: "no-store" });
      const data = await response.json();
      const signedIn = response.ok && data.authenticated;
      setMember(signedIn ? data.member : null);
      if (signedIn) {
        const activityResponse = await fetch("/api/member-portal/activity", { cache: "no-store" });
        const activityData = await activityResponse.json();
        if (activityResponse.ok && activityData.authenticated) {
          setActivity({
            events: activityData.events || [],
            announcements: activityData.announcements || [],
            attendance: activityData.attendance || [],
            certificates: activityData.certificates || [],
          });
        }
      } else {
        setActivity({ events: [], announcements: [], attendance: [], certificates: [] });
      }
    } catch {
      setMember(null);
      setMessage("Could not connect to the portal. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/member-portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: uid, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || data.error || "Sign-in failed. Check your UID and password.");
        return;
      }
      setPassword("");
      await load();
    } catch {
      setMessage("Network error. Please try signing in again.");
    } finally {
      setBusy(false);
    }
  }

  async function changeUid(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/member-portal/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, username: nextUsername }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Could not change your UID.");
        return;
      }
      setCurrentPassword("");
      setNextUsername("");
      setMessage("Your UID has been updated successfully.");
      await load();
    } catch {
      setMessage("Network error. Please try changing your UID again.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadMemberCardPdf() {
    if (!member) return;
    setBusy(true);
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
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not generate the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/member-portal/logout", { method: "POST" });
      setMember(null);
      setUid("");
      setPassword("");
      setMessage("You have been signed out.");
    } catch {
      setMessage("Could not sign out cleanly. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6 text-stone-600">Loading member portal…</main>;
  }

  return (
    <main className="min-h-screen bg-stone-50 p-5 text-stone-900 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {!member ? (
          <form onSubmit={login} className="mx-auto mt-10 max-w-md space-y-4 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-900">Willes Literary Club</p>
            <h1 className="text-3xl font-semibold tracking-tight">Member Portal</h1>
            <p className="text-sm leading-6 text-stone-600">Sign in with the UID and password you created when activating your membership.</p>
            <label className="block text-sm font-medium">Member UID
              <input value={uid} onChange={event => setUid(event.target.value)} required maxLength={20} autoComplete="username" placeholder="e.g. wlc_gen_3" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-rose-800 focus:ring-2 focus:ring-rose-100" />
            </label>
            <label className="block text-sm font-medium">Password
              <input type="password" value={password} onChange={event => setPassword(event.target.value)} required autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-rose-800 focus:ring-2 focus:ring-rose-100" />
            </label>
            <button disabled={busy} className="w-full rounded-xl bg-rose-900 p-3 font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Signing in…" : "Sign in securely"}</button>
            {message && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{message}</p>}
            <p className="text-xs leading-5 text-stone-500">Haven’t activated your account? Open the one-time activation link sent to your registered email. If it expired, contact the club admin for a new link.</p>
          </form>
        ) : (
          <>
            <header className="flex flex-col gap-5 rounded-3xl bg-stone-900 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div><p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-200">Willes Literary Club</p><h1 className="mt-3 text-3xl font-semibold">Welcome, {member.name}</h1><p className="mt-2 text-sm text-stone-300">Your personal membership space</p></div>
              <button disabled={busy} onClick={logout} className="rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 disabled:opacity-60">{busy ? "Please wait…" : "Log out"}</button>
            </header>
            <section className="mt-5 grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-stone-200 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Official Member ID</p><h2 className="mt-2 break-words text-2xl font-bold text-rose-900">{member.memberId}</h2><p className="mt-2 text-xs text-stone-500">Permanent club identifier</p></article>
              <article className="rounded-2xl border border-stone-200 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Personal UID</p><h2 className="mt-2 break-words text-2xl font-bold">{member.username}</h2><p className="mt-2 text-xs text-stone-500">Use this to sign in</p></article>
              <article className="rounded-2xl border border-stone-200 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Membership</p><h2 className="mt-2 text-xl font-bold text-emerald-800">{member.status === "ACTIVE" ? "Active" : member.status}</h2><p className="mt-2 text-xs text-stone-500">Portal: {member.portalStatus}</p></article>
            </section>
            <a href="/member-portal/writings" className="mt-5 flex flex-col gap-2 rounded-2xl border border-rose-200 bg-white p-6 transition hover:border-rose-400 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-rose-900">Writing Desk</p><h2 className="mt-1 text-xl font-semibold">Submit writing & track submissions</h2><p className="mt-1 text-sm text-stone-600">Submit poems, stories or essays and see which member submitted them and the review status.</p></div><span className="font-semibold text-rose-900">Open Writing Desk →</span></a>
            <section id="member-profile" className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <h2 className="text-xl font-semibold">Personal information</h2>
              <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div><dt className="text-sm text-stone-500">Full name</dt><dd className="mt-1 font-medium">{member.name || "Not provided"}</dd></div>
                <div><dt className="text-sm text-stone-500">Registered email</dt><dd className="mt-1 break-words font-medium">{member.email || "Not provided"}</dd></div>
                <div><dt className="text-sm text-stone-500">Phone</dt><dd className="mt-1 font-medium">{member.phone || "Not provided"}</dd></div>
                <div><dt className="text-sm text-stone-500">Class / Year</dt><dd className="mt-1 font-medium">{member.batch || "Not provided"}</dd></div>
              </dl>
            </section>
            <section id="account-settings" className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <h2 className="text-xl font-semibold">Change your UID</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Your official Member ID never changes. You can update your personal sign-in UID after confirming your current password.</p>
              <form onSubmit={changeUid} className="mt-4 grid gap-3 sm:grid-cols-3">
                <input value={nextUsername} onChange={event => setNextUsername(event.target.value)} required minLength={4} maxLength={20} pattern="[A-Za-z0-9_]{4,20}" autoComplete="username" placeholder="New UID (4–20 chars)" className="rounded-xl border border-stone-300 p-3 outline-none focus:border-rose-800" />
                <input value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required type="password" autoComplete="current-password" placeholder="Current password" className="rounded-xl border border-stone-300 p-3 outline-none focus:border-rose-800" />
                <button disabled={busy} className="rounded-xl bg-rose-900 p-3 font-semibold text-white disabled:opacity-60">{busy ? "Please wait…" : "Update UID"}</button>
              </form>
              <p className="mt-2 text-xs text-stone-500">UIDs are unique and can contain English letters, numbers and underscores only.</p>
            </section>
            <section id="member-card" className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 print-card-section">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div><h2 className="font-semibold">Digital membership card</h2><p className="mt-1 text-xs text-stone-500">Your official WLC identity card.</p></div>
                <div className="flex gap-2"><button type="button" onClick={downloadMemberCardPdf} disabled={busy} className="rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-60">{busy ? "Preparing PDF…" : "Download PDF"}</button><button type="button" onClick={() => window.print()} className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Print</button></div>
              </div>
              <div className="flex justify-center">
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
                      <img src={"https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=4&color=111111&bgcolor=faf9f6&data=" + encodeURIComponent("https://wlc.pro.bd/member-portal/verify?id=" + member.memberId)} alt="QR code for WLC membership verification" className="aspect-square w-full object-contain" />
                      <span className="mt-[5%] text-center text-[clamp(7px,1.35vw,10px)] font-bold uppercase tracking-[0.13em] text-stone-800">Scan to verify</span>
                      <span className="mt-1 text-center text-[clamp(5px,0.95vw,7px)] uppercase tracking-[0.12em] text-stone-500">Official WLC portal</span>
                    </div>
                  </div>
                  <div className="mt-[2.5%] flex shrink-0 items-center justify-end"><span className="font-serif text-[clamp(8px,1.5vw,11px)] italic text-stone-500">Learn · Write · Inspire</span></div>
                </div>
              </div>
              <p className="mt-3 text-center text-xs leading-5 text-stone-500 print:hidden">Scan the QR code to verify your membership on the official WLC portal.</p>
              <style jsx global>{`@media print {
                @page { size: 85.6mm 54mm; margin: 0; }
                html, body { width: 85.6mm !important; height: 54mm !important; margin: 0 !important; padding: 0 !important; background: #fff !important; }
                body * { visibility: hidden !important; }
                #wlc-print-card, #wlc-print-card * { visibility: visible !important; }
                #wlc-print-card {
                  position: absolute !important; left: 0 !important; top: 0 !important;
                  display: flex !important; flex-direction: column !important;
                  width: 85.6mm !important; height: 54mm !important; max-width: none !important; aspect-ratio: auto !important;
                  box-sizing: border-box !important; margin: 0 !important;
                  border: 1px solid #e7d9d9 !important; border-radius: 2mm !important;
                  background: #FAF9F6 !important; box-shadow: none !important;
                  print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important;
                }
                #wlc-print-card img { print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important; }
                .print-card-section { border: 0 !important; padding: 0 !important; margin: 0 !important; }
              }`}</style>
            </section>
            <section className="mt-5 grid gap-4 sm:grid-cols-2">
              <article id="events" className="rounded-2xl border border-stone-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Upcoming / published events</h2><span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs">{activity.events.length}</span></div>{activity.events.length ? <div className="mt-4 space-y-4">{activity.events.map(event => <div key={String(event.id)} className="border-t border-stone-100 pt-3"><p className="font-medium">{event.title || "WLC event"}</p><p className="mt-1 text-xs text-stone-500">{[event.date,event.time,event.venue].filter(Boolean).join(" · ")}</p>{event.description && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-600">{event.description}</p>}{event.link && (String(event.link).startsWith("/") || /^https?:\/\//i.test(String(event.link))) && <a href={String(event.link)} className="mt-2 inline-block text-sm font-semibold text-rose-900 underline">Event details ↗</a>}</div>)}</div> : <p className="mt-3 text-sm text-stone-500">No published events right now.</p>}</article>
              <article id="announcements" className="rounded-2xl border border-stone-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Club announcements</h2><span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs">{activity.announcements.length}</span></div>{activity.announcements.length ? <div className="mt-4 space-y-4">{activity.announcements.map(item => <div key={String(item.id)} className="border-t border-stone-100 pt-3"><p className="font-medium">{item.title || "WLC announcement"}</p>{item.date && <p className="mt-1 text-xs text-stone-500">{item.date}</p>}{item.summary && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-600">{item.summary}</p>}{item.link && (String(item.link).startsWith("/") || /^https?:\/\//i.test(String(item.link))) && <a href={String(item.link)} className="mt-2 inline-block text-sm font-semibold text-rose-900 underline">Read more ↗</a>}</div>)}</div> : <p className="mt-3 text-sm text-stone-500">No published announcements right now.</p>}</article>
            </section>
            <section className="mt-5 grid gap-4 sm:grid-cols-2">
              <article id="attendance" className="rounded-2xl border border-stone-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Attendance history</h2><span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs">{activity.attendance.length}</span></div>{activity.attendance.length ? <div className="mt-4 space-y-3">{activity.attendance.map(item => <div key={item.id} className="flex items-start justify-between gap-3 border-t border-stone-100 pt-3"><div><p className="font-medium">{item.eventTitle || "Club event"}</p><p className="mt-1 text-xs text-stone-500">{item.eventDate || ""}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800">{item.status || "Recorded"}</span></div>)}</div> : <p className="mt-3 text-sm text-stone-500">Attendance records will appear here when added by the club.</p>}</article>
              <article id="certificates" className="rounded-2xl border border-stone-200 bg-white p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">Certificates</h2><span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs">{activity.certificates.length}</span></div>{activity.certificates.length ? <div className="mt-4 space-y-3">{activity.certificates.map(item => <div key={item.id} className="border-t border-stone-100 pt-3"><p className="font-medium">{item.title || "WLC certificate"}</p>{item.certificateId && <p className="mt-1 text-xs text-stone-500">Certificate ID: {item.certificateId}</p>}{item.issuedAt && <p className="mt-1 text-xs text-stone-500">Issued: {item.issuedAt}</p>}{item.downloadUrl && (String(item.downloadUrl).startsWith("/") || /^https?:\/\//i.test(String(item.downloadUrl))) && <a href={String(item.downloadUrl)} target={String(item.downloadUrl).startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-rose-900 underline">View certificate ↗</a>}</div>)}</div> : <p className="mt-3 text-sm text-stone-500">Your certificates will appear here when issued.</p>}</article>
            </section>
            {message && <p role="status" className="mt-4 rounded-xl bg-stone-100 p-3 text-sm">{message}</p>}
          </>
        )}
        <footer className="py-8 text-center text-xs text-stone-500">Willes Literary Club · Member Portal</footer>
      </div>
    </main>
  );
}
