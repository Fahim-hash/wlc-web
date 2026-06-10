// app/album/page.tsx
import React from "react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

// 🚀 প্রিমিয়াম এসইও সেটআপ
export const metadata: Metadata = {
  title: "ফটো অ্যালবাম ও গ্যালারি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর বিভিন্ন আয়োজন ও সোনালী মুহূর্তের ছবিঘর।",
};

// 🎯 টেলিগ্রাম চ্যানেল থেকে সব ছবি ও ডকুমেন্ট (ফাইল) ফেচ করার ফাংশন
async function getTelegramImages(): Promise<string[]> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return [];

    // ১. টেলিগ্রামের লেটেস্ট আপডেটস ফেচ করা (সব ক্যাশ হার্ড-ব্লকড)
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=-100`, {
      cache: "no-store",
      next: { revalidate: 0 },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
    
    const data = await res.json();
    if (!data.ok) return [];

    const telegramImages: string[] = [];

    for (const update of data.result) {
      const post = update.channel_post || update.edited_channel_post;
      if (!post) continue;

      const document = post.document;
      const photoArray = post.photo;
      let fileId = "";

      // 📁 ১. যদি ছবি "Document" (ফাইল) হিসেবে আপলোড করা হয়
      if (document && document.mime_type && document.mime_type.startsWith("image/")) {
        fileId = document.file_id;
      } 
      // 🌐 ২. যদি নরমাল ইমেজ হিসেবে আপলোড করা হয়
      else if (photoArray && photoArray.length > 0) {
        fileId = photoArray[photoArray.length - 1].file_id; // হাই কোয়ালিটি ছবি
      }

      if (fileId) {
        // ফাইলটি এখনো টেলিগ্রাম সার্ভারে সলিডভাবে আছে কি না চেক করা (ডিলিট ফিল্টার)
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`, {
          cache: "no-store",
          next: { revalidate: 0 }
        });
        const fileData = await fileRes.json();

        if (fileData.ok && fileData.result.file_path) {
          const directUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
          
          // ডুপ্লিকেট ইমেজ এড়াতে চেক
          if (!telegramImages.includes(directUrl)) {
            telegramImages.unshift(directUrl); // নতুন ছবি সবার আগে থাকবে
          }
        }
      }
    }
    return telegramImages;
  } catch (error) {
    console.error("টেলিগ্রাম থেকে ছবি আনতে ব্যর্থ:", error);
    return [];
  }
}

export default async function AlbumPage() {
  // ১. public/pic ফোল্ডার থেকে লোকাল ছবিগুলো রিড করা
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
    console.error("public/pic ফোল্ডার রিড করতে সমস্যা:", error);
  }

  // ২. টেলিগ্রাম থেকে সব ছবি ও ডকুমেন্ট নিয়ে আসা
  const telegramImages = await getTelegramImages();

  // ৩. দুই সোর্সের মোট ছবির কাউন্ট
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

        {/* ইমেজ গ্রিড গ্যালারি */}
        {totalImagesCount === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">
              এখনো কোনো ছবি অ্যালবামে যুক্ত করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* 🌐 পার্ট ১: টেলিগ্রাম চ্যানেল থেকে আসা ছবি ও ডকুমেন্টস */}
            {telegramImages.map((url, index) => (
              <div 
                key={`tg-${index}`} 
                className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* ১৬:৯ অ্যাসপেক্ট রেশিও কন্টেইনার */}
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <img
                    src={url}
                    alt={`Willes Literary Club Moment - Cloud ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {/* নিচের টেক্সট এরিয়া লোকাল ছবির মতোই ক্লিন রাখা হয়েছে */}
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-400 truncate uppercase tracking-wider">
                    WLC Moment {telegramImages.length - index}
                  </p>
                </div>
              </div>
            ))}

            {/* 📁 পার্ট ২: তোমার লোকাল public/pic ফোল্ডারের ছবিগুলো */}
            {localImages.map((fileName, index) => (
              <div 
                key={`local-${index}`} 
                className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={`/pic/${fileName}`}
                    alt={`Willes Literary Club Moment - ${index + 1}`}
                    fill
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
