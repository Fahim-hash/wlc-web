// app/panel/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function PanelMainDashboard() {
  const cards = [
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
      color: "from-stone-800 to-stone-900",
      icon: "📜"
    },
    {
      title: "জেনারেশন - ১",
      subtitle: "GEN-1 (2024)",
      desc: "ক্লাবের সম্মানিত ফাউন্ডার মেম্বার এবং প্রথম দিককার কারিগরদের ইতিহাস ও লিগ্যাসি আর্কাইভ।",
      link: "/panel/GEN-1",
      color: "from-stone-700 to-stone-800",
      icon: "✒️"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up text-center">
      
      {/* স্বাগতম সেকশন */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 text-rose-800 text-3xl rounded-3xl border border-rose-100 shadow-sm mb-4">
          📖
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-stone-900 mb-4">
          নেতৃত্ব ও ইতিহাস আর্কাইভ
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          উইল্‌স সাহিত্য ক্লাবের সূচনা লগ্ন (২০২৪) থেকে শুরু করে আজকের রানিং সেশন পর্যন্ত সকল দায়িত্বশীলদের পরিচয় ও কাজের খতিয়ান।
        </p>
      </div>

      {/* ৩টি প্যানেলে যাওয়ার মেইন কার্ডস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cards.map((card, idx) => (
          <Link href={card.link} key={idx} className="group text-left flex flex-col justify-between bg-white rounded-2xl border border-stone-200/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
      <div className="mt-16 pt-8 border-t border-stone-200/60 max-w-md mx-auto">
        <p className="text-xs italic font-serif text-stone-400">
          "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে এগিয়ে চলেছে উইলিয়ানদের ভালোবাসার এই প্রাঙ্গণ।"
        </p>
      </div>

    </div>
  );
}
