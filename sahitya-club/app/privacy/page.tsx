import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | উইল্‌স সাহিত্য ক্লাব",
  description:
    "উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইট, সদস্যপদ, যোগাযোগ ফর্ম ও ডিজিটাল সেবা ব্যবহারের সময় ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার, সংরক্ষণ ও সুরক্ষিত রাখা হতে পারে—জানুন।",
  alternates: { canonical: "https://wlc.pro.bd/privacy" },
  openGraph: {
    title: "গোপনীয়তা নীতি | উইল্‌স সাহিত্য ক্লাব",
    description:
      "আপনার তথ্য, গোপনীয়তা এবং ডিজিটাল নিরাপত্তা সম্পর্কে উইল্‌স সাহিত্য ক্লাবের নীতি।",
    url: "https://wlc.pro.bd/privacy",
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "article",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "উইল্‌স সাহিত্য ক্লাব — গোপনীয়তা নীতি",
      },
    ],
  },
};

const sections = [
  {
    id: "overview",
    number: "01",
    title: "এই নীতি সম্পর্কে",
    intro: "আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ।",
    paragraphs: [
      "এই গোপনীয়তা নীতিতে ব্যাখ্যা করা হয়েছে যে wlc.pro.bd ও উইল্‌স সাহিত্য ক্লাবের সংশ্লিষ্ট ডিজিটাল সেবা ব্যবহার করার সময় আপনার দেওয়া বা সেবা পরিচালনার জন্য তৈরি হওয়া তথ্য কীভাবে ব্যবহার হতে পারে।",
      "সাইটের সব ফিচার সব সময় চালু নাও থাকতে পারে। কোনো তথ্য সংগ্রহ বা ব্যবহার নির্ভর করবে আপনি কোন ফর্ম, পোর্টাল বা ফিচার ব্যবহার করছেন তার ওপর। কোনো ফর্মে তথ্য দেওয়ার আগে সেটি কেন চাওয়া হচ্ছে তা দেখে নিন।",
    ],
  },
  {
    id: "data",
    number: "02",
    title: "কোন তথ্য সংগ্রহ করা হতে পারে",
    intro: "শুধু সংশ্লিষ্ট কার্যক্রমের জন্য প্রাসঙ্গিক তথ্য।",
    paragraphs: [
      "আপনি নিজে তথ্য দিলে আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর, শ্রেণি বা শিক্ষার্থী-পরিচিতি, সদস্যপদ-সংক্রান্ত তথ্য এবং যোগাযোগের বার্তা সংগ্রহ হতে পারে। কোন ফর্মে কোন তথ্য চাওয়া হচ্ছে, তা ফর্মের ক্ষেত্রগুলোর মাধ্যমে বোঝানো হয়।",
      "আপনি লেখা, ছবি, ইভেন্টের কাজ, আবেদন বা অন্য কোনো কনটেন্ট জমা দিলে সেই কনটেন্ট এবং সেটির সঙ্গে দেওয়া তথ্য প্রক্রিয়া করা হতে পারে। সদস্যপদ বা উপস্থিতি-সংক্রান্ত ফিচার ব্যবহার করলে সদস্য আইডি, যাচাই-সংক্রান্ত তথ্য বা কার্যক্রমের রেকর্ডও তৈরি হতে পারে।",
      "সাইটের নিরাপত্তা ও কার্যকারিতা বজায় রাখতে সার্ভার বা প্রযুক্তিগত সেবা থেকে ব্রাউজার, ডিভাইস, অনুরোধের সময় এবং ত্রুটি-সংক্রান্ত সীমিত লগ তৈরি হতে পারে। কোন তথ্য স্বয়ংক্রিয়ভাবে লগ হয় তা ব্যবহৃত অবকাঠামোর ওপর নির্ভর করে।",
    ],
  },
  {
    id: "use",
    number: "03",
    title: "তথ্য কী কাজে ব্যবহার করা হয়",
    intro: "ক্লাবের কার্যক্রম পরিচালনা ও আপনার অনুরোধের উত্তর দিতে।",
    paragraphs: [
      "তথ্য সদস্যপদ নিবন্ধন ও যাচাই, ক্লাবের অনুষ্ঠান ও কার্যক্রম সমন্বয়, আপনার প্রশ্নের উত্তর, আবেদন বা লেখা পর্যালোচনা, প্রাসঙ্গিক নোটিফিকেশন বা সার্টিফিকেট পাঠানো এবং সাইটের নিরাপত্তা ও নির্ভরযোগ্যতা বজায় রাখার কাজে ব্যবহার হতে পারে।",
      "ব্যবহার-সংক্রান্ত সমষ্টিগত পরিসংখ্যান পাওয়া গেলে তা সাইটের ব্যবহারযোগ্যতা ও কার্যকারিতা উন্নত করতে সহায়তা করতে পারে। আপনার তথ্য বিক্রি করে আয় করার উদ্দেশ্যে এই নীতি প্রণীত নয়।",
    ],
  },
  {
    id: "sharing",
    number: "04",
    title: "তথ্য কার সঙ্গে শেয়ার হতে পারে",
    intro: "সেবা পরিচালনার প্রয়োজন অনুযায়ী সীমিতভাবে।",
    paragraphs: [
      "ওয়েবসাইটের কিছু ফিচার চালাতে হোস্টিং, ডেটাবেস, ফর্ম প্রসেসিং, ইমেইল ডেলিভারি, স্প্রেডশিট, অ্যানালিটিক্স বা মেসেজিং সেবার মতো তৃতীয় পক্ষের প্রযুক্তি ব্যবহৃত হতে পারে। ফিচার অনুযায়ী Firebase/Google, Google Sheets, Formspree, Resend, Vercel বা Telegram-এর মতো সেবা প্রাসঙ্গিক হতে পারে; সব সেবা প্রতিটি ফিচারে ব্যবহৃত হয় না।",
      "এসব সেবা তাদের নিজস্ব শর্ত ও গোপনীয়তা নীতি অনুযায়ী তথ্য প্রক্রিয়া করতে পারে। যেখানে সম্ভব, সংশ্লিষ্ট ফিচার চালানোর জন্য প্রয়োজনীয় তথ্যের মধ্যেই শেয়ার সীমিত রাখা উচিত। ক্লাবের অনুমোদিত দায়িত্বশীল ব্যক্তিরা কার্যক্রম পরিচালনার প্রয়োজনে প্রাসঙ্গিক তথ্য দেখতে পারেন।",
      "আইনগত বাধ্যবাধকতা, বৈধ অনুরোধ, নিরাপত্তা বা অপব্যবহার প্রতিরোধের প্রয়োজন হলে প্রযোজ্য আইন অনুযায়ী তথ্য প্রকাশের প্রয়োজন হতে পারে।",
    ],
  },
  {
    id: "cookies",
    number: "05",
    title: "কুকি, অ্যানালিটিক্স ও নোটিফিকেশন",
    intro: "ব্রাউজার ও সাইটের সেটিংসের ভূমিকা।",
    paragraphs: [
      "সাইটের নির্দিষ্ট ফিচার সচল রাখা, নিরাপত্তা, সেশন বা আপনার নির্বাচিত পছন্দ মনে রাখার জন্য ব্রাউজার স্টোরেজ বা অনুরূপ প্রযুক্তি ব্যবহার হতে পারে। এগুলোর কিছু বন্ধ করলে সাইটের নির্দিষ্ট ফিচার ঠিকমতো কাজ নাও করতে পারে।",
      "Google Analytics কনফিগার করা ও সক্রিয় থাকলে সাইট ব্যবহারের পরিসংখ্যান সংগ্রহ হতে পারে। অ্যানালিটিক্স সক্রিয় কি না তা সাইটের বর্তমান কনফিগারেশনের ওপর নির্ভর করে। ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ এবং ডিভাইসের সেটিংস থেকে ওয়েব-পুশ নোটিফিকেশনের অনুমতি পরিবর্তন করা যায়।",
    ],
  },
  {
    id: "retention",
    number: "06",
    title: "তথ্য সংরক্ষণ ও নিরাপত্তা",
    intro: "যুক্তিসঙ্গত সুরক্ষা ব্যবস্থা, সীমাহীন নিশ্চয়তা নয়।",
    paragraphs: [
      "তথ্য সংশ্লিষ্ট কার্যক্রম পরিচালনা, রেকর্ড বজায় রাখা, নিরাপত্তা নিশ্চিত করা বা প্রযোজ্য বাধ্যবাধকতা পূরণের জন্য যতটা প্রয়োজন ততদিন রাখার চেষ্টা করা হয়। নির্দিষ্ট সব ধরনের তথ্যের জন্য একই সংরক্ষণকাল প্রযোজ্য নয়।",
      "অননুমোদিত প্রবেশ, পরিবর্তন, হারানো বা প্রকাশের ঝুঁকি কমাতে যুক্তিসঙ্গত প্রযুক্তিগত ও সাংগঠনিক ব্যবস্থা নেওয়ার চেষ্টা করা হয়। তবে ইন্টারনেট বা কোনো ইলেকট্রনিক সংরক্ষণ-পদ্ধতিই সম্পূর্ণ নিরাপদ—এমন নিশ্চয়তা দেওয়া যায় না।",
    ],
  },
  {
    id: "your-choices",
    number: "07",
    title: "আপনার অধিকার ও পছন্দ",
    intro: "তথ্য সম্পর্কে প্রশ্ন বা অনুরোধ জানাতে পারেন।",
    paragraphs: [
      "আপনার তথ্য সম্পর্কে জানতে, ভুল তথ্য সংশোধন করতে, প্রযোজ্য ক্ষেত্রে তথ্য মুছে ফেলার অনুরোধ জানাতে বা নোটিফিকেশন বন্ধ করতে আমাদের সঙ্গে যোগাযোগ করতে পারেন। অনুরোধটি যাচাই করতে পরিচয় নিশ্চিত করার জন্য অতিরিক্ত তথ্য চাইতে হতে পারে।",
      "কোনো তথ্য সদস্যপদ, নিরাপত্তা, রেকর্ড সংরক্ষণ বা আইনগত বাধ্যবাধকতার জন্য প্রয়োজন হলে তা সঙ্গে সঙ্গে মুছে ফেলা সম্ভব নাও হতে পারে। তৃতীয় পক্ষের সেবায় থাকা তথ্যের ক্ষেত্রে সংশ্লিষ্ট সেবার প্রক্রিয়াও প্রযোজ্য হতে পারে।",
    ],
  },
  {
    id: "students",
    number: "08",
    title: "শিক্ষার্থী ও অপ্রাপ্তবয়স্কদের তথ্য",
    intro: "প্রয়োজনের অতিরিক্ত ব্যক্তিগত তথ্য দেবেন না।",
    paragraphs: [
      "ক্লাবের কার্যক্রমে স্কুলপড়ুয়া ও অপ্রাপ্তবয়স্ক শিক্ষার্থী অংশ নিতে পারে। প্রযোজ্য ক্ষেত্রে অভিভাবক বা দায়িত্বশীল ব্যক্তির সহায়তা নিয়ে তথ্য দেওয়া উচিত। ফর্মে চাওয়া হয়নি—এমন সংবেদনশীল তথ্য, পাসওয়ার্ড বা ব্যক্তিগত পরিচয়পত্রের অনুলিপি জমা দেবেন না।",
      "কোনো শিক্ষার্থীর তথ্য অনুপযুক্তভাবে সংগ্রহ হয়েছে বলে মনে হলে বিষয়টি আমাদের জানান, যাতে তা পর্যালোচনা করা যায়।",
    ],
  },
  {
    id: "external-links",
    number: "09",
    title: "বহিরাগত ওয়েবসাইট",
    intro: "অন্য সাইটের নীতি আলাদা হতে পারে।",
    paragraphs: [
      "আমাদের ওয়েবসাইটে তৃতীয় পক্ষের সেবা বা বহিরাগত ওয়েবসাইটের লিংক থাকতে পারে। সেসব সাইটের বিষয়বস্তু, নিরাপত্তা বা গোপনীয়তা অনুশীলনের ওপর ক্লাবের সরাসরি নিয়ন্ত্রণ নেই। তথ্য দেওয়ার আগে সংশ্লিষ্ট সাইটের নীতি পড়ুন।",
    ],
  },
  {
    id: "changes",
    number: "10",
    title: "এই নীতির পরিবর্তন",
    intro: "প্রয়োজন অনুযায়ী নীতি হালনাগাদ করা হতে পারে।",
    paragraphs: [
      "ওয়েবসাইটের ফিচার, প্রযুক্তি বা প্রযোজ্য নিয়ম পরিবর্তিত হলে এই নীতি সংশোধন করা হতে পারে। হালনাগাদ সংস্করণ এই পৃষ্ঠায় প্রকাশ করা হবে এবং উপরে প্রদর্শিত তারিখটি সর্বশেষ সংশোধনের তারিখ নির্দেশ করবে। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে উপযুক্ত উপায়ে জানানো হতে পারে।",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] text-stone-800">
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-rose-800/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 left-1/4 h-72 w-72 rounded-full bg-amber-700/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-stone-300">
            <Link href="/" className="transition-colors hover:text-white">
              হোম
            </Link>
            <span aria-hidden="true" className="mx-2 text-stone-500">/</span>
            <span className="text-white">গোপনীয়তা নীতি</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-200/20 bg-rose-100/10 px-3 py-1.5 text-xs font-bold tracking-wide text-rose-100">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-rose-300" />
              WILLES LITERARY CLUB · PRIVACY
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              গোপনীয়তা নীতি
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              আপনার তথ্যের প্রতি যত্ন, স্বচ্ছতা এবং দায়িত্বশীল ব্যবহার—আমাদের ডিজিটাল অভিজ্ঞতার গুরুত্বপূর্ণ অংশ।
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-stone-300">
              <span className="inline-flex items-center gap-2">
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-rose-200">
                  <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6.5 2.8v3.4M13.5 2.8v3.4M3.5 8h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                সর্বশেষ হালনাগাদ: ২৩ অক্টোবর ২০২৬
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-stone-500 sm:block" />
              <span>পড়তে আনুমানিক ৬–৮ মিনিট</span>
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-rose-900 via-rose-700 to-amber-600" />
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <aside className="self-start lg:sticky lg:top-8">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-800">
              এই পৃষ্ঠায়
            </p>
            <nav aria-label="গোপনীয়তা নীতির বিষয়সূচি" className="mt-4">
              <ol className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-start gap-3 rounded-lg px-2.5 py-2 text-sm leading-6 text-stone-600 transition-colors hover:bg-rose-50 hover:text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700"
                    >
                      <span className="pt-0.5 font-mono text-[11px] text-stone-400 group-hover:text-rose-700">
                        {section.number}
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mt-5 border-t border-stone-100 pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-rose-800 transition-colors hover:text-rose-950"
              >
                যোগাযোগ করুন
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/70 p-5">
            <p className="text-sm font-bold text-stone-900">আপনার তথ্য, আপনার সচেতনতা</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              কোনো ফর্মে শুধু প্রয়োজনীয় তথ্য দিন। পাসওয়ার্ড বা অপ্রয়োজনীয় সংবেদনশীল তথ্য শেয়ার করবেন না।
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-900">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                  <path d="M12 3 19 6v5c0 4.8-2.9 8-7 10-4.1-2-7-5.2-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                  <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-950">এক নজরে</h2>
                <p className="mt-2 text-sm leading-7 text-stone-600 sm:text-base">
                  আমরা আপনার দেওয়া তথ্য ক্লাবের কার্যক্রম, সদস্যপদ, যোগাযোগ, নিরাপত্তা এবং প্রাসঙ্গিক ডিজিটাল সেবা পরিচালনায় ব্যবহার করতে পারি। কোন তথ্য ব্যবহৃত হবে তা নির্ভর করে আপনার ব্যবহৃত ফিচারের ওপর। তথ্য সম্পর্কে প্রশ্ন বা অনুরোধ থাকলে নিচের যোগাযোগের মাধ্যমে জানাতে পারেন।
                </p>
              </div>
            </div>
          </section>

          <div className="space-y-5">
            {sections.map((section) => (
              <section
                id={section.id}
                key={section.id}
                className="scroll-mt-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 font-mono text-xs font-bold text-rose-900">
                    {section.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold leading-snug text-stone-950 sm:text-2xl">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-rose-800">
                      {section.intro}
                    </p>
                    <div className="mt-4 space-y-4 text-sm leading-8 text-stone-600 sm:text-base">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section
            id="contact"
            className="mt-6 scroll-mt-8 overflow-hidden rounded-2xl bg-stone-950 text-white shadow-sm"
          >
            <div className="h-1 bg-gradient-to-r from-rose-900 via-rose-700 to-amber-600" />
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200">
                Questions or requests
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                গোপনীয়তা নিয়ে কথা বলতে চান?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300 sm:text-base">
                এই নীতি, আপনার তথ্য বা কোনো সংশোধন-সংক্রান্ত অনুরোধের জন্য আমাদের সঙ্গে যোগাযোগ করুন। বার্তায় অপ্রয়োজনীয় ব্যক্তিগত তথ্য বা পাসওয়ার্ড দেবেন না।
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:contact@wlc.pro.bd"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  contact@wlc.pro.bd
                  <span aria-hidden="true">↗</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                >
                  যোগাযোগ পৃষ্ঠা
                </Link>
              </div>
            </div>
          </section>

          <footer className="flex flex-col gap-3 py-8 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Willes Literary Club</p>
            <Link href="/" className="font-semibold text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-rose-900">
              মূল ওয়েবসাইটে ফিরে যান
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
