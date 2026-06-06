import Image from "next/image";

export default function RunningCommittee() {
  // ডেমো ডেটা (এটি পরে ডাটাবেস বা API থেকে আসতে পারে)
  const committeeMembers = [
    { id: 1, name: "রাফসান আহমেদ", role: "প্রেসিডেন্ট", batch: "HSC '25" },
    { id: 2, name: "জারিন তাসনিম", role: "জেনারেল সেক্রেটারি", batch: "HSC '25" },
    { id: 3, name: "ফাহিম উদ্দীন", role: "ক্রিয়েটিভ ডিরেক্টর", batch: "HSC '26" },
    { id: 4, name: "নাবিলা হক", role: "পাবলিকেশন সেক্রেটারি", batch: "HSC '26" },
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
          <div key={member.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
            {/* Image Placeholder */}
            <div className="h-48 bg-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span>ছবি {member.id}</span>
              </div>
            </div>
            
            {/* Member Details */}
            <div className="p-5 text-center">
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-rose-700 font-medium text-sm mt-1">{member.role}</p>
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
