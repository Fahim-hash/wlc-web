// app/nobinboron/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function NobinBoronFlashback() {
  // ২০২৫ সালের নবীনবরণের স্মৃতির অ্যালবামের ইমেজ অ্যারে (৬টি ছবি)
  const memoryImages = [1, 2, 3, 4, 5, 6];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-stone-800 font-sans selection:bg-rose-100 overflow-x-hidden">
      
      {/* ১. ইভেন্ট লোগো ও ল্যান্ডિંગ সেকশন (পেজ ওপেন করলেই এটি দেখা যাবে) */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 text-center bg-white border-b border-stone-200/50 shadow-sm">
        {/* হালকা সাহিত্যিক ব্যাকগ্রাউন্ড গ্রিড */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-60"></div>
        
        <div className="relative z-10 flex flex-col items-center animate-fade-in">
          
          {/* ইভেন্টের মূল লোগো কন্টেইনার */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.05)] bg-white p-2 rounded-full border border-stone-100 transition-transform duration-500 hover:scale-105">
            <Image 
              src="/nobinboron.png" 
              alt="সাহিত্যের নবীনবরণ ২০২৫ ইভেন্ট লোগো" 
              fill 
              className="object-contain p-2"
              priority
            />
          </div>
          
          {/* ইভেন্ট টাইটেল ও সাবটাইটেল */}
          <span className="text-xs uppercase tracking-widest text-rose-800 font-bold bg-rose-50 px-4 py-1.5 rounded-full mb-3">
            স্মৃতির পাতায় আরকাইভ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-stone-950 tracking-tight mb-4">
            সাহিত্যের নবীনবরণ ২০২৫
          </h1>
          
          {/* স্পেসিফিক ইভেন্ট ডেট: 8th November 2025 */}
          <div className="flex items-center gap-2 text-stone-500 font-medium font-serif border-t border-b border-stone-200 py-2 px-6 mt-2">
            <span>📅</span>
            <span className="tracking-wide">৮ই নভেম্বর, ২০২৫</span>
          </div>

        </div>

        {/* নিচে স্ক্রোল করার ইন্ডিকেটর */}
        <div className="absolute bottom-8 animate-bounce text-stone-400 text-xs flex flex-col items-center gap-1">
          <span>স্মৃতিচারণ দেখতে নিচে স্ক্রোল করুন</span>
          <span>👇</span>
        </div>
      </section>

      {/* ২. ফ্ল্যাশবাক / নস্টালজিয়া ডেসক্রিপশন */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="inline-text text-3xl mb-4">✨</div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-950 mb-6 font-serif">ফ্ল্যাশবাক: ফিরে দেখা</h2>
        <p className="text-base md:text-lg text-stone-600 leading-relaxed font-serif italic">
          "একটি চমৎকার সকাল, কিছু জাদুকরী মুহূর্ত আর একঝাঁক নতুন স্বপ্ন।" <br /><br />
          গত ৮ই নভেম্বর, ২০২৫ তারিখে উইল্‌স সাহিত্য ক্লাবের আঙিনায় অনুষ্ঠিত হয়েছিল আমাদের বহু প্রতীক্ষিত <strong>"সাহিত্যের নবীনবরণ ২০২৫"</strong>। নতুনদের বরণ করে নেওয়ার সেই আনন্দঘন কোলাহল, চমৎকার আড্ডা, আর সিনিয়র-জুনিয়রদের মেলবন্ধনের রঙিন স্মৃতিগুলো আজও আমাদের হৃদয়ে অমলিন। এটি কেবল একটি ইভেন্ট ছিল না, এটি ছিল নতুন অধ্যায়ের সূচনা।
        </p>
      </section>

      {/* ৩. ফটো গ্যালারি (স্মৃতির অ্যালবাম) */}
      <section className="bg-white py-20 border-t border-b border-stone-200/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-stone-950 font-serif mb-2">ক্যামেরার ফ্রেমে বন্দি মুহূর্তরা</h3>
            <p className="text-stone-500 text-sm">উত্সবের সেই বিশেষ দিনটির কিছু খণ্ডচিত্র</p>
          </div>

          {/* গ্রিড গ্যালারি লেআউট */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {memoryImages.map((num) => (
              <div 
                key={num} 
                className="relative group aspect-[4/3] overflow-hidden rounded-2xl shadow-sm hover:shadow-md border border-stone-200/60 transition-all duration-300 bg-stone-50"
              >
                <Image
                  src={`/album/nobinboron_${num}.jpg`} 
                  alt={`সাহিত্যের নবীনবরণ ২০২৫ Memory ${num}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* হোভার ইফেক্ট কভার */}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-xs font-medium tracking-wide bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg">
                    📸 স্মৃতি - {num}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৪. ব্যাক টু হোম অ্যাকশন */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-rose-900 transition-colors"
        >
          ← মূল ওয়েবসাইটে ফিরে যান
        </Link>
      </section>

    </main>
  );
}
