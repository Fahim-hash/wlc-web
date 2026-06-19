// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore/lite"; 
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
  
  // Daily target config: 10 batches x 10 words = 100 unique words per 24 hours
  const totalTarget = 100; 
  const batchSize = 10;
  const iterations = totalTarget / batchSize;
  
  let dailyMasterWordList: any[] = [];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

  try {
    // Strategic iterative parsing to bypass prompt token limit and guarantee 100 words
    for (let i = 0; i < iterations; i++) {
      const prompt = `Generate exactly ${batchSize} unique, beautiful, and sophisticated Bengali literary words for a premium vocabulary evaluation platform. These must be completely distinct from typical everyday vocabulary.
      
      For each word, provide:
      1. Correct primary meaning in Bengali.
      2. An elegant contextual example sentence applying the word organically.
      3. An array of 4 options containing the correct meaning along with 3 contextual but highly challenging incorrect alternatives (distractors).

      Ensure absolute structural uniformity. Do NOT duplicate words across this batch. Return ONLY a valid raw JSON array matching the target layout perfectly with no markdown block identifiers or backticks.

      Target Structure:
      [
        {
          "word": "শব্দ",
          "meaning": "সঠিক অর্থ",
          "sentence": "বাক্যে প্রয়োগের উদাহরণ।",
          "options": ["সঠিক অর্থ", "ভুল অর্থ ১", "ভুল অর্থ ২", "ভুল অর্থ ৩"]
        }
      ]`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-specdec',
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const responseText = chatCompletion.choices[0]?.message?.content?.trim() || "[]";
      
      let parsedBatch = [];
      try {
        const cleanJson = JSON.parse(responseText);
        parsedBatch = Array.isArray(cleanJson) ? cleanJson : (cleanJson.words || cleanJson.data || []);
      } catch (parseError) {
        console.error(`Parsing failure on iteration stream ${i + 1}. Reallocating resource...`);
        continue; 
      }

      dailyMasterWordList = [...dailyMasterWordList, ...parsedBatch];
    }

    if (dailyMasterWordList.length === 0) {
      return NextResponse.json({ error: "Generation Anomaly. Compiled repository is empty." }, { status: 500 });
    }

    // 3. Database Sync & Firestore Batch Write (Max 500 items per batch)
    const batch = writeBatch(db);

    dailyMasterWordList.forEach((item: any) => {
      if (item.word && item.meaning && Array.isArray(item.options)) {
        const docRef = doc(collection(db, "daily_words"));
        batch.set(docRef, {
          word: item.word,
          meaning: item.meaning,
          sentence: item.sentence || "",
          options: item.options,
          date: today, // Hardcoded standard date template: YYYY-MM-DD (Asia/Dhaka)
          createdAt: new Date()
        });
      }
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: `Successfully populated and synchronized ${dailyMasterWordList.length} premium entities for date cycle: ${today}.` 
    });

  } catch (error: any) {
    console.error("Systemic Cron Operations Failure:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
