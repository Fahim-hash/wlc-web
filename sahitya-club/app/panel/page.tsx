// app/panel/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function PanelMainDashboard() {
  const studentCards = [
    {
      title: "বর্তমান কমিটি",
      subtitle: "Running Session",
      desc: "উইল্‌স সাহিত্য ক্লাবের বর্তমান নেতৃত্ব যারা বর্তমানে ক্লাবটিকে সামনে এগিয়ে নিয়ে যাচ্ছে।",
      link: "/panel/running",
      color: "from-rose-800 to-rose-950",
      icon: "✍️"
    },
    {
      title: "জেনারেশন - ২",
      subtitle: "GEN-2 (2025)",
      desc: "দ্বিতীয় ব্যাচের কার্যনির্বাহী ও সম্পাদনা প্যানেল, যাদের হাত ধরে ক্লাবটি পেয়েছে এক নতুন মাত্রা।",
      link: "/panel/GEN-2",
      color: "from-stone-850 to-stone-950",
      icon: "📜"
    },
    {
      title: "জেনারেশন - ১",
      subtitle: "GEN-1 (2024)",
      desc: "ক্লাবের সম্মানিত ফাউন্ডার মেম্বার এবং প্রথম দিককার কারিগরদের ইতিহাস ও লিগ্যাসি আর্কাইভ।",
      link: "/panel/GEN-1",
      color: "from-stone-700 to-stone-850",
      icon: "✒️"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
      
      {/* স্বাগতম ও হেডার সেকশন */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-800 text-3xl rounded-3xl border border-rose-100 shadow-sm mb-4">
          📖
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-stone-900 mb-4">
          নেতৃত্ব ও ইতিহাস আর্কাইভ
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          উইল্‌স সাহিত্য ক্লাবের সূচনা লগ্ন (২০২৪) থেকে শুরু করে আজ পর্যন্ত সকল মডারেটর এবং দায়িত্বশীলদের পরিচয় ও কাজের খতিয়ান।
        </p>
      </div>

      {/* ================= ১. শিক্ষক মডারেটর প্যানেল (Full-width VIP Card) ================= */}
      <div className="mb-10">
        <Link 
          href="/panel/moderator" 
          className="group block bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden border border-stone-800"
        >
          {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক মোটিফ */}
          <div className="absolute right-6 bottom-0 text-stone-800/40 font-serif text-9xl select-none pointer-events-none translate-y-6">
            👨‍🏫
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-block bg-rose-800/30 text-rose-300 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-rose-700/30 mb-3">
                Guiding Light
              </span>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-50 group-hover:text-rose-300 transition-colors">
                শ্রদ্ধেয় মডারেটর প্যানেল
              </h2>
              <p className="text-stone-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
                উইল্‌স সাহিত্য ক্লাবের মূল অভিভাবক ও দিকনির্ধারক শিক্ষক মডারেটরদের প্রোফাইল, পরিচিতি এবং তাঁদের মূল্যবান বাণীসমূহ দেখতে এখানে প্রবেশ করুন।
              </p>
            </div>
            
            <div className="w-full md:w-auto px-6 py-3 rounded-xl bg-white text-stone-900 text-center text-sm font-bold shadow-sm group-hover:bg-rose-50 transition-colors whitespace-nowrap">
              শিক্ষক প্যানেল দেখুন →
            </div>
          </div>
        </Link>
      </div>

      {/* সেকশন ডিভাইডার টাইটেল */}
      <div className="flex items-center gap-4 my-8">
        <span className="text-xs uppercase font-bold text-stone-400 tracking-wider whitespace-nowrap">ছাত্রছাত্রীদের কমিটি সেশনসমূহ</span>
        <div className="w-full h-px bg-stone-200"></div>
      </div>

      {/* ================= ২. ৩টি ছাত্র প্যানেলে যাওয়ার মেইন কার্ডস ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {studentCards.map((card, idx) => (
          <Link 
            href={card.link} 
            key={idx} 
            className="group text-left flex flex-col justify-between bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              {/* আইকন ও ছোট ব্যাজ */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 bg-stone-50 px-2 py-1 rounded-md">
                  {card.subtitle}
                </span>
              </div>

              {/* টাইটেল ও বিবরণ */}
              <h3 className="text-xl font-bold font-serif text-stone-900 group-hover:text-rose-900 transition-colors mb-2">
                {card.title}
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                {card.desc}
              </p>
            </div>

            {/* অ্যাকশন বাটন */}
            <div className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${card.color} text-white text-center text-xs font-semibold shadow-sm group-hover:shadow-md transition-all`}>
              প্যানেল দেখুন →
            </div>
          </Link>
        ))}
      </div>

      {/* ক্লাবের মিশন ফুটনোট */}
      <div className="mt-16 pt-8 border-t border-stone-200/60 max-w-md mx-auto text-center">
        <p className="text-xs italic font-serif text-stone-400">
          "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে এগিয়ে চলেছে উইলিয়ানদের ভালোবাসার এই প্রাঙ্গণ।"
        </p>
      </div>

    </div>
  );
}
