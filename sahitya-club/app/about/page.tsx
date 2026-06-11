// app/about/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function AboutUsPage() {
  const coreValues = [
    { icon: "🌱", title: "প্রতিভা অন্বেষণ", desc: "শিক্ষার্থীদের ভেতরের সুপ্ত সাহিত্যিক ও সৃজনশীল মেধাকে খুঁজে বের করা এবং তাদের উপযুক্ত প্ল্যাটফর্ম দেওয়া।" },
    { icon: "✒️", title: "সৃজনশীল প্রকাশ", desc: "পত্রিকা, দেয়ালিকা, অনলাইন ব্লগ এবং নিয়মিত সাহিত্য আসরের মাধ্যমে লেখার অভ্যাস ও মুক্তচিন্তার বিকাশ ঘটানো।" },
    { icon: "🤝", title: "সাংস্কৃতিক মেলবন্ধন", desc: "স্কুল ও কলেজের বিভিন্ন ব্যাচের সাহিত্যপ্রেমী শিক্ষার্থীদের মধ্যে একটি সুদৃঢ় ও ভ্রাতৃত্বপূর্ণ নেটওয়ার্ক তৈরি করা।" }
  ];

  const activities = [
    { title: "নিয়মিত সাহিত্য আসর", time: "মাসিক ইভেন্ট", desc: "যেখানে সদস্যরা নিজেদের নতুন লেখা গল্প, কবিতা বা প্রবন্ধ পড়ে শোনায় এবং গঠনমূলক সমালোচনা ও ফিডব্যাক পায়।" },
    { title: "বার্ষিক দেয়ালিকা ও ম্যাগাজিন", time: "ফ্ল্যাগশিপ প্রজেক্ট", desc: "বিশেষ দিনগুলোতে ক্লাবের নিজস্ব সম্পাদনা প্যানেলের তত্ত্বাবধানে দেয়ালিকা প্রকাশ এবং বার্ষিক স্মারক গ্রন্থ সংকলন।" },
    { title: "আন্তঃকলেজ ফেস্টিভাল", time: "কালচারাল ইভেন্ট", desc: "অন্যান্য স্বনামধন্য শিক্ষাপ্রতিষ্ঠানের সাথে কুইজ, বিতর্ক, দেয়ালিকা এবং গল্প লেখা প্রতিযোগিতার আয়োজন ও অংশগ্রহণ।" }
  ];

  // 📸 অ্যালবাম সেকশন যুক্ত করা হয়েছে (পাবলিক ফোল্ডারের ইমেজ পাথ বা আনস্প্ল্যাশ ডামি ব্যবহার করতে পারেন)
  const galleryImages = [
    { src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600", alt: "সাহিত্য আসর ২০২৫", caption: "নিয়মিত সাহিত্য আসর ও আলোচনা" },
    { src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600", alt: "বইমেলা সংকলন", caption: "বার্ষিক ম্যাগাজিন প্রকাশনা" },
    { src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600", alt: "দেয়ালিকা উৎসব", caption: "বিশেষ দিবসের দেয়ালিকা প্রদর্শনী" },
    { src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600", alt: "আন্তঃকলেজ প্রতিযোগিতা", caption: "পুরস্কার বিতরণী ও সাংস্কৃতিক উৎসব" },
    { src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=600", alt: "নবীনবরণ ২০২৫", caption: "ক্লাব পরিচিতি ও ওরিয়েন্টেশন" },
    { src: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=600", alt: "প্যানেল মিটিং", caption: "কার্যনির্বাহী কমিটির পরিকল্পনা সভা" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-28 transition-all">
      
      {/* ১. পরিচিতি ও মূল হিরো ব্যানার */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-900 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-rose-200/40">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
          আমাদের গল্প • Who We Are
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight leading-tight">
          উইল্‌স সাহিত্য ক্লাব
        </h1>
        <div className="w-16 h-1 bg-rose-900 mx-auto rounded-full my-4"></div>
        <p className="text-stone-600 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto italic">
          "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে"
        </p>
        <p className="text-stone-500 text-sm md:text-base leading-relaxed">
          এই মূলমন্ত্রকে বুকে ধারণ করে ২০২৪ সালে যাত্রা শুরু করে উইল্‌স লিটল ফ্লাওয়ার স্কুল অ্যান্ড কলেজের একঝাঁক স্বপ্নবাজ শিক্ষার্থীর ভালোবাসার এই প্রাঙ্গণ। মুক্তচিন্তা ও লেখনীর বিকাশে আমরা সদা প্রতিজ্ঞাবদ্ধ।
        </p>
      </div>

      {/* ২. আমাদের লক্ষ্য ও উদ্দেশ্য (Premium Core Values Grid) */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-950">আমাদের মূল লক্ষ্যত্রয়ী</h2>
          <p className="text-stone-400 text-xs uppercase tracking-wider">Our Core Vision & Mission</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((value, idx) => (
            <div key={idx} className="group bg-white border border-stone-200/60 rounded-2xl p-6 hover:shadow-xl hover:border-rose-200/50 transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-3xl mb-5 bg-stone-50 group-hover:bg-rose-50 w-12 h-12 flex items-center justify-center rounded-xl shadow-sm border border-stone-100 transition-colors">
                {value.icon}
              </div>
              <h3 className="text-lg font-bold text-stone-950 mb-2 group-hover:text-rose-900 transition-colors">{value.title}</h3>
              <p className="text-stone-600 text-xs leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ৩. ক্লাবের মূল কার্যক্রম (Interactive Layout) */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 md:p-12 shadow-sm border border-stone-800">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">আমরা কী কী করি?</h2>
            <p className="text-stone-400 text-xs">ক্লাবের নিয়মিত ও বার্ষিক আয়োজনসমূহের সংক্ষিপ্ত রূপরেখা</p>
          </div>
          
          <div className="space-y-8">
            {activities.map((activity, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-3 md:gap-8 items-start pb-6 border-b border-stone-800 last:border-0 last:pb-0 group">
                <div className="min-w-[130px]">
                  <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/50 border border-rose-900/40 px-2.5 py-1 rounded-md">
                    {activity.time}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-base font-bold text-stone-200 group-hover:text-rose-400 transition-colors">{activity.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 📸 ৪. গ্যালারি / স্মৃতির অ্যালবাম (Replacement of /album Layout) */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-950">ফটো গ্যালারি ও অ্যালবাম</h2>
          <p className="text-stone-400 text-xs uppercase tracking-wider">Capturing Literary Moments</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl bg-stone-100 border border-stone-200/60 shadow-sm aspect-[4/3]">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              {/* ওভারলে ক্যাপশন ইফেক্ট */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs font-semibold">{img.caption}</p>
                  <p className="text-[10px] text-stone-300">Willes Literary Club</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ৫. প্রিমিয়াম কল-টু-অ্যাকশন (CTA) */}
      <div className="bg-stone-950 text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg border border-stone-800">
        <div className="absolute right-0 bottom-0 text-stone-900 text-9xl select-none pointer-events-none translate-y-10 translate-x-4">
          ✒️
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-4xl font-bold text-stone-100">
            আমাদের নেতৃত্ব দেখতে চান?
          </h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
            যাঁদের সুনিপুণ পরিকল্পনা ও অক্লান্ত পরিশ্রমে এই কার্যক্রমগুলো এবং চমৎকার ইভেন্টগুলো পরিচালিত হয়, তাঁদের দেখতে আমাদের অফিশিয়াল আর্কাইভ ও প্যানেল ঘুরে আসুন।
          </p>
          <div>
            <Link 
              href="/panel" 
              className="inline-flex items-center gap-2 bg-white text-stone-950 font-bold px-6 py-3 rounded-xl text-xs shadow-md hover:bg-rose-50 hover:scale-[1.02] transition-all"
            >
              কমিটি ও প্যানেল দেখুন →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
