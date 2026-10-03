// app/api/cron/generate-words/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  writeBatch,
  doc,
  getDocs,
  query,
  where,
  runTransaction,
} from "firebase/firestore/lite";
import Groq from "groq-sdk";

const TOTAL_TARGET = 100;
const MAX_GENERATION_ATTEMPTS = 3;
const LOCK_TTL_MS = 10 * 60 * 1000;

const WORD_CATEGORIES = [
  "প্রকৃতি, ঋতু, আকাশ, নদী, বৃষ্টি ও ভূদৃশ্য",
  "অনুভূতি, আবেগ, মন ও মানবিক সম্পর্ক",
  "সাহিত্য, কবিতা, শিল্প, সঙ্গীত ও নন্দনতত্ত্ব",
  "চরিত্র, ব্যক্তিত্ব, আচরণ ও মানবস্বভাব",
  "জ্ঞান, চিন্তা, দর্শন, প্রজ্ঞা ও বুদ্ধিবৃত্তিক ধারণা",
  "আলো, অন্ধকার, রং, শব্দ, গন্ধ ও ইন্দ্রিয়",
  "সময়, স্মৃতি, অতীত, ভবিষ্যৎ ও পরিবর্তন",
  "সমাজ, সংস্কৃতি, সভ্যতা, ইতিহাস ও ঐতিহ্য",
  "নৈতিকতা, মূল্যবোধ, আদর্শ ও জীবনদর্শন",
  "শহর, গ্রাম, পথ, যাত্রা ও দৈনন্দিন জীবনের সাহিত্যিক শব্দ",
  "প্রাচীন ও সাধুভাষার প্রচলিত সাহিত্যিক শব্দ",
  "সংস্কৃতমূল ও তৎসম বাংলা শব্দ",
  "ফারসি, আরবি ও অন্যান্য উৎস থেকে বাংলায় প্রতিষ্ঠিত সাহিত্যিক শব্দ",
  "প্রেম, বিরহ, আকাঙ্ক্ষা, অপেক্ষা ও আবেগঘন সাহিত্যিক শব্দ",
  "বীরত্ব, সংগ্রাম, সাহস, দৃঢ়তা ও প্রতিরোধ",
  "শান্তি, নীরবতা, নিঃসঙ্গতা, ধ্যান ও অন্তর্জগত",
  "রহস্য, কৌতূহল, বিস্ময়, স্বপ্ন ও কল্পনা",
  "প্রাণী, উদ্ভিদ, ফুল, পাখি ও জীবজগত",
  "আলোচনা, ভাষা, বক্তব্য, প্রকাশ ও যোগাযোগ",
  "দুর্লভ কিন্তু অভিধানসম্মত বাংলা সাহিত্যিক শব্দ",
];

type GeneratedWord = {
  word: string;
  meaning: string;
  sentence: string;
};

function normalize(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function validateWords(value: unknown): GeneratedWord[] {
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
    if (!unique.has(key)) unique.set(key, { word, meaning, sentence });
  }

  return Array.from(unique.values());
}

