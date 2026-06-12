// app/album/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function AlbumPage() {
  const [telegramImages, setTelegramImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 📁 লোকাল ছবির লিস্ট (যেহেতু ইউজারের ব্রাউজার সরাসরি সার্ভারের fs রিড করতে পারে না, 
  // তাই লোকাল ছবিগুলো এখানে একটা অ্যারেতে ডিফাইন করে দেওয়া হলো)
  const localImages: string[] = [
    // তোমার public/pic ফোল্ডারে যে ছবিগুলো আছে, সেগুলোর নাম এখানে বসাতে পারো (যেমন: "pic1.jpg", "pic2.png")
    // যদি লোকাল ছবি না থাকে, তবে এই অ্যারেটি খালি [] রাখতে পারো
  ];

  useEffect(() => {
    async function fetchTelegramImages() {
      try {
        const channelUsername = "wlcweb";
        // অল্টারনেটিভ ফ্রি কর্স প্রক্সি ব্যবহার করা হয়েছে যাতে ব্রাউজার থেকে টেলিগ্রামের ডাটা ডিরেক্ট ব্লক না হয়
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://t.me/s/${channelUsername}`)}`);
        
        if (!response.ok) return;
        
        const data = await response.json();
        const html = data.contents;
        const images: string[] = [];

        // টেলিগ্রামের ব্যাকগ্রাউন্ড ইমেজ রেগুলার এক্সপ্রেশন
        const regex = /background-image:\s*url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
        let match;

        while ((match = regex.exec(html)) !== null) {
          const imageUrl = match[1];
          if (imageUrl.includes("cdn") || imageUrl.includes("telegram.org/file")) {
            if (!images.includes(imageUrl)) {
              images.unshift(imageUrl); // লেটেস্ট ছবি আগে দেখাবে
            }
          }
        }

        setTelegramImages(images);
      } catch (error) {
        console.error("টেলিগ্রাম থেকে ছবি লোড করতে সমস্যা হয়েছে:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTelegramImages();
  }, []);

  const totalCount = localImages.length + telegramImages.length;

  return (
    <div className="w-full bg-stone-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        {/* পেজ হেডার */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-950 mb-3 tracking-tight">
            স্মৃতির অ্যালবাম 📸
          </h1>
          <p className="text-sm md:text-base text-stone-600">
            উইল্‌স সাহিত্য ক্লাবের বিভিন্ন অনুষ্ঠান, আড্ডা ও সাহিত্যিক মুহূর্তগুলোর ফ্রেমবন্দী গল্পকথা।
          </p>
          <div className="w-16 h-1 bg-rose-800 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* লোডিং স্টেট */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-800 mb-2"></div>
            <p className="text-stone-500 text-sm">অ্যালবাম লোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
          </div>
        ) : totalCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">কোনো ছবি পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* 🌐 টেলিগ্রাম ক্লাউড ইমেজ পার্ট */}
            {telegramImages.map((url, index) => (
              <div key={`tg-${index}`} className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <img 
                    src={url} 
                    alt="WLC Cloud Moment" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.parentElement?.parentElement?.remove();
                    }}
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-400 truncate uppercase tracking-wider">WLC Cloud Moment</p>
                </div>
              </div>
            ))}

            {/* 📁 লোকাল ইমেজ পার্ট */}
            {localImages.map((fileName, index) => (
              <div key={`local-${index}`} className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <Image 
                    src={`/pic/${fileName}`} 
                    alt="WLC Local" 
                    width={500}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-400 truncate uppercase tracking-wider">
                    {fileName.split('.')[0]}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
