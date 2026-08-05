"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "নমস্কার! আমি কথাসখী—উইল্‌স সাহিত্য ক্লাবের ডিজিটাল সখী। সাহিত্য কিংবা ক্লাব সংক্রান্ত যেকোনো বিষয়ে কীভাবে সাহায্য করতে পারি?",
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
          { role: "assistant", content: "দুঃখিত, সংযোগে সমস্যা হচ্ছে। আবার চেষ্টা করুন।" },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "দুঃখিত, সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[380px] h-[520px] bg-white border border-stone-200/90 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          
          {/* হেডার - কথাসখী */}
          <div className="bg-gradient-to-r from-rose-950 via-stone-900 to-rose-900 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-900/50 border border-rose-400/30 flex items-center justify-center text-lg">
                📖
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm tracking-wide text-rose-50">কথাসখী</h3>
                <p className="text-[10px] text-rose-200/80 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  WLC Digital Companion
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-300 hover:text-white hover:bg-white/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm"
            >
              ✕
            </button>
          </div>

          {/* চ্যাট এলাকা */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFAFA] text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed font-medium shadow-sm ${
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
                <div className="bg-white border border-stone-200/70 p-3.5 rounded-2xl rounded-bl-none text-stone-400 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-rose-800 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-rose-800 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-rose-800 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ইনপুট */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="কথাসখীকে কিছু জিজ্ঞেস করুন..."
              className="flex-1 bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-800 focus:bg-white transition-all font-medium placeholder:text-stone-400"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-stone-950 hover:bg-rose-900 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all duration-300 shadow-sm active:scale-95"
            >
              ➔
            </button>
          </form>
        </div>
      )}

      {/* ট্রিগার বাটন */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-stone-950 hover:bg-rose-900 text-white w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-stone-800 group"
      >
        <span className="group-hover:rotate-12 transition-transform duration-300">
          {isOpen ? "✕" : "✨"}
        </span>
      </button>
    </div>
  );
}
