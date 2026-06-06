import Image from "next/image";

export default function RunningCommittee() {
  // মেম্বার ডেটা: ইমেজগুলো সরাসরি public/panel/ থেকে কল করা হয়েছে
  const committeeMembers = [
    { id: 1, name: "রাফসান আহমেদ", role: "প্রেসিডেন্ট", batch: "HSC '25", image: "/album/1.jpg" },
    { id: 2, name: "জারিন তাসনিম", role: "জেনারেল সেক্রেটারি", batch: "HSC '25", image: "/panel/2.jpg" },
    { id: 3, name: "ফাহিম উদ্দীন", role: "ক্রিয়েটিভ ডিরেক্টর", batch: "HSC '26", image: "/panel/3.jpg" },
    { id: 4, name: "নাবিলা হক", role: "পাবলিকেশন সেক্রেটারি", batch: "HSC '26", image: "/panel/4.jpg" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-2">
          বর্তমান কমিটি (Running Panel)
        </h1>
        <p className="text-lg text-gray-600">
          উইল্‌স সাহিত্য ক্লাবের বর্তমান নেতৃত্ব যারা ক্লাবটিকে সামনে এগিয়ে নিয়ে যাচ্ছে।
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {committeeMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
            
            {/* Member Image Area */}
            <div className="h-60 bg-gray-100 relative overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                priority={member.id <= 2}
              />
            </div>
            
            {/* Member Details */}
            <div className="p-5 text-center bg-white relative z-10">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-rose-900 transition-colors">
                {member.name}
              </h3>
              <p className="text-rose-700 font-medium text-sm mt-1">
                {member.role}
              </p>
              <div className="mt-3 inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-semibold">
                {member.batch}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
