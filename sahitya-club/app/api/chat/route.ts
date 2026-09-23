import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type WebResult = {\n  title: string;\n  url: string;\n  content: string;\n};\n\ntype KnowledgeChunk = {
  text: string;
  normalized: string;
  tokens: Set<string>;
};

const BANGLISH_MAP: Record<string, string> = {
  ke: "কে", k: "কে", who: "কে",
  ki: "কি", what: "কি",
  kothay: "কোথায়", where: "কোথায়",
  kobe: "কবে", when: "কবে",
  kivabe: "কীভাবে", how: "কীভাবে",
  dao: "দাও", den: "দেন", diba: "দিবা", send: "দাও",
  link: "লিংক", website: "ওয়েবসাইট", site: "ওয়েবসাইট",
  fb: "ফেসবুক", facebook: "ফেসবুক", fesbuk: "ফেসবুক",
  insta: "ইনস্টাগ্রাম", ig: "ইনস্টাগ্রাম", instagram: "ইনস্টাগ্রাম",
  club: "ক্লাব", clb: "ক্লাব",
  member: "সদস্য", membar: "সদস্য", sodosso: "সদস্য",
  committee: "কমিটি", commitee: "কমিটি", komiti: "কমিটি",
  president: "সভাপতি", presi: "সভাপতি",
  secretary: "সম্পাদক", sec: "সম্পাদক",
  moderator: "মডারেটর", teacher: "শিক্ষক",
  event: "ইভেন্ট", program: "ইভেন্ট", prog: "ইভেন্ট",
  achievement: "অর্জন", award: "পুরস্কার",
  fahim: "ফাহিম",
};

function normalizeText(input: string) {
  const lower = input
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");

  return lower
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => BANGLISH_MAP[word] || word)
    .join(" ");
}

function tokenize(input: string) {
  return new Set(
    normalizeText(input)
      .split(/\s+/)
      .filter((word) => word.length >= 2)
  );
}

function loadKnowledge(): KnowledgeChunk[] {
  const filePath = path.join(process.cwd(), "data", "wlc-info.txt");
  const raw = fs.readFileSync(filePath, "utf8");

  // Each === section is independently retrievable.
  return raw
    .split(/(?=^=== )/m)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text) => ({
      text,
      normalized: normalizeText(text),
      tokens: tokenize(text),
    }));
}

