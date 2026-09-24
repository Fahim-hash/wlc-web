"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type TelegramImage = {
  id: string;
  messageId: number;
  fileId: string;
  fileName: string;
  caption: string;
  url: string;
  createdAt: number;
};

export default function AlbumPage() {
  const [telegramImages, setTelegramImages] = useState<TelegramImage[]>([]);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [telegramError, setTelegramError] = useState("");

  const loadTelegramImages = useCallback(async () => {
    try {
      setTelegramError("");
      const response = await fetch("/api/fetch-telegram", {
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Telegram album load failed.");
      }

      setTelegramImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      console.error("Telegram album fetch error:", err);
      setTelegramError("Telegram album could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/local-images", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { images: [] }))
      .then((data) =>
        setLocalImages(Array.isArray(data.images) ? data.images : [])
      )
      .catch(() => setLocalImages([]));

    loadTelegramImages();

    const interval = window.setInterval(loadTelegramImages, 30_000);
    return () => window.clearInterval(interval);
  }, [loadTelegramImages]);

  const totalImages = localImages.length + telegramImages.length;

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
          <div className="w-16 h-1 bg-rose-800 mx-auto mt-4 rounded-full" />
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-500 text-sm">অ্যালবাম লোড হচ্ছে...</p>
          </div>
        ) : totalImages === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/60 shadow-sm">
            <p className="text-stone-400 italic text-sm">
              কোনো অ্যালবাম ছবি পাওয়া যায়নি।
            </p>
            {telegramError && (
              <p className="mt-2 text-xs text-rose-600">{telegramError}</p>
            )}
          </div>
        ) : (
          <>
            {telegramError && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs text-amber-800">
                পুরোনো GitHub ছবি দেখানো হচ্ছে। Telegram feed সাময়িকভাবে লোড হয়নি।
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {localImages.map((fileName, index) => (
                <div
                  key={`local-${fileName}`}
                  className="group relative bg-white border border-stone-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-video w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={`/pic/${encodeURIComponent(fileName)}`}
                      alt={`WLC Moment - ${fileName}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={index < 6}
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-xs font-medium text-stone-500 truncate uppercase tracking-wider">
                      {fileName.split(".")[0].replace(/[-_]/g, " ")}
                    </p>
                  </div>
                </div>
              ))}

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
                      {(image.caption || image.fileName.split(".")[0]).replace(
                        /[-_]/g,
                        " "
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
