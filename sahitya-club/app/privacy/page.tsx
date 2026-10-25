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
    number: "০১",
    title: "এই নীতি সম্পর্কে",
    paragraphs: [
      "আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। এই নীতিতে ব্যাখ্যা করা হয়েছে যে wlc.pro.bd ও উইল্‌স সাহিত্য ক্লাবের সংশ্লিষ্ট ডিজিটাল সেবা ব্যবহার করার সময় আপনার দেওয়া বা সেবা পরিচালনার জন্য তৈরি হওয়া তথ্য কীভাবে ব্যবহার হতে পারে।",
      "সাইটের সব ফিচার সব সময় চালু নাও থাকতে পারে। তথ্য সংগ্রহ বা ব্যবহার নির্ভর করবে আপনি কোন ফর্ম, পোর্টাল বা ফিচার ব্যবহার করছেন তার ওপর। কোনো ফর্মে তথ্য দেওয়ার আগে সেটি কেন চাওয়া হচ্ছে তা দেখে নিন।",
    ],
  },
  {
    id: "data",
    number: "০২",
    title: "কোন তথ্য সংগ্রহ করা হতে পারে",
    paragraphs: [
      "আপনি নিজে তথ্য দিলে আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর, শ্রেণি বা শিক্ষার্থী-পরিচিতি, সদস্যপদ-সংক্রান্ত তথ্য এবং যোগাযোগের বার্তা সংগ্রহ হতে পারে। কোন ফর্মে কোন তথ্য চাওয়া হচ্ছে, তা ফর্মের ক্ষেত্রগুলোর মাধ্যমে বোঝানো হয়।",
      "আপনি লেখা, ছবি, ইভেন্টের কাজ, আবেদন বা অন্য কোনো কনটেন্ট জমা দিলে সেই কনটেন্ট এবং সেটির সঙ্গে দেওয়া তথ্য প্রক্রিয়া করা হতে পারে। সদস্যপদ বা উপস্থিতি-সংক্রান্ত ফিচার ব্যবহার করলে সদস্য আইডি, যাচাই-সংক্রান্ত তথ্য বা কার্যক্রমের রেকর্ডও তৈরি হতে পারে।",
      "সাইটের নিরাপত্তা ও কার্যকারিতা বজায় রাখতে সার্ভার বা প্রযুক্তিগত সেবা থেকে ব্রাউজার, ডিভাইস, অনুরোধের সময় এবং ত্রুটি-সংক্রান্ত সীমিত লগ তৈরি হতে পারে। কোন তথ্য স্বয়ংক্রিয়ভাবে লগ হয় তা ব্যবহৃত অবকাঠামোর ওপর নির্ভর করে।",
    ],
  },
  {
    id: "use",
    number: "০৩",
    title: "তথ্য কী কাজে ব্যবহার করা হয়",
    paragraphs: [
      "তথ্য সদস্যপদ নিবন্ধন ও যাচাই, ক্লাবের অনুষ্ঠান ও কার্যক্রম সমন্বয়, আপনার প্রশ্নের উত্তর, আবেদন বা লেখা পর্যালোচনা, প্রাসঙ্গিক নোটিফিকেশন বা সার্টিফিকেট পাঠানো এবং সাইটের নিরাপত্তা ও নির্ভরযোগ্যতা বজায় রাখার কাজে ব্যবহার হতে পারে।",
      "ব্যবহার-সংক্রান্ত সমষ্টিগত পরিসংখ্যান পাওয়া গেলে তা সাইটের ব্যবহারযোগ্যতা ও কার্যকারিতা উন্নত করতে সহায়তা করতে পারে। আপনার তথ্য বিক্রি করে আয় করার উদ্দেশ্যে এই নীতি প্রণীত নয়।",
    ],
  },
  {
    id: "sharing",
    number: "০৪",
    title: "তথ্য কার সঙ্গে শেয়ার হতে পারে",
    paragraphs: [
      "ওয়েবসাইটের কিছু ফিচার চালাতে হোস্টিং, ডেটাবেস, ফর্ম প্রসেসিং, ইমেইল ডেলিভারি, স্প্রেডশিট, অ্যানালিটিক্স বা মেসেজিং সেবার মতো তৃতীয় পক্ষের প্রযুক্তি ব্যবহৃত হতে পারে। ফিচার অনুযায়ী Firebase/Google, Google Sheets, Formspree, Resend, Vercel বা Telegram-এর মতো সেবা প্রাসঙ্গিক হতে পারে; সব সেবা প্রতিটি ফিচারে ব্যবহৃত হয় না।",
      "এসব সেবা তাদের নিজস্ব শর্ত ও গোপনীয়তা নীতি অনুযায়ী তথ্য প্রক্রিয়া করতে পারে। যেখানে সম্ভব, সংশ্লিষ্ট ফিচার চালানোর জন্য প্রয়োজনীয় তথ্যের মধ্যেই শেয়ার সীমিত রাখা উচিত। ক্লাবের অনুমোদিত দায়িত্বশীল ব্যক্তিরা কার্যক্রম পরিচালনার প্রয়োজনে প্রাসঙ্গিক তথ্য দেখতে পারেন।",
      "আইনগত বাধ্যবাধকতা, বৈধ অনুরোধ, নিরাপত্তা বা অপব্যবহার প্রতিরোধের প্রয়োজন হলে প্রযোজ্য আইন অনুযায়ী তথ্য প্রকাশের প্রয়োজন হতে পারে।",
    ],
  },
  {
    id: "cookies",
    number: "০৫",
    title: "কুকি, অ্যানালিটিক্স ও নোটিফিকেশন",
    paragraphs: [
      "সাইটের নির্দিষ্ট ফিচার সচল রাখা, নিরাপত্তা, সেশন বা আপনার নির্বাচিত পছন্দ মনে রাখার জন্য ব্রাউজার স্টোরেজ বা অনুরূপ প্রযুক্তি ব্যবহার হতে পারে। এগুলোর কিছু বন্ধ করলে সাইটের নির্দিষ্ট ফিচার ঠিকমতো কাজ নাও করতে পারে।",
      "Google Analytics কনফিগার করা ও সক্রিয় থাকলে সাইট ব্যবহারের পরিসংখ্যান সংগ্রহ হতে পারে। অ্যানালিটিক্স সক্রিয় কি না তা সাইটের বর্তমান কনফিগারেশনের ওপর নির্ভর করে। ব্রাউজার সেটিংস থেকে কুকি নিয়ন্ত্রণ এবং ডিভাইসের সেটিংস থেকে ওয়েব-পুশ নোটিফিকেশনের অনুমতি পরিবর্তন করা যায়।",
    ],
  },
  {
    id: "retention",
    number: "০৬",
    title: "তথ্য সংরক্ষণ ও নিরাপত্তা",
    paragraphs: [
      "তথ্য সংশ্লিষ্ট কার্যক্রম পরিচালনা, রেকর্ড বজায় রাখা, নিরাপত্তা নিশ্চিত করা বা প্রযোজ্য বাধ্যবাধকতা পূরণের জন্য যতটা প্রয়োজন ততদিন রাখার চেষ্টা করা হয়। নির্দিষ্ট সব ধরনের তথ্যের জন্য একই সংরক্ষণকাল প্রযোজ্য নয়।",
      "অননুমোদিত প্রবেশ, পরিবর্তন, হারানো বা প্রকাশের ঝুঁকি কমাতে যুক্তিসঙ্গত প্রযুক্তিগত ও সাংগঠনিক ব্যবস্থা নেওয়ার চেষ্টা করা হয়। তবে ইন্টারনেট বা কোনো ইলেকট্রনিক সংরক্ষণ-পদ্ধতিই সম্পূর্ণ নিরাপদ—এমন নিশ্চয়তা দেওয়া যায় না।",
    ],
  },
  {
    id: "your-choices",
    number: "০৭",
    title: "আপনার অধিকার ও পছন্দ",
    paragraphs: [
      "আপনার তথ্য সম্পর্কে জানতে, ভুল তথ্য সংশোধন করতে, প্রযোজ্য ক্ষেত্রে তথ্য মুছে ফেলার অনুরোধ জানাতে বা নোটিফিকেশন বন্ধ করতে আমাদের সঙ্গে যোগাযোগ করতে পারেন। অনুরোধটি যাচাই করতে পরিচয় নিশ্চিত করার জন্য অতিরিক্ত তথ্য চাইতে হতে পারে।",
      "কোনো তথ্য সদস্যপদ, নিরাপত্তা, রেকর্ড সংরক্ষণ বা আইনগত বাধ্যবাধকতার জন্য প্রয়োজন হলে তা সঙ্গে সঙ্গে মুছে ফেলা সম্ভব নাও হতে পারে। তৃতীয় পক্ষের সেবায় থাকা তথ্যের ক্ষেত্রে সংশ্লিষ্ট সেবার প্রক্রিয়াও প্রযোজ্য হতে পারে।",
    ],
  },
  {
    id: "students",
    number: "০৮",
    title: "শিক্ষার্থী ও অপ্রাপ্তবয়স্কদের তথ্য",
    paragraphs: [
      "ক্লাবের কার্যক্রমে স্কুলপড়ুয়া ও অপ্রাপ্তবয়স্ক শিক্ষার্থী অংশ নিতে পারে। প্রযোজ্য ক্ষেত্রে অভিভাবক বা দায়িত্বশীল ব্যক্তির সহায়তা নিয়ে তথ্য দেওয়া উচিত। ফর্মে চাওয়া হয়নি—এমন সংবেদনশীল তথ্য, পাসওয়ার্ড বা ব্যক্তিগত পরিচয়পত্রের অনুলিপি জমা দেবেন না।",
      "কোনো শিক্ষার্থীর তথ্য অনুপযুক্তভাবে সংগ্রহ হয়েছে বলে মনে হলে বিষয়টি আমাদের জানান, যাতে তা পর্যালোচনা করা যায়।",
    ],
  },
  {
    id: "external-links",
    number: "০৯",
    title: "বহিরাগত ওয়েবসাইট",
    paragraphs: [
      "আমাদের ওয়েবসাইটে তৃতীয় পক্ষের সেবা বা বহিরাগত ওয়েবসাইটের লিংক থাকতে পারে। সেসব সাইটের বিষয়বস্তু, নিরাপত্তা বা গোপনীয়তা অনুশীলনের ওপর ক্লাবের সরাসরি নিয়ন্ত্রণ নেই। তথ্য দেওয়ার আগে সংশ্লিষ্ট সাইটের নীতি পড়ুন।",
    ],
  },
  {
    id: "changes",
    number: "১০",
    title: "এই নীতির পরিবর্তন",
    paragraphs: [
      "ওয়েবসাইটের ফিচার, প্রযুক্তি বা প্রযোজ্য নিয়ম পরিবর্তিত হলে এই নীতি সংশোধন করা হতে পারে। হালনাগাদ সংস্করণ এই পৃষ্ঠায় প্রকাশ করা হবে এবং উপরে প্রদর্শিত তারিখটি সর্বশেষ সংশোধনের তারিখ নির্দেশ করবে। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে উপযুক্ত উপায়ে জানানো হতে পারে।",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full overflow-x-hidden bg-stone-50 text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      <section className="relative overflow-hidden border-b border-stone-200/60 bg-white px-4 py-16 text-center shadow-sm sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900 via-stone-100 to-white"
        />
        <div className="relative z-10 mx-auto max-w-3xl space-y-5">
          <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
            <Link href="/" className="transition-colors hover:text-rose-900">
              হোম
            </Link>
            <span aria-hidden="true" className="mx-2 text-stone-300">/</span>
            <span className="text-stone-700">গোপনীয়তা নীতি</span>
          </nav>
          <span className="inline-block rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-900">
            Privacy & Transparency
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl md:text-5xl">
            গোপনীয়তা নীতি
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
            আপনার তথ্যের প্রতি যত্ন, স্বচ্ছতা এবং দায়িত্বশীল ব্যবহার—উইল্‌স সাহিত্য ক্লাবের ডিজিটাল অভিজ্ঞতার গুরুত্বপূর্ণ অংশ।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-stone-500">
            <span>সর্বশেষ হালনাগাদ: ২৩ অক্টোবর ২০২৬</span>
            <span aria-hidden="true" className="text-stone-300">•</span>
            <span>পড়তে আনুমানিক ৬–৮ মিনিট</span>
          </div>
          <div className="mx-auto h-1 w-12 rounded-full bg-rose-900/30" />
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-6 px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <span aria-hidden="true" className="text-2xl">🛡️</span>
            <h2 className="text-xl font-bold text-stone-950">এক নজরে</h2>
          </div>
          <p className="text-sm leading-8 text-stone-600 sm:text-base">
            আমরা আপনার দেওয়া তথ্য ক্লাবের কার্যক্রম, সদস্যপদ, যোগাযোগ, নিরাপত্তা এবং প্রাসঙ্গিক ডিজিটাল সেবা পরিচালনায় ব্যবহার করতে পারি। কোন তথ্য ব্যবহৃত হবে তা নির্ভর করে আপনার ব্যবহৃত ফিচারের ওপর। তথ্য সম্পর্কে প্রশ্ন বা অনুরোধ থাকলে আমাদের সঙ্গে যোগাযোগ করতে পারেন।
          </p>
        </div>

        <nav aria-label="গোপনীয়তা নীতির বিষয়সূচি" className="rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-lg font-bold text-stone-950">বিষয়সূচি</h2>
          <ol className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="flex items-start gap-3 rounded-xl border border-stone-100 px-3 py-2.5 text-sm text-stone-600 transition-colors hover:border-rose-100 hover:bg-rose-50/60 hover:text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700"
                >
                  <span className="font-mono text-xs text-rose-900">{section.number}</span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-5">
          {sections.map((section) => (
            <section
              id={section.id}
              key={section.id}
              className="scroll-mt-8 rounded-2xl border border-stone-200/60 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="mb-4 flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 font-mono text-xs font-bold text-rose-900">
                  {section.number}
                </span>
                <h2 className="pt-1 font-serif text-xl font-bold leading-snug text-stone-950 sm:text-2xl">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-4 border-l-2 border-stone-100 pl-4 text-sm leading-8 text-stone-600 sm:pl-5 sm:text-base">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section id="contact" className="scroll-mt-8 rounded-3xl border border-stone-800 bg-stone-950 p-8 text-center text-stone-100 shadow-xl sm:p-10">
          <span className="inline-block rounded-full border border-stone-800 bg-stone-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-rose-300">
            Questions or requests
          </span>
          <h2 className="mt-4 font-serif text-2xl font-bold text-white sm:text-3xl">
            গোপনীয়তা নিয়ে কোনো প্রশ্ন আছে?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
            এই নীতি বা আপনার তথ্য সম্পর্কে জানতে কিংবা সংশোধনের অনুরোধ জানাতে আমাদের সঙ্গে যোগাযোগ করুন। বার্তায় পাসওয়ার্ড বা অপ্রয়োজনীয় ব্যক্তিগত তথ্য দেবেন না।
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:wlfsc.sahittoclub.com@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-stone-950 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              wlfsc.sahittoclub.com@gmail.com <span aria-hidden="true">↗</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-100 transition-colors hover:border-stone-500 hover:bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              যোগাযোগ পৃষ্ঠা
            </Link>
          </div>
        </section>

      </section>
    </div>
  );
}
