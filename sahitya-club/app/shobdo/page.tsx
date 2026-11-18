// app/shobdo/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore/lite";
import { ChevronDown, BookOpen, Layers, Search, Compass, AlertCircle, HelpCircle } from "lucide-react";

interface WordData {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  date: string;
}

export default function ShobdoListPage() {
  const [words, setWords] = useState<WordData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugDate, setDebugDate] = useState("");

  useEffect(() => {
    const fetchTodayWords = async () => {
      try {
        const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
        setDebugDate(todayStr);

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

        if (list.length === 0) {
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
          });
        }

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

  // সার্চ ফিল্টারিং লজিক
  const filteredWords = words.filter(item => 
    item.word.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
        <span className="font-mono text-xs text-stone-500 tracking-wider">শব্দকোষ সাজানো হচ্ছে ভাই...</span>
      </main>
    );
  }

  if (words.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 antialiased">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto border border-amber-100">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold font-serif text-stone-900">কোনো শব্দ পাওয়া যায়নি!</h1>
            <p className="text-xs text-stone-500">আপনার ফ্রন্টএন্ড ট্রাই করছে: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">{debugDate}</code></p>
          </div>
          <p className="text-xs text-stone-400 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
            ভাই, ব্রাউজারে Right Click {"->"} Inspect {"->"} Console ট্যাব চেক করুন, আসল জটলা ওখানে প্রিন্ট হয়েছে।
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-stone-800 p-4 md:p-8 flex flex-col items-center justify-start antialiased selection:bg-stone-950 selection:text-white">
      <div className="max-w-2xl w-full space-y-5 my-4">

        {/* প্রিমিয়াম এডিটোরিয়াল হেডার */}
        <header className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-stone-400">
                আজকের অভিধান • {words[0]?.date || debugDate}
              </span>
            </div>
            <h1 className="text-3xl font-black font-serif text-stone-950 tracking-tight">সাহিত্য ক্লাব শব্দকোষ</h1>
          </div>
          <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/60 px-4 py-2.5 rounded-2xl self-start sm:self-auto shadow-inner">
            <Layers className="w-4 h-4 text-stone-400" />
            <div>
              <p className="text-[9px] uppercase font-mono font-bold tracking-wider text-stone-400">সংগ্রহ সক্ষমতা</p>
              <p className="text-sm font-black font-serif text-stone-950">{words.length} টি শব্দ</p>
            </div>
          </div>
        </header>

        {/* ইনস্ট্যান্ট সার্চ বার */}
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-950 transition-colors" />
          <input 
            type="text"
            placeholder="শব্দ বা অর্থ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-stone-200 rounded-2xl text-sm transition-all focus:outline-none focus:border-stone-400 focus:shadow-sm font-serif"
          />
          {searchQuery && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-400 bg-stone-50 border px-2 py-0.5 rounded-md">
              {filteredWords.length}টি মেলা
            </span>
          )}
        </div>

        {/* শব্দ তালিকা কন্টেইনার */}
        <section className="bg-white border border-stone-200 rounded-3xl p-3 shadow-sm space-y-1.5 max-h-[68vh] overflow-y-auto custom-scrollbar">
          {filteredWords.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs font-serif italic">
              "এই নামে শব্দকোষে কোনো ডেটা মেলেনি ভাই..."
            </div>
          ) : (
            filteredWords.map((item, index) => {
              const isExpanded = expandedId === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`rounded-2xl transition-all duration-300 border ${
                    isExpanded 
                      ? 'bg-stone-50/80 border-stone-300 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-stone-50/50'
                  }`}
                >
                  {/* শব্দ রো ট্র্যাকার */}
                  <div 
                    onClick={() => toggleExpand(item.id)}
                    className="w-full p-4 flex items-center justify-between cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-stone-400/80 group-hover:text-stone-600 transition-colors">
                        {String(index + 1).padStart(3, '0')}
                      </span>
                      <h2 className="text-base font-bold font-serif text-stone-900 group-hover:text-stone-950 transition-colors tracking-wide">
                        {item.word}
                      </h2>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-all duration-300 ${isExpanded ? 'rotate-180 text-stone-950' : ''}`} />
                  </div>

                  {/* লিনিয়ার অ্যাকোর্ডিয়ন কন্টেন্ট */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 space-y-4 border-t border-stone-200/50 animate-fadeIn text-sm">
                      
                      {/* মূল অর্থ */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] uppercase font-mono font-bold text-stone-400 tracking-wider">
                          <BookOpen className="w-3 h-3 text-stone-400" />
                          <span>সাংকেতিক বা সঠিক শব্দার্থ</span>
                        </div>
                        <p className="text-stone-950 font-serif text-base font-medium pl-4.5 border-l-2 border-stone-900/40 leading-relaxed">
                          {item.meaning}
                        </p>
                      </div>

                      {/* বাস্তব উদাহরণ */}
                      {item.sentence && (
                        <div className="bg-white border border-stone-200/80 p-3.5 rounded-xl space-y-1.5 shadow-xs flex gap-2.5 items-start">
                          <Compass className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-mono font-bold text-stone-400 tracking-wider block">প্রয়োগিক প্রেক্ষাপট</span>
                            <p className="text-xs italic text-stone-600 font-serif leading-relaxed">"{item.sentence}"</p>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        

      </div>
    </main>
  );
}
