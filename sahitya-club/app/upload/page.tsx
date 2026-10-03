// app/upload/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function UploadPage() {
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  // মাল্টিপল ফাইল হ্যান্ডেল ও প্রিভিউ জেনারেট করার লজিক
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // আগের প্রিভিউ ইউআরএল থাকলে মেমোরি রিলিজ করা
      previewUrls.forEach((url) => URL.revokeObjectURL(url));

      // নতুন সব ছবির প্রিভিউ তৈরি
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || files.length === 0) return;

    setStatus("uploading");

    const formData = new FormData();
    formData.append("name", name);
    // প্রতিটি ফাইলকে 'files' কি-তে অ্যাপেন্ড করা হচ্ছে
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/upload-telegram", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setName("");
        setFiles([]);
        setPreviewUrls([]);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-800 font-sans py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-stone-200/80 rounded-3xl shadow-xl p-8 md:p-10 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-800 via-rose-600 to-amber-500"></div>

        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Image src="/logo.png" alt="WLC Logo" fill className="object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 mb-2">
            বাল্ক ছবি আপলোড পোর্টাল
          </h1>
          <p className="text-xs md:text-sm text-stone-500">
            আপনার নাম লিখে এক বা একাধিক ছবি একসাথে সিলেক্ট করে আপলোড করুন।
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-200 shadow-sm">
              ✓
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-serif">সবগুলো ছবি সফলভাবে আপলোড হয়েছে!</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto leading-relaxed">
              আপনার দেওয়া ফাইলগুলো নাম্বারিং ফরম্যাটে কাস্টমাইজ করে ক্লাবের চ্যানেলে পাঠানো হয়েছে।
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-all shadow-sm"
            >
              আবার আপলোড করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">আপনার নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: Syed Fahim"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-rose-700 text-sm transition-all bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                ছবিগুলো যুক্ত করুন (একের অধিক সিলেক্ট করতে পারবেন) *
              </label>
              <div className="border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center hover:border-rose-600 transition-colors bg-stone-50/30 relative group">
                <input
                  type="file"
                  required
                  accept="image/*"
                  multiple // 🎯 এর মাধ্যমে একসাথে অনেক ছবি সিলেক্ট করা যাবে
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                {previewUrls.length > 0 ? (
                  /* 📸 মাল্টিপল ইমেজ গ্রিড প্রিভিউ */
                  <div className="space-y-4 relative z-10">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 bg-white rounded-xl border border-stone-100">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-stone-200 shadow-sm">
                          <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-rose-800 font-bold bg-rose-50 inline-block px-3 py-1 rounded-full border border-rose-100 animate-pulse">
                      Selected: {files.length} টি ছবি
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="text-3xl transition-transform duration-300 group-hover:scale-110 block">📸</div>
                    <p className="text-xs text-stone-600 font-semibold">এখানে ক্লিক করে এক বা একাধিক ছবি সিলেক্ট করুন</p>
                    <p className="text-[10px] text-stone-400">Ctrl চেপে ধরে বা ড্র্যাগ করে একসাথে একাধিক ছবি সিলেক্ট করুন</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "uploading" || !name || files.length === 0}
                className="w-full bg-stone-900 hover:bg-rose-900 text-white font-semibold py-4 px-6 rounded-xl text-sm transition-all shadow-md disabled:bg-stone-300 flex items-center justify-center gap-2"
              >
                {status === "uploading" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    সবগুলো ছবি আপলোড হচ্ছে ({files.length} টি)...
                  </>
                ) : (
                  "সব ছবি একসাথে আপলোড দিন ➔"
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="text-center text-xs text-rose-600 font-bold mt-2 bg-rose-50 py-2 rounded-lg border border-rose-100">
                ⚠️ বাল্ক আপলোডে সমস্যা হয়েছে। সাইজ বা নেটওয়ার্ক চেক করে আবার চেষ্টা করো ভাই।
              </p>
            )}

          </form>
        )}

      </div>
    </main>
  );
}
