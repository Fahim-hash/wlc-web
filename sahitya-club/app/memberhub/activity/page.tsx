"use client";

import { useEffect, useState } from "react";

type MemberOption = { memberId: string; name: string; email: string | null };
type EventOption = { id: string; title: string; date: string };

export default function MemberActivityAdminPage() {
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [memberId, setMemberId] = useState("");
  const [eventId, setEventId] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  const [certificateTitle, setCertificateTitle] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [authorized, setAuthorized] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/memberhub/activity", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401) { setAuthorized(false); return; }
      if (!response.ok) { setMessage(data.message || "Could not load admin tools."); return; }
      setAuthorized(true);
      setMembers(data.members || []);
      setEvents(data.events || []);
      if (!memberId && data.members?.length) setMemberId(data.members[0].memberId);
      if (!eventId && data.events?.length) setEventId(data.events[0].id);
    } catch {
      setMessage("Network error while loading activity tools.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function submit(action: "attendance" | "certificate") {
    setBusy(true);
    setMessage("");
    try {
      const payload = action === "attendance"
        ? { action, memberId, eventId, status: attendanceStatus }
        : { action, memberId, title: certificateTitle, downloadUrl: certificateUrl };
      const response = await fetch("/api/memberhub/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message || "Could not save this record."); return; }
      setMessage(data.message || "Saved successfully.");
      if (action === "certificate") { setCertificateTitle(""); setCertificateUrl(""); }
    } catch {
      setMessage("Network error. Please retry.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6 text-stone-600">Loading activity tools…</main>;

  return <main className="min-h-screen bg-stone-50 p-5 text-stone-900 sm:p-8"><div className="mx-auto max-w-5xl"><header className="rounded-3xl bg-stone-900 p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-200">Willes Literary Club · Admin</p><h1 className="mt-3 text-3xl font-semibold">Attendance & Certificates</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-stone-300">Record event attendance and issue member certificates. Records are connected to the member’s personal portal.</p></header>{!authorized ? <section className="mt-5 rounded-2xl border bg-white p-6"><h2 className="text-xl font-semibold">Admin sign-in required</h2><p className="mt-2 text-sm text-stone-600">Open Member Hub and sign in with your admin access key first. Then return here.</p><a href="/memberhub" className="mt-4 inline-block rounded-xl bg-rose-900 px-5 py-3 text-sm font-semibold text-white">Open Member Hub</a></section> : <><div className="mt-5 rounded-2xl border border-stone-200 bg-white p-6"><h2 className="text-xl font-semibold">Select member</h2><label className="mt-4 block text-sm font-medium">Active member<select value={memberId} onChange={e=>setMemberId(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-stone-300 p-3">{members.map(member=><option key={member.memberId} value={member.memberId}>{member.name} — {member.memberId}</option>)}</select></label><p className="mt-2 text-xs text-stone-500">{members.length} active member(s) available</p></div><div className="mt-5 grid gap-5 md:grid-cols-2"><section className="rounded-2xl border border-stone-200 bg-white p-6"><h2 className="text-xl font-semibold">Record attendance</h2><p className="mt-2 text-sm leading-6 text-stone-600">Saving again for the same member and event updates the existing record instead of creating a duplicate.</p><label className="mt-5 block text-sm font-medium">Published event<select value={eventId} onChange={e=>setEventId(e.target.value)} required className="mt-1.5 w-full rounded-xl border border-stone-300 p-3">{events.map(event=><option key={event.id} value={event.id}>{event.title}{event.date ? " — "+event.date : ""}</option>)}</select></label><label className="mt-4 block text-sm font-medium">Attendance status<select value={attendanceStatus} onChange={e=>setAttendanceStatus(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-300 p-3"><option value="PRESENT">Present</option><option value="LATE">Late</option><option value="ABSENT">Absent</option><option value="EXCUSED">Excused</option></select></label><button disabled={busy||!memberId||!eventId} onClick={()=>void submit("attendance")} className="mt-5 w-full rounded-xl bg-rose-900 p-3 font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save attendance"}</button>{!events.length&&<p className="mt-3 text-sm text-amber-800">No published events are available. Publish an event in the WLC CMS first.</p>}</section><section className="rounded-2xl border border-stone-200 bg-white p-6"><h2 className="text-xl font-semibold">Issue certificate</h2><p className="mt-2 text-sm leading-6 text-stone-600">The system creates a unique certificate ID. Add a PDF or certificate page URL if it is already hosted.</p><label className="mt-5 block text-sm font-medium">Certificate title<input value={certificateTitle} onChange={e=>setCertificateTitle(e.target.value)} required minLength={2} maxLength={120} placeholder="e.g. Best Delegate — EmissaryMUN" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3"/></label><label className="mt-4 block text-sm font-medium">Certificate URL (optional)<input value={certificateUrl} onChange={e=>setCertificateUrl(e.target.value)} placeholder="https://… or /certificates/…" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3"/></label><button disabled={busy||!memberId||certificateTitle.trim().length<2} onClick={()=>void submit("certificate")} className="mt-5 w-full rounded-xl bg-stone-900 p-3 font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Issue certificate"}</button></section></div></>}{message&&<p role="status" className="mt-5 rounded-xl border border-stone-200 bg-white p-4 text-sm">{message}</p>}<footer className="flex flex-wrap gap-4 py-7 text-sm"><a href="/memberhub" className="font-semibold text-rose-900 underline">← Member Hub</a><button onClick={()=>void load()} className="font-semibold text-rose-900 underline">Refresh data</button></footer></div></main>;
}
