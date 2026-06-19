// app/controlhub/written-approval/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { ShieldCheck, LayoutDashboard, LogOut, FileText, RefreshCw } from "lucide-react";

interface Writing {
  id: string;
  title: string;
  category: string;
  content: string;
  penName: string;
}

export default function WrittenApprovalPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 🛡️ সিকিউরিটি লক: ড্যাশবোর্ডে লগইন না থাকলে এই পেজ এক্সেস করতে দেবে না
  useEffect(() => {
    const cachedGate = localStorage.getItem("wlc_gate_session");
    const cachedAdmin = localStorage.getItem("wlc_admin_active");

    if (cachedGate === "session_valid_2026_authorized" && cachedAdmin) {
      setIsAdmin(true);
      setAdminUser(cachedAdmin);
      fetchPendingWritings();
    } else {
      // লগইন না থাকলে সোজা মেইন ড্যাশবোর্ডে কিক আউট করবে
      window.location.href = "/controlhub";
    }
  }, []);

  const fetchPendingWritings = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "writings"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      const pendingList: Writing[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        pendingList.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          content: data.content,
          penName: data.penName || "অজ্ঞাতনামা",
        });
      });
      setWritings(pendingList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await updateDoc(doc(db, "writings", id), { status: "approved" });
      setWritings(writings.filter((w) => w.id !== id));
    } catch {
      alert("Approve করতে সমস্যা হয়েছে ভাই।");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("লেখাটি চিরতরে ডিলিট করতে চাও ভাই?")) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "writings", id));
      setWritings(writings.filter((w) => w.id !== id));
    } catch {
      alert("ডিলিট করতে সমস্যা হয়েছে।");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("wlc_gate_session");
    localStorage.removeItem("wlc_admin_active");
    window.location.href = "/controlhub";
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-mono text-xs animate-pulse">
        সিকিউরিটি গেটওয়ে চেকিং...
      </div>
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
            <p className="text-[10px] text-neutral-500 mt-1 uppercase font-mono">Admin: {adminUser}</p>
          </div>
          <nav className="space-y-2">
            <a href="/controlhub" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200">
              <LayoutDashboard className="w-4 h-4" /> মেইন ড্যাশবোর্ড
            </a>
            <a href="/controlhub/written-approval" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold bg-neutral-800 text-white border-l-4 border-emerald-500">
              <FileText className="w-4 h-4" /> লেখা অ্যাপ্রুভাল
            </a>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-neutral-800/60 text-neutral-400 hover:text-red-400 border border-neutral-800 py-2.5 rounded-xl text-xs font-semibold">
          <LogOut className="w-3.5 h-3.5" /> সিস্টেম লগআউট
        </button>
      </aside>

      {/* রাইট ওয়ার্কস্পেস */}
      <section className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5 mb-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white">পেন্ডিং লেখা মডারেশন ডেস্ক</h2>
            <p className="text-xs text-neutral-400 mt-1">মেম্বারদের সাবমিট করা লেখার ডাটাবেজ কোয়ালিটি কন্ট্রোল হাব।</p>
          </div>
          <div className="text-xs font-semibold bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl flex items-center gap-4">
            <span>কিউ স্ট্যাটাস: <strong className="text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">{writings.length} টি বাকি</strong></span>
            <button onClick={fetchPendingWritings} className="text-emerald-400 hover:underline flex items-center gap-1 font-bold">
              <RefreshCw className="w-3 h-3" /> রিফ্রেশ করুন
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-neutral-500 font-mono animate-pulse">ফায়ারস্টোর ডাটা সিঙ্ক হচ্ছে ভাই...</div>
        ) : writings.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <span className="text-2xl block mb-2">⚡</span>
            <p className="text-neutral-400 text-sm font-medium">কোনো পেন্ডিং লেখা জমা নেই ভাই! অল ক্লিয়ার।</p>
          </div>
        ) : (
          <div className="space-y-6">
            {writings.map((post) => (
              <div key={post.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-850 border border-neutral-800 text-neutral-300 px-2.5 py-1 rounded-full">
                      {post.category === "poetry" ? "কবিতা" : post.category === "story" ? "ছোটগল্প" : "প্রবন্ধ"}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">কলমে: <strong className="text-emerald-400 font-serif">{post.penName}</strong></span>
                  </div>
                  <h2 className="text-lg font-bold text-white font-serif">{post.title}</h2>
                  <p className="text-neutral-300 text-sm leading-relaxed bg-neutral-950 border border-neutral-850 p-4 rounded-xl whitespace-pre-line max-h-60 overflow-y-auto font-mono">
                    {post.content}
                  </p>
                </div>

                <div className="flex md:flex-col gap-3 w-full md:w-36 flex-shrink-0">
                  <button onClick={() => handleApprove(post.id)} disabled={actionLoading !== null} className="flex-1 bg-emerald-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-40">
                    {actionLoading === post.id ? "প্রсеসিং..." : "Approve ✓"}
                  </button>
                  <button onClick={() => handleDelete(post.id)} disabled={actionLoading !== null} className="flex-1 bg-neutral-950 border border-red-900/40 hover:bg-red-950/20 text-red-400 font-bold text-xs py-3 rounded-xl transition-all disabled:opacity-40">
                    Reject ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
