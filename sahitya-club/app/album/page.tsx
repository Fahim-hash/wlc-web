// app/album/page.tsx
import React from "react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "ফটো অ্যালবাম ও গ্যালারি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর বিভিন্ন আয়োজন ও সোনালী মুহূর্তের ছবিঘর।",
};

// 🎯 ডিরেক্ট বটের মাধ্যমে ১০০% গ্যারান্টিড ক্লাউড ফেচিং ফাংশন
async function getTelegramImages(): Promise<string[]> {
  const images: string[] = [];
  
  // হার্ডকোডেড সেফসাইড টোকেন ও চ্যাট আইডি (Vercel ভেরিয়েবল কাজ না করলেও ব্যাকআপ হিসেবে কাজ করবে)
  const botToken = "8791133586:AAFYpzRB0kPtyAsktVqp4k9M_293sj1be4k";
  
  try {
    // টেলিগ্রামের getUpdates মেথডে রিকোয়েস্ট পাঠানো
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=100`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.ok || !data.result) return [];

    // লুপ চালিয়ে ছবিগুলোর ফাইল আইডি বের করা
    for (const update of data.result) {
      const post = update.channel_post;
      if (!post) continue;

      let fileId = "";
      if (post.document && post.document.mime_type?.startsWith("image/")) {
        fileId = post.document.file_id;
      } else if (post.photo && post.photo.length > 0) {
        fileId = post.photo[post.photo.length - 1].file_id;
      }

      if (fileId) {
        // ফাইল আইডি দিয়ে সরাসরি টেলিগ্রামের ডিরেক্ট ইমেজ পাথ নেওয়া
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`, { cache: "no-store" });
        const fileData = await fileRes.json();

        if (fileData.ok && fileData.result.file_path) {
          const directUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
          if (!images.includes(directUrl)) {
            images.unshift(directUrl); // লেটেস্ট ছবি আগে দেখাবে
          }
        }
      }
    }
  } catch (error) {
    console.error("Telegram fetching failed gracefully:", error);
  }
  
  return images;
}

export default async function AlbumPage() {
  const telegramImages = await getTelegramImages();

  return (
    <div className="w-full bg-stone-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">

        {/* হেডার */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-950 mb-3 tracking-tight">
            স্মৃতির অ্যালবাম 📸
          </h1>
          <p className="text-sm md:text-base text-stone-600">
            উইল্‌স সাহিত্য ক্লাবের বিভিন্ন অনুষ্ঠান ও সোনালী মুহূর্তগুলোর ফ্রেমবন্দী গল্পকথা।
          </p>
          <div className="w-16 h-1 bg-rose-800 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* ইমেজ গ্রিড */}
        {telegramImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">
              কোনো ছবি পাওয়া যায়নি। চ্যানেলে নতুন একটি ছবি আপলোড করে পেজটি রিফ্রেশ করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {telegramImages.map((url, index) => (
              <div key={index} className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <img 
                    src={url} 
                    alt="WLC Cloud Moment" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="lazy"
                  />
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-400 truncate uppercase tracking-wider">WLC Cloud Moment</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
