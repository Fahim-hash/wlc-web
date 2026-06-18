// app/writing/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // 👈 সেন্ট্রাল ফায়ারবেস কানেকশন
import { collection, query, where, getDocs, orderBy } from "firebase/firestore/lite"; // 👈 ফায়ারস্টোর লাইট মডিউল

interface Writing {
  id: string; // 👈 ফায়ারবেসের আইডি 'id' হয়, '_id' না ভাই
  title: string;
  category: string;
  content: string;
  penName?: string;
}

export default function ApprovedWritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApprovedWritings() {
      try {
        // 🔥 সরাসরি ফায়ারবেস থেকে শুধু 'approved' স্ট্যাটাসের লেখাগুলো তুলে আনা হচ্ছে
        // সাথে 'createdAt' দিয়ে সর্ট করা হচ্ছে যাতে নতুন লেখা আগে দেখায়
        const q = query(
          collection(db, "writings"), 
          where("status", "==", "approved"),
          orderBy("createdAt", "desc")
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
          });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 whitespace-pre-line">
                  {post.content}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
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
