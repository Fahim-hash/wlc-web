"use client";

import { useEffect, useState } from "react";

type Verification = { valid: boolean; memberId?: string; name?: string; status?: string; organization?: string; message?: string };

export default function VerifyMemberPage() {
  const [result, setResult] = useState<Verification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") || "";
    if (!id) {
      setResult({ valid: false, message: "No member ID was provided." });
      setLoading(false);
      return;
    }
    fetch("/api/member-portal/verify?id=" + encodeURIComponent(id), { cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        setResult(data);
      })
      .catch(() => setResult({ valid: false, message: "Verification service is unavailable. Please try again." }))
      .finally(() => setLoading(false));
  }, []);

  return <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6 text-stone-900"><section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-900">Willes Literary Club</p><h1 className="mt-3 text-3xl font-semibold">Member ID Verification</h1>{loading ? <p className="mt-8 text-stone-500">Checking official registry…</p> : result?.valid ? <><div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-800">✓</div><p className="mt-5 text-sm font-semibold uppercase tracking-widest text-emerald-800">Verified active member</p><h2 className="mt-2 text-2xl font-semibold">{result.name}</h2><p className="mt-2 font-mono text-lg text-rose-900">{result.memberId}</p><p className="mt-2 text-sm text-stone-500">{result.organization}</p><p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">This ID matches an active record in the Willes Literary Club registry. This page does not display the member’s contact details.</p></> : <><div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl text-rose-900">!</div><h2 className="mt-4 text-xl font-semibold">Could not verify this ID</h2><p className="mt-2 text-sm leading-6 text-stone-600">{result?.message || "The member ID is invalid or not active."}</p></>}<a href="/member-portal" className="mt-8 inline-block rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white">Member Portal</a></section></main>;
}
