// app/panel/running/page.tsx
import Image from "next/image";

export default function RunningCommittee() {
  const executiveMembers = [
   
  { id: 1, name: "আরিয়ান আজমাইন মিয়ন", role: "উপদেষ্টা", batch: "SSC '24", image: "/panel/1.jpg" },
  { id: 2, name: "মাইমুনা তাবাসসুম মাহিয়া", role: "সভাপতি", batch: "HSC '25", image: "/panel/2.jpg" },
  { id: 3, name: "এহসান আহমেদ সিয়াম", role: "সহ-সভাপতি", batch: "HSC '26", image: "/panel/3.jpg" },
  { id: 4, name: "সামিয়া সাদেক", role: "সম্পাদক", batch: "HSC '27", image: "/panel/4.jpg" },
  { id: 5, name: "মো. শান গাজী", role: "সহ-সম্পাদক", batch: "SSC '26", image: "/panel/5.jpg" },
  { id: 6, name: "আতিক আহরার", role: "সদস্য সচিব", batch: "HSC '27", image: "/panel/6.jpg" },
  { id: 7, name: "তাসীন খান", role: "উপ সদস্য সচিব", batch: "SSC '26", image: "/panel/7.jpg" },
  { id: 8, name: "তওহিদ মাহমুদ", role: "প্রচারণা সম্পাদক", batch: "HSC '27", image: "/panel/8.jpg" },
  { id: 9, name: "আরিফুর রহমান তাহমিদ", role: "নিয়ন্ত্রক (বাংলা সাহিত্য)", batch: "SSC '26", image: "/panel/9.jpg" },
  { id: 10, name: "মোল্লা সৌম্য রহমান", role: "নিয়ন্ত্রক (ইংরেজি সাহিত্য)", batch: "HSC '27", image: "/panel/10.jpg" },
  { id: 11, name: "তাওসীফ মাহমুদ গুঞ্জন", role: "নিয়ন্ত্রক (ধর্মীয় সাহিত্য)", batch: "SSC '26", image: "/panel/11.jpg" },
  { id: 12, name: "তানজুমা আক্তার স্নেহা", role: "সহ-নিয়ন্ত্রক (বাংলা সাহিত্য)", batch: "SSC '26", image: "/panel/12.jpg" },
  { id: 13, name: "হাসনাত আযান", role: "সহ-নিয়ন্ত্রক (ইংরেজি সাহিত্য)", batch: "SSC '26", image: "/panel/13.jpg" },
  { id: 14, name: "আদিবা হাসান", role: "সহ-নিয়ন্ত্রক (ধর্মীয় সাহিত্য)", batch: "SSC '26", image: "/panel/14.jpg" },
  { id: 15, name: "ইয়ামিন উজ জামান", role: "চিত্র ও নথি সংগ্রাহক", batch: "HSC '26", image: "/panel/15.jpg" },
  { id: 16, name: "নাজমুল সাকিব", role: "কার্যনির্বাহী প্রধান", batch: "HSC '26", image: "/panel/16.jpg" },
  { id: 17, name: "যুক্ত প্রিয়তা", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/17.jpg" },
  { id: 18, name: "অনন্যা হাসান বিথি", role: "কার্যনির্বাহী", batch: "HSC '26", image: "/panel/18.jpg" },
  { id: 19, name: "আরিয়ান চৌধুরী", role: "কার্যনির্বাহী", batch: "SSC '27", image: "/panel/19.jpg" },
  { id: 20, name: "সাজিদ আলম খান তামিম", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/20.jpg" },
  { id: 21, name: "অয়ন মাহমুদ রাদিন", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/21.jpg" },
  { id: 22, name: "আবিদ হাসান দীপ্ত", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/22.jpg" },
  { id: 23, name: "মুহতাসিম মানাফি", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/23.jpg" },
  { id: 24, name: "নাফিসা সুলতানা", role: "কার্যনির্বাহী", batch: "HSC '26", image: "/panel/24.jpg" },
  { id: 25, name: "আব্দুল নুর", role: "কার্যনির্বাহী", batch: "SSC '27", image: "/panel/25.jpg" },
  { id: 26, name: "নামিয়া নাওয়ার", role: "কার্যনির্বাহী", batch: "HSC '27", image: "/panel/26.jpg" },
  { id: 27, name: "নাহিদ ইসলাম নয়ন", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/27.jpg" },
  { id: 28, name: "সাদিকা মালিহা শখ", role: "কার্যনির্বাহী", batch: "SSC '28", image: "/panel/28.jpg" },
  { id: 29, name: "সেঁজুতি আক্তার অথৈ", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/29.jpg" }

  ];

  const editorialMembers = [
    
  { id: 1, name: "আইশান শান", role: "সম্পাদক", batch: "HSC '25", image: "/panel/1.jpg" },
  { id: 2, name: "সৈয়দ ফাহিম মুদ্দাসির", role: "সহ-সম্পাদক ", batch: "HSC '26", image: "/panel/2.jpg" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="text-center mb-16">
        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          WLC Leadership Tree
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif mt-3 mb-4">
          বর্তমান কমিটি প্যানেল
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg">
          ডিপার্টমেন্টাল হায়ারার্কি বা ট্রি স্ট্রাকচারের মাধ্যমে আমাদের কার্যনির্বাহী ও সম্পাদনা বিভাগের বিন্যাস।
        </p>
      </div>

      {/* --- THE TREE STRUCTURE START --- */}
      <div className="relative flex flex-col items-center">
        
        {/* Top Root Node (Club Center) */}
        <div className="bg-gray-900 text-white px-8 py-4 rounded-xl shadow-md font-serif text-xl font-bold border border-gray-800 z-10 text-center">
          উইল্‌স সাহিত্য ক্লাব
          <span className="block text-xs font-sans text-gray-400 font-normal mt-1">রানিং সেশন (২০২৬)</span>
        </div>

        {/* Vertical Main Stem (Top Line) */}
        <div className="w-0.5 h-12 bg-gray-300 relative"></div>

        {/* The Split Branch (Horizontal Connecting Line) */}
        {/* Desktop-এ লাইন দেখাবে, Mobile-এ লিনিয়ার লেআউট হয়ে যাবে */}
        <div className="hidden md:flex w-full max-w-4xl justify-between relative">
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300"></div>
          <div className="w-0.5 h-8 bg-gray-300 left-1/4 absolute"></div>
          <div className="w-0.5 h-8 bg-gray-300 right-1/4 absolute"></div>
        </div>

        {/* Two Main Branches Content Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mt-0 md:mt-8">
          
          {/* ================= BRANCH 1: EXECUTIVE (কার্যনির্বাহী) ================= */}
          <div className="bg-gradient-to-b from-rose-50/50 to-transparent p-6 rounded-2xl border border-rose-100/70 shadow-sm relative">
            <div className="absolute -top-4 left-6 bg-rose-800 text-white px-5 py-1 rounded-full text-sm font-semibold font-serif shadow-sm">
              ■ কার্যনির্বাহী বিভাগ
            </div>
            
            {/* Inner Branch Line for Mobile/Desktop */}
            <div className="border-l-2 border-rose-200/60 ml-6 pl-6 space-y-8 mt-6">
              {executiveMembers.map((member) => (
                <div key={member.id} className="relative flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:border-rose-300 transition-all">
                  {/* Tree Node Dot Indicator */}
                  <div className="absolute -left-[33px] w-3 h-3 bg-rose-700 rounded-full ring-4 ring-white"></div>
                  
                  {/* Avatar */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-rose-100">
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      fill 
                      className="object-cover object-top"
                    />
                  </div>
                  
                  {/* Info */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-900 transition-colors">{member.name}</h3>
                    <p className="text-xs text-rose-700 font-medium mt-0.5">{member.role}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full mt-1 inline-block">{member.batch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= BRANCH 2: EDITORIAL (সম্পাদনা) ================= */}
          <div className="bg-gradient-to-b from-amber-50/50 to-transparent p-6 rounded-2xl border border-amber-100/70 shadow-sm relative mt-8 md:mt-0">
            <div className="absolute -top-4 left-6 bg-amber-700 text-white px-5 py-1 rounded-full text-sm font-semibold font-serif shadow-sm">
              ■ সম্পাদনা বিভাগ
            </div>

            {/* Inner Branch Line */}
            <div className="border-l-2 border-amber-200/60 ml-6 pl-6 space-y-8 mt-6">
              {editorialMembers.map((member) => (
                <div key={member.id} className="relative flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:border-amber-300 transition-all">
                  {/* Tree Node Dot Indicator */}
                  <div className="absolute -left-[33px] w-3 h-3 bg-amber-600 rounded-full ring-4 ring-white"></div>
                  
                  {/* Avatar */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-amber-100">
                    <Image 
                      src={member.image} 
                      alt={member.name} 
                      fill 
                      className="object-cover object-top"
                    />
                  </div>
                  
                  {/* Info */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-900 transition-colors">{member.name}</h3>
                    <p className="text-xs text-amber-700 font-medium mt-0.5">{member.role}</p>
                    <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full mt-1 inline-block">{member.batch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      {/* --- THE TREE STRUCTURE END --- */}

    </div>
  );
}
