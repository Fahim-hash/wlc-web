// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore/lite"; 

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
    const prompt = `Generate exactly 50 unique, beautiful, and sophisticated Bengali literary words with their meanings, an example sentence, and 3 wrong options for an MCQ quiz. 
    Return ONLY a valid JSON array. Do NOT wrap it in markdown blocks.
    Format: [{"word": "...", "meaning": "...", "sentence": "...", "options": ["correct_meaning", "wrong1", "wrong2", "wrong3"]}]`;

    // 🤖 ফ্রেশ v1 এন্ডপয়েন্ট এবং লেটেস্ট gemini-2.0-flash মডেল ব্যবহার করা হলো ভাই
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }] 
      })
    });

    const aiData = await response.json();

    // 🛡️ কড়া সেফটি চেক
    if (!aiData.candidates || !aiData.candidates[0] || !aiData.candidates[0].content || !aiData.candidates[0].content.parts[0]) {
      console.error("Gemini raw error:", aiData);
      return NextResponse.json({ error: "AI failed to generate content", raw: aiData }, { status: 500 });
    }

    let rawText = aiData.candidates[0].content.parts[0].text;

    // 🔥 এআই যদি ভুল করে ```json বা ``` জুড়ে দেয়, সেটাকে কেটে সাফ করা হচ্ছে
    rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

    const wordList = JSON.parse(rawText);

    // 🔥 ফায়ারবেসে ব্যাচ আপলোড
    const batch = writeBatch(db);
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
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
