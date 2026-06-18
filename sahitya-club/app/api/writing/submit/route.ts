// app/api/writing/submit/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "../../../../lib/firebase"; // 👈 আমাদের তৈরি করা সেন্ট্রাল ফায়ারবেস কানেকশন
import { collection, addDoc } from "firebase/firestore"; // 👈 ফায়ারস্টোরে ডাটা এড করার মেথড

// ১. Zod দিয়ে কঠোর ডেটা ভ্যালিডেশন স্কিমা (XSS Injection ডিফেন্স)
const submitSchema = z.object({
  title: z.string().min(2, "শিরোনাম খুব ছোট").max(100, "শিরোনাম ১০০ ক্যারেক্টারের বেশি হতে পারবে না").trim(),
  category: z.enum(["poetry", "story", "essay"]),
  content: z.string().min(10, "লেখা খুব ছোট").max(5000, "লেখা ৫০০০ ক্যারেক্টারের বেশি হতে পারবে না").trim(),
  penName: z.string().max(50, "ছদ্মনাম ৫০ ক্যারেক্টারের বেশি হতে পারবে না").trim().default("অজ্ঞাতনামা"), // খালি থাকলে ডিফল্ট ভ্যালু
});

export async function POST(request: Request) {
  try {
    // সিকিউরিটি চেক ২: কনটেন্ট টাইপ চেক
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ message: "Invalid Content Type" }, { status: 400 });
    }

    const body = await request.json();

    // সিকিউরিটি চেক ৩: ডাটা স্যানিটাইজেশন এবং স্কিমা ম্যাচিং
    const validation = submitSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "সিকিউরিটি ভায়োলেশন! ভুল বা ক্ষতিকারক ডাটা ডিটেক্ট হয়েছে।", errors: validation.error.format() },
        { status: 422 }
      );
    }

    const cleanedData = validation.data;

    // 🇧🇩 পিওর বাংলাদেশ টাইমজোন ডেট (YYYY-MM-DD)
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

    // 🔥 ফায়ারবেস ফায়ারস্টোর অপারেশন (এখানেই আসল ম্যাজিক হচ্ছে ভাই)
    // এটি ফায়ারবেসে 'writings' নামে কালেকশন তৈরি করবে (যদি না থাকে) এবং ডাটা পুশ করবে
    const docRef = await addDoc(collection(db, "writings"), {
      title: cleanedData.title,
      category: cleanedData.category,
      content: cleanedData.content,
      penName: cleanedData.penName,
      status: "pending", // 👈 মডারেশনের জন্য প্রথমে 'pending' থাকবে, যা তুমি /controlhub থেকে অ্যাপ্রুভ করবে
      date: today,
      createdAt: new Date(),
      userIp: request.headers.get("x-forwarded-for") || "unknown" // ট্র্যাকিং আইপি
    });

    console.log("Document successfully written with ID to Firebase:", docRef.id);

    return NextResponse.json(
      { message: "তোমার লেখাটি সফলভাবে জমা হয়েছে ভাই! মডারেটর প্যানেলের অনুমোদনের পর এটি লাইভ করা হবে।" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Firebase/Internal Server Error:", error);
    return NextResponse.json(
      { message: "সার্ভারে কোনো ইন্টারনাল সিকিউরিটি বা টেকনিক্যাল ইস্যু হয়েছে।", error: error.message },
      { status: 500 }
    );
  }
}
