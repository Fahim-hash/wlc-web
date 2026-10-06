"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  LogIn,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

type Member = {
  memberId: string;
  name: string;
  email: string | null;
  phone: string | null;
  batch: string | null;
  notes: string | null;
  status: "ACTIVE" | "INACTIVE";
  emailStatus: "PENDING" | "SENT" | "FAILED" | "NOT_APPLICABLE";
  emailSentAt: number | null;
  createdAt: number;
  whatsappUrl: string | null;
  whatsappText?: string | null;
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  batch: "",
  notes: "",
  notification: "none" as "none" | "email" | "whatsapp" | "both",
};

export default function MemberHubPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [gatewayKey, setGatewayKey] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [emailing, setEmailing] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [created, setCreated] = useState<Member | null>(null);

  async function loadMembers() {
    setLoading(true);
    const response = await fetch("/api/memberhub/members", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    const data = await response.json();
    setAuthenticated(true);
    setMembers(data.members || []);
    setLoading(false);
  }

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/memberhub/auth", { cache: "no-store" });
      const data = await response.json();
      setAuthenticated(Boolean(data.authenticated));
      if (data.authenticated) await loadMembers();
      else setLoading(false);
    })();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setNotice("");
    const response = await fetch("/api/memberhub/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gatewayKey }),
    });
    const data = await response.json();

    if (!response.ok) {
      setNotice(data.message || "Login failed.");
      return;
    }

    setGatewayKey("");
    setAuthenticated(true);
    await loadMembers();
  }

  async function logout() {
    await fetch("/api/memberhub/auth", { method: "DELETE" });
    setAuthenticated(false);
    setMembers([]);
  }

  async function addMember(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    setCreated(null);

    try {
      const response = await fetch("/api/memberhub/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setNotice(data.message || "Unable to add member.");
        return;
      }

      setCreated(data.member);
      setMembers((current) => [data.member, ...current]);
      setForm(emptyForm);

      if (data.email?.status === "sent") {
        setNotice(`Member ${data.member.memberId} added and confirmation email sent.`);
      } else if (data.email?.status === "failed") {
        setNotice(
          `Member ${data.member.memberId} added, but email failed: ${data.email.message}`
        );
      } else {
        setNotice(`Member ${data.member.memberId} added successfully.`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function sendEmail(memberId: string) {
    setEmailing(memberId);
    setNotice("");
    try {
      const response = await fetch(
        `/api/memberhub/members/${encodeURIComponent(memberId)}/email`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) {
        setNotice(data.message || "Email failed.");
        return;
      }

      setMembers((current) =>
        current.map((member) =>
          member.memberId === memberId
            ? { ...member, emailStatus: "SENT", emailSentAt: Date.now() }
            : member
        )
      );
      setNotice(`Confirmation email sent for ${memberId}.`);
    } finally {
      setEmailing(null);
    }
  }

  async function copyText(text: string, successMessage: string) {
    await navigator.clipboard.writeText(text);
    setNotice(successMessage);
  }

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter((member) =>
      [member.memberId, member.name, member.email, member.phone, member.batch]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [members, search]);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto flex min-h-[80vh] max-w-md items-center">
          <form
            onSubmit={login}
            className="w-full rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl backdrop-blur"
          >
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
              <ShieldCheck size={28} />
            </div>
            <p className="text-sm font-medium text-sky-300">WLC PRIVATE AREA</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Member Management</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Add registered members, create their Member IDs, and prepare their contact messages.
            </p>

            <label className="mt-7 block text-sm text-slate-300">Admin access key</label>
            <input
              type="password"
              value={gatewayKey}
              onChange={(event) => setGatewayKey(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none ring-sky-400/40 focus:ring-2"
              placeholder="Enter your private access key"
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <LogIn size={18} />
              Open Member Hub
            </button>

            {notice && (
              <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {notice}
              </p>
            )}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-300">WLC Member Hub</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Member Management</h1>
            <p className="mt-2 text-sm text-slate-400">
              Private registry for offline registrations, Member IDs and confirmations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadMembers}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium hover:bg-white/10"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium hover:bg-white/10"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300">
                <UserPlus size={21} />
              </div>
              <div>
                <h2 className="font-semibold">Add member</h2>
                <p className="text-xs text-slate-500">ID is generated automatically.</p>
              </div>
            </div>

            <form onSubmit={addMember} className="mt-6 space-y-4">
              <Field
                label="Full name"
                value={form.name}
                onChange={(value) => setForm((current) => ({ ...current, name: value }))}
                placeholder="Member's full name"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Field
                  label="Phone / WhatsApp"
                  value={form.phone}
                  onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
                  placeholder="01XXXXXXXXX"
                />
                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) => setForm((current) => ({ ...current, email: value }))}
                  placeholder="member@email.com"
                />
              </div>
              <label className="block">
                <span className="text-sm text-slate-300">Class / Year</span>
                <select
                  value={form.batch}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, batch: event.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-sky-400/40"
                >
                  <option value="" className="bg-slate-900">Select class / year</option>
                  <option value="Class 2" className="bg-slate-900">Class 2</option>
                  <option value="Class 3" className="bg-slate-900">Class 3</option>
                  <option value="Class 4" className="bg-slate-900">Class 4</option>
                  <option value="Class 5" className="bg-slate-900">Class 5</option>
                  <option value="Class 6" className="bg-slate-900">Class 6</option>
                  <option value="Class 7" className="bg-slate-900">Class 7</option>
                  <option value="Class 8" className="bg-slate-900">Class 8</option>
                  <option value="Class 9" className="bg-slate-900">Class 9</option>
                  <option value="Class 10" className="bg-slate-900">Class 10</option>
                  <option value="1st Year (College)" className="bg-slate-900">1st Year (College)</option>
                  <option value="2nd Year (College)" className="bg-slate-900">2nd Year (College)</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
                  placeholder="Optional internal note"
                />
              </label>

              <div>
                <span className="text-sm text-slate-300">Confirmation</span>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {[
                    ["none", "Add only"],
                    ["email", "Add + send email"],
                    ["whatsapp", "Add + WhatsApp"],
                    ["both", "Add + email + WhatsApp"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          notification: value as typeof current.notification,
                        }))
                      }
                      className={`rounded-2xl border px-3 py-2.5 text-left text-sm transition ${
                        form.notification === value
                          ? "border-sky-300/50 bg-sky-400/10 text-sky-200"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.06]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  WhatsApp mode prepares a pre-filled message. It does not send automatically through a personal WhatsApp account.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-300 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60"
              >
                <Plus size={18} />
                {submitting ? "Adding…" : "Add Member"}
              </button>

              {created && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-semibold">Member created</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-black/20 px-3 py-2.5">
                    <code className="text-base font-semibold tracking-wide">{created.memberId}</code>
                    <button
                      onClick={() => copyText(created.memberId, "Member ID copied.")}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                      title="Copy Member ID"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {created.whatsappUrl && (
                      <a
                        href={created.whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-400/15 px-3 py-2 text-sm text-emerald-200"
                      >
                        <MessageCircle size={16} />
                        Open WhatsApp
                      </a>
                    )}
                    {created.whatsappText && (
                      <button
                        onClick={() => copyText(created.whatsappText!, "WhatsApp message copied.")}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm text-slate-300"
                      >
                        <Copy size={16} />
                        Copy WhatsApp Text
                      </button>
                    )}
                  </div>
                </div>
              )}

              {notice && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-5 text-slate-300">
                  {notice}
                </div>
              )}
            </form>
          </section>

          <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-xl">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Users size={22} className="text-sky-300" />
                  <h2 className="font-semibold">Registered members</h2>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">
                    {members.length}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Private records only. These are not exposed through the public CMS.
                </p>
              </div>
              <label className="relative block xl:w-80">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
                  placeholder="Search name, ID, email, phone…"
                />
              </label>
            </div>

            <div className="mt-6 overflow-x-auto">
              {loading ? (
                <div className="py-16 text-center text-sm text-slate-500">Loading members…</div>
              ) : filteredMembers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-slate-500">
                  No members found.
                </div>
              ) : (
                <table className="w-full min-w-[880px] border-separate border-spacing-y-2 text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Member</th>
                      <th className="px-3 py-2">Contact</th>
                      <th className="px-3 py-2">Batch</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.memberId} className="bg-white/[0.035]">
                        <td className="rounded-l-2xl px-3 py-3.5">
                          <div className="font-medium text-white">{member.name}</div>
                          <code className="text-xs text-sky-300">{member.memberId}</code>
                        </td>
                        <td className="px-3 py-3.5 text-slate-400">{member.phone || "—"}</td>
                        <td className="px-3 py-3.5 text-slate-400">{member.batch || "—"}</td>
                        <td className="px-3 py-3.5">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                            member.emailStatus === "SENT"
                              ? "bg-emerald-400/10 text-emerald-200"
                              : member.emailStatus === "FAILED"
                                ? "bg-red-400/10 text-red-200"
                                : "bg-white/10 text-slate-400"
                          }`}>
                            {member.email ? member.emailStatus : "No email"}
                          </span>
                          {member.email && <div className="mt-1 max-w-[220px] truncate text-xs text-slate-500">{member.email}</div>}
                        </td>
                        <td className="rounded-r-2xl px-3 py-3.5">
                          <div className="flex flex-wrap gap-2">
                            {member.email && (
                              <button
                                onClick={() => sendEmail(member.memberId)}
                                disabled={emailing === member.memberId}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-2.5 py-2 text-xs text-slate-300 hover:bg-white/10 disabled:opacity-60"
                              >
                                <Mail size={14} />
                                {emailing === member.memberId ? "Sending…" : member.emailStatus === "SENT" ? "Resend" : "Send Email"}
                              </button>
                            )}
                            {member.whatsappUrl && (
                              <a
                                href={member.whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400/10 px-2.5 py-2 text-xs text-emerald-200"
                              >
                                <MessageCircle size={14} />
                                WhatsApp
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/40"
      />
    </label>
  );
}
