// app/shobdo/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

interface WordData {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  date: string;
}

export default function ShobdoListPage() {
  const [words, setWords] = useState<WordData[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugDate, setDebugDate] = useState("");

  useEffect(() => {
    const fetchTodayWords = async () => {
      try {
        // ঢাকা টাইমজোনে আজকের ডেট জেনারেট
        const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
        setDebugDate(todayStr);
        
        console.log("🔍 ফ্রন্টএন্ড এই ডেট দিয়ে ফায়ারবেসে খুঁজছে:", todayStr);

        // সেফটি কুয়েরি: আজকের ডেটের সাথে মিলিয়ে সর্বোচ্চ ১৫০টা শব্দ টানবে
        const q = query(
          collection(db, "daily_words"), 
          where("date", "==", todayStr)
        );
        
        const querySnapshot = await getDocs(q);
        const list: WordData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            word: data.word,
            meaning: data.meaning,
            sentence: data.sentence || "",
            date: data.date
          });
        });

        // 💡 ডিবগ ট্রিক: যদি আজকের ডেটে শব্দ না পায়, তবে লেটেস্ট যেকোনো শব্দ তুলে দেখাবে (যাতে ব্লাঙ্ক না থাকে)
        if (list.length === 0) {
          console.warn("⚠️ আজকের ডেটে কোনো শব্দ পাওয়া যায়নি! ব্যাকআপ কুয়েরি রান হচ্ছে...");
          
          const backupQ = query(
            collection(db, "daily_words"),
            orderBy("createdAt", "desc"),
            limit(100)
          );
          const backupSnapshot = await getDocs(backupQ);
          
          backupSnapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              word: data.word,
              meaning: data.meaning,
              sentence: data.sentence || "",
              date: data.date
            });
            console.log(`फায়ারবেসে থাকা ডেটার আসল ডেট ফরম্যাট -> [${data.word}]: ${data.date}`);
          });
        }

        // বাংলা বর্ণমালা অনুযায়ী সাজানো
        setWords(list.sort((a, b) => a.word.localeCompare(b.word)));
      } catch (err) {
        console.error("✕ Firebase fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayWords();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-mono text-xs text-gray-400">শব্দকোষ লোড হচ্ছে ভাই...</main>;
  }

  if (words.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-3">
          <span className="text-4xl">⏳</span>
          <h1 className="text-xl font-bold font-serif">কোনো শব্দ পাওয়া যায়নি!</h1>
          <p className="text-xs text-gray-500">আপনার ফ্রন্টএন্ড ট্রাই করছে: <code className="bg-gray-200 px-1 rounded">{debugDate}</code></p>
          <p className="text-[11px] text-rose-500">ভাই, ব্রাউজারে Right Click -> Inspect -> Console ট্যাব চেক করুন, আসল জটলা ওখানে প্রিন্ট হয়েছে।</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 p-4 md:p-8 flex flex-col items-center justify-start">
      <div className="max-w-xl w-full space-y-6 my-4">
        
        {/* হেডার */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
              আজকের অভিধান ({words[0]?.date || debugDate})
            </span>
            <h1 className="text-2xl font-extrabold font-serif text-gray-950 pt-1">সাহিত্য ক্লাব শব্দকোষ</h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-gray-400 block">মোট শব্দ</span>
            <strong className="text-xl font-serif text-gray-950">{words.length} টি</strong>
          </div>
        </div>

        {/* শব্দ তালিকা */}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-sm space-y-2 max-h-[75vh] overflow-y-auto">
          {words.map((item, index) => {
            const isExpanded = expandedId === item.id;
            return (
              <div 
                key={item.id} 
                className={`rounded-2xl transition-all duration-200 border ${
                  isExpanded ? 'bg-stone-50 border-stone-300' : 'bg-white border-transparent hover:bg-stone-50/50'
                }`}
              >
                {/* শব্দ রো */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="w-full p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <h2 className="text-lg font-bold font-serif text-gray-950">
                      {item.word}
                    </h2>
                  </div>
                  <span className="text-gray-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                </div>

                {/* বিবরণী */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 space-y-3 border-t border-stone-200/60 animate-fadeIn text-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block">শব্দার্থ:</span>
                      <p className="text-gray-900 font-serif text-base font-medium pl-0.5">
                        {item.meaning}
                      </p>
                    </div>

                    {item.sentence && (
                      <div className="bg-white border border-stone-200 p-3.5 rounded-xl space-y-1">
                        <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 block">বাক্যে প্রয়োগ:</span>
                        <p className="text-xs italic text-gray-600 leading-relaxed font-serif">"{item.sentence}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          বৈঠকখানা শব্দকোষ ফ্রেমওয়ার্ক • ২০২৬
        </p>

      </div>
    </main>
  );
}
