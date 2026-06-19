// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, getDocs, query, where } from "firebase/firestore/lite"; 
import Groq from "groq-sdk";

export async function GET(request: Request) {
  // 1. Authorization & Security Protocol
  const { searchParams } = new URL(request.url);
  const cronKey = searchParams.get("key");

  if (cronKey !== "wlc_secret_cron_2026") {
    return NextResponse.json({ error: "Access Denied. Invalid token signature." }, { status: 401 });
  }

  // 2. Client Key Validation
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Configuration Fail. Groq Core Key is missing." }, { status: 500 });
  }

  const groq = new Groq({ apiKey });

  const totalTarget = 100; 
  const batchSize = 25;
  const iterations = totalTarget / batchSize;

  let dailyMasterWordList: any[] = [];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

  try {
    // 🛡️ ডুপ্লিকেট প্রোটেকশন: ফায়ারবেসে আজকের ডেটের আগে কোনো ডেটা থাকলে তা তুলে আনা (ডিলিট করার জন্য)
    const existingQuery = query(collection(db, "daily_words"), where("date", "==", today));
    const existingSnapshot = await getDocs(existingQuery);

    for (let i = 0; i < iterations; i++) {
      // আগের ব্যাচগুলোতে অলরেডি চলে আসা শব্দগুলোর একটি লিস্ট তৈরি (যাতে ডুপ্লিকেট না করে)
      const existingWordsInSession = dailyMasterWordList.map(item => item.word.trim());
      const exclusionString = existingWordsInSession.length > 0 
        ? `Do NOT generate any of these words: [${existingWordsInSession.join(", ")}].`
        : "";

      const prompt = `Generate exactly ${batchSize} unique, beautiful, and sophisticated Bengali literary words for a premium vocabulary archive. These must be rare, rich, and completely distinct from daily casual conversation.
      
      ${exclusionString} Ensure these ${batchSize} words are completely unique from each other and from any previous context.

      For each word, provide:
      1. Correct primary meaning (meaning) in beautiful Bengali.
      2. An elegant contextual example sentence (sentence) applying the word organically.

      Return a valid JSON object containing a "words" key which holds the array of items. No markdown wrappers or backticks.

      Target Structure:
      {
        "words": [
          {
            "word": "অনির্বাণ",
            "meaning": "যা কখনো নেভে না বা যা চিরকাল জ্বলছে",
            "sentence": "শহীদদের স্মৃতি এদেশের মানুষের হৃদয়ে অনির্বাণ হয়ে থাকবে।"
          }
        ]
      }`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile', 
        temperature: 0.7, // বৈচিত্র্য বাড়াতে টেম্পারেচার কিছুটা বাড়ানো হলো
        response_format: { type: "json_object" }
      });

      const responseText = chatCompletion.choices[0]?.message?.content?.trim() || "{}";

      let parsedBatch = [];
      try {
        const cleanJson = JSON.parse(responseText);
        parsedBatch = cleanJson.words || cleanJson.data || (Array.isArray(cleanJson) ? cleanJson : []);
        console.log(`✓ ব্যাচ ${i + 1} জেনারেট হয়েছে। শব্দ সংখ্যা: ${parsedBatch.length} টি`);
      } catch (parseError) {
        console.error(`✕ Parsing failure on iteration stream ${i + 1}.`);
        continue; 
      }

      dailyMasterWordList = [...dailyMasterWordList, ...parsedBatch];
    }

    // 🛠️ জাভাস্ক্রিপ্ট লেভেলে ডুপ্লিকেট ফিল্টারিং (যদি এআই ভুল করে একই শব্দ আবার দিয়ে দেয়)
    const uniqueWordMap = new Map();
    dailyMasterWordList.forEach((item: any) => {
      if (item.word && item.meaning) {
        const cleanWord = item.word.trim();
        if (!uniqueWordMap.has(cleanWord)) {
          uniqueWordMap.set(cleanWord, item);
        }
      }
    });
    
    const finalUniqueList = Array.from(uniqueWordMap.values());

    if (finalUniqueList.length === 0) {
      return NextResponse.json({ error: "Generation Anomaly. Compiled repository is empty." }, { status: 500 });
    }

    // 3. Database Sync & Firestore Batch Write
    const batch = writeBatch(db);

    // ১. আগের জমানো আজকের ডুপ্লিকেট ডেটা থাকলে ফায়ারবেস থেকে ডিলিট করা হচ্ছে
    existingSnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    // ২. একদম ফ্রেশ ইউনিক শব্দগুলো ইনসার্ট করা হচ্ছে
    finalUniqueList.forEach((item: any) => {
      batch.set(doc(collection(db, "daily_words")), {
        word: item.word.trim(),
        meaning: item.meaning.trim(),
        sentence: item.sentence ? item.sentence.trim() : "",
        date: today, 
        createdAt: new Date()
      });
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully saved ${finalUniqueList.length} unique literary words for date cycle: ${today}. Previous entries cleared.` 
    });

  } catch (error: any) {
    console.error("Systemic Cron Operations Failure:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
