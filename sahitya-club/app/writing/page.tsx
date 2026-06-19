// app/writing/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // 👈 সেন্ট্রাল ফায়ারবেস কানেকশন
import { collection, query, where, getDocs } from "firebase/firestore/lite"; 

interface Writing {
  id: string; 
  title: string;
  category: string;
  content: string;
  penName?: string;
  createdAt?: any; 
}

export default function ApprovedWritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedWritings() {
      try {
        // 🔥 Composite Index এরর এড়াতে কুয়েরি একদম ক্লিন রাখা হয়েছে
        const q = query(
          collection(db, "writings"), 
          where("status", "==", "approved")
        );

        const querySnapshot = await getDocs(q);
        const approvedList: Writing[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          approvedList.push({
            id: doc.id,
            title: data.title,
            category: data.category,
            content: data.content,
            penName: data.penName,
            createdAt: data.createdAt || null,
          });
        });

        // ⚡ ক্লায়েন্ট সাইড সর্টিং: নতুন লেখা সবার আগে আসবে (যদি createdAt টাইমস্ট্যাম্প থাকে)
        approvedList.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          const timeA = a.createdAt.seconds || new Date(a.createdAt).getTime() || 0;
          const timeB = b.createdAt.seconds || new Date(b.createdAt).getTime() || 0;
          return timeB - timeA; 
        });

        setWritings(approvedList);
      } catch (err) {
        console.error("Failed to load writings from Firebase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchApprovedWritings();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans p-6 md:p-12 max-w-4xl mx-auto">

      <header className="border-b border-gray-200 pb-6 mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold font-serif text-gray-900">নির্বাচিত সাহিত্যকর্ম ✒️</h1>
        <p className="text-gray-500 text-sm mt-2">অ্যাডমিন প্যানেল দ্বারা অনুমোদিত শিক্ষার্থীদের সৃজনশীল লেখালেখি।</p>
      </header>

      {loading ? (
        <div className="text-center py-12 text-sm text-gray-400 font-mono">লেখাগুলো লোড হচ্ছে ভাই...</div>
      ) : writings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
          <p className="text-gray-400 text-sm">এখনো কোনো অনুমোদিত লেখা নেই। নতুন লেখা জমা দিলে তা রিভিউ শেষে এখানে প্রকাশ পাবে!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {writings.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-rose-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 border border-rose-100 text-rose-800 px-2.5 py-1 rounded-full">
                    {post.category === "poetry" ? "কবিতা" : post.category === "story" ? "ছোটগল্প" : "প্রবন্ধ"}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold px-2 py-0.5 rounded-md">
                    ✓ Verified
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900 font-serif mb-3">{post.title}</h2>
                
                {/* 🚀 ফিক্সড: line-clamp-4 রিমুভড, এখন বড় কবিতা বা গল্প পুরোটা কোনো ব্রেক ছাড়া শো করবে */}
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line font-serif">
                  {post.content}
                </p>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-5 flex items-center justify-between">
                <span className="text-xs text-gray-400">লেখক:</span>
                <span className="text-xs font-bold text-gray-800 font-serif">{post.penName || "অনামী সাহিত্যিক"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
