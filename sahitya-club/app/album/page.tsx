// app/album/page.tsx
import React from "react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ফটো অ্যালবাম ও গ্যালারি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর বিভিন্ন আয়োজন ও সোনালী মুহূর্তের ছবিঘর।",
};

// 🎯 সেফ স্ক্র্যাপার ফাংশন (কোনো এরর আসলে ক্র্যাশ করবে না)
async function getTelegramImages(): Promise<string[]> {
  const images: string[] = [];
  try {
    const channelUsername = "wlcweb";
    
    // ১. টাইমআউট সেট করার জন্য AbortController ব্যবহার (যাতে রিকোয়েস্ট আটকে না থাকে)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // ৫ সেকেন্ড পর রিকোয়েস্ট ড্রপ করবে

    const response = await fetch(`https://t.me/s/${channelUsername}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn("টেলিগ্রাম পেজ রেসপন্স করেনি, স্ট্যাটাস:", response.status);
      return [];
    }

    const html = await response.text();

    // ২. ব্যাকগ্রাউন্ড ইমেজের জন্য রেগুলার এক্সপ্রেশন
    const regex = /background-image:\s*url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const imageUrl = match[1];
      if (imageUrl.includes("cdn") || imageUrl.includes("telegram.org/file")) {
        if (!images.includes(imageUrl)) {
          images.unshift(imageUrl);
        }
      }
    }

    return images;
  } catch (error) {
    // যেকোনো নেটওয়ার্ক বা কর্স এরর এখানে হ্যান্ডেল হবে, সাইট ক্র্যাশ করবে না
    console.error("টেলিগ্রাম থেকে ডাটা আনা যায়নি (সেফ মোড সক্রিয়):", error);
    return [];
  }
}

export default async function AlbumPage() {
  // ১. লোকাল public/pic ফোল্ডার থেকে ছবি রিড করা
  const picDirectory = path.join(process.cwd(), "public", "pic");
  let localImages: string[] = [];

  try {
    if (fs.existsSync(picDirectory)) {
      const files = fs.readdirSync(picDirectory);
      localImages = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ext === ".png" || ext === ".jpg" || ext === ".jpeg";
      });
    }
  } catch (error) {
    console.error("লোকাল pic ফোল্ডার রিড করতে সমস্যা:", error);
  }

  // ২. লাইভ টেলিগ্রাম ছবি (এরর আসলে খালি অ্যারে রিটার্ন করবে, সাইট ফাটবে না)
  const telegramImages = await getTelegramImages();
  const totalImagesCount = localImages.length + telegramImages.length;

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

        {/* ইমেজ গ্রিড */}
        {totalImagesCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">কোনো ছবি পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* 🌐 টেলিগ্রাম ক্লাউড ইমেজ পার্ট */}
            {telegramImages.length > 0 && telegramImages.map((url, index) => (
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
                    fill 
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-400 truncate uppercase tracking-wider">
                    {fileName.split('.')[0].replace(/[-_]/g, ' ')}
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
