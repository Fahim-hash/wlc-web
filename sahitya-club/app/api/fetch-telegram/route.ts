// app/api/fetch-telegram/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "কনফিগারেশন পাওয়া যায়নি।" }, { status: 500 });
    }

    // ১. টেলিগ্রাম চ্যানেল থেকে সাম্প্রতিক মেসেজগুলো ফেচ করা
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=-100`);
    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json({ error: "টেলিগ্রাম থেকে ডাটা আনতে ব্যর্থ।" }, { status: 500 });
    }

    const images: string[] = [];

    // ২. মেসেজগুলো থেকে ছবির ডিরেক্ট লিংক জেনারেট করা
    for (const update of data.result) {
      // ওয়েবসাইট থেকে বা ম্যানুয়ালি ডকুমেন্ট হিসেবে আপলোড করা ফাইল চেক
      const document = update.channel_post?.document;
      // সরাসরি ছবি হিসেবে আপলোড করা ফাইল চেক (ম্যানুয়াল আপলোড)
      const photoArray = update.channel_post?.photo;

      let fileId = "";

      if (document && document.mime_type.startsWith("image/")) {
        fileId = document.file_id;
      } else if (photoArray && photoArray.length > 0) {
        // সবচেয়ে হাই-কোয়ালিটি (সবচেয়ে বড় সাইজ) ছবিটির আইডি নেওয়া
        fileId = photoArray[photoArray.length - 1].file_id;
      }

      if (fileId) {
        // ৩. file_id দিয়ে টেলিগ্রামের নিজস্ব সোর্স পাথ বের করা
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();

        if (fileData.ok && fileData.result.file_path) {
          const directImageUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
          images.unshift(directImageUrl); // নতুন ছবিগুলো গ্যালারির শুরুতে দেখাবে
        }
      }
    }

    // ক্যাশিং এড়াতে no-store রেসপন্স পাঠানো হচ্ছে
    return NextResponse.json({ success: true, images }, {
      headers: { "Cache-Control": "no-store, max-age=0" }
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "সার্ভার ইন্টারনাল এরর।" }, { status: 500 });
  }
}
