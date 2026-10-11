"use client";

import { useCallback, useEffect, useState } from "react";

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
      setMember(response.ok && data.authenticated ? data.member : null);
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
              <input value={uid} onChange={event => setUid(event.target.value)} required maxLength={20} autoComplete="username" placeholder="e.g. fahim_01" className="mt-1.5 w-full rounded-xl border border-stone-300 p-3 outline-none focus:border-rose-800 focus:ring-2 focus:ring-rose-100" />
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
            <section className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <h2 className="text-xl font-semibold">Personal information</h2>
              <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <div><dt className="text-sm text-stone-500">Full name</dt><dd className="mt-1 font-medium">{member.name || "Not provided"}</dd></div>
                <div><dt className="text-sm text-stone-500">Registered email</dt><dd className="mt-1 break-words font-medium">{member.email || "Not provided"}</dd></div>
                <div><dt className="text-sm text-stone-500">Phone</dt><dd className="mt-1 font-medium">{member.phone || "Not provided"}</dd></div>
                <div><dt className="text-sm text-stone-500">Class / Year</dt><dd className="mt-1 font-medium">{member.batch || "Not provided"}</dd></div>
              </dl>
            </section>
            <section className="mt-5 rounded-2xl border border-stone-200 bg-white p-6 sm:p-7">
              <h2 className="text-xl font-semibold">Change your UID</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">Your official Member ID never changes. You can update your personal sign-in UID after confirming your current password.</p>
              <form onSubmit={changeUid} className="mt-4 grid gap-3 sm:grid-cols-3">
                <input value={nextUsername} onChange={event => setNextUsername(event.target.value)} required minLength={4} maxLength={20} pattern="[A-Za-z0-9_]{4,20}" autoComplete="username" placeholder="New UID (4–20 chars)" className="rounded-xl border border-stone-300 p-3 outline-none focus:border-rose-800" />
                <input value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required type="password" autoComplete="current-password" placeholder="Current password" className="rounded-xl border border-stone-300 p-3 outline-none focus:border-rose-800" />
                <button disabled={busy} className="rounded-xl bg-rose-900 p-3 font-semibold text-white disabled:opacity-60">{busy ? "Please wait…" : "Update UID"}</button>
              </form>
              <p className="mt-2 text-xs text-stone-500">UIDs are unique and can contain English letters, numbers and underscores only.</p>
            </section>
            <section className="mt-5 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-stone-200 bg-white p-6"><h2 className="font-semibold">Digital membership card</h2><p className="mt-2 text-sm leading-6 text-stone-600">Your official Member ID is shown above. A verified QR card can be enabled once the club’s member-verification endpoint is connected.</p></article>
              <article className="rounded-2xl border border-stone-200 bg-white p-6"><h2 className="font-semibold">Club updates and activities</h2><p className="mt-2 text-sm leading-6 text-stone-600">Events, attendance, certificates and announcements will appear here after the club’s admin data sources are connected.</p></article>
            </section>
            {message && <p role="status" className="mt-4 rounded-xl bg-stone-100 p-3 text-sm">{message}</p>}
          </>
        )}
        <footer className="py-8 text-center text-xs text-stone-500">Willes Literary Club · Member Portal</footer>
      </div>
    </main>
  );
}
