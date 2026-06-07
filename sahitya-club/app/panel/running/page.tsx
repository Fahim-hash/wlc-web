// app/panel/running/page.tsx
import Image from "next/image";

export default function RunningCommittee() {
  const advisors = [
    { id: 1, name: "আরিয়ান আজমাইন মিয়ন", role: "উপদেষ্টা", batch: "SSC '24", image: "/panel/adv_1.jpg" },
    { id: 2, name: "আইশান শান", role: "উপদেষ্টা", batch: "HSC '25", image: "/panel/adv_2.jpg" },
    { id: 3, name: "মোল্লা সৌম্য রহমান", role: "পরামর্শদাতা", batch: "HSC '27", image: "/panel/adv_3.jpg" },
    { id: 4, name: "তওহিদ মাহমুদ", role: "পরামর্শদাতা", batch: "HSC '27", image: "/panel/adv_4.jpg" }
  ];

  const executiveMembers = [
    { id: 1, name: "এহসান আহমেদ সিয়াম", role: "সভাপতি", batch: "HSC '26", image: "/panel/1.jpg" },
    { id: 2, name: "অনন্যা হাসান বিথি", role: "সহ সভাপতি", batch: "HSC '26", image: "/panel/2.jpg" },
    { id: 3, name: "আতিক আহরার", role: "সাধারন সম্পাদক", batch: "HSC '27", image: "/panel/3.jpg" },
    { id: 4, name: "রাফিদুল আমিন সাব্বির", role: "সাংগঠনিক সম্পাদক", batch: "SSC '26", image: "/panel/4.jpg" },
    { id: 5, name: "শেখ তাসিন", role: "মুখ্য সংগঠক (দিবা শাখা)", batch: "SSC '27", image: "/panel/5.jpg" },
    { id: 6, name: "নাহিয়ান নূর অহনা", role: "মুখ্য সংগঠক (প্রভাতি শাখা)", batch: "SSC '28", image: "/panel/6.jpg" },
    { id: 7, name: "অরণ্য আসিফ", role: "নিয়ন্ত্রক (বাংলা সাহিত্য)", batch: "SSC '26", image: "/panel/7.jpg" },
    { id: 8, name: "সামশিহা পরী", role: "নিয়ন্ত্রক (ইংরেজি সাহিত্য)", batch: "SSC '28", image: "/panel/8.jpg" },
    { id: 9, name: "দেওয়ান মো: রেজওয়ান", role: "নিয়ন্ত্রক (সুইড শাখা)", batch: "SSC '27", image: "/panel/9.jpg" },
    { id: 10, name: "আরিয়ান চৌধুরী", role: "সহ নিয়ন্ত্রক (বাংলা সাহিত্য)", batch: "SSC '27", image: "/panel/10.jpg" },
    { id: 11, name: "ইফতেখার জামান রোহান", role: "সহ নিয়ন্ত্রক (ইংরেজি সাহিত্য)", batch: "SSC '27", image: "/panel/11.jpg" },
    { id: 12, name: "আলী আল-আমীন", role: "সহ নিয়ন্ত্রক (ধর্মীয় সাহিত্য)", batch: "SSC '29", image: "/panel/12.jpg" },
    { id: 13, name: "রাফসান জাবির", role: "সহ নিয়ন্ত্রক (সুইড শাখা)", batch: "SSC '27", image: "/panel/13.jpg" },
    { id: 14, name: "আব্দুল কাইয়ুম ত্বোহা", role: "কোষাধ্যক্ষ", batch: "HSC '27", image: "/panel/14.jpg" },
    { id: 15, name: "ফারহানা আফরোজ ইপ্তি", role: "প্রচার-প্রচারণা বিষয়ক সম্পাদক", batch: "HSC '26", image: "/panel/15.jpg" },
    { id: 16, name: "আব্দুল নূর", role: "যোগাযোগ ও ব্যবস্থাপনা বিষয়ক সম্পাদক", batch: "SSC '27", image: "/panel/16.jpg" },
    { id: 17, name: "সামিন ইয়াসির", role: "গ্রন্থাগার বিষয়ক সম্পাদক", batch: "SSC '26", image: "/panel/17.jpg" },
    { id: 18, name: "ইয়াসফা রহমান জুঁই", role: "দেয়ালিকা বিষয়ক সম্পাদক", batch: "SSC '27", image: "/panel/18.jpg" },
    { id: 19, name: "নাবিল আহমেদ", role: "নিয়োগ ও শৃঙ্খলা বিষয়ক সম্পাদক (দিবা শাখা)", batch: "SSC '27", image: "/panel/19.jpg" },
    { id: 20, name: "জান্নাতুন তাজরি বারিহা", role: "শৃঙ্খলা বিষয়ক সম্পাদক (প্রভাতি শাখা)", batch: "SSC '29", image: "/panel/20.jpg" },
    { id: 21, name: "আব্দুল্লাহ আল-মাহদি", role: "নথি সংগ্রাহক", batch: "SSC '27", image: "/panel/21.jpg" }
  ];

  const editorialMembers = [
    { id: 1, name: "নাজমুল সাকিব", role: "সভাপতি (সম্পাদনা বিভাগ)", batch: "HSC '26", image: "/panel/edit_1.jpg" },
    { id: 2, name: "ইয়ামিন উজ-জামান", role: "সম্পাদক (সম্পাদনা বিভাগ)", batch: "HSC '26", image: "/panel/edit_2.jpg" },
    { id: 3, name: "রাকিবুল ইসলাম আকাশ", role: "সহ সম্পাদক (চিত্র ও ভিডিওগ্রাফি)", batch: "SSC '27", image: "/panel/edit_3.jpg" },
    { id: 4, name: "আবিয়াজ বুশাইরি", role: "কার্যনির্বাহী", batch: "SSC '26", image: "/panel/edit_4.jpg" }
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
          ডিপার্টমেন্টাল হায়ারার্কি বা ট্রি স্ট্রাকচারের মাধ্যমে আমাদের উপদেষ্টা, प्रशासनिक ও সম্পাদনা বিভাগের বিন্যাস।
        </p>
      </div>

      {/* --- THE TREE STRUCTURE START --- */}
      <div className="relative flex flex-col items-center">
        
        {/* Top Root Node (Club Center) */}
        <div className="bg-gray-900 text-white px-8 py-4 rounded-xl shadow-md font-serif text-xl font-bold border border-gray-800 z-10 text-center">
          উইল্‌স সাহিত্য ক্লাব
          <span className="block text-xs font-sans text-gray-400 font-normal mt-1">রানিং সেশন (২০২৬)</span>
        </div>

        {/* Vertical Main Stem -> Connecting to Advisors */}
        <div className="w-0.5 h-10 bg-gray-300 relative"></div>

        {/* ================= ADVISORY & MENTOR PANEL ================= */}
        <div className="w-full max-w-4xl bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm relative mb-8">
          <div className="absolute -top-4 left-6 bg-slate-800 text-white px-5 py-1 rounded-full text-sm font-semibold font-serif shadow-sm">
            ■ উপদেষ্টা ও পরামর্শদাতা প্যানেল
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {advisors.map((advisor) => (
              <div key={advisor.id} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 group hover:border-slate-400 transition-all">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-slate-200">
                  <Image 
                    src={advisor.image} 
                    alt={advisor.name} 
                    fill 
                    className="object-cover object-top"
                  />
                </div>
                {/* Info */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-slate-900 transition-colors">{advisor.name}</h4>
                  <p className="text-[11px] text-slate-600 font-medium">{advisor.role}</p>
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block">{advisor.batch}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Main Stem -> Connecting to Main Branches */}
        <div className="w-0.5 h-10 bg-gray-300 relative hidden md:block"></div>

        {/* The Split Branch (Horizontal Connecting Line) */}
        <div className="hidden md:flex w-full max-w-4xl justify-between relative">
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300"></div>
          <div className="w-0.5 h-8 bg-gray-300 left-1/4 absolute"></div>
          <div className="w-0.5 h-8 bg-gray-300 right-1/4 absolute"></div>
        </div>

        {/* Two Main Branches Content Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mt-0 md:mt-8">
          
          {/* ================= BRANCH 1: ADMINISTRATIVE (প্রশাসনিক বিভাগ) ================= */}
          <div className="bg-gradient-to-b from-rose-50/50 to-transparent p-6 rounded-2xl border border-rose-100/70 shadow-sm relative">
            <div className="absolute -top-4 left-6 bg-rose-800 text-white px-5 py-1 rounded-full text-sm font-semibold font-serif shadow-sm">
              ■ प्रशासनिक বিভাগ
            </div>
            
            {/* Inner Branch Line */}
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

          {/* ================= BRANCH 2: EDITORIAL (সম্পাদনা বিভাগ) ================= */}
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
