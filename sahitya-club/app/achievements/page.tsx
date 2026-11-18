import { listPublished } from "@/lib/cms";

type Achievement = {
  id: string;
  title?: string;
  category?: string;
  date?: string;
  description?: string;
  imageFileId?: string;
};

export const revalidate = 30;

function achievementImage(fileId: string) {
  return `/api/telegram/media/${encodeURIComponent(fileId)}`;
}

export default async function AchievementsPage() {
  const achievements = (await listPublished("achievements", 100)) as Achievement[];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-20 font-sans text-gray-800">
      <header className="mx-auto max-w-5xl border-b border-gray-200 px-6 pb-9 pt-12 md:px-10 md:pb-12 md:pt-16">
        <span className="inline-flex items-center rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-700">
          উইল্‌স সাহিত্য ক্লাব · Achievements
        </span>
        <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
              অর্জন ও <span className="text-rose-800">স্বীকৃতি</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
              প্রতিটি অর্জনের পেছনে আছে পরিশ্রম, সৃজনশীলতা আর একসঙ্গে এগিয়ে যাওয়ার গল্প। উইল্‌স সাহিত্য ক্লাবের স্মরণীয় মুহূর্তগুলো এক জায়গায়।
            </p>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white text-4xl shadow-sm md:h-24 md:w-24" aria-hidden="true">
            🏆
          </div>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <span className="rounded-xl bg-stone-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
            {achievements.length}টি প্রকাশিত অর্জন
          </span>
          <a href="#achievement-wall" className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800">
            অর্জনগুলো দেখুন <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <section id="achievement-wall" className="mx-auto max-w-5xl scroll-mt-8 px-6 py-12 md:px-10 md:py-16">
        <div className="mb-7 border-l-4 border-rose-800 pl-4">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-700">Achievement gallery</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-gray-900 md:text-3xl">সাফল্যের স্মরণীয় মুহূর্ত</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">আমাদের যাত্রার প্রতিটি স্বীকৃতি ভবিষ্যতের আরও ভালো কাজের অনুপ্রেরণা।</p>
        </div>

        {achievements.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
            <div className="grid items-center gap-7 md:grid-cols-[220px_1fr]">
              <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-100 bg-[#FAFAFA] text-7xl">
                🏆
              </div>
              <div>
                <span className="inline-flex rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">Coming soon</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-gray-900">নতুন অর্জনের অপেক্ষায়</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                  উইল্‌স সাহিত্য ক্লাবের অর্জন ও স্বীকৃতির গল্প প্রকাশিত হলে এখানে ছবি ও বিস্তারিত তথ্যসহ দেখা যাবে।
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, index) => (
              <article key={item.id} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-gray-100 bg-[#FAFAFA]">
                  {item.imageFileId ? (
                    <img
                      src={achievementImage(item.imageFileId)}
                      alt={item.title ? `${item.title} — অর্জনের ছবি` : "উইল্‌স সাহিত্য ক্লাবের অর্জন"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white text-4xl shadow-sm">🏆</div>
                    </div>
                  )}
                  <span className="absolute left-4 top-4 rounded-full border border-rose-100 bg-rose-50/95 px-3 py-1.5 text-[11px] font-bold text-rose-700 shadow-sm">
                    {item.category || "অর্জন"}
                  </span>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white/95 font-mono text-xs font-bold text-gray-500 shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {item.date && <p className="text-xs font-semibold text-rose-700">{item.date}</p>}
                  <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-rose-800">
                    {item.title || "অর্জন ও স্বীকৃতি"}
                  </h3>
                  <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-7 text-gray-500">
                    {item.description || "এই অর্জনের বিস্তারিত শিগগিরই যুক্ত হবে।"}
                  </p>
                  <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs font-bold text-gray-600">
                    <span className="h-2 w-2 rounded-full bg-rose-700" />
                    উইল্‌স সাহিত্য ক্লাব
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
