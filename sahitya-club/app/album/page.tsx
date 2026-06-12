// app/album/page.tsx
import React from "react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

// Vercel বা অন্য কোথাও যেন পেজটি ক্যাশ হয়ে না থাকে, সেজন্য ডাইনামিক রেন্ডারিং ফোর্স করা হলো
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ফটো অ্যালবাম ও গ্যালারি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর বিভিন্ন আয়োজন ও সোনালী মুহূর্তের ছবিঘর।",
};

// 🎯 টেলিগ্রাম পাবলিক চ্যানেল স্ক্র্যাপ করার আলটিমেট ও পার্মানেন্ট ফাংশন
async function getTelegramImages(): Promise<string[]> {
  try {
    const channelUsername = "wlcweb"; // তোমার চ্যানেলের সঠিক ইউজারনেম
    const response = await fetch(`https://t.me/s/${channelUsername}`, {
      next: { revalidate: 0 },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      console.error("টেলিগ্রাম পেজ লোড করতে ব্যর্থ হয়েছে");
      return [];
    }

    const html = await response.text();
    const images: string[] = [];

    // টেলিগ্রামের পাবলিক ওয়েবসাইটের ব্যাকগ্রাউন্ড ইমেজের ইউআরএল এক্সট্র্যাক্ট করার রেগুলার এক্সপ্রেশন
    const regex = /background-image:\s*url\s*\(\s*['"]?([^'")]+)['"]?\s*\)/gi;
    let match;

    while ((match = regex.exec(html)) !== null) {
      const imageUrl = match[1];
      
      // শুধুমাত্র আসল ছবিগুলোর লিংক ফিল্টার করা হচ্ছে (ছোট প্রোফাইল পিকচার বা ইমোজি বাদে)
      if (imageUrl.includes("cdn") || imageUrl.includes("telegram.org/file")) {
        if (!images.includes(imageUrl)) {
          images.unshift(imageUrl); // নতুন ছবিগুলোকে গ্যালারির সবার আগে দেখানোর জন্য unshift
        }
      }
    }

    return images;
  } catch (error) {
    console.error("টেলিগ্রাম স্ক্র্যাপিং করার সময় এরর হয়েছে:", error);
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

  // ২. লাইভ টেলিগ্রাম স্ক্র্যাপড ছবি নিয়ে আসা
  const telegramImages = await getTelegramImages();
  
  // ৩. টোটাল ছবির সংখ্যা হিসাব করা
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

        {/* ইমেজ গ্রিড লেআউট */}
        {totalImagesCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">
              এখনো কোনো ছবি অ্যালবামে যুক্ত করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* 🌐 পার্ট ১: টেলিগ্রাম চ্যানেল থেকে আসা ছবিসমূহ */}
            {telegramImages.map((url, index) => (
              <div 
                key={`tg-${index}`} 
                className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Willes Literary Club Moment - Cloud ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="lazy" 
                    onError={(e) => {
                      // কোনো কারণে কোনো ছবির লিংক ব্রোকেন হলে কার্ডটি স্বয়ংক্রিয়ভাবে হাইড হয়ে যাবে
                      e.currentTarget.parentElement?.parentElement?.remove();
                    }}
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-400 truncate uppercase tracking-wider">
                    WLC Cloud Moment
                  </p>
                </div>
              </div>
            ))}

            {/* 📁 পার্ট ২: লোকাল public/pic ফোল্ডারের ছবিসমূহ */}
            {localImages.map((fileName, index) => (
              <div 
                key={`local-${index}`} 
                className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <Image 
                    src={`/pic/${fileName}`} 
                    alt={`Willes Literary Club Moment - Local ${index + 1}`} 
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
