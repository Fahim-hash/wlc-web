import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";

export default function WillesSahityaClub() {
  // ১. public/pic ফোল্ডার থেকে ছবি রিড করার লজিক
  const picDirectory = path.join(process.cwd(), "public", "pic");
  let flashbackImages: string[] = [];

  try {
    const files = fs.readdirSync(picDirectory);
    flashbackImages = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return ext === ".png" || ext === ".jpg" || ext === ".jpeg";
    });
  } catch (error) {
    console.error("public/pic ফোল্ডারটি খুঁজে পাওয়া যায়নি বা খালি:", error);
  }

  const features = [
    { icon: "✍️", title: "নিয়মিত সাহিত্য আসর", desc: "গল্প, কবিতা ও প্রবন্ধের আসর যেখানে সদস্যরা মুক্ত মনে তাদের লেখনী তুলে ধরে।" },
    { icon: "🎨", title: "দেয়ালিকা ও প্রকাশনা", desc: "বিশেষ দিনগুলোতে ক্লাবের নিজস্ব সম্পাদনা প্যানেলের যৌথ উদ্যোগে দেয়ালিকা প্রকাশ।" },
    { icon: "🏆", title: "প্রতিযোগিতা ও কুইজ", desc: "আন্তঃকলেজ সাহিত্য উৎসব, কুইজ এবং সৃজনশীল লেখালেখি প্রতিযোগিতায় অংশগ্রহণ।" }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-rose-200">
      
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 text-center bg-white border-b border-gray-200 shadow-sm">
        <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-100 to-white"></div>
        
        <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 drop-shadow-md">
            <Image 
              src="/logo.png" 
              alt="উইল্‌স সাহিত্য ক্লাব Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-4 font-serif">
            উইল্‌স সাহিত্য ক্লাব
          </h1>
          
          <h2 className="text-xl md:text-2xl text-rose-700 font-medium italic mb-6">
            "সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে"
          </h2>
          
          <div className="flex items-center gap-3 text-sm md:text-base text-gray-500 font-semibold tracking-wider uppercase bg-gray-100 px-6 py-2 rounded-full">
            <span>ESTD 2024</span>
            <span>•</span>
            <span>Dhaka</span>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl font-bold text-gray-900 mb-6 font-serif">আমাদের কথা</h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          ২০২৪ সালে প্রতিষ্ঠিত উইল্‌স সাহিত্য ক্লাব এমন একটি উন্মুক্ত প্রাঙ্গণ, যেখানে সাহিত্যের প্রতি অকৃত্রিম ভালোবাসা এবং সৃজনশীলতার মেলবন্ধন ঘটে। আমরা বিশ্বাস করি প্রতিটি শিক্ষার্থীর মাঝেই লুকিয়ে আছে একজন সুপ্ত লেখক, কবি বা দার্শনিক। আমাদের মূল লক্ষ্য হলো সেই প্রতিভাকে খুঁজে বের করা এবং একটি সুস্থ সাহিত্যিক পরিবেশ নিশ্চিত করা।
        </p>
      </section>

      {/* 3. Features/Activities Section */}
      <section className="bg-stone-50 py-20 border-t border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 font-serif mb-3">আমাদের মূল কার্যক্রম</h3>
            <p className="text-gray-500">উইলিয়ানদের সৃজনশীলতার মূল ভিত্তি</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold font-serif text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Flashbacks / Gallery Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 font-serif mb-3">স্মৃতির পাতা</h3>
            <p className="text-gray-500">আমাদের সাম্প্রতিক কার্যক্রমের কিছু মুহূর্ত</p>
          </div>

          {flashbackImages.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 rounded-xl border border-gray-200/60">
              <p className="text-gray-400 italic text-sm">কোনো ছবি পাওয়া যায়নি। public/pic ফোল্ডারে ছবি রাখুন।</p>
            </div>
          ) : (
            <>
              {/* হোমপেজে শুধুমাত্র প্রথম ৬টি ছবি দেখাবে */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {flashbackImages.slice(0, 6).map((fileName, idx) => (
                  <div 
                    key={idx} 
                    className="relative group aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gray-100"
                  >
                    <Image
                      src={`/pic/${fileName}`}
                      alt={`Club Activity Flashback ${idx + 1}`}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium drop-shadow-md">
                        মুহূর্ত {idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 🎯 [FIX] এই বাটনটি এখন সবসময় থাকবে এবং সরাসরি /album পেজে নিয়ে যাবে */}
              <div className="text-center mt-12">
                <Link
                  href="/album"
                  className="inline-flex items-center gap-2 bg-stone-100 hover:bg-rose-50 text-stone-800 hover:text-rose-950 font-semibold text-sm px-6 py-3 rounded-full border border-stone-200 shadow-sm transition-all duration-250"
                >
                  সব ছবি দেখুন (অ্যালবাম) ➔
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 5. Call to Action Section */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 md:p-12 shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif mb-4">
            আমাদের সাংগঠনিক প্যানেল দেখতে চান?
          </h3>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            ক্লাবের স্বপ্নযাত্রাকে বাস্তবে রূপ দিতে রানিং কমিটি এবং পূর্ববর্তী জেনারেশনের যেসকল প্যানেল মেম্বাররা নিরলসভাবে কাজ করে যাচ্ছেন, তাদের সাথে পরিচিত হোন।
          </p>
          <Link 
            href="/panel" 
            className="inline-block bg-stone-900 text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-rose-900 transition-colors shadow-sm"
          >
            অফিশিয়াল প্যানেল দেখুন 📖
          </Link>
        </div>
      </section>

    </main>
  );
}
