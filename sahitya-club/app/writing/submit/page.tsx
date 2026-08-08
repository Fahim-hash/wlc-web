"use client";

import React, { useState } from "react";

export default function WritingSubmitPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "poetry",
    content: "",
    penName: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // সিকিউরিটি চেক: একদম বেসিক ক্লায়েন্ট সাইড ভ্যালিডেশন
    if (!formData.title || !formData.content) {
      setStatus({ type: "error", message: "শিরোনাম এবং লেখার মূল অংশ দেওয়া বাধ্যতামূলক ভাই!" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/writing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "সাবমিশনে কোনো সমস্যা হয়েছে।");
      }

      setStatus({ type: "success", message: "আগুন! তোমার লেখাটি আমাদের ব্যাকএন্ডে সিকিউরডভাবে জমা হয়েছে। ✒️" });
      setFormData({ title: "", category: "poetry", content: "", penName: "" }); // ফর্ম রিসেট
    } catch (error: any) {
      setStatus({ type: "error", message: error.message || "সার্ভার এরর! দয়া করে আবার চেষ্টা করো।" });
    } finally {
      setLoading(false);
    }
  };

  return (
    /* 🚀 Outer Container: 'w-screen min-h-screen' পুরো মনিটরের ব্যাকগ্রাউন্ড কভার করবে */
    <div className="min-h-screen w-screen bg-[#FAFAFA] text-gray-800 font-sans overflow-x-hidden">
      
      {/* Inner Content Container */}
      <main className="max-w-3xl mx-auto px-6 md:px-12 py-8 md:py-12">
        
        {/* গাইডলাইন কার্ড */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 mb-8 border border-stone-800 shadow-xl">
          <h2 className="text-xl font-bold font-serif mb-2 flex items-center gap-2">
            🔒 সিকিউর রাইটিং সাবমিশন পোর্টাল
          </h2>
          <p className="text-xs text-stone-400 leading-relaxed">
            উইলস সাহিত্য ক্লাবের সিকিউরড পোর্টালে তোমাকে স্বাগতম। তোমার সাবমিট করা প্রতিটি ডাটা সম্পূর্ণ এনক্রিপ্টেড অবস্থায় ডাটাবেজে জমা হবে। কোনো প্রকার কপি বা স্প্যামিং কোড সেন্ড করার চেষ্টা করলে আইপি ব্লক করা হতে পারে।
          </p>
        </div>

        {/* মেইন ফর্ম */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          
          {status && (
            <div className={`p-4 rounded-xl text-xs font-bold ${
              status.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-rose-50 text-rose-800 border border-rose-100"
            }`}>
              {status.message}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">লেখার শিরোনাম *</label>
            <input 
              type="text"
              className="w-full bg-stone-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-800 transition-colors"
              placeholder="তোমার চমৎকার কবিতার বা গল্পের নাম"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">ক্যাটাগরি</label>
              <select 
                className="w-full bg-stone-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-800 transition-colors cursor-pointer"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="poetry">কবিতা (Poetry)</option>
                <option value="story">ছোটগল্প (Short Story)</option>
                <option value="essay">প্রবন্ধ (Essay)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">ছদ্মনাম / পেন নেম (ঐচ্ছিক)</label>
              <input 
                type="text"
                className="w-full bg-stone-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-800 transition-colors"
                placeholder="যদি ছদ্মনামে প্রকাশ করতে চাও"
                value={formData.penName}
                onChange={(e) => setFormData({ ...formData, penName: e.target.value })}
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">মূল লেখাটি এখানে টাইপ করো *</label>
            <textarea 
              rows={10}
              className="w-full bg-stone-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-800 transition-colors resize-none leading-relaxed"
              placeholder="এখানে তোমার মনের মাধুরী মিশিয়ে লেখো..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              maxLength={5000}
            />
            <span className="text-[10px] text-gray-400 block text-right mt-1">সর্বোচ্চ ৫০০০ ক্যারেক্টার</span>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-stone-950 text-white font-semibold text-sm py-4 rounded-xl hover:bg-rose-900 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "সার্ভারে সিকিউরডভাবে পাঠানো হচ্ছে..." : "লেখা জমা দিন ✒️"}
          </button>

        </form>
      </main>
    </div>
  );
}
