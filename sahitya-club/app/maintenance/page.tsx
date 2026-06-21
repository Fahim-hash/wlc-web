import Image from "next/image";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-stone-950 text-stone-100 antialiased select-none">
      <div className="max-w-sm w-full text-center space-y-6">
        
        {/* ক্লাবের লোগো */}
        <div className="relative w-16 h-16 mx-auto bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-center shadow-inner">
          <Image 
            src="/logo.png" 
            alt="WLC Logo" 
            fill 
            className="object-contain p-2 grayscale opacity-90"
            priority
          />
        </div>

        {/* সলিড ও বোল্ড টেক্সট */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase sm:text-4xl">
            Opening Soon
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed max-w-[280px] mx-auto">
            উইল্‌স সাহিত্য ক্লাবের নতুন ওয়েব প্ল্যাটফর্ম প্রস্তুত হচ্ছে। আমরা খুব শীঘ্রই আসছি।
          </p>
        </div>

        {/* মিনিমাল পালস ডট */}
        <div className="flex items-center justify-center pt-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
        </div>

        {/* একদম নিট ফুটার */}
        <div className="pt-8 border-t border-stone-900/60 flex items-center justify-between text-[11px] text-stone-600 font-medium">
          <p>© 2026 Willes Sahitto Club</p>
          <p className="tracking-wide">
            Dev: <span className="text-stone-400 font-semibold">Relax Studio</span>
          </p>
        </div>

      </div>
    </div>
  );
}
