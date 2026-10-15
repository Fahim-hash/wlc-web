"use client";

import { useEffect, useState } from "react";

export default function ActivatePage() {
  const [token, setToken] = useState("");
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") || "");
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) { setMessage("This activation link is missing its token. Open the full link from your WLC email."); return; }
    if (password !== again) { setMessage("Passwords do not match."); return; }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/member-portal/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, username: uid, password }),
      });
      const data = await response.json();
      if (!response.ok) { setMessage(data.message || "Activation failed. Please try again."); return; }
      setMessage("Account activated successfully. You can now sign in with your new UID and password.");
      setPassword("");
      setAgain("");
    } catch {
      setMessage("Network error. Please check your internet and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="min-h-screen bg-stone-50 p-6 text-stone-900"><form onSubmit={submit} className="mx-auto mt-12 max-w-md space-y-4 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-rose-900">Willes Literary Club</p><h1 className="text-3xl font-semibold">Activate Member Portal</h1><p className="text-sm leading-6 text-stone-600">Choose a memorable UID (4–20 English letters, numbers or underscores) and a password of at least 10 characters.</p><label className="block text-sm font-medium">Choose UID<input value={uid} onChange={event => setUid(event.target.value)} pattern="[A-Za-z0-9_]{4,20}" minLength={4} maxLength={20} required autoComplete="username" placeholder="e.g. wlc_gen_3" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3" /></label><label className="block text-sm font-medium">Create password<input type="password" value={password} onChange={event => setPassword(event.target.value)} minLength={10} maxLength={128} required autoComplete="new-password" placeholder="At least 10 characters" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3" /></label><label className="block text-sm font-medium">Confirm password<input type="password" value={again} onChange={event => setAgain(event.target.value)} minLength={10} maxLength={128} required autoComplete="new-password" placeholder="Enter the password again" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3" /></label><button disabled={busy || !token} className="w-full rounded-xl bg-rose-900 p-3 font-semibold text-white disabled:opacity-60">{busy ? "Activating…" : "Activate account"}</button>{message && <p role="status" className="rounded-xl bg-stone-100 p-3 text-sm">{message}</p>}<a href="/member-portal" className="block text-center text-sm text-rose-900 underline">Back to login</a></form></main>;
}
