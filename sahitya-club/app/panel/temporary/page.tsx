// app/panel/associate/page.tsx
import Image from "next/image";

export default function AssociateCommittee() {
  const interimMembers = [
    { id: 1, name: "সুরাইয়া আক্তার", role: "অস্থায়ী কার্যনির্বাহী", batch: "SSC '26", image: "/panel/temp_1.jpg" },
    { id: 2, name: "আব্দুল্লাহ আহমেদ", role: "অস্থায়ী কার্যনির্বাহী", batch: "SSC '30", image: "/panel/temp_2.jpg" },
    { id: 3, name: "মেহরাব জামান আরিয়ান", role: "অস্থায়ী কার্যনির্বাহী", batch: "SSC '29", image: "/panel/temp_3.jpg" },
    { id: 4, name: "রাহুল পাল", role: "অস্থায়ী কার্যনির্বাহী", batch: "HSC '27", image: "/panel/temp_4.jpg" },
    { id: 5, name: "আহনাফ অমি", role: "অস্থায়ী কার্যনির্বাহী", batch: "SSC '30", image: "/panel/temp_5.jpg" },
    { id: 6, name: "মাশরাক আলম", role: "অস্থায়ী কার্যনির্বাহী", batch: "SSC '28", image: "/panel/temp_6.jpg" },
    { id: 7, name: "আসফিতাজ ইনোরা", role: "অস্থায়ী কার্যনির্বাহী", batch: "SSC '28", image: "/panel/temp_7.jpg" },
    { id: 8, name: "সুমাইয়া আক্তার", role: "অস্থায়ী কার্যনির্বাহী", batch: "SSC '27", image: "/panel/temp_8.jpg" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="text-center mb-16">
        <span className="bg-sky-100 text-sky-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
          WLC Interim Wing
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-serif mt-3 mb-4">
          সহযোগী কার্যনির্বাহী প্যানেল
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg">
          উইল্‌স সাহিত্য ক্লাবের বিভিন্ন সাংগঠনিক কার্যক্রমে সহায়তাকারী অস্থায়ী কার্যনির্বাহী সদস্যবৃন্দ।
        </p>
      </div>

      {/* Grid Layout for Temporary Members */}
      <div className="bg-gradient-to-b from-sky-50/50 to-transparent p-6 rounded-2xl border border-sky-100/70 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {interimMembers.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:border-sky-300 transition-all text-center flex flex-col items-center">
              
              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-sky-100 mb-3 shadow-inner">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Info */}
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-sky-900 transition-colors">{member.name}</h3>
                <p className="text-xs text-sky-700 font-medium mt-0.5">{member.role}</p>
                <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full mt-2 inline-block">{member.batch}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
