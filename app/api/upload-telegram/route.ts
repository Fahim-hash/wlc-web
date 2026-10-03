// app/api/upload-telegram/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    
    // FormData থেকে সবকটি ফাইল 'files' কি (key) দিয়ে তুলে আনা
    const files = formData.getAll("files") as File[];

    if (!name || files.length === 0) {
      return NextResponse.json({ error: "নাম এবং নূন্যতম একটি ফাইল আবশ্যক।" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: "টেলিগ্রাম এনভায়রনমেন্ট ভেরিয়েবল সেট করা নেই।" }, { status: 500 });
    }

    // 🚀 প্রতিটি ফাইলের জন্য লুপ চালিয়ে আলাদা আলাদা করে টেলিগ্রামে পাঠানো
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = file.name.split(".").pop();
      
      // ফাইল নেমিং ফরম্যাট: Name_1_pic.ext, Name_2_pic.ext
      const customFileName = `${name.trim().replace(/\s+/g, "_")}_${i + 1}_pic.${fileExtension}`;

      const bytes = await file.arrayBuffer();
      const blob = new Blob([bytes], { type: file.type });

      const telegramFormData = new FormData();
      telegramFormData.append("chat_id", chatId);
      telegramFormData.append("document", blob, customFileName);
      telegramFormData.append(
        "caption", 
        `👤 আপলোড করেছেন: ${name}\n📁 ফাইলের নাম: ${customFileName}\n🔢 মোট ছবির সংখ্যা: ${files.length} টির মধ্যে ${i + 1} নম্বর`
      );

      // টেলিগ্রাম এপিআই হিট
      const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: telegramFormData,
      });

      const telegramData = await telegramResponse.json();

      if (!telegramData.ok) {
        console.error(`ফাইল ${customFileName} আপলোডে সমস্যা হয়েছে:`, telegramData);
        return NextResponse.json({ error: `টেলিগ্রামে ${customFileName} পাঠাতে ব্যর্থ।` }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Bulk Upload Error:", error);
    return NextResponse.json({ error: "সার্ভার ইন্টারনাল এরর।" }, { status: 500 });
  }
}
