// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore/lite"; 
import { GoogleGenerativeAI } from "@google/generative-ai"; 

export async function GET(request: Request) {
  // ১. সিকিউরিটি চেক
  const { searchParams } = new URL(request.url);
  const cronKey = searchParams.get("key");
  if (cronKey !== "wlc_secret_cron_2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ২. এপিআই কী চেক
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API Key is missing in Vercel Variables!" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    
    // 🤖 অল-টাইম স্টেবল এবং বাঘা মডেল gemini-1.5-pro সেট করা হলো ভাই
    const model = ai.getGenerativeModel({
      model: "gemini-1.5-pro", 
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    // কড়া এবং নিখুঁত প্রম্পট
    const prompt = `Generate exactly 50 unique, beautiful, and sophisticated Bengali literary words with their meanings, an example sentence, and 3 wrong options for an MCQ quiz. 
    You must return ONLY a raw JSON array. No markdown, no \`\`\`json blocks, no explanations.
    Format: [{"word": "...", "meaning": "...", "sentence": "...", "options": ["correct_meaning", "wrong1", "wrong2", "wrong3"]}]`;
    
    // কন্টেন্ট জেনারেট করা
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rawJsonText = result.response.text();
    
    if (!rawJsonText) {
      return NextResponse.json({ error: "AI returned empty text" }, { status: 500 });
    }

    const wordList = JSON.parse(rawJsonText);

    // 🔥 ফায়ারবেসে ব্যাচ আপলোড
    const batch = writeBatch(db);
    
    // 🇧🇩 পিওর বাংলাদেশ টাইমজোন ডেট (YYYY-MM-DD)
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

    wordList.forEach((item: any) => {
      const docRef = doc(collection(db, "daily_words"));
      batch.set(docRef, {
        word: item.word,
        meaning: item.meaning,
        sentence: item.sentence,
        options: item.options,
        date: today,
        createdAt: new Date()
      });
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `${wordList.length} words uploaded successfully for date: ${today}!` 
    });

  } catch (error: any) {
    console.error("SDK Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
