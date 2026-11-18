"use client";

import { useCallback, useEffect, useState } from "react";

type Submission = { id: string; title: string; category: string; status: string; date: string; createdAt: string; penName: string };
const categoryLabels: Record<string, string> = { poetry: "কবিতা", story: "ছোটগল্প", essay: "প্রবন্ধ" };
const statusLabels: Record<string, string> = { pending: "Review pending", approved: "Approved", published: "Published", rejected: "Needs revision" };

export default function MemberWritingPage() {
  const [form, setForm] = useState({ title: "", category: "poetry", content: "", penName: "" });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/member-portal/writings", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load submissions.");
      setSubmissions(data.submissions || []);
    } catch (e) {
      setError(true);
      setMessage(e instanceof Error ? e.message : "Could not load submissions.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setError(false);
    try {
      const response = await fetch("/api/member-portal/writings", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Submission failed.");
      setMessage("লেখাটি সফলভাবে জমা হয়েছে। এখন থেকে এই পোর্টালেই submission status দেখতে পারবে।");
      setForm({ title: "", category: "poetry", content: "", penName: "" });
      await load();
    } catch (e) {
      setError(true); setMessage(e instanceof Error ? e.message : "Submission failed.");
    } finally { setBusy(false); }
  }

  return <main className="min-h-screen bg-stone-50 p-5 text-stone-900 sm:p-8"><div className="mx-auto max-w-5xl">
    <a href="/member-portal" className="text-sm font-semibold text-rose-900 underline">← Back to Member Portal</a>
    <header className="mt-5 rounded-3xl bg-stone-900 p-7 text-white sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-200">Willes Literary Club</p><h1 className="mt-3 text-3xl font-semibold">Writing Desk</h1><p className="mt-2 text-sm leading-6 text-stone-300">Submit your poems, stories or essays and track every submission from your member account.</p></header>
    <form onSubmit={submit} className="mt-5 space-y-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
      <h2 className="text-xl font-semibold">Submit a new writing</h2>
      {message && <p role="status" className={`rounded-xl p-3 text-sm ${error ? "bg-rose-50 text-rose-800" : "bg-emerald-50 text-emerald-800"}`}>{message}</p>}
      <label className="block text-sm font-medium">Title *<input required minLength={2} maxLength={100} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1.5 w-full rounded-xl border border-stone-300 p-3" placeholder="Give your writing a title"/></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1.5 w-full rounded-xl border border-stone-300 p-3"><option value="poetry">কবিতা (Poetry)</option><option value="story">ছোটগল্প (Short story)</option><option value="essay">প্রবন্ধ (Essay)</option></select></label><label className="block text-sm font-medium">Pen name (optional)<input maxLength={50} value={form.penName} onChange={e=>setForm({...form,penName:e.target.value})} className="mt-1.5 w-full rounded-xl border border-stone-300 p-3" placeholder="অজ্ঞাতনামা"/></label></div>
      <label className="block text-sm font-medium">Your writing *<textarea required minLength={10} maxLength={5000} rows={10} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} className="mt-1.5 w-full resize-y rounded-xl border border-stone-300 p-3 leading-7" placeholder="Write your poem, story or essay here…"/></label>
      <p className="text-right text-xs text-stone-500">{form.content.length}/5000 characters</p>
      <button disabled={busy} className="w-full rounded-xl bg-rose-900 p-3 font-semibold text-white disabled:opacity-60">{busy ? "Submitting…" : "Submit for review ✒️"}</button>
    </form>
    <section className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">My submissions</h2><span className="rounded-full bg-stone-100 px-3 py-1 text-xs">{submissions.length} total</span></div>
      {loading ? <p className="mt-4 text-sm text-stone-500">Loading submissions…</p> : submissions.length ? <div className="mt-4 space-y-3">{submissions.map(item=><article key={item.id} className="rounded-xl border border-stone-200 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-xs text-stone-500">{categoryLabels[item.category] || item.category} · {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Date unavailable")}{item.penName ? " · "+item.penName : ""}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status==="published"||item.status==="approved" ? "bg-emerald-50 text-emerald-800" : item.status==="rejected" ? "bg-rose-50 text-rose-800" : "bg-amber-50 text-amber-800"}`}>{statusLabels[item.status] || item.status}</span></div></article>)}</div> : <p className="mt-4 text-sm text-stone-500">You have not submitted any writing through your member account yet.</p>}
    </section><footer className="py-8 text-center text-xs text-stone-500">Willes Literary Club · Writing Desk</footer>
  </div></main>;
}
