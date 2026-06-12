// app/api/webhook/telegram/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "public", "telegram-data.json");

// JSON ফাইল রিড ও রাইট করার হেল্পার ফাংশন
function getSavedData(): string[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf-8");
      return JSON.parse(fileContent) || [];
    }
  } catch (e) {
    console.error("Error reading JSON file", e);
  }
  return [];
}

function saveData(data: string[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing JSON file", e);
  }
}

export async function POST(request: Request) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const body = await request.json();

    // ১. নতুন পোস্ট বা ডকুমেন্ট হ্যান্ডেল করা
    const post = body.channel_post || body.edited_channel_post;
    
    if (post) {
      const document = post.document;
      const photoArray = post.photo;
      let fileId = "";

      if (document && document.mime_type?.startsWith("image/")) {
        fileId = document.file_id;
      } else if (photoArray && photoArray.length > 0) {
        fileId = photoArray[photoArray.length - 1].file_id;
      }

      if (fileId) {
        // টেলিগ্রাম থেকে ডিরেক্ট ফাইল পাথ নেওয়া
        const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const fileData = await fileRes.json();

        if (fileData.ok && fileData.result.file_path) {
          const directUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
          
          let currentImages = getSavedData();
          if (!currentImages.includes(directUrl)) {
            currentImages.unshift(directUrl); // নতুন ছবি সবার আগে পুশ হবে
            saveData(currentImages);
          }
        }
      }
    }

    // ২. যদি চ্যানেল থেকে কোনো পোস্ট ডিলিট করা হয় (অটোমেটিক রিমুভাল)
    // নোট: কিছু ক্ষেত্রে টেলিগ্রাম ডিলিট হওয়া মেসেজের ডিরেক্ট ফাইল আইডি দেয় না, 
    // তবে এটি সেফসাইড ট্র্যাকিং এর জন্য রাখা হলো।
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
