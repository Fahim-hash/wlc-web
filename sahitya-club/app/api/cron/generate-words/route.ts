// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore/lite"; // 👈 ফায়ারস্টোর লাইট মডিউল (সবচেয়ে ইম্পর্ট্যান্ট ফিক্স)

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
    // পিওর এবং কড়া প্রম্পট
    const prompt = `Generate exactly 50 unique, beautiful, and sophisticated Bengali literary words with their meanings, an example sentence, and 3 wrong options for an MCQ quiz. 
    You must return ONLY a raw JSON array. No markdown, no \`\`\`json blocks, no explanations.
    Format: [{"word": "...", "meaning": "...", "sentence": "...", "options": ["correct_meaning", "wrong1", "wrong2", "wrong3"]}]`;
    
    // 🤖 লেটেস্ট gemini-1.5-flash মডেল ব্যবহার করা হলো
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" } // 👈 এটি Gemini-কে বাধ্য করবে শুধু ফ্রেশ JSON ব্যাক করতে
      })
    });

    const aiData = await response.json();

    // 🛡️ কড়া সেফটি চেক (যাতে candidates[0] আনডিফাইন্ড এরর না আসে)
    if (!aiData.candidates || !aiData.candidates[0] || !aiData.candidates[0].content || !aiData.candidates[0].content.parts[0]) {
      console.error("Gemini raw error:", aiData);
      return NextResponse.json({ error: "AI failed to generate content or returned invalid structure", raw: aiData }, { status: 500 });
    }

    const rawJsonText = aiData.candidates[0].content.parts[0].text;
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

    return NextResponse.json({ success: true, message: `${wordList.length} words uploaded successfully for date: ${today}!` });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
