// app/shobdo/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FiBookOpen, FiChevronDown, FiChevronUp, FiCompass, FiLayers } from "react-icons/fi";

interface WordQuiz {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  options: string[];
}

export default function PremiumLexiconListing() {
  const [words, setWords] = useState<WordQuiz[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayArchive = async () => {
      try {
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
        const q = query(collection(db, "daily_words"), where("date", "==", today));
        const querySnapshot = await getDocs(q);

        const list: WordQuiz[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            word: data.word,
            meaning: data.meaning,
            sentence: data.sentence,
            options: data.options || [],
          });
        });
        
        // Primary alphabetical sorting for a cleaner archive layout
        setWords(list.sort((a, b) => a.word.localeCompare(b.word)));
      } catch (err) {
        console.error("Repository tracking anomaly:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayArchive();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center font-sans tracking-widest text-[10px] uppercase text-zinc-500 gap-3">
        <span className="w-4 h-4 border border-t-transparent border-zinc-500 rounded-full animate-spin"></span>
        Parsing Daily Lexicon Archives...
      </main>
    );
  }

  if (words.length === 0) {
    return (
      <main className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-center antialiased">
        <div className="max-w-sm space-y-4 border border-zinc-900 bg-[#0e0e11] p-8 rounded-2xl shadow-xl">
          <span className="text-2xl text-amber-500/60 font-light font-serif">⏳</span>
          <h1 className="text-lg font-light tracking-wide text-zinc-200">Index Unavailable</h1>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">The architectural log has not compiled today's vocabulary stream. Please re-initialize shortly.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-8 flex flex-col items-center antialiased select-none">
      <div className="max-w-2xl w-full space-y-6 my-4">
        
        {/* Editorial Executive Header */}
        <header className="bg-[#0e0e11] border border-zinc-900/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 animate-pulse"></span>
              <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-bold">Linguistic Compendium</p>
            </div>
            <h1 className="text-2xl font-light tracking-wide text-zinc-200 font-serif italic">Sahitya <span className="text-zinc-400 font-sans not-italic text-xl">Archive</span></h1>
          </div>
          
          <div className="flex items-center gap-3 bg-[#050507] border border-zinc-900 px-4 py-2.5 rounded-xl font-mono text-left">
            <FiLayers className="w-4 h-4 text-zinc-600" />
            <div>
              <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-medium">Daily Database Capacity</p>
              <p className="text-sm font-semibold text-zinc-200">{words.length} Dynamic Units</p>
            </div>
          </div>
        </header>

        {/* Master Registry Stream */}
        <section className="bg-[#0e0e11] border border-zinc-900/80 rounded-2xl shadow-2xl overflow-hidden p-2 space-y-1">
          <div className="px-4 py-3 border-b border-zinc-900/60 flex items-center justify-between text-zinc-500 text-[10px] font-mono uppercase tracking-wider">
            <span>Vocabulary Registry</span>
            <span>Action View</span>
          </div>

          <div className="divide-y divide-zinc-900/40 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar space-y-1">
            {words.map((item, index) => {
              const isExpanded = expandedId === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`rounded-xl transition-all duration-300 border ${
                    isExpanded 
                      ? 'bg-[#050507] border-zinc-800 shadow-inner' 
                      : 'bg-transparent border-transparent hover:bg-zinc-900/30'
                  }`}
                >
                  {/* Word Header Trigger */}
                  <div 
                    onClick={() => toggleExpand(item.id)}
                    className="w-full px-4 py-4 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
                        {String(index + 1).padStart(3, '0')}
                      </span>
                      <h3 className="text-base font-medium tracking-wide text-zinc-300 font-serif italic group-hover:text-zinc-100 transition-colors">
                        {item.word}
                      </h3>
                    </div>
                    <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                      {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Contextual Dropdown Accordion Panel */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 text-xs text-zinc-400 space-y-4 border-t border-zinc-900/40 animate-in fade-in slide-in-from-top-1 duration-200">
                      
                      {/* Literal Definition */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block">Core Structural Definition</span>
                        <p className="text-zinc-200 text-sm font-medium pl-1">{item.meaning}</p>
                      </div>

                      {/* Linguistic Options / Synonyms Array */}
                      {item.options.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block">Structural Distractor Matrices</span>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {item.options.map((opt, oIdx) => (
                              <span 
                                key={oIdx} 
                                className={`px-2.5 py-1 text-[11px] rounded-lg border font-medium ${
                                  opt === item.meaning 
                                    ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                                }`}
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Organic Sentence Paradigm */}
                      {item.sentence && (
                        <div className="bg-[#09090b] border border-zinc-900 p-3.5 rounded-xl space-y-1 flex gap-2 items-start">
                          <FiCompass className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest block">Linguistic Paradigm Application</span>
                            <p className="text-zinc-400 italic font-serif leading-relaxed">"{item.sentence}"</p>
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Global Footer Controls */}
        <footer className="text-center text-[10px] font-mono tracking-widest text-zinc-600 pt-2 flex justify-center items-center gap-1.5">
          <FiBookOpen className="w-3 h-3" /> Consolidated Lexicon Framework • 2026 Registry 
        </footer>

      </div>
    </main>
  );
}
