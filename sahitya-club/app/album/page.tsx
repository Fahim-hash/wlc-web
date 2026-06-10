// app/album/page.tsx
import React from "react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

// 🚀 এই পেজের জন্য প্রিমিয়াম এসইও সেটআপ
export const metadata: Metadata = {
  title: "ফটো অ্যালবাম ও গ্যালারি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর বিভিন্ন আয়োজন ও সোনালী মুহূর্তের ছবিঘর।",
};

// 🎯 টেলিগ্রাম চ্যানেল থেকে অনুমোদিত (👍 বা ✔️ রিঅ্যাকশন পাওয়া) ছবি ও ডকুমেন্ট ফেচ করার ফাংশন
async function getTelegramImages(): Promise<string[]> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return [];

    // ১. টেলিগ্রামের লেটেস্ট আপডেটস ফেচ করা (সব রকমের ক্যাশ হার্ড-ব্লক করা হয়েছে)
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
      // টেলিগ্রামের রিঅ্যাকশন মূলত আপডেট টাইপের ওপর ভিত্তি করে ভিন্ন ভিন্ন অবজেক্টে আসতে পারে
      const channelPost = update.channel_post || update.edited_channel_post;
      if (!channelPost) continue;

      // 🔍 রিঅ্যাকশন ফিল্টার লজিক (সাধারণ পোস্ট এবং ডকুমেন্ট পোস্ট উভয়ের জন্যই)
      const reactions = channelPost.reactions?.current_reactions || [];
      
      // আমরা চেক করব 👍 (thumbsup) অথবা ✔️ (checkmark) রিঅ্যাকশন আছে কি না
      const isApproved = reactions.some((r: any) => 
        r.reaction?.emoji === "👍" || r.reaction?.emoji === "✔️"
      );

      // 🛑 যদি অনুমোদিত রিঅ্যাকশন না থাকে, তবে এই ফাইল বা ছবি ওয়েবসাইটে দেখাবে না
      if (!isApproved) continue;

      const document = channelPost.document;
      const photoArray = channelPost.photo;
      let fileId = "";

      // 📁 কন্ডিশন ১: যদি ছবিটি "Document" (ফাইল) হিসেবে আপলোড করা হয়
      if (document && document.mime_type && document.mime_type.startsWith("image/")) {
        fileId = document.file_id;
      } 
      // 🌐 কন্ডিশন ২: যদি সরাসরি মেসেজে সাধারণ ছবি আকারে পাঠানো হয়
      else if (photoArray && photoArray.length > 0) {
        fileId = photoArray[photoArray.length - 1].file_id; // হাই কোয়ালিটি ইমেজ আইডি
      }

      // যদি কোনো ভ্যালিড ফাইল আইডি পাওয়া যায়, তবে সেটার ডিরেক্ট ইউআরএল তৈরি করব
      if (fileId) {
        // ২. ফাইলটি এখনো টেলিগ্রাম ক্লাউডে লাইভ আছে কি না ভেরিফাই করা
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`, {
          cache: "no-store",
          next: { revalidate: 0 },
          headers: { "Cache-Control": "no-cache, no-store" }
        });
        const fileData = await fileRes.json();

        // যদি ফাইলটি ডিলিট হয়ে গিয়ে থাকে, তবে স্কিপ করবে
        if (!fileData.ok || !fileData.result.file_path) {
          continue; 
        }

        const directUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        telegramImages.unshift(directUrl); // নতুন ছবি বা ডকুমেন্ট সবার আগে পুশ হবে
      }
    }
    return telegramImages;
  } catch (error) {
    console.error("টেলিগ্রাম থেকে ডেটা আনতে ব্যর্থ:", error);
    return [];
  }
}

export default async function AlbumPage() {
  // ১. public/pic ফোল্ডার থেকে লোকাল ছবি রিড
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

  // ২. টেলিগ্রাম থেকে শুধুমাত্র রিঅ্যাকশন পাওয়া লাইভ ছবি ও ডকুমেন্টগুলো আনা
  const telegramImages = await getTelegramImages();

  // ৩. মোট ছবির সংখ্যা গণনা
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
              এখনো কোনো অনুমোদিত ছবি বা ডকুমেন্ট অ্যালবামে যুক্ত করা হয়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* 🌐 পার্ট ১: টেলিগ্রাম থেকে লাইভ অ্যাপ্রুভড ছবি ও ডকুমেন্টস */}
            {telegramImages.map((url, index) => (
              <div 
                key={`tg-${index}`} 
                className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <img
                    src={url}
                    alt={`WLC Cloud Memory - ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    Approved 👍
                  </span>
                </div>
                <div className="p-4 bg-white">
                  <p className="text-xs font-semibold text-stone-500 tracking-wide">
                    প্যানেল আপলোড #{telegramImages.length - index}
                  </p>
                </div>
              </div>
            ))}

            {/* 📁 পার্ট ২: লোকাল public/pic ফোল্ডারের ছবিগুলো */}
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
