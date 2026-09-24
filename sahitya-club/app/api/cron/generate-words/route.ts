// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, getDocs, query, where } from "firebase/firestore/lite";
import Groq from "groq-sdk";

const TOTAL_TARGET = 100;
const BATCH_SIZE = 25;
const MAX_BATCH_ATTEMPTS = 3;

type GeneratedWord = {
  word: string;
  meaning: string;
  sentence: string;
};

function normalizeWord(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateBatch(value: unknown): GeneratedWord[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      word: normalizeWord(item.word),
      meaning: normalizeWord(item.meaning),
      sentence: normalizeWord(item.sentence),
    }))
    .filter((item) => item.word && item.meaning && item.sentence);
}

async function generateBatch(groq: Groq, batchNumber: number): Promise<GeneratedWord[]> {
  // Each batch is independent. Previous batches are never included in the prompt.
  const prompt =
    "Generate exactly " + BATCH_SIZE + " unique Bengali literary vocabulary words.\n\n" +
    "Requirements:\n" +
    "- Use real, established Bengali literary words suitable for a vocabulary page.\n" +
    "- Prefer uncommon, elegant, meaningful words, but do not invent words.\n" +
    "- Every word in this batch must be different.\n" +
    "- For each word provide a concise Bengali meaning and one natural Bengali example sentence.\n" +
    "- Return ONLY a JSON object with a words key.\n" +
    "- The words array must contain exactly " + BATCH_SIZE + " items.\n" +
    "- Every item must contain exactly these fields: word, meaning, sentence.\n" +
    "- Do not add any text before or after the JSON.\n\n" +
    "Example shape:\n" +
    '{"words":[{"word":"অনির্বাণ","meaning":"যা কখনো নেভে না","sentence":"শহীদদের স্মৃতি মানুষের হৃদয়ে অনির্বাণ হয়ে থাকবে।"}]}';

  for (let attempt = 1; attempt <= MAX_BATCH_ATTEMPTS; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "openai/gpt-oss-120b",
        temperature: 0.55,
        response_format: { type: "json_object" },
      });

      const responseText = completion.choices[0]?.message?.content?.trim() || "";
      const parsed = JSON.parse(responseText);
      const words = validateBatch(parsed.words);

      const uniqueWords = new Map<string, GeneratedWord>();
      for (const item of words) {
        const key = item.word.replace(/\s+/g, " ").trim();
        if (!uniqueWords.has(key)) uniqueWords.set(key, item);
      }

      const result = Array.from(uniqueWords.values());
      if (result.length === BATCH_SIZE) {
        console.log("✓ Batch " + batchNumber + ": " + result.length + " words generated.");
        return result;
      }

      console.warn("⚠ Batch " + batchNumber + ", attempt " + attempt +
        ": expected " + BATCH_SIZE + ", got " + result.length + ".");
    } catch (error: any) {
      console.error("✕ Batch " + batchNumber + ", attempt " + attempt + " failed:",
        error?.message || error);
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

    // Four independent batches = 100 words.
    for (let batchNumber = 1; batchNumber <= TOTAL_TARGET / BATCH_SIZE; batchNumber++) {
      const generatedBatch = await generateBatch(groq, batchNumber);

      if (generatedBatch.length === 0) {
        return NextResponse.json(
          {
            error: "Generation incomplete.",
            generated: allWords.length,
            required: TOTAL_TARGET,
            failedBatch: batchNumber,
            message: "A batch failed after retries. Existing daily data was not changed.",
          },
          { status: 502 }
        );
      }

      for (const item of generatedBatch) {
        const key = item.word.replace(/\s+/g, " ").trim();
        if (!seenWords.has(key) && allWords.length < TOTAL_TARGET) {
          seenWords.add(key);
          allWords.push(item);
        }
      }

      console.log("Generation progress: " + allWords.length + "/" + TOTAL_TARGET + " unique words.");
    }

    if (allWords.length < TOTAL_TARGET) {
      return NextResponse.json(
        { error: "Generation incomplete.", generated: allWords.length, required: TOTAL_TARGET },
        { status: 502 }
      );
    }

    // Replace today's data only after a complete set of 100 is ready.
    const existingQuery = query(collection(db, "daily_words"), where("date", "==", today));
    const existingSnapshot = await getDocs(existingQuery);
    const batch = writeBatch(db);

    existingSnapshot.forEach((docSnap) => batch.delete(docSnap.ref));

    allWords.slice(0, TOTAL_TARGET).forEach((item) => {
      batch.set(doc(collection(db, "daily_words")), {
        word: item.word,
        meaning: item.meaning,
        sentence: item.sentence,
        date: today,
        createdAt: new Date(),
      });
    });

    await batch.commit();

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
