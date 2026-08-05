import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API Key is missing." }, { status: 500 });
    }

    // 📄 ডাটা ফাইল থেকে ক্লাবের তথ্য পড়া
    const filePath = path.join(process.cwd(), "data", "wlc-info.txt");
    let clubContext = "";
    
    try {
      clubContext = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.warn("WLC Context file not found, using default fallback.");
    }

    const groq = new Groq({ apiKey });

    // 🎯 "কথাসখী" প্রম্পট কনফিগারেশন
    const systemPrompt = {
      role: "system",
      content: `তুমি "কথাসখী" (Kothasokhi)—উইল্‌স সাহিত্য ক্লাব (WLC)-এর অফিশিয়াল সাহিত্যিক AI ডিজিটাল সখী।

      [তোমার নিয়মাবলী]:
      ১. নিচে দেওয়া [নলেজ বেস]-এর উপর ভিত্তি করে নম্র ও সাহিত্যিক বাংলায় উত্তর দাও।
      ২. যদি কোনো তথ্য নলেজ বেসে না থাকে, তবে বিনয়ের সাথে বলো যে তোমার কাছে এই তথ্যটি জানা নেই।
      ৩. বাংলা ভাষার সৌন্দর্য, মার্জিত রূপ ও শালীনতা বজায় রাখবে।

      [নলেজ বেস]:
      ${clubContext}`
    };

    const completion = await groq.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "অনাকাঙ্ক্ষিত কোনো সমস্যা হয়েছে।" }, { status: 500 });
  }
}
