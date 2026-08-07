"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function KothasokhiPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "স্বাগতম! আমি 'সাহিত্যসখী'—উইল্‌স সাহিত্য ক্লাবের ডিজিটাল সখী। সাহিত্য, অবস্থান কিংবা ক্লাব সংক্রান্ত যেকোনো বিষয়ে কীভাবে সাহায্য করতে পারি?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const apiPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiPayload }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "দুঃখিত, কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "দুঃখিত, সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে।" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen pt-20 sm:pt-24 pb-6 px-3 sm:px-6 bg-[#FAFAFA] text-stone-800 font-sans flex flex-col items-center justify-center relative overflow-x-hidden select-none">
      
      {/* ব্যাকগ্রাউন্ড সফট ব্লুর গ্লো */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-rose-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-stone-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* চ্যাটবক্স কার্ড */}
      <div className="max-w-3xl w-full flex flex-col bg-white border border-stone-200/80 rounded-[2rem] shadow-2xl relative overflow-hidden z-10 h-[78vh] min-h-[500px]">
        
        {/* টপ মেটালিক অ্যান্ড নিওন এক্সেন্ট */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-900 via-stone-900 to-rose-700 z-20" />

        {/* 🔮 হেডার বার */}
        <header className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-white/95 backdrop-blur-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-stone-50 rounded-2xl p-1.5 border border-stone-200/60 flex items-center justify-center shadow-sm select-none shrink-0">
              <Image
                src="/logo.png"
                alt="WLC Logo"
                width={40}
                height={40}
                className="object-contain aspect-square"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold font-serif text-stone-950 tracking-tight">
                  সাহিত্যসখী
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md">
                  AI Companion
                </span>
              </div>
              <p className="text-stone-400 text-xs font-medium hidden sm:block">
                উইল্‌স সাহিত্য ক্লাবের অফিশিয়াল ডিজিটাল সহকারী
              </p>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            title="নতুন সেশন শুরু করুন"
            className="text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 p-2 sm:px-3.5 sm:py-2 rounded-xl border border-stone-200/60 transition-all text-xs font-semibold flex items-center gap-1.5 active:scale-95 shrink-0"
          >
            🔄 <span className="hidden sm:inline">নতুন চ্যাট</span>
          </button>
        </header>

        {/* 💬 চ্যাট এলাকা */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5 bg-[#FAFAFA]/50 text-xs sm:text-sm scroll-smooth">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[78%] p-3.5 sm:p-4 rounded-2xl leading-relaxed font-medium shadow-sm transition-all ${
                  msg.role === "user"
                    ? "bg-rose-900 text-white rounded-br-none"
                    : "bg-white text-stone-800 border border-stone-200/70 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200/70 p-3.5 sm:p-4 rounded-2xl rounded-bl-none text-stone-400 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 bg-rose-800 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-rose-800 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-rose-800 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 📥 ইনপুট বার */}
        <footer className="p-3 sm:p-4 bg-white border-t border-stone-200/80 shrink-0 z-10">
          <form onSubmit={handleSend} className="flex items-center gap-2 max-w-3xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="সাহিত্যসখীকে আপনার প্রশ্নটি লিখুন..."
              className="flex-1 bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm rounded-xl px-4 py-3 outline-none focus:border-rose-900 focus:bg-white transition-all font-medium placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-stone-950 hover:bg-rose-900 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-xl transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <span className="hidden sm:inline">পাঠান</span> ➔
            </button>
          </form>
        </footer>

      </div>
    </main>
  );
}
