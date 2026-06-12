// app/album/page.tsx
import React from "react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import { Metadata } from "next";

// ক্যাশ ক্লিয়ার রাখার জন্য ডাইনামিক রেন্ডারিং ফোর্স করা হলো
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ফটো অ্যালবাম ও গ্যালারি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অফিশিয়াল সাহিত্য ক্লাব-এর বিভিন্ন আয়োজন ও সোনালী মুহূর্তের ছবিঘর।",
};

export default async function AlbumPage() {
  // public/pic ফোল্ডারের পাথ সেট করা
  const picDirectory = path.join(process.cwd(), "public", "pic");
  let localImages: string[] = [];

  try {
    // ফোল্ডারটি এক্সিস্ট করে কি না চেক করা
    if (fs.existsSync(picDirectory)) {
      const files = fs.readdirSync(picDirectory);
      
      // শুধুমাত্র ছবি ফাইলগুলো (png, jpg, jpeg) ফিল্টার করে নেওয়া
      localImages = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp";
      });
    }
  } catch (error) {
    console.error("public/pic ফোল্ডার রিড করতে সমস্যা হয়েছে:", error);
  }

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
        {localImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">
              `public/pic` ফোল্ডারে কোনো ছবি পাওয়া যায়নি। ফোল্ডারে ছবি রেখে পেজটি রিফ্রেশ করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            
            {localImages.map((fileName, index) => (
              <div 
                key={index} 
                className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* ইমেজ কন্টেইনার */}
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <Image 
                    src={`/pic/${fileName}`} 
                    alt={`WLC Moment - ${fileName}`} 
                    fill 
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    priority={index < 6} // প্রথম ৬টা ছবি ফাস্ট লোড হওয়ার জন্য প্রpriority সেট করা
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* কার্ড ফুটার (ছবির টাইটেল) */}
                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-500 truncate uppercase tracking-wider">
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
