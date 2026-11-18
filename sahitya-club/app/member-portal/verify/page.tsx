"use client";

import { useEffect, useState } from "react";

type Verification = { valid: boolean; memberId?: string; name?: string; status?: string; organization?: string; message?: string };
type EventOption = { id: string; title: string; date: string };

export default function VerifyMemberPage() {
  const [result, setResult] = useState<Verification | null>(null);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [eventId, setEventId] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  const [adminReady, setAdminReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") || "";
    if (!id) {
      setResult({ valid: false, message: "No member ID was provided." });
      setLoading(false);
      return;
    }
    Promise.all([
      fetch("/api/member-portal/verify?id=" + encodeURIComponent(id), { cache: "no-store" }).then(async response => ({ response, data: await response.json() })),
      fetch("/api/memberhub/activity", { cache: "no-store" }).then(async response => ({ response, data: await response.json() })).catch(() => null),
    ]).then(([verification, admin]) => {
      setResult(verification.data);
      if (admin?.response.ok) {
        setAdminReady(true);
        setEvents(admin.data.events || []);
        if (admin.data.events?.length) setEventId(admin.data.events[0].id);
      }
    }).catch(() => setResult({ valid: false, message: "Verification service is unavailable. Please try again." }))
      .finally(() => setLoading(false));
  }, []);

  async function checkIn() {
    if (!result?.memberId || !eventId) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/memberhub/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "attendance", memberId: result.memberId, eventId, status: attendanceStatus }),
      });
      const data = await response.json();
      setMessage(response.ok ? (data.message || "Attendance saved.") : (data.message || "Could not record attendance."));
    } catch {
      setMessage("Network error. Please retry.");
    } finally {
      setSaving(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6 text-stone-900"><section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-900">Willes Literary Club</p><h1 className="mt-3 text-3xl font-semibold">Member ID Verification</h1>{loading ? <p className="mt-8 text-stone-500">Checking official registry…</p> : result?.valid ? <><div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-800">✓</div><p className="mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-800">Verified active member</p><h2 className="mt-2 text-2xl font-semibold">{result.name}</h2><p className="mt-2 font-mono text-lg text-rose-900">{result.memberId}</p><p className="mt-2 text-sm text-stone-500">{result.organization}</p><p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">This ID matches an active member record. Contact details are not displayed.</p>{adminReady && <section className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/50 p-5 text-left"><p className="text-xs font-bold uppercase tracking-wider text-rose-900">Admin check-in</p><h3 className="mt-1 text-lg font-semibold">Record event attendance</h3><label className="mt-4 block text-sm font-medium">Published event<select value={eventId} onChange={e => setEventId(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white p-3">{events.map(event => <option key={event.id} value={event.id}>{event.title}{event.date ? " — " + event.date : ""}</option>)}</select></label><label className="mt-3 block text-sm font-medium">Status<select value={attendanceStatus} onChange={e => setAttendanceStatus(e.target.value)} className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white p-3"><option value="PRESENT">Present</option><option value="LATE">Late</option><option value="ABSENT">Absent</option><option value="EXCUSED">Excused</option></select></label><button disabled={saving || !eventId || !events.length} onClick={() => void checkIn()} className="mt-4 w-full rounded-xl bg-rose-900 p-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving attendance…" : "Confirm attendance"}</button>{!events.length && <p className="mt-3 text-sm text-amber-800">No published events available. Publish an event first.</p>}{message && <p role="status" className="mt-3 rounded-xl bg-white p-3 text-sm">{message}</p>}</section>}</> : <><div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-900">!</div><h2 className="mt-4 text-xl font-semibold">Could not verify this ID</h2><p className="mt-2 text-sm leading-6 text-stone-600">{result?.message || "The member ID is invalid or not active."}</p></>}<a href="/member-portal" className="mt-8 inline-block rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white">Member Portal</a></section></main>;
}
