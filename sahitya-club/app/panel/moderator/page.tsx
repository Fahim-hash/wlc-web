// app/panel/moderator/page.tsx
import Image from "next/image";

export default function TeacherModeratorPanel() {
  // শিক্ষকদের ডেটা (ছবি সরাসরি public/panel/ ফোল্ডার থেকে লোড হবে)
  const moderators = [
    {
      id: 101,
      name: "জনাব মোহাম্মদ আলী",
      role: "প্রধান মডারেটর",
      designation: "সিনিয়র শিক্ষক, বাংলা বিভাগ",
      institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
      speech: "সাহিত্যচর্চা মানুষের মনের সংকীর্ণতা দূর করে চেতনাকে শাণিত করে। উইল্‌স সাহিত্য ক্লাব আমাদের শিক্ষার্থীদের ভেতরের সুপ্ত প্রতিভাকে বিকশিত করার যে মহৎ যাত্রা শুরু করেছে, তা সত্যিই প্রশংসনীয়। আমার বিশ্বাস, এই প্রাঙ্গণ থেকেই আগামী দিনের শ্রেষ্ঠ লেখক ও চিন্তাবিদদের জন্ম হবে।",
      image: "/panel/teacher1.jpg",
    },
    {
      id: 102,
      name: "মিসেস ফাতেমা বেগম",
      role: "সহকারী মডারেটর",
      designation: "সহকারী শিক্ষক, ইংরেজি বিভাগ",
      institution: "উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজ",
      speech: "সাহিত্যের কোনো সীমানা নেই। বাংলা ও বিশ্বসাহিত্যের মেলবন্ধনে আমাদের শিক্ষার্থীরা যেভাবে নিজেদের সৃজনশীলতা প্রকাশ করছে, তা দেখে একজন শিক্ষক হিসেবে আমি গর্বিত। উইল্‌স সাহিত্য ক্লাবের প্রতিটি উদ্যোগের সাথে থাকতে পেরে আমি আনন্দিত।",
      image: "/panel/teacher2.jpg",
    },
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
