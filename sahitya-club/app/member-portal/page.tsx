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
        setMessage(data.message || "Sign-in failed. Check your UID and password.");
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
              <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                <h2 className="font-semibold">Digital membership card</h2>
                <button type="button" onClick={() => window.print()} className="rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-800">Print member card</button>
              </div>
              <div className="mt-4 flex justify-center">
                <div id="wlc-member-card" className="flex h-[204px] w-full max-w-[540px] items-center justify-between gap-4 overflow-hidden rounded-xl border-2 border-rose-900/20 bg-gradient-to-br from-white via-stone-50 to-rose-50 p-4 text-stone-900 shadow-sm print-card">
                  <div className="flex min-w-0 flex-1 flex-col self-stretch">
                    <div className="flex items-center gap-2">
                      <img src="/logo.png" alt="Willes Literary Club logo" width="38" height="38" className="h-9 w-9 shrink-0 object-contain" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-rose-900">Willes Literary Club</p>
                        <p className="text-[8px] font-medium uppercase tracking-[0.18em] text-stone-500">Official Member Card</p>
                      </div>
                    </div>
                    <div className="mt-auto min-w-0">
                      <p className="truncate text-lg font-bold leading-tight">{member.name}</p>
                      <p className="mt-1 break-all font-mono text-sm font-semibold text-rose-900">{member.memberId}</p>
                      <p className="mt-2 text-[10px] font-medium text-stone-600">{member.batch ? "Class / Year: " + member.batch : "Willes Literary Club Member"}</p>
                      <p className="mt-0.5 text-[10px] text-stone-600">Status: {member.status === "ACTIVE" ? "Active" : member.status}</p>
                    </div>
                  </div>
                  <div className="flex h-full w-[112px] shrink-0 flex-col items-center justify-center rounded-lg border border-stone-200 bg-white p-2">
                    <img alt="QR code for official member verification" width="104" height="104" className="h-[92px] w-[92px]" src={"https://api.qrserver.com/v1/create-qr-code/?size=104x104&margin=4&data=" + encodeURIComponent("https://wlc.pro.bd/member-portal/verify?id=" + member.memberId)} />
                    <span className="mt-1 text-[8px] font-semibold text-stone-700">SCAN TO VERIFY</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-stone-500 print:hidden">Scan this QR to verify membership. The QR contains no contact details.</p>
              <style jsx global>{`@media print {
                @page { size: auto; margin: 8mm; }
                html, body { background: #fff !important; }
                body * { visibility: hidden !important; }
                #wlc-member-card, #wlc-member-card * { visibility: visible !important; }
                #wlc-member-card {
                  position: absolute !important; left: 0 !important; top: 0 !important;
                  display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important;
                  width: 85.6mm !important; height: 54mm !important; min-height: 54mm !important; max-width: none !important;
                  box-sizing: border-box !important; margin: 0 !important; padding: 3.5mm !important; gap: 3mm !important;
                  overflow: hidden !important; border: 1px solid #881337 !important; border-radius: 3mm !important;
                  background: linear-gradient(135deg,#fff 0%,#faf8f7 58%,#fff1f2 100%) !important; color: #171717 !important;
                  box-shadow: none !important; print-color-adjust: exact !important; -webkit-print-color-adjust: exact !important;
                }
                #wlc-member-card > div:first-child { display:flex !important; flex:1 1 auto !important; min-width:0 !important; height:100% !important; }
                #wlc-member-card > div:last-child { display:flex !important; flex:0 0 29mm !important; width:29mm !important; height:39mm !important; padding:1.5mm !important; }
                #wlc-member-card img { print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; }
                #wlc-member-card > div:first-child img { width:9mm !important; height:9mm !important; }
                #wlc-member-card > div:last-child img { width:25mm !important; height:25mm !important; }
                #wlc-member-card p, #wlc-member-card span { color:#171717 !important; }
                #wlc-member-card p.text-rose-900 { color:#881337 !important; }
                .print-card-section { border:0 !important; padding:0 !important; }
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
