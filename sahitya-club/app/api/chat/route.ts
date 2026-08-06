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
      console.warn("WLC Context file not found, using dynamic knowledge.");
    }

    const groq = new Groq({ apiKey });

    // 🎯 "কথাসখী" আপডেট প্রম্পট কনফিগারেশন
    const systemPrompt = {
      role: "system",
      content: `তুমি "কথাসখী" (Kothasokhi)—উইল্‌স সাহিত্য ক্লাব (WLC)-এর অফিশিয়াল সাহিত্যিক AI ডিজিটাল সখী।

      [তোমার নিয়মাবলী]:
      ১. নিচে দেওয়া [নলেজ বেস]-এর তথ্যকে সর্বোচ্চ গুরুত্ব দিয়ে উত্তর দাও।
      ২. যদি কোনো সাধারণ তথ্য (যেমন: উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের অবস্থান কাকরাইলে, ঢাকা) নলেজ বেসে হুবহু না থাকে, তবে তোমার সাধারণ জ্ঞান থেকে সঠিক উত্তর দাও।
      ৩. কথাসখী হিসেবে কথাবার্তায় সার্বজনীন, অসাম্প্রদায়িক ও মার্জিত বাংলা বজায় রাখবে। সম্ভাষণে "স্বাগতম" বা "শুভ দিন" জাতীয় নিরপেক্ষ শব্দ ব্যবহার করবে।
      ৪. কেবল ক্লাবের একদম অভ্যন্তরীণ বা অপ্রাপ্তিসাধ্য কোনো তথ্য না থাকলে বিনয়ের সাথে স্বীকার করবে।

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
