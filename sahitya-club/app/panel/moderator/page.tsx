// app/panel/moderator/page.tsx
import Image from "next/image";

export default function TeacherModeratorPanel() {
  // শিক্ষকদের ডেটা (ছবি সরাসরি public/panel/ ফোল্ডার থেকে লোড হবে)
  const moderators = [
   
  {
    id: 101,
    name: "খন্দকার আতিক",
    role: "মডারেটর",
    designation: "সহকারী শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "সাহিত্যচর্চা মানুষের মনের সংকীর্ণতা দূর করে চেতনাকে শাণিত করে। শিক্ষার্থীদের ভেতরের সুপ্ত প্রতিভাকে বিকশিত করার এই মহৎ যাত্রায় যুক্ত থাকতে পেরে আমি আনন্দিত।",
    image: "/panel/teacher101.jpg",
  },
  {
    id: 102,
    name: "সংজিৎ অধিকারী",
    role: "ক্লাব সেক্রেটারি",
    designation: "সহকারী শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "একটি সৃজনশীল মনই পারে একটি সুন্দর সমাজ বিনির্মাণ করতে। আমাদের সাহিত্য ক্লাব শিক্ষার্থীদের সেই সৃজনশীলতার বিকাশ ঘটানোর জন্য নিরলসভাবে কাজ করে যাচ্ছে।",
    image: "/panel/teacher102.jpg",
  },
  {
    id: 103,
    name: "আব্দুল কাইয়ুম",
    role: "সদস্য (ইংরেজি সাহিত্য)",
    designation: "প্রভাষক, কলেজ (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "বিশ্ব সাহিত্যের আলোয় নিজেদের আলোকিত করতে ইংরেজি সাহিত্যের চর্চাও সমান গুরুত্বপূর্ণ। আমাদের শিক্ষার্থীরা যেন বৈশ্বিক চিন্তাধারায় নিজেদের সমৃদ্ধ করতে পারে, এটাই আমার লক্ষ্য।",
    image: "/panel/teacher103.jpg",
  },
  {
    id: 104,
    name: "ফেরদৌসী সুমি",
    role: "সদস্য (ইংরেজি সাহিত্য)",
    designation: "সহকারী শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "সাহিত্যের কোনো সীমানা নেই। ইংরেজি সাহিত্যের রস আস্বাদন করে শিক্ষার্থীরা তাদের ভাবনার জগৎকে আরও বিস্তৃত করুক—এই প্রত্যাশা রইল।",
    image: "/panel/teacher104.jpg",
  },
  {
    id: 105,
    name: "রফিক নটবর",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "সিনিয়র শিক্ষক",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "বাংলা সাহিত্যের সমৃদ্ধ ঐতিহ্য আমাদের অহংকার। নতুন প্রজন্মের মাঝে এই সাহিত্যের মেলবন্ধন ও মমত্ববোধ ছড়িয়ে দেওয়াই আমাদের মূল উদ্দেশ্য।",
    image: "/panel/teacher105.jpg",
  },
  {
    id: 106,
    name: "শাইরফুল ইসলাম",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "সহকারী শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "শিক্ষার্থীদের লেখনী ও চিন্তাভাবনায় বাংলা সাহিত্যের ছোঁয়া তাদের আরও সংবেদনশীল মানুষ হিসেবে গড়ে তুলবে বলে আমার বিশ্বাস।",
    image: "/panel/teacher106.jpg",
  },
  {
    id: 107,
    name: "ফৌজিয়া আক্তার",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "সহকারী শিক্ষক, বি.এম (প্রভাতি শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "ভোরের আলোর মতোই হোক আমাদের শিক্ষার্থীদের সাহিত্যিক চেতনা। সুস্থ সংস্কৃতি ও সাহিত্যচর্চার মাধ্যমে তারা সমাজকে আলোকিত করবে, এই আমার কামনা।",
    image: "/panel/teacher107.jpg",
  },
  {
    id: 108,
    name: "ফ্রাহিম মারজান",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "সহকারী শিক্ষক, বি.এম (প্রভাতি শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "শব্দ আর ভাবনার খেলায় মেতে উঠুক আমাদের তরুণ প্রাণ। সাহিত্য ক্লাবের মাধ্যমে শিক্ষার্থীদের সুপ্ত প্রতিভা বিকশিত হোক।",
    image: "/panel/teacher108.jpg",
  },
  {
    id: 109,
    name: "রণপ্রভা সাহা",
    role: "সদস্য (ইংরেজি সাহিত্য)",
    designation: "সহকারী শিক্ষক, বি.এম (প্রভাতি শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "সাহিত্যের মেলবন্ধনে আমরা শিক্ষার্থীদের মননকে আরও সমৃদ্ধ করতে চাই। নতুন ভাষা ও সাহিত্যের বৈচিত্র্য তাদের চিন্তাকে আরও উন্নত করবে।",
    image: "/panel/teacher109.jpg",
  },
  {
    id: 110,
    name: "কাবেরী বিশ্বাস",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "সহকারী শিক্ষক, ই.ভি (প্রভাতি শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "ইংরেজি মাধ্যমের শিক্ষার্থীদের মধ্যেও বাংলা সাহিত্যের প্রতি ভালোবাসা জাগিয়ে তোলা এবং আমাদের সংস্কৃতির সাথে তাদের পরিচয় করিয়ে দেওয়া অত্যন্ত আনন্দের।",
    image: "/panel/teacher110.jpg",
  },
  {
    id: 111,
    name: "আয়েশা সিদ্দিকা",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "প্রভাষক, কলেজ (প্রভাতি শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "উচ্চতর স্তরে সাহিত্যচর্চা শিক্ষার্থীদের মাঝে গভীর জীবনবোধের জন্ম দেয়। আমাদের শিক্ষার্থীরা আগামী দিনের মননশীল সমাজ গঠনে ভূমিকা রাখবে।",
    image: "/panel/teacher111.jpg",
  },
  {
    id: 112,
    name: "তৌহিদা জাহের",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "সহকারী শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "পাঠ্যবইয়ের বাইরে সাহিত্যের এই বিশাল জগৎ শিক্ষার্থীদের মনকে করবে উদার ও মানবিক। এই অগ্রযাত্রায় শামিল হতে পেরে ভালো লাগছে।",
    image: "/panel/teacher112.jpg",
  },
  {
    id: 113,
    name: "সৈয়দ আনিসুর রহমান",
    role: "সদস্য (ইসলামী সাহিত্য)",
    designation: "সিনিয়র শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "ইসলামী সাহিত্য ও মূল্যবোধ মানুষের নৈতিক চরিত্র গঠনে অনন্য ভূমিকা পালন করে। শিক্ষার্থীদের মাঝে এই সুন্দর ও কল্যাণময় সাহিত্য ছড়িয়ে দেওয়াই আমাদের লক্ষ্য।",
    image: "/panel/teacher113.jpg",
  },
  {
    id: 114,
    name: "ফাতেমা খানম",
    role: "সদস্য (ইসলামী সাহিত্য)",
    designation: "সিনিয়র শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "জ্ঞানের পাশাপাশি নৈতিকতার চর্চা অপরিহার্য। ইসলামী সাহিত্যের সুবাস শিক্ষার্থীদের জীবনকে সুন্দর ও পরিমার্জিত করতে সাহায্য করবে।",
    image: "/panel/teacher114.jpg",
  },
  {
    id: 115,
    name: "মহিবুল ইসলাম",
    role: "সদস্য (ইসলামী সাহিত্য)",
    designation: "সিনিয়র শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "সাহিত্য ও সংস্কৃতির মাধ্যমে শিক্ষার্থীদের মাঝে সঠিক জীবনদর্শন ও নৈতিক চেতনা জাগ্রত করাই আমাদের এই ক্লাবের মূল উদ্দেশ্য।",
    image: "/panel/teacher115.jpg",
  },
  {
    id: 116,
    name: "এইচ.কে সাব্বির",
    role: "সদস্য (ইসলামী সাহিত্য)",
    designation: "সহকারী শিক্ষক, ই.ভি (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "ইংরেজি ভার্সনের শিক্ষার্থীদের নৈতিক ও মানবিক মূল্যবোধের বিকাশে ইসলামী সাহিত্যের ইতিবাচক দিকগুলো তুলে ধরা অত্যন্ত জরুরি।",
    image: "/panel/teacher116.jpg",
  },
  {
    id: 117,
    name: "খান মোঃ রায়হান ফারুক",
    role: "সদস্য (ইসলামী সাহিত্য)",
    designation: "সহকারী শিক্ষক, ই.ভি (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "সুন্দর মন ও সুন্দর চরিত্র গঠনে সাহিত্যের বিকল্প নেই। শিক্ষার্থীদের মাঝে শুভ বুদ্ধির উদয় ঘটাতে আমাদের এই প্রচেষ্টা অব্যাহত থাকবে।",
    image: "/panel/teacher117.jpg",
  },
  {
    id: 118,
    name: "মোঃ জাকের উল্লাহ",
    role: "সদস্য (ইসলামী সাহিত্য)",
    designation: "সহকারী শিক্ষক, বি.এম (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "সাহিত্যচর্চা মানুষের মনের অন্ধকার দূর করে। ইসলামী সাহিত্যের আলোয় আমাদের শিক্ষার্থীদের জীবন আরও সুন্দর ও সার্থক হয়ে উঠুক।",
    image: "/panel/teacher118.jpg",
  },
  {
    id: 119,
    name: "মনিরুজ্জামান মুকুল",
    role: "সদস্য (ইসলামী সাহিত্য)",
    designation: "প্রভাষক, college (দিবা শাখা)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "মননশীলতা ও আধ্যাত্মিকতার এক অপূর্ব সংমিশ্রণ হলো ইসলামী সাহিত্য। কলেজ স্তরের শিক্ষার্থীদের চিন্তা ও চেতনাকে সমৃদ্ধ করতে এই সাহিত্য বিশেষ ভূমিকা রাখবে।",
    image: "/panel/teacher119.jpg",
  },
  {
    id: 120,
    name: "আসাদুজ্জামান খান",
    role: "সদস্য (বাংলা সাহিত্য)",
    designation: "গ্রন্থাগারিক (Librarian)",
    institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
    speech: "বই হলো জ্ঞানের আলো, আর লাইব্রেরি হলো সেই আলোর উৎস। সাহিত্য ক্লাবের মাধ্যমে শিক্ষার্থীরা বইয়ের প্রতি আরও অনুরাগী হয়ে উঠবে এবং জ্ঞানরাজ্য জয় করবে, এটাই আমার প্রত্যাশা।",
    image: "/panel/teacher120.jpg",
  }

  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
      
      {/* হেডার সেকশন */}
      <div className="text-center mb-16">
        <span className="bg-stone-900 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest font-serif">
          Guiding Light • শিক্ষক প্যানেল
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-stone-950 font-serif mt-4 mb-4">
          শ্রদ্ধেয় মডারেটর প্যানেল
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto text-base md:text-lg">
          যাঁদের সুনিপুণ দিকনির্দেশনা, অনুপ্রেরণা এবং অভিভাবকত্বে উইল্‌স সাহিত্য ক্লাব প্রতিনিয়ত এগিয়ে চলেছে।
        </p>
      </div>

      {/* মডারেটরদের প্রফেশনাল ও এলিগ্যান্ট কার্ডস */}
      <div className="space-y-12">
        {moderators.map((teacher, idx) => (
          <div 
            key={teacher.id}
            className={`bg-white rounded-3xl border border-stone-200/60 p-6 md:p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start transition-all duration-300 hover:shadow-md relative overflow-hidden ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* ব্যাকগ্রাউন্ডে একটি সুক্ষ্ম কোটেশন মার্ক মোটিফ */}
            <div className="absolute -top-6 right-8 text-stone-100 font-serif text-[12rem] select-none pointer-events-none leading-none">
              ”
            </div>

            {/* শিক্ষকের ছবি (একটি রয়্যাল বর্ডারসহ বৃত্তাকার ফ্রেম) */}
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-stone-900/5 ring-offset-4 bg-stone-100 shadow-inner">
              <Image 
                src={teacher.image} 
                alt={teacher.name} 
                fill 
                className="object-cover object-top"
                priority={idx === 0}
              />
            </div>

            {/* শিক্ষক সম্পর্কিত বিস্তারিত তথ্য ও বাণী */}
            <div className="flex-1 text-center md:text-left flex flex-col justify-between h-full">
              <div>
                <span className="inline-block bg-rose-50 text-rose-850 font-serif text-xs font-bold px-3 py-1 rounded-md mb-2">
                  {teacher.role}
                </span>
                <h3 className="text-2xl font-bold text-stone-900 font-serif">
                  {teacher.name}
                </h3>
                <p className="text-sm font-medium text-stone-500 mt-1">
                  {teacher.designation}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {teacher.institution}
                </p>
              </div>

              {/* মডারেটরের বাণী/কোটেশন */}
              <div className="mt-6 p-5 rounded-2xl bg-stone-50/80 border border-stone-100 relative">
                <p className="text-stone-700 italic text-sm md:text-base leading-relaxed font-serif relative z-10">
                  "{teacher.speech}"
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* সম্মাননা ফুটনোট */}
      <div className="text-center mt-16 pt-8 border-t border-stone-200/60 max-w-md mx-auto">
        <p className="text-xs font-medium text-stone-400 font-serif tracking-wider">
          "শিক্ষকের আলোয় আলোকিত হোক আমাদের প্রতিভার অন্বেষণ।"
        </p>
      </div>

    </div>
  );
}
