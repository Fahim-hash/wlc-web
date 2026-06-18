// app/controlhub/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // 👈 রুট অ্যালিয়াস ব্যবহার করলাম যাতে পাথ নিয়ে কোনো প্যারা না থাকে
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore/lite"; // 👈 ফায়ারস্টোর লাইট মডিউল (সবচেয়ে ইম্পর্ট্যান্ট ফিক্স!)

interface Writing {
  id: string;
  title: string;
  category: string;
  content: string;
  penName: string;
}

export default function ControlHubPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");

  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 🛡️ কড়া সিকিউরিটি ট্রিকস: কনসোল ও ইনস্পেক্ট লক করা
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const interval = setInterval(() => {
      (() => { debugger; })();
    }, 100);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // 🔑 গেটওয়ে পাসওয়ার্ড চেক
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "WLC_Control_2026") { 
      setIsAuthenticated(true);
      setPassError("");
      fetchPendingWritings();
    } else {
      setPassError("ভুল পাসওয়ার্ড ভাই! প্রবেশাধিকার সংরক্ষিত।");
    }
  };

  // 🔄 ফায়ারবেস থেকে পেন্ডিং লেখাগুলো পুল করা
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
    } catch (err: any) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve লজিক
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const docRef = doc(db, "writings", id);
      await updateDoc(docRef, { status: "approved" });
      setWritings(writings.filter((w) => w.id !== id));
    } catch (err) {
      alert("Approve করতে সমস্যা হয়েছে ভাই।");
    } finally {
      setActionLoading(null);
    }
  };

  // ❌ Reject/Delete লজিক
  const handleDelete = async (id: string) => {
    if (!confirm("লেখাটি ডাটাবেজ থেকে চিরতরে ডিলিট করতে চাও ভাই?")) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "writings", id));
      setWritings(writings.filter((w) => w.id !== id));
    } catch (err) {
      alert("ডিলিট করতে সমস্যা হয়েছে।");
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xl max-w-sm w-full space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">🛡️</div>
            <h1 className="text-xl font-bold font-serif text-gray-900">Control Hub Access</h1>
            <p className="text-xs text-gray-400 mt-1">উইলস সাহিত্য ক্লাব সেন্ট্রাল ম্যানেজমেন্ট</p>
          </div>

          {passError && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl font-medium text-center">{passError}</p>}

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">প্যানেল অ্যাক্সেস কি (Key)</label>
            <input 
              type="password" 
              className="w-full bg-stone-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-900 font-mono"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-stone-950 text-white font-semibold text-xs py-3.5 rounded-xl hover:bg-rose-900 transition-colors tracking-wide">
            হাব এন্ট্রি মারো ➔
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 p-6 md:p-12 max-w-5xl mx-auto">
      <header className="border-b border-gray-200 pb-6 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono bg-stone-900 text-stone-100 px-2.5 py-1 rounded-md uppercase tracking-widest">Central System</span>
          <h1 className="text-3xl font-bold font-serif text-gray-900 mt-2">Control Hub Panel</h1>
          <p className="text-gray-500 text-sm mt-1">মেম্বারদের সাবমিট করা লেখার ডাটাবেজ মডারেশন ডেস্ক।</p>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="text-xs font-semibold text-stone-500 bg-white border border-gray-200 hover:bg-stone-50 px-4 py-2 rounded-xl transition-colors self-start sm:self-center">
          লগআউট ✕
        </button>
      </header>

      <div className="flex items-center justify-between mb-6 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <span className="text-sm font-medium">
          পেন্ডিং ডাটা কিউ (Queue): <strong className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{writings.length} টি</strong>
        </span>
        <button onClick={fetchPendingWritings} className="text-xs font-bold text-stone-900 hover:underline flex items-center gap-1">
          🔄 রিফ্রেশ ফিড
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-gray-400 font-mono animate-pulse">ফায়ারস্টোর সিঙ্ক হচ্ছে ভাই...</div>
      ) : writings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <span className="text-xl block mb-2">⚡</span>
          <p className="text-gray-500 text-sm font-medium">কোনো পেন্ডিং ডাটা নেই ভাই! অল ক্লিয়ার।</p>
        </div>
      ) : (
        <div className="space-y-6">
          {writings.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start">
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 border border-stone-200 text-stone-800 px-2.5 py-1 rounded-full">
                    {post.category === "poetry" ? "কবিতা" : post.category === "story" ? "ছোটগল্প" : "প্রবন্ধ"}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">কলমে: <strong className="text-gray-700 font-serif">{post.penName}</strong></span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 font-serif">{post.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed bg-stone-50 border border-stone-100 p-4 rounded-2xl whitespace-pre-line max-h-60 overflow-y-auto font-mono">
                  {post.content}
                </p>
              </div>

              <div className="flex md:flex-col gap-3 w-full md:w-36 flex-shrink-0">
                <button onClick={() => handleApprove(post.id)} disabled={actionLoading !== null} className="flex-1 bg-stone-950 text-white font-bold text-xs py-3 rounded-xl hover:bg-emerald-800 transition-colors shadow-sm disabled:bg-gray-300">
                  {actionLoading === post.id ? "প্রসেসিং..." : "Approve ✓"}
                </button>
                <button onClick={() => handleDelete(post.id)} disabled={actionLoading !== null} className="flex-1 bg-white border border-rose-200 text-rose-700 font-bold text-xs py-3 rounded-xl hover:bg-rose-50 transition-colors disabled:bg-gray-300">
                  Reject ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
