// app/about/page.tsx
import Link from "next/link";

export default function AboutUsPage() {
  const coreValues = [
    { icon: "🌱", title: "প্রতিভা অন্বেষণ", desc: "শিক্ষার্থীদের ভেতরের সুপ্ত সাহিত্যিক ও সৃজনশীল মেধাকে খুঁজে বের করা এবং তাদের উপযুক্ত প্ল্যাটফর্ম দেওয়া।" },
    { icon: "✒️", title: "সৃজনশীল প্রকাশ", desc: "পত্রিকা, দেয়ালিকা, অনলাইন ব্লগ এবং নিয়মিত সাহিত্য আসরের মাধ্যমে লেখার অভ্যাস ও মুক্তচিন্তার বিকাশ ঘটানো।" },
    { icon: "🤝", title: "সাংস্কৃতিক মেলবন্ধন", desc: "স্কুল ও কলেজের বিভিন্ন ব্যাচের সাহিত্যপ্রেমী শিক্ষার্থীদের মধ্যে একটি সুদৃঢ় ও ভ্রাতৃত্বপূর্ণ নেটওয়ার্ক তৈরি করা।" }
  ];

  const activities = [
    { title: "নিয়মিত সাহিত্য আসর", time: "মাসিক ইভেন্ট", desc: "যেখানে সদস্যরা নিজেদের নতুন লেখা গল্প, কবিতা বা প্রবন্ধ পড়ে শোনায় এবং গঠনমূলক সমালোচনা ও ফিডব্যাক পায়।" },
    { title: "বার্ষিক দেয়ালিকা ও ম্যাগাজিন", time: "ফ্ল্যাগশিপ প্রজেক্ট", desc: "বিশেষ দিনগুলোতে ক্লাবের নিজস্ব সম্পাদনা প্যানেলের তত্ত্বাবধানে দেয়ালিকা প্রকাশ এবং বার্ষিক স্মারক গ্রন্থ সংকলন।" },
    { title: "আন্তঃকলেজ ফেস্টিভাল", time: "কালচারাল ইভেন্ট", desc: "অন্যান্য স্বনামধন্য শিক্ষাপ্রতিষ্ঠানের সাথে কুইজ, বিতর্ক, দেয়ালিকা এবং গল্প লেখা প্রতিযোগিতার আয়োজন ও অংশগ্রহণ।" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in-up">
      
      {/* ১. পরিচিতি ও মূল ব্যানার */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <span className="bg-rose-50 text-rose-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest font-sans">
          আমাদের গল্প • Who We Are
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-stone-900 font-serif mt-4 mb-6 tracking-tight leading-tight">
          উইল্‌স সাহিত্য ক্লাব
        </h1>
        <p className="text-stone-600 text-base md:text-xl font-serif leading-relaxed">
          "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে" — এই মূলমন্ত্রকে বুকে ধারণ করে ২০২৪ সালে যাত্রা শুরু করে উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের একঝাঁক স্বপ্নবাজ শিক্ষার্থীদের এই ভালোবাসার প্রাঙ্গণ।
        </p>
      </div>

      {/* ২. আমাদের লক্ষ্য ও উদ্দেশ্য (Core Values) */}
      <div className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-900 font-serif mb-10">
          আমাদের মূল লক্ষ্যত্রয়ী
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, idx) => (
            <div key={idx} className="bg-stone-50 border border-stone-200/50 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
              <div className="text-3xl mb-4 bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-sm border border-stone-100">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold font-serif text-stone-900 mb-2">{value.title}</h3>
              <p className="text-stone-600 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ৩. ক্লাবের মূল কার্যক্রম (Activities Timeline) */}
      <div className="mb-20 bg-gradient-to-b from-stone-50 via-transparent to-transparent border border-stone-200/60 rounded-3xl p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-serif mb-2 text-center md:text-left">
          আমরা কী কী করি?
        </h2>
        <p className="text-stone-500 text-sm mb-10 text-center md:text-left">ক্লাবের নিয়মিত ও বার্ষিক আয়োজনসমূহের সংক্ষিপ্ত রূপরেখা</p>
        
        <div className="space-y-8">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex flex-col md:flex-row gap-2 md:gap-8 items-start pb-6 border-b border-stone-200/50 last:border-0 last:pb-0">
              <div className="min-w-[140px]">
                <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md">
                  {activity.time}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-stone-900 font-serif mb-1">{activity.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ৪. কল-টু-অ্যাকশন (CTA) এবং প্যানেলের সাথে কানেকশন */}
      <div className="bg-stone-950 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg">
        {/* ব্যাকগ্রাউন্ড এলিমেন্ট */}
        <div className="absolute right-0 bottom-0 text-stone-900 font-serif text-9xl select-none pointer-events-none translate-y-10 translate-x-4">
          ✒️
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold font-serif mb-4 text-stone-100">
            আমাদের নেতৃত্ব দেখতে চান?
          </h2>
          <p className="text-stone-400 text-sm md:text-base mb-8 leading-relaxed">
            যাঁদের সুনিপুণ পরিকল্পনা ও অক্লান্ত পরিশ্রমে এই কার্যক্রমগুলো সুন্দরভাবে পরিচালিত হয়, তাঁদের দেখতে আমাদের অফিশিয়াল আর্কাইভ ঘুরে আসুন।
          </p>
          <Link 
            href="/panel" 
            className="inline-block bg-white text-stone-950 font-bold px-8 py-3.5 rounded-xl text-sm shadow-md hover:bg-rose-50 transition-colors"
          >
            কমিটি ও প্যানেল দেখুন →
          </Link>
        </div>
      </div>

    </div>
  );
}
