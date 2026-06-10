// app/album/page.tsx
import React from "react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ফটো অ্যালবাম ও গ্যালারি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর বিভিন্ন আয়োজন ও সোনালী মুহূর্তের ছবিঘর।",
};

// 🎯 টেলিগ্রাম চ্যানেল থেকে অনুমোদিত (👍 বা ✔️ রিঅ্যাকশন পাওয়া) ছবি ও ডকুমেন্ট ফেচ করার ফাংশন
async function getTelegramImages(): Promise<string[]> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) return [];

    // 🛠️ টেলিগ্রামকে বাধ্য করা হচ্ছে যাতে সে মেসেজ, এডিট এবং রিঅ্যাকশন কাউন্টের সব আপডেট পাঠায়
    const allowedUpdates = JSON.stringify([
      "message", 
      "edited_message", 
      "channel_post", 
      "edited_channel_post", 
      "message_reaction", 
      "message_reaction_count"
    ]);

    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/getUpdates?offset=-100&allowed_updates=${encodeURIComponent(allowedUpdates)}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
    
    const data = await res.json();
    if (!data.ok) return [];

    // একই ফাইল আইডি বা মেসেজ ডুপ্লিকেট হওয়া আটকাতে ম্যাপ ব্যবহার করা হলো
    const validImagesMap = new Map<number, string>();

    // ১. প্রথমে পুরো আপডেটের লুপ চালিয়ে মেসেজের আইডি ও তাদের ফাইল আইডিগুলো ম্যাপ করে নেব
    for (const update of data.result) {
      const post = update.channel_post || update.edited_channel_post;
      if (!post) continue;

      const messageId = post.message_id;
      const document = post.document;
      const photoArray = post.photo;
      let fileId = "";

      // 📁 ফাইল/ডকুমেন্ট হিসেবে আপলোড করা ছবি হ্যান্ডেল করা
      if (document && document.mime_type && document.mime_type.startsWith("image/")) {
        fileId = document.file_id;
      } 
      // 🌐 সরাসরি ইমেজ আকারে আপলোড করা ছবি হ্যান্ডেল করা
      else if (photoArray && photoArray.length > 0) {
        fileId = photoArray[photoArray.length - 1].file_id;
      }

      if (fileId) {
        // মেসেজ আইডির বিপরীতে ফাইল আইডি সেভ করে রাখছি
        validImagesMap.set(messageId, fileId);
      }
    }

    const approvedUrls: string[] = [];

    // ২. এবার দ্বিতীয় ধাপে চেক করব কোন কোন মেসেজ আইডিতে 👍 বা ✔️ রিঅ্যাকশন পড়েছে
    for (const update of data.result) {
      let targetMessageId = null;
      let hasTargetReaction = false;

      // কন্ডিশন A: সরাসরি পোস্টের অবজেক্ট থেকে রিঅ্যাকশন চেক
      const post = update.channel_post || update.edited_channel_post;
      if (post) {
        targetMessageId = post.message_id;
        const reactions = post.reactions?.current_reactions || [];
        hasTargetReaction = reactions.some((r: any) => 
          r.reaction?.emoji === "👍" || r.reaction?.emoji === "✔️"
        );
      }

      // কন্ডিশন B: আলাদা রিঅ্যাকশন ইভেন্ট (message_reaction_count) অবজেক্ট থেকে চেক
      const reactionCountUpdate = update.message_reaction_count;
      if (reactionCountUpdate) {
        targetMessageId = reactionCountUpdate.message_id;
        const reactions = reactionCountUpdate.reactions || [];
        hasTargetReaction = reactions.some((r: any) => 
          r.type === "emoji" && (r.emoji === "👍" || r.emoji === "✔️")
        );
      }

      // যদি অ্যাপ্রুভড রিঅ্যাকশন থাকে এবং আমাদের কাছে সেই মেসেজের ফাইল আইডি সেভ করা থাকে
      if (hasTargetReaction && targetMessageId && validImagesMap.has(targetMessageId)) {
        const fileId = validImagesMap.get(targetMessageId);

        if (fileId) {
          // ৩. টেলিগ্রাম থেকে মেইন ফাইল পাথ নিয়ে ডিরেক্ট ইউআরএল তৈরি করা
          const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`, {
            cache: "no-store",
            next: { revalidate: 0 }
          });
          const fileData = await fileRes.json();

          if (fileData.ok && fileData.result.file_path) {
            const directUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
            // ডুপ্লিকেট ইউআরএল পুশ হওয়া ঠেকাতে চেক
            if (!approvedUrls.includes(directUrl)) {
              approvedUrls.unshift(directUrl);
            }
          }
        }
      }
    }

    return approvedUrls;
  } catch (error) {
    console.error("টেলিগ্রাম ইমেজ ফেচিং এরর:", error);
    return [];
  }
}

export default async function AlbumPage() {
  // ১. public/pic ফোল্ডার থেকে লোকাল ছবি রিড করা
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

  // ২. টেলিগ্রাম থেকে রিঅ্যাকশন ফিল্টারড লাইভ ছবি ও ডকুমেন্ট নিয়ে আসা
  const telegramImages = await getTelegramImages();

  // ৩. মোট ছবির কাউন্ট
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
