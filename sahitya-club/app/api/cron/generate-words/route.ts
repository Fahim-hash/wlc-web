// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, getDocs, query, where } from "firebase/firestore/lite";
import Groq from "groq-sdk";

const TOTAL_TARGET = 100;
const BATCH_SIZE = 10;
const MAX_BATCH_ATTEMPTS = 5;
const MAX_BATCHES = 14;

type GeneratedWord = {
  word: string;
  meaning: string;
  sentence: string;
};

function normalize(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function validateBatch(value: unknown): GeneratedWord[] {
  if (!Array.isArray(value)) return [];

  const unique = new Map<string, GeneratedWord>();

  for (const item of value) {
    if (!item || typeof item !== "object") continue;

    const row = item as Record<string, unknown>;
    const word = normalize(row.word);
    const meaning = normalize(row.meaning);
    const sentence = normalize(row.sentence);

    if (!word || !meaning || !sentence) continue;

    const key = word.toLocaleLowerCase("bn-BD");
    if (!unique.has(key)) {
      unique.set(key, { word, meaning, sentence });
    }
  }

  return Array.from(unique.values());
}

async function generateBatch(groq: Groq, batchNumber: number): Promise<GeneratedWord[]> {
  // IMPORTANT: every request is independent. No previous batch is sent to Groq.
  const prompt =
    "Generate exactly " + BATCH_SIZE + " different, real Bengali literary vocabulary words.\n" +
    "Use established Bengali words; do not invent words. Prefer uncommon and elegant words.\n" +
    "For every word give a short accurate Bengali meaning and one natural Bengali example sentence.\n" +
    "Return ONLY valid JSON. No markdown, comments, explanation, or extra text.\n" +
    "JSON shape: {\"words\":[{\"word\":\"...\",\"meaning\":\"...\",\"sentence\":\"...\"}]}\n" +
    "The words array MUST contain exactly " + BATCH_SIZE + " items.\n" +
    "Each item MUST contain exactly: word, meaning, sentence.";

  for (let attempt = 1; attempt <= MAX_BATCH_ATTEMPTS; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "openai/gpt-oss-120b",
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const responseText = completion.choices[0]?.message?.content?.trim() || "";
      const parsed = JSON.parse(responseText);
      const result = validateBatch(parsed?.words);

      if (result.length === BATCH_SIZE) {
        console.log("✓ Batch " + batchNumber + " attempt " + attempt + ": " + result.length + " words.");
        return result;
      }

      console.warn(
        "⚠ Batch " + batchNumber + " attempt " + attempt +
        ": expected " + BATCH_SIZE + ", got " + result.length + "."
      );
    } catch (error: any) {
      console.error(
        "✕ Batch " + batchNumber + " attempt " + attempt + " failed:",
        error?.message || error
      );
    }
  }

  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cronKey = searchParams.get("key");
  const expectedCronKey = process.env.CRON_SECRET;

  if (!expectedCronKey || cronKey !== expectedCronKey) {
    return NextResponse.json(
      { error: "Access Denied. Invalid token signature." },
      { status: 401 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Configuration Fail. Groq Core Key is missing." },
      { status: 500 }
    );
  }

  const groq = new Groq({ apiKey });
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

  try {
    const allWords: GeneratedWord[] = [];
    const seenWords = new Set<string>();

    // Generate small independent batches until we have exactly 100 unique words.
    // Previous batches are NEVER included in any prompt.
    for (let batchNumber = 1; batchNumber <= MAX_BATCHES && allWords.length < TOTAL_TARGET; batchNumber++) {
      const generatedBatch = await generateBatch(groq, batchNumber);

      if (generatedBatch.length === 0) {
        console.warn("⚠ Batch " + batchNumber + " produced no usable words; continuing with a fresh independent batch.");
        continue;
      }

      let added = 0;
      for (const item of generatedBatch) {
        const key = item.word.toLocaleLowerCase("bn-BD");

        if (!seenWords.has(key) && allWords.length < TOTAL_TARGET) {
          seenWords.add(key);
          allWords.push(item);
          added++;
        }
      }

      console.log(
        "Generation progress: " + allWords.length + "/" + TOTAL_TARGET +
        " unique words (" + added + " added from batch " + batchNumber + ")."
      );
    }

    if (allWords.length < TOTAL_TARGET) {
      return NextResponse.json(
        {
          error: "Generation incomplete.",
          generated: allWords.length,
          required: TOTAL_TARGET,
          message: "Could not produce 100 unique valid words after multiple independent attempts. Existing daily data was not changed.",
        },
        { status: 502 }
      );
    }

    // Replace today's data only after a complete set of 100 is ready.
    const existingQuery = query(
      collection(db, "daily_words"),
      where("date", "==", today)
    );
    const existingSnapshot = await getDocs(existingQuery);
    const firestoreBatch = writeBatch(db);

    existingSnapshot.forEach((docSnap) => firestoreBatch.delete(docSnap.ref));

    allWords.slice(0, TOTAL_TARGET).forEach((item) => {
      firestoreBatch.set(doc(collection(db, "daily_words")), {
        word: item.word,
        meaning: item.meaning,
        sentence: item.sentence,
        date: today,
        createdAt: new Date(),
      });
    });

    await firestoreBatch.commit();

    return NextResponse.json({
      success: true,
      message: "Successfully generated and saved " + TOTAL_TARGET + " unique literary words for " + today + ".",
      date: today,
      count: TOTAL_TARGET,
    });
  } catch (error: any) {
    console.error("Systemic Cron Operations Failure:", error);

    return NextResponse.json(
      { error: error?.message || "Unknown generation failure." },
      { status: 500 }
    );
  }
}
