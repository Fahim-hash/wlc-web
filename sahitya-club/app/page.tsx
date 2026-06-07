import Image from "next/image";

export default function WillesSahityaClub() {
  const flashbackImages = [1, 2, 3, 4, 5, 6];

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

      {/* 3. Flashbacks / Gallery Section */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 font-serif mb-3">স্মৃতির পাতা</h3>
            <p className="text-gray-500">আমাদের সাম্প্রতিক কার্যক্রমের কিছু মুহূর্ত</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {flashbackImages.map((num) => (
              <div 
                key={num} 
                className="relative group aspect-square overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300 bg-gray-100"
              >
                <Image
                  src={`/album/${num}.jpg`}
                  alt={`Club Activity Flashback ${num}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium drop-shadow-md">মুহূর্ত {num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
