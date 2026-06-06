// app/panel/running/page.tsx
import { MemberCard } from "@/components/MemberCard"; // components ফোল্ডার থেকে ইম্পোর্ট করো

export default function RunningCommittee() {
  // ১. কার্যনির্বাহী বিভাগ (Executive Department)
  const executiveMembers = [
    { id: 1, name: "রাফসান আহমেদ", role: "প্রেসিডেন্ট", batch: "HSC '25", image: "/panel/1.jpg" },
    { id: 2, name: "জারিন তাসনিম", role: "জেনারেল সেক্রেটারি", batch: "HSC '25", image: "/panel/2.jpg" },
    // আরও মেম্বার যুক্ত করো...
  ];

  // ২. সম্পাদনা বিভাগ (Editorial Department)
  const editorialMembers = [
    { id: 3, name: "ফাহিম উদ্দীন", role: "চিফ এডিটর", batch: "HSC '26", image: "/panel/3.jpg" },
    { id: 4, name: "নাবিলা হক", role: "সহ-সম্পাদক", batch: "HSC '26", image: "/panel/4.jpg" },
    // আরও মেম্বার যুক্ত করো...
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-12 border-b-4 border-rose-800 pb-8 relative">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-950 font-serif mb-3">
          বর্তমান কমিটি (Running Panel)
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl leading-relaxed">
          উইল্‌স সাহিত্য ক্লাবের বর্তমান নেতৃত্ব যারা ক্লাবটিকে সামনে এগিয়ে নিয়ে যাচ্ছে।
        </p>
        <div className="absolute top-0 right-0 opacity-[0.04] text-[8vw] select-none pointer-events-none">২০২৪</div>
      </div>

      {/* ১. কার্যনির্বাহী বিভাগ */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-900 font-serif mb-8 flex items-center gap-4">
          <span className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full text-lg">১</span>
          কার্যনির্বাহী বিভাগ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {executiveMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      {/* ২. সম্পাদনা বিভাগ */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-900 font-serif mb-8 flex items-center gap-4">
          <span className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full text-lg">২</span>
          সম্পাদনা বিভাগ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {editorialMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
