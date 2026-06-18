// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";

export async function GET(request: Request) {
  // সিকিউরিটি চেক (ক্রন জব ছাড়া অন্য কেউ যেন রান করতে না পারে)
  const { searchParams } = new URL(request.url);
  const cronKey = searchParams.get("key");
  if (cronKey !== "wlc_secret_cron_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 🤖 Gemini API Call (অথবা তোমার পছন্দের যেকোনো AI SDK)
    const prompt = `Generate exactly 50 unique, beautiful, and sophisticated Bengali literary words with their meanings, an example sentence, and 3 wrong options for an MCQ quiz. Return raw JSON format only: [{"word": "...", "meaning": "...", "sentence": "...", "options": ["correct_meaning", "wrong1", "wrong2", "wrong3"]}]. Do not include markdown code blocks.`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const aiData = await response.json();
    const rawJsonText = aiData.candidates[0].content.parts[0].text;
    const wordList = JSON.parse(rawJsonText);

    // 🔥 ফায়ারবেসে ব্যাচ আপলোড (যাতে একবারে সব ডাটা সেভ হয়)
    const batch = writeBatch(db);
    const today = new Date().toISOString().split('T')[0]; // আজকের ডেট স্ট্যাম্প

    wordList.forEach((item: any, index: number) => {
      const docRef = doc(collection(db, "daily_words"));
      batch.set(docRef, {
        ...item,
        date: today,
        createdAt: new Date()
      });
    });

    await batch.commit();

    return NextResponse.json({ success: true, message: `${wordList.length} words uploaded successfully for today!` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