async function generateWords(
  groq: Groq,
  attempt: number
): Promise<GeneratedWord[]> {
  const prompt =
    "Generate exactly 100 UNIQUE Bengali literary vocabulary words in ONE response.\n" +
    "Cover a broad mix of these areas: " + WORD_CATEGORIES.join(" | ") + ".\n" +
    "Use only established Bengali words found in reputable Bengali dictionaries or recognized Bengali literature.\n" +
    "Do NOT invent, fabricate, merge, mechanically combine, or create pseudo-words.\n" +
    "Do NOT repeat any word, including spelling variants that represent the same word.\n" +
    "Prefer uncommon, elegant, useful literary Bengali vocabulary rather than ordinary everyday words.\n" +
    "For every word provide a concise accurate Bengali meaning and one natural Bengali example sentence.\n" +
    "Return ONLY one JSON object with a top-level 'words' array containing exactly 100 objects.\n" +
    "Each object must contain ONLY: word, meaning, sentence.\n" +
    "No markdown, explanation, comments, headings, or extra text.\n" +
    "This is generation attempt " + attempt + " of " + MAX_GENERATION_ATTEMPTS + ".";

  for (let retry = 1; retry <= 2; retry++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "openai/gpt-oss-120b",
        temperature: 0.45,
        max_completion_tokens: 12000,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "bengali_vocabulary",
            strict: true,
            schema: {
              type: "object",
              properties: {
                words: {
                  type: "array",
                  minItems: TOTAL_TARGET,
                  maxItems: TOTAL_TARGET,
                  items: {
                    type: "object",
                    properties: {
                      word: { type: "string" },
                      meaning: { type: "string" },
                      sentence: { type: "string" },
                    },
                    required: ["word", "meaning", "sentence"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["words"],
              additionalProperties: false,
            },
          },
        } as any,
      });

      const responseText = completion.choices[0]?.message?.content?.trim() || "";
      const parsed = JSON.parse(responseText);
      const words = validateWords(parsed?.words);

      if (words.length === TOTAL_TARGET) {
        console.log("✓ Generated exactly 100 unique words in one prompt on attempt " + attempt + ".");
        return words;
      }

      console.warn(
        "⚠ Attempt " + attempt + ", API retry " + retry +
        ": got " + words.length + " unique valid words; expected 100."
      );
    } catch (error: any) {
      console.error(
        "✕ Attempt " + attempt + ", API retry " + retry + " failed:",
        error?.message || error
      );
    }
  }

  return [];
}

async function acquireGenerationLock(): Promise<boolean> {
  const lockRef = doc(collection(db, "system_locks"), "daily_words_generation");
  const now = Date.now();
  const expiresAt = now + LOCK_TTL_MS;

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(lockRef);
    const current = snapshot.exists() ? snapshot.data() : null;

    if (current?.expiresAt && Number(current.expiresAt) > now) {
      return false;
    }

    transaction.set(lockRef, {
      locked: true,
      startedAt: now,
      expiresAt,
    });

    return true;
  });
}

async function releaseGenerationLock(): Promise<void> {
  const lockRef = doc(collection(db, "system_locks"), "daily_words_generation");

  try {
    await runTransaction(db, async (transaction) => {
      transaction.delete(lockRef);
    });
  } catch (error) {
    console.error("Failed to release daily word generation lock:", error);
  }
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

  let lockAcquired = false;

  try {
    lockAcquired = await acquireGenerationLock();

    if (!lockAcquired) {
      return NextResponse.json(
        {
          error: "Generation already in progress.",
          message: "Another daily word generation request is currently running. Please do not start another request.",
        },
        { status: 409 }
      );
    }

    const groq = new Groq({ apiKey });
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Dhaka",
    });

    let allWords: GeneratedWord[] = [];

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
      allWords = await generateWords(groq, attempt);
      if (allWords.length === TOTAL_TARGET) break;
    }

    if (allWords.length < TOTAL_TARGET) {
      return NextResponse.json(
        {
          error: "Generation incomplete.",
          generated: allWords.length,
          required: TOTAL_TARGET,
          message:
            "Could not produce exactly 100 unique valid words after multiple single-prompt attempts. Existing daily data was not changed.",
        },
        { status: 502 }
      );
    }


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
      message:
        "Successfully generated and saved " +
        TOTAL_TARGET +
        " unique literary words for " +
        today +
        ".",
      date: today,
      count: TOTAL_TARGET,
    });
  } catch (error: any) {
    console.error("Systemic Cron Operations Failure:", error);

    return NextResponse.json(
      { error: error?.message || "Unknown generation failure." },
      { status: 500 }
    );
  } finally {
    if (lockAcquired) {
      await releaseGenerationLock();
    }
  }
}