function retrieveKnowledge(query: string, chunks: KnowledgeChunk[], limit = 3) {
  const queryTokens = tokenize(query);

  if (!queryTokens.size) {
    return chunks.slice(0, limit).map((chunk) => chunk.text);
  }

  const scored = chunks.map((chunk) => {
    let score = 0;

    for (const token of queryTokens) {
      if (chunk.tokens.has(token)) score += 3;
      if (chunk.normalized.includes(token)) score += 1;
    }

    // Strong boosts for direct intent/category matches.
    const q = normalizeText(query);
    if (q.includes("ফেসবুক") && chunk.normalized.includes("ফেসবুক")) score += 12;
    if (q.includes("ইনস্টাগ্রাম") && chunk.normalized.includes("ইনস্টাগ্রাম")) score += 12;
    if (q.includes("ফাহিম") && chunk.normalized.includes("ফাহিম")) score += 15;
    if (q.includes("কমিটি") && chunk.normalized.includes("কমিটি")) score += 8;
    if (q.includes("ইভেন্ট") && chunk.normalized.includes("ইভেন্ট")) score += 8;
    if (q.includes("অর্জন") && chunk.normalized.includes("অর্জন")) score += 8;

    return { text: chunk.text, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.text);
}

function isClubContext(input: string) {
  const q = normalizeText(input);
  return q.includes("wlc") || q.includes("ক্লাব") || q.includes("উইলস") || q.includes("সাহিত্য") || q.includes("willes");
}

function actionReply(input: string): string | null {
  const q = normalizeText(input);
  const clubContext = isClubContext(input);

  const wantsLink =
    /\b(link|url|dao|den|send)\b/i.test(input) ||
    q.includes("লিংক") || q.includes("দাও") || q.includes("দেন") || q.includes("কোথায়");

  if (!wantsLink) return null;

  const mentionsPerson =
    q.includes("ফাহিম") || q.includes("member") || q.includes("সদস্য") ||
    q.includes("person") || q.includes("মানুষ") || q.includes("president") ||
    q.includes("সভাপতি") || q.includes("secretary") || q.includes("সম্পাদক");

  const actions: Array<{ terms: string[]; label: string; url: string; message: string }> = [
    { terms: ["ফেসবুক"], label: "Official WLC Facebook", url: "https://www.facebook.com/share/1BfViwgesC/", message: "এটাই উইল্‌স সাহিত্য ক্লাবের official Facebook:" },
    { terms: ["ইনস্টাগ্রাম"], label: "Official WLC Instagram", url: "https://www.instagram.com/willes_literary_club/", message: "এটাই উইল্‌স সাহিত্য ক্লাবের official Instagram:" },
    { terms: ["রেজিস্ট্রেশন", "সদস্য", "মেম্বার"], label: "Join WLC", url: "https://wlc.pro.bd/register", message: "WLC-তে সদস্য হওয়ার অফিসিয়াল রেজিস্ট্রেশন পেজ:" },
    { terms: ["ওয়েবসাইট"], label: "WLC Website", url: "https://wlc.pro.bd/", message: "উইল্‌স সাহিত্য ক্লাবের অফিসিয়াল ওয়েবসাইট:" },
    { terms: ["কমিটি", "প্যানেল"], label: "Current Committee", url: "https://wlc.pro.bd/panel/running", message: "বর্তমান ২০২৬ কমিটি:" },
    { terms: ["ইভেন্ট"], label: "WLC Events", url: "https://wlc.pro.bd/events", message: "WLC-এর ইভেন্ট পেজ:" },
    { terms: ["অর্জন", "পুরস্কার"], label: "WLC Achievements", url: "https://wlc.pro.bd/achievements", message: "WLC-এর অর্জন ও পুরস্কারের পেজ:" },
    { terms: ["যোগাযোগ"], label: "WLC Contact", url: "https://wlc.pro.bd/contact", message: "WLC-এর অফিসিয়াল যোগাযোগ পেজ:" },
    { terms: ["লেখালেখি"], label: "WLC Writing Desk", url: "https://wlc.pro.bd/writing", message: "WLC Writing Desk:" },
    { terms: ["ছবি", "গ্যালারি", "অ্যালবাম"], label: "WLC Photo Album", url: "https://wlc.pro.bd/album", message: "WLC-এর ছবি ও স্মৃতির অ্যালবাম:" },
    { terms: ["মডারেটর", "শিক্ষক"], label: "Teacher Moderators", url: "https://wlc.pro.bd/panel/moderator", message: "WLC-এর শিক্ষক মডারেটর প্যানেল:" },
  ];

  const match = actions.find((action) => {
    if ((action.terms.includes("ফেসবুক") || action.terms.includes("ইনস্টাগ্রাম")) && mentionsPerson) return false;
    if (action.terms.includes("ফেসবুক") || action.terms.includes("ইনস্টাগ্রাম")) return clubContext || !mentionsPerson;
    return action.terms.some((term) => q.includes(term));
  });

  return match ? `${match.message}\n\n[BUTTON:${match.label}|${match.url}]` : null;
}

function needsWebSearch(input: string) {
  const q = normalizeText(input);
  const lower = input.toLowerCase();

  const linkIntent =
    /\b(facebook|fb|instagram|insta|linkedin|youtube|github|website|profile|link|url|search|find)\b/i.test(lower) ||
    q.includes("ফেসবুক") || q.includes("ইনস্টাগ্রাম") || q.includes("লিংক") || q.includes("খুঁজ");

  const personIntent =
    q.includes("ফাহিম") || q.includes("member") || q.includes("সদস্য") ||
    q.includes("president") || q.includes("সভাপতি") || q.includes("secretary") ||
    q.includes("সম্পাদক") || q.includes("person") || q.includes("profile");

  return linkIntent && personIntent;
}

async function searchWeb(query: string): Promise<WebResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        query,
        search_depth: "basic",
        topic: "general",
        max_results: 5,
        include_answer: false,
        include_raw_content: false,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Tavily search failed:", response.status);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data?.results)
      ? data.results.slice(0, 5)
          .map((item: any) => ({
            title: String(item.title || "Web result"),
            url: String(item.url || ""),
            content: String(item.content || ""),
          }))
          .filter((item: { url: string }) => /^https?:\/\//i.test(item.url))
      : [];
  } catch (error) {
    console.error("Web search error:", error);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages)
      ? (body.messages as ChatMessage[])
      : [];

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Groq API Key is missing." },
        { status: 500 }
      );
    }

    const latestUserMessage =
      [...messages].reverse().find((message) => message.role === "user")?.content || "";

    // Known WLC links are answered locally without spending model tokens.
    const directAction = actionReply(latestUserMessage);
    if (directAction) {
      return NextResponse.json({ reply: directAction });
    }

    const webResults = needsWebSearch(latestUserMessage)
      ? await searchWeb(`Willes Literary Club Dhaka ${latestUserMessage}`)
      : [];

    const knowledge = loadKnowledge();
    const isCasual =
      /\b(joke|funny|fun|riddle|game|roast|story|jokes|play)\b/i.test(latestUserMessage) ||
      /মজা|জোক|ধাঁধা|খেলা|গল্প|হাসাও|রোস্ট/i.test(latestUserMessage);

    const relevantKnowledge = isCasual
      ? []
      : retrieveKnowledge(latestUserMessage, knowledge, 3);

    const webContext = webResults.length
      ? webResults.map((result, index) =>
          `[WEB ${index + 1}] ${result.title}\nURL: ${result.url}\nSnippet: ${result.content}`
        ).join("\n\n")
      : "No external web results were available.";

    // Keep conversational context bounded so token usage does not grow forever.
    const recentMessages = messages.slice(-8);

    const systemPrompt = {
      role: "system" as const,
      content: `তুমি "সাহিত্যসখী"—উইল্‌স সাহিত্য ক্লাব (WLC)-এর অফিসিয়াল ডিজিটাল সহকারী।

LANGUAGE / BANGLISH:
- বাংলা, English, Banglish, Romanized Bangla, এবং mixed Bangla-English বুঝবে।
- "fahim k?", "fahim ke", "fb link dao", "wlc te kivabe join korbo", "committee k?"—এ ধরনের ছোট/ভাঙা/মিশ্র বাক্যকে স্বাভাবিক অর্থে বুঝবে।
- ব্যবহারকারী Banglish লিখলে উত্তর স্বাভাবিক, সহজ বাংলায় দিতে পারো।
- spelling ভুল হলেও intent ধরার চেষ্টা করবে।

ANSWER STYLE:
- প্রথমে সরাসরি উত্তর দাও; অপ্রাসঙ্গিক বড় তালিকা দিও না।
- "fahim k?" হলে Fahim-এর relevant WLC role 1–3 বাক্যে বলবে।
- "facebook link dao" হলে link/button দেবে।
- "কীভাবে join করব?" হলে registration process + button দেবে।
- "কে president?" হলে শুধু current president-এর নাম/পদ আগে বলবে।
- ব্যবহারকারী detail চাইলে তারপর বিস্তারিত দেবে।
- ভদ্র, friendly, natural tone রাখবে; robotic disclaimer কম ব্যবহার করবে।

KNOWLEDGE:
- নিচের RETRIEVED KNOWLEDGE-ই WLC সম্পর্কিত factual source।
- বর্তমান তথ্যকে historical/Gen-1 তথ্যের সঙ্গে গুলিয়ে ফেলবে না।
- knowledge-এ নেই এমন WLC-specific তথ্য বানাবে না।
- সাধারণ তথ্যের ক্ষেত্রে নিশ্চিত না হলে সংক্ষেপে বলবে যে WLC source-এ তথ্যটি নেই।
- কোনো external action সত্যিই করা না হলে "আমি করে দিয়েছি" বলবে না।
- known WLC links থাকলে "internet নেই" বলবে না; stored official link দিতে পারবে।

INTERACTIVE OUTPUT:
- প্রয়োজন হলে [BUTTON:Label|https://...] syntax ব্যবহার করতে পারো।
- URL অবশ্যই http/https হতে হবে।
- Person photo-এর জন্য [IMAGE:/path|caption] ব্যবহার কেবল knowledge-এ path explicitly থাকলে।

RETRIEVED WLC KNOWLEDGE:
${relevantKnowledge.join("\n\n---\n\n")}

LIVE WEB RESULTS:
${webContext}
`,
    };

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [systemPrompt, ...recentMessages],
      model: "openai/gpt-oss-120b",
      temperature: 0.35,
      max_tokens: 700,
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "দুঃখিত, এই মুহূর্তে কোনো উত্তর পাওয়া যায়নি।";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "অনাকাঙ্ক্ষিত কোনো সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
