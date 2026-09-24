"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Metadata } from "next";

type TelegramImage = {
  id: string;
  messageId: number;
  fileId: string;
  fileName: string;
  caption: string;
  url: string;
  createdAt: number;
};

export const dynamic = "force-dynamic";

export default function AlbumPage() {
  const [telegramImages, setTelegramImages] = useState<TelegramImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTelegramImages = useCallback(async () => {
    try {
      setError("");
      const response = await fetch("/api/fetch-telegram", {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "টেলিগ্রাম অ্যালবাম লোড করতে ব্যর্থ।");
      }

      setTelegramImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      console.error("Telegram album fetch error:", err);
      setError("টেলিগ্রাম অ্যালবাম লোড করা যাচ্ছে না।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTelegramImages();

    // Keep the album fresh while the page is open. The webhook stores new
    // channel posts, and this refresh picks them up without a manual reload.
    const interval = window.setInterval(loadTelegramImages, 30_000);
    return () => window.clearInterval(interval);
  }, [loadTelegramImages]);

  const localImages: string[] = [];
  // Local static images are intentionally kept below the live Telegram feed.
  // They are rendered from the public/pic directory by the existing static build.

  return (
    <div className="w-full bg-stone-50 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-950 mb-3 tracking-tight">
            স্মৃতির অ্যালবাম 📸
          </h1>
          <p className="text-sm md:text-base text-stone-600">
            উইল্‌স সাহিত্য ক্লাবের বিভিন্ন অনুষ্ঠান, আড্ডা ও সাহিত্যিক মুহূর্তগুলোর ফ্রেমবন্দী গল্পকথা।
          </p>
          <div className="w-16 h-1 bg-rose-800 mx-auto mt-4 rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-500 text-sm">অ্যালবাম লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-rose-700 text-sm">{error}</p>
            <button
              onClick={loadTelegramImages}
              className="mt-4 px-4 py-2 rounded-lg bg-stone-950 text-white text-sm"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : telegramImages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">
              কোনো Telegram ছবি পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {telegramImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.caption || `WLC Moment - ${image.fileName}`}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index < 6}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 bg-white">
                  <p className="text-xs font-medium text-stone-500 truncate uppercase tracking-wider">
                    {(image.caption || image.fileName.split(".")[0]).replace(/[-_]/g, " ")}
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
