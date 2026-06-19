// app/controlhub/shobdo-add/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc } from "firebase/firestore/lite";
import { ShieldCheck, LayoutDashboard, LogOut, FileText, PlusCircle, Edit3, Trash2, RefreshCw, X } from "lucide-react";

interface WordData {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  options?: string[];
  date: string;
}

export default function ShobdoAddManagementPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ইনপুট ফর্ম স্টেট (অ্যাড এবং এডিট উভয়ের জন্য)
  const [formData, setFormData] = useState({ word: "", meaning: "", sentence: "", opt1: "", opt2: "", opt3: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // 🛡️ সিকিউরিটি লক চেক
  useEffect(() => {
    const cachedGate = localStorage.getItem("wlc_gate_session");
    const cachedAdmin = localStorage.getItem("wlc_admin_active");

    if (cachedGate === "session_valid_2026_authorized" && cachedAdmin) {
      setIsAdmin(true);
      setAdminUser(cachedAdmin);
      fetchWordsList();
    } else {
      window.location.href = "/controlhub";
    }
  }, []);

  // 📥 ডাটাবেজ থেকে সব শব্দ পুল করা
  const fetchWordsList = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "daily_words"));
      const list: WordData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          word: data.word,
          meaning: data.meaning,
          sentence: data.sentence || "",
          options: data.options || [],
          date: data.date,
        });
      });
      // শব্দগুলোকে বর্ণানুক্রমিকভাবে সর্ট করে নেওয়া হলো
      setWords(list.sort((a, b) => a.word.localeCompare(b.word)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ শব্দ যোগ অথবা 💾 এডিট সেভ করার সাবমিট লজিক
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word || !formData.meaning) {
      alert("শব্দ এবং অর্থ অবশ্যই দিতে হবে ভাই!");
      return;
    }

    setActionLoading("submit");
    const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
    
    // MCQ কুইজের অপশন অ্যারে তৈরি করা হচ্ছে (১ম টি সঠিক অর্থ, বাকি ৩টি ভুল উত্তর)
    const finalOptions = [
      formData.meaning,
      formData.opt1 || "ভুল অর্থ ১",
      formData.opt2 || "ভুল অর্থ ২",
      formData.opt3 || "ভুল অর্থ ৩"
    ];

    try {
      if (editingId) {
        // 🔄 UPDATE (এডিট সেভ)
        const docRef = doc(db, "daily_words", editingId);
        await updateDoc(docRef, {
          word: formData.word,
          meaning: formData.meaning,
          sentence: formData.sentence,
          options: finalOptions,
        });
        
        setWords(words.map(w => w.id === editingId ? { 
          ...w, 
          word: formData.word, 
          meaning: formData.meaning, 
          sentence: formData.sentence, 
          options: finalOptions 
        } : w));
        
        setSuccessMsg("🎉 শব্দ সফলভাবে আপডেট করা হয়েছে!");
        setEditingId(null);
      } else {
        // ➕ CREATE (নতুন শব্দ যোগ)
        const newDoc = {
          word: formData.word,
          meaning: formData.meaning,
          sentence: formData.sentence,
          options: finalOptions,
          date: todayStr,
          createdAt: new Date()
        };

        const docRef = await addDoc(collection(db, "daily_words"), newDoc);
        setWords([{ id: docRef.id, ...newDoc }, ...words]);
        setSuccessMsg("🚀 নতুন শব্দ ডাটাবেজে যুক্ত হয়েছে!");
      }

      // ফর্ম রিসেট
      setFormData({ word: "", meaning: "", sentence: "", opt1: "", opt2: "", opt3: "" });
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      alert("ডাটাবেজ অপারেশনে সমস্যা হয়েছে ভাই!");
    } finally {
      setActionLoading(null);
    }
  };

  // ✍️ এডিট মোড চালু করার ফাংশন
  const startEdit = (item: WordData) => {
    setEditingId(item.id);
    setFormData({
      word: item.word,
      meaning: item.meaning,
      sentence: item.sentence,
      opt1: item.options?.[1] || "",
      opt2: item.options?.[2] || "",
      opt3: item.options?.[3] || "",
    });
    // স্ক্রল করে ফর্মের কাছে নিয়ে যাওয়ার ট্রিক
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ শব্দ মুছে ফেলার লজিক
  const handleDelete = async (id: string, wordText: string) => {
    if (!confirm(`"${wordText}" শব্দটি কি অভিধান থেকে চিরতরে মুছে ফেলতে চান ভাই?`)) return;
    setActionLoading(id);
    try {
      await deleteDoc(doc(db, "daily_words", id));
      setWords(words.filter(w => w.id !== id));
    } catch {
      alert("মুছে ফেলতে সমস্যা হয়েছে!");
    } finally {
      setActionLoading(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ word: "", meaning: "", sentence: "", opt1: "", opt2: "", opt3: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("wlc_gate_session");
    localStorage.removeItem("wlc_admin_active");
    window.location.href = "/controlhub";
  };

  if (!isAdmin) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-mono text-xs animate-pulse">সিকিউরিটি গেটওয়ে চেকিং...</div>;
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
            <a href="/controlhub/written-approval" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-400 hover:bg-neutral-850 hover:text-neutral-200">
              <FileText className="w-4 h-4" /> লেখা অ্যাপ্রুভাল
            </a>
            <a href="/controlhub/shobdo-add" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold bg-neutral-800 text-white border-l-4 border-emerald-500">
              <PlusCircle className="w-4 h-4" /> শব্দকোষ কন্ট্রোল
            </a>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-neutral-800/60 text-neutral-400 hover:text-red-400 border border-neutral-800 py-2.5 rounded-xl text-xs font-semibold">
          <LogOut className="w-3.5 h-3.5" /> সিস্টেম লগআউট
        </button>
      </aside>

      {/* রাইট ওয়ার্কস্পেস */}
      <section className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-serif text-white">{editingId ? "✍️ শব্দ এডিট মোড" : "✍️ শব্দকোষ অভিধান কন্ট্রোল"}</h2>
            <p className="text-xs text-neutral-400 mt-1">সাহিত্য ক্লাবের কুইজ ও অভিধানের ডাটাবেজ ম্যানুয়ালি এডিট, এড এবং রিমুভ হাব।</p>
          </div>
          <button onClick={fetchWordsList} className="text-xs font-semibold bg-neutral-900 border border-neutral-800 px-4 py-2.5 rounded-xl flex items-center gap-2 text-emerald-400 hover:bg-neutral-850 transition-all">
            <RefreshCw className="w-3 h-3" /> রিফ্রেশ লিস্ট
          </button>
        </div>

        {/* 📑 ফর্ম সেকশন: ADD / EDIT */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center justify-between">
            <span>{editingId ? "শব্দ পরিবর্তন ফর্ম" : "নতুন সাহিত্যিক শব্দ যোগ ফর্ম"}</span>
            {editingId && (
              <button onClick={cancelEdit} className="text-neutral-400 hover:text-rose-400 flex items-center gap-1 text-[11px] capitalize">
                <X className="w-3 h-3" /> বাতিল করুন
              </button>
            )}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">মূল শব্দ (Word)</label>
                <input type="text" required value={formData.word} onChange={(e) => setFormData({ ...formData, word: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-emerald-500 font-serif" placeholder="উদা: নিভৃত" />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">সঠিক অর্থ (Meaning)</label>
                <input type="text" required value={formData.meaning} onChange={(e) => setFormData({ ...formData, meaning: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-emerald-500 font-serif" placeholder="উদা: নির্জন বা লোকচক্ষুর অন্তরালে" />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">প্রয়োগিক প্রেক্ষাপট/বাক্য (Sentence)</label>
              <input type="text" value={formData.sentence} onChange={(e) => setFormData({ ...formData, sentence: e.target.value })} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-emerald-500 font-serif" placeholder="শব্দটি দিয়ে তৈরি একটি বাক্য..." />
            </div>

            {/* MCQ অপশনস মডিউল */}
            <div className="pt-2 border-t border-neutral-850">
              <label className="text-[11px] font-bold text-neutral-400 block mb-2">MCQ কুইজের ভুল অপশনসমূহ (ঐচ্ছিক - ফাও উত্তর বানানোর জন্য)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input type="text" value={formData.opt1} onChange={(e) => setFormData({ ...formData, opt1: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500" placeholder="ভুল উত্তর ১" />
                <input type="text" value={formData.opt2} onChange={(e) => setFormData({ ...formData, opt2: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500" placeholder="ভুল উত্তর ২" />
                <input type="text" value={formData.opt3} onChange={(e) => setFormData({ ...formData, opt3: e.target.value })} className="bg-neutral-950 border border-neutral-800 rounded-xl py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-emerald-500" placeholder="ভুল উত্তর ৩" />
              </div>
            </div>

            {successMsg && <p className="text-xs text-emerald-400 font-medium">{successMsg}</p>}

            <button type="submit" disabled={actionLoading === "submit"} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all disabled:opacity-40 shadow-md">
              {actionLoading === "submit" ? "সংরক্ষণ হচ্ছে..." : editingId ? "পরিবর্তন সংরক্ষণ করুন ✓" : "অভিধানে যোগ করুন ➔"}
            </button>
          </form>
        </div>

        {/* 📊 ডাটা টেবিল লিস্ট সেকশন */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">
            ডাটাবেজে রক্ষিত মোট শব্দ ভাণ্ডার ({words.length} টি)
          </h3>

          {loading ? (
            <div className="text-center py-12 text-xs text-neutral-500 font-mono animate-pulse">শব্দসমূহ সিঙ্ক হচ্ছে ভাই...</div>
          ) : words.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs italic">অভিধান সম্পূর্ণ ফাঁকা ভাই! কোনো শব্দ পাওয়া যায়নি।</div>
          ) : (
            <div className="border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-850">
              {words.map((item) => (
                <div key={item.id} className="p-4 bg-neutral-950/40 hover:bg-neutral-950 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-serif">{item.word}</h4>
                      <span className="text-[9px] bg-neutral-850 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md font-mono">{item.date}</span>
                    </div>
                    <p className="text-xs text-neutral-300 font-serif"><strong className="text-emerald-500 font-sans">অর্থ:</strong> {item.meaning}</p>
                    {item.sentence && <p className="text-[11px] text-neutral-400 italic font-serif">"{item.sentence}"</p>}
                  </div>

                  {/* অ্যাকশন বাটন গ্রুপ */}
                  <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                    <button onClick={() => startEdit(item)} disabled={actionLoading !== null} className="p-2 bg-neutral-900 border border-neutral-800 hover:border-emerald-600/50 text-neutral-300 hover:text-emerald-400 rounded-lg transition-all">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.word)} disabled={actionLoading !== null} className="p-2 bg-neutral-900 border border-neutral-800 hover:border-rose-950 text-neutral-400 hover:text-rose-400 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
