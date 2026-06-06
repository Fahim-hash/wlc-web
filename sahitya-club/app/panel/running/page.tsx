// app/panel/running/page.tsx
import Image from "next/image";

export default function RunningCommittee() {
  const executiveMembers = [
    { id: 1, name: "রাফসান আহমেদ", role: "প্রেসিডেন্ট", batch: "HSC '25", image: "/panel/1.jpg" },
    { id: 2, name: "জারিন তাসনিম", role: "জেনারেল সেক্রেটারি", batch: "HSC '25", image: "/panel/2.jpg" },
  ];

  const editorialMembers = [
    { id: 3, name: "ফাহিম উদ্দীন", role: "চিফ এডিটর", batch: "HSC '26", image: "/panel/3.jpg" },
    { id: 4, name: "নাবিলা হক", role: "পাবলিকেশন সেক্রেটারি", batch: "HSC '26", image: "/panel/4.jpg" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="text-center mb-16">
        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          WSC Leadership Tree
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
