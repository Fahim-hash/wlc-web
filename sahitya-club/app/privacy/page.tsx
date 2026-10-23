import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | উইল্‌স সাহিত্য ক্লাব",
  description: "উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইটে ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার, সংরক্ষণ ও সুরক্ষিত রাখা হয়—সে সম্পর্কে জানুন।",
  alternates: { canonical: "https://wlc.pro.bd/privacy" },
  openGraph: {
    title: "গোপনীয়তা নীতি | উইল্‌স সাহিত্য ক্লাব",
    description: "উইল্‌স সাহিত্য ক্লাবের ওয়েবসাইটের তথ্য সংগ্রহ ও ব্যবহারের নীতি।",
    url: "https://wlc.pro.bd/privacy",
    siteName: "Willes Literary Club",
    locale: "bn_BD",
    type: "article",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "উইল্‌স সাহিত্য ক্লাব" }],
  },
};

const sections = [
  {
    title: "১. কোন তথ্য সংগ্রহ করা হতে পারে",
    body: "আপনি যোগাযোগ ফর্ম বা সদস্যপদ ফর্মে যে তথ্য দেন—যেমন নাম, ইমেইল, ফোন নম্বর, শ্রেণি/পরিচিতি ও বার্তা—তা সংশ্লিষ্ট সেবা দেওয়ার জন্য ব্যবহার হতে পারে। আপনি স্বেচ্ছায় লেখা, ছবি বা অন্য কনটেন্ট জমা দিলে সেই কনটেন্টও প্রযোজ্য হতে পারে।",
  },
  {
    title: "২. তথ্য কেন ব্যবহার করা হয়",
    body: "সদস্যপদ ও পরিচয় যাচাই, ক্লাবের কার্যক্রম পরিচালনা, আপনার বার্তার উত্তর, সার্টিফিকেট বা নোটিফিকেশন পাঠানো, সাইটের নিরাপত্তা বজায় রাখা এবং সেবার নির্ভরযোগ্যতা উন্নত করার জন্য তথ্য ব্যবহার করা হতে পারে।",
  },
  {
    title: "৩. তৃতীয় পক্ষের সেবা",
    body: "ওয়েবসাইটের কিছু ফিচার Firebase/Google Sheets, ইমেইল ডেলিভারি সেবা, যোগাযোগ ফর্ম প্রসেসর, ওয়েব-পুশ নোটিফিকেশন বা Telegram-এর মতো তৃতীয় পক্ষের প্রযুক্তির ওপর নির্ভর করতে পারে। এসব সেবা তাদের নিজস্ব নীতি অনুযায়ী তথ্য প্রক্রিয়া করতে পারে। তাদের কাছে কেবল সংশ্লিষ্ট ফিচার চালাতে প্রয়োজনীয় তথ্য পাঠানো উচিত।",
  },
  {
    title: "৪. কুকি, অ্যানালিটিক্স ও নোটিফিকেশন",
    body: "সাইটের কার্যকারিতা, নিরাপত্তা বা আপনার চালু করা নোটিফিকেশন পছন্দ মনে রাখতে ব্রাউজার প্রযুক্তি ব্যবহার হতে পারে। Google Analytics চালু থাকলে ব্যবহার-সংক্রান্ত পরিসংখ্যান সংগ্রহ হতে পারে। ব্রাউজারের সেটিংস থেকে নোটিফিকেশন অনুমতি পরিবর্তন করতে পারবেন।",
  },
  {
    title: "৫. তথ্য সংরক্ষণ ও নিরাপত্তা",
    body: "তথ্য কেবল সংশ্লিষ্ট কার্যক্রমের প্রয়োজন অনুযায়ী সংরক্ষণ করার চেষ্টা করা হয়। অননুমোদিত প্রবেশ, পরিবর্তন বা প্রকাশ ঠেকাতে যুক্তিসঙ্গত সুরক্ষা ব্যবস্থা নেওয়া হয়; তবে ইন্টারনেটে কোনো পদ্ধতিই সম্পূর্ণ ঝুঁকিমুক্ত নয়।",
  },
  {
    title: "৬. আপনার অনুরোধ",
    body: "আপনার ব্যক্তিগত তথ্য সংশোধন, হালনাগাদ বা মুছে ফেলার বিষয়ে অনুরোধ করতে আমাদের সঙ্গে যোগাযোগ করুন। পরিচয় ও প্রাসঙ্গিক রেকর্ড যাচাই করার প্রয়োজন হতে পারে এবং আইনগত/প্রাতিষ্ঠানিক কারণে কিছু তথ্য রাখা লাগতে পারে।",
  },
  {
    title: "৭. শিশু ও শিক্ষার্থীদের তথ্য",
    body: "ক্লাবের কার্যক্রমে শিক্ষার্থী অংশ নিতে পারে। অপ্রাপ্তবয়স্ক শিক্ষার্থীদের ব্যক্তিগত তথ্য দেওয়ার আগে অভিভাবক বা দায়িত্বশীল ব্যক্তির সহায়তা নেওয়া উচিত। অপ্রয়োজনীয় সংবেদনশীল তথ্য ফর্মে দেবেন না।",
  },
  {
    title: "৮. নীতির পরিবর্তন",
    body: "ওয়েবসাইটের ফিচার বা কার্যক্রম পরিবর্তিত হলে এই নীতি হালনাগাদ হতে পারে। পরিবর্তিত সংস্করণ এই পৃষ্ঠায় প্রকাশ করা হবে।",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12 text-stone-800 sm:px-6">
      <article className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-800">Willes Literary Club</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">গোপনীয়তা নীতি</h1>
        <p className="mt-3 text-sm text-stone-500">সর্বশেষ হালনাগাদ: ২৩ অক্টোবর ২০২৬</p>
        <p className="mt-6 leading-8">
          এই নীতিতে ব্যাখ্যা করা হয়েছে যে <Link href="/" className="font-semibold text-rose-800 underline underline-offset-4">wlc.pro.bd</Link> ব্যবহার করার সময় আপনার দেওয়া তথ্য কীভাবে ব্যবহার হতে পারে। কোনো ফর্ম পূরণ বা সাইটের ফিচার ব্যবহার করার আগে অনুগ্রহ করে নীতিটি পড়ুন।
        </p>
        <div className="mt-8 space-y-7">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold text-stone-950">{section.title}</h2>
              <p className="mt-2 leading-8 text-stone-600">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-stone-50 p-5">
          <h2 className="font-bold text-stone-950">যোগাযোগ</h2>
          <p className="mt-2 text-sm leading-7 text-stone-600">এই নীতি বা আপনার তথ্য সম্পর্কে প্রশ্ন থাকলে ইমেইল করুন:</p>
          <a className="mt-1 inline-block font-semibold text-rose-800 underline underline-offset-4" href="mailto:contact@wlc.pro.bd">contact@wlc.pro.bd</a>
        </div>
      </article>
    </main>
  );
}
