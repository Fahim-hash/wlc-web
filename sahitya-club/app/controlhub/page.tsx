// app/controlhub/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, LayoutDashboard, LogOut, FileText, PlusCircle, ArrowRight } from "lucide-react";

export default function ControlHubPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gatewayPassword, setGatewayPassword] = useState("");
  const [gatewayError, setGatewayError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeAdmin, setActiveAdmin] = useState<string | null>(null);
  const [adminUid, setAdminUid] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [adminError, setAdminError] = useState("");

  // ১ লেয়ার ও ২ লেয়ার সেশন ক্যাশ চেক
  useEffect(() => {
    const cachedGate = localStorage.getItem("wlc_gate_session");
    const cachedAdmin = localStorage.getItem("wlc_admin_active");
    if (cachedGate === "session_valid_2026_authorized") {
      setIsAuthenticated(true);
    }
    if (cachedAdmin) {
      setActiveAdmin(cachedAdmin);
    }
  }, []);

  // ১ম লেয়ার: গেটওয়ে এপিআই চেক
  const handleGatewayLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setGatewayError("");
    try {
      const res = await fetch("/api/controlhub-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gatewayKey: gatewayPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("wlc_gate_session", data.token);
      } else {
        setGatewayError(data.message || "ভুল গেটওয়ে অ্যাক্সেস কি!");
      }
    } catch {
      setGatewayError("নেটওয়ার্ক ভেরিফিকেশন ফেইল্ড!");
    } finally {
      setAuthLoading(false);
    }
  };

  // ২য় লেয়ার: অ্যাডমিন ইউজার ভেরিফিকেশন
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    const admins: { [key: string]: string } = {
      "fahim_admin": "202699",
      "willian_mod": "112233",
    };

    if (admins[adminUid] && admins[adminUid] === adminPin) {
      setActiveAdmin(adminUid);
      localStorage.setItem("wlc_admin_active", adminUid);
    } else {
      setAdminError("ভুল অ্যাডমিন আইডি অথবা সিক্রেট পিন ভাই!");
    }
  };

  const handleFullLogout = () => {
    localStorage.removeItem("wlc_gate_session");
    localStorage.removeItem("wlc_admin_active");
    setIsAuthenticated(false);
    setActiveAdmin(null);
    setGatewayPassword("");
    setAdminUid("");
    setAdminPin("");
  };

  // SCREEN RENDERING
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <form onSubmit={handleGatewayLogin} className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-red-950/40 border border-red-900/50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🛡️</div>
            <h1 className="text-xl font-bold text-neutral-100">Gateway Lock</h1>
            <p className="text-xs text-neutral-400 mt-1">উইলস সাহিত্য ক্লাব সেন্ট্রাল সিকিউরিটি</p>
          </div>
          {gatewayError && <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-xl text-center">{gatewayError}</p>}
          <div>
            <input type="password" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 font-mono" placeholder="গেটওয়ে কি (Key)" value={gatewayPassword} onChange={(e) => setGatewayPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={authLoading} className="w-full bg-red-700 hover:bg-red-600 text-white font-semibold text-xs py-3.5 rounded-xl transition-all">
            {authLoading ? "ভেরিফাইং..." : "গেটওয়ে আনলক করুন ➔"}
          </button>
        </form>
      </main>
    );
  }

  if (!activeAdmin) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <form onSubmit={handleAdminVerify} className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">🔐</div>
            <h1 className="text-xl font-bold text-neutral-100">Admin Verification</h1>
          </div>
          {adminError && <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-xl text-center">{adminError}</p>}
          <div className="space-y-4">
            <input type="text" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600" placeholder="অ্যাডমিন UID" value={adminUid} onChange={(e) => setAdminUid(e.target.value)} />
            <input type="password" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-600 font-mono" placeholder="সিক্রেট পিন" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={handleFullLogout} className="flex-1 bg-neutral-800 text-neutral-300 font-medium text-xs py-3 rounded-xl">পিছনে যান</button>
            <button type="submit" className="flex-1 bg-emerald-600 text-white font-semibold text-xs py-3 rounded-xl">প্রবেশ করুন</button>
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col md:flex-row">
      {/* বাম পাশের সাইডবার */}
      <aside className="w-full md:w-64 bg-neutral-900 border-b md:border-b-0 md:border-r border-neutral-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider text-sm">
              <ShieldCheck className="w-5 h-5" /> WLC SYSTEM
            </div>
            <p className="text-[10px] text-neutral-500 mt-1 uppercase font-mono">Admin: {activeAdmin}</p>
          </div>
          <nav className="space-y-2">
            <a href="/controlhub" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold bg-neutral-800 text-white border-l-4 border-emerald-500">
              <LayoutDashboard className="w-4 h-4" /> মেইন ড্যাশবোর্ড
            </a>
            <a href="/controlhub/written-approval" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200">
              <FileText className="w-4 h-4" /> লেখা অ্যাপ্রুভাল
            </a>
            {/* 🔗 ফিক্সড: সাইডবারে শব্দকোষ কন্ট্রোল প্যানেলের লিংক যুক্ত করা হয়েছে */}
            <a href="/controlhub/shobdo-add" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200">
              <PlusCircle className="w-4 h-4" /> শব্দকোষ কন্ট্রোল
            </a>
          </nav>
        </div>
        <button onClick={handleFullLogout} className="w-full flex items-center justify-center gap-2 bg-neutral-800/60 text-neutral-400 hover:text-red-400 border border-neutral-800 py-2.5 rounded-xl text-xs font-semibold">
          <LogOut className="w-3.5 h-3.5" /> সিস্টেম লগআউট
        </button>
      </aside>

      {/* ড্যাশবোর্ড কমান্ড ডিরেক্টরি */}
      <section className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold font-serif text-white mb-2">🕹️ ডিরেক্টরি কমান্ড হাব</h2>
          <p className="text-neutral-400 text-sm">উইলস সাহিত্য ক্লাবের যাবতীয় সিকিউরড ইন্টারনাল পেজের এক্সেস রুট সমূহ:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* মডিউল ১: লেখা অ্যাপ্রুভাল */}
            <a href="/controlhub/written-approval" className="p-5 bg-neutral-950 border border-neutral-800 hover:border-emerald-600 rounded-2xl transition-all group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded-xl flex items-center justify-center text-lg mb-4">📝</div>
                <h3 className="text-sm font-bold text-white mb-1">Written Approval Panel</h3>
                <p className="text-xs text-neutral-400">পেন্ডিং গল্প, কবিতা ও রচনার কোয়ালিটি কন্ট্রোল ও ডাটাবেজ মডারেশন ডেস্ক।</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-all">
                প্যানেলে ঢুকুন <ArrowRight className="w-3 h-3" />
              </div>
            </a>

            {/* মডিউল ২: শব্দ যোগ প্যানেল */}
            {/* 🔗 ফিক্সড: আগের ডেড অ্যালার্ট বোতামটি ফেলে ডিরেক্ট <a> এঙ্কর ট্যাগ লিংকে কনভার্ট করা হয়েছে */}
            <a href="/controlhub/shobdo-add" className="p-5 bg-neutral-950 border border-neutral-800 hover:border-emerald-600 rounded-2xl transition-all group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 rounded-xl flex items-center justify-center text-lg mb-4">✍️</div>
                <h3 className="text-sm font-bold text-white mb-1">Word Management Hub</h3>
                <p className="text-xs text-neutral-400">প্রতিদিনের কুইজ প্রতিযোগিতার জন্য এআই জেনারেটেড ও ম্যানুয়াল শব্দ ভাণ্ডার আপলোডার হাব।</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold mt-4 opacity-0 group-hover:opacity-100 transition-all">
                প্যানেলে ঢুকুন <ArrowRight className="w-3 h-3" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
