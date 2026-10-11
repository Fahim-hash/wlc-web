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
    <main className="min-h-screen bg-[#f7f4ef] pb-24 text-[#211d1a]">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#211d1a] text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_15%,rgba(159,45,34,.52),transparent_34%),radial-gradient(circle_at_88%_78%,rgba(221,171,116,.18),transparent_30%)]" />
        <div aria-hidden="true" className="absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full border border-white/10 md:h-96 md:w-96" />
        <div aria-hidden="true" className="absolute -right-4 -top-12 -z-10 h-56 w-56 rounded-full border border-white/10 md:h-80 md:w-80" />
        <div className="mx-auto grid max-w-6xl items-end gap-10 px-6 pb-16 pt-20 md:grid-cols-[1.15fr_.85fr] md:pb-24 md:pt-28">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#e9b8a9]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e9b8a9]" />
              উইল্‌স সাহিত্য ক্লাব
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1.08] tracking-tight md:text-7xl">
              অর্জন ও <span className="text-[#e9b8a9]">স্বীকৃতি</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              প্রতিটি স্বীকৃতির পেছনে থাকে চেষ্টা, সাহস আর একসঙ্গে এগিয়ে যাওয়ার গল্প। আমাদের পথচলার উল্লেখযোগ্য মুহূর্তগুলো থাকুক স্মৃতির পাতায়।
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#f7f4ef] px-5 py-2.5 text-sm font-bold text-[#211d1a]">🏆 {achievements.length}টি প্রকাশিত অর্জন</span>
              <a href="#achievement-wall" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:bg-white/10">অর্জনগুলো দেখুন ↓</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md md:justify-self-end">
            <div className="absolute -inset-4 rounded-[2rem] border border-white/10" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-7 backdrop-blur-sm md:p-9">
              <div className="flex items-start justify-between gap-4">
                <span className="text-5xl" aria-hidden="true">✦</span>
                <span className="rounded-full border border-[#e9b8a9]/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e9b8a9]">Our journey</span>
              </div>
              <p className="mt-8 font-serif text-3xl font-bold leading-snug md:text-4xl">শব্দ থেকে স্বীকৃতি, স্বপ্ন থেকে সাফল্য।</p>
              <div className="mt-8 h-px bg-white/15" />
              <p className="mt-5 text-sm leading-7 text-white/60">সাহিত্য, সৃজনশীলতা ও দলগত প্রচেষ্টায় তৈরি আমাদের স্মরণীয় অধ্যায়গুলো।</p>
            </div>
          </div>
        </div>
      </section>

      <section id="achievement-wall" className="mx-auto max-w-6xl scroll-mt-8 px-6 py-14 md:py-20">
        <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9f2d22]">The achievement wall</p>
            <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">সাফল্যের স্মরণীয় মুহূর্ত</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#746c66]">প্রতিটি অর্জন আমাদের আরও ভালো কাজ করতে অনুপ্রাণিত করে।</p>
        </div>

        {achievements.length === 0 ? (
          <div className="overflow-hidden rounded-[2rem] border border-[#ded7ce] bg-white shadow-[0_20px_60px_rgba(33,29,26,.05)]">
            <div className="grid items-center gap-8 p-8 md:grid-cols-[.65fr_1fr] md:p-12">
              <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_50%_35%,rgba(159,45,34,.13),transparent_55%),linear-gradient(135deg,#f7eee7,#eee6dc)]">
                <span className="text-8xl" aria-hidden="true">🏆</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9f2d22]">A story in the making</p>
                <h3 className="mt-3 font-serif text-3xl font-bold">নতুন অর্জনের অপেক্ষায়</h3>
                <p className="mt-4 max-w-lg text-sm leading-8 text-[#746c66]">উইল্‌স সাহিত্য ক্লাবের অর্জন ও স্বীকৃতির গল্প প্রকাশিত হলে এই দেয়ালেই সেগুলো ছবি ও বিস্তারিত তথ্যসহ সাজানো হবে।</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, index) => (
              <article key={item.id} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#ded7ce] bg-white shadow-[0_12px_40px_rgba(33,29,26,.045)] transition duration-300 hover:-translate-y-1 hover:border-[#cbb8aa] hover:shadow-[0_24px_55px_rgba(33,29,26,.11)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_50%_35%,rgba(159,45,34,.14),transparent_55%),linear-gradient(135deg,#f7eee7,#eee6dc)]">
                  {item.imageFileId ? (
                    <img
                      src={achievementImage(item.imageFileId)}
                      alt={item.title ? `${item.title} — অর্জনের ছবি` : "উইল্‌স সাহিত্য ক্লাবের অর্জন"}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#9f2d22]/15 bg-white/70 text-5xl shadow-sm">🏆</div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
                  <span className="absolute bottom-4 left-5 rounded-full border border-white/30 bg-black/25 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    {item.category || "অর্জন"}
                  </span>
                  <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/85 font-serif text-sm font-bold text-[#9f2d22] shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  {item.date && <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#9f2d22]">{item.date}</p>}
                  <h3 className="mt-2 font-serif text-2xl font-bold leading-snug transition-colors group-hover:text-[#9f2d22]">{item.title || "অর্জন ও স্বীকৃতি"}</h3>
                  <p className="mt-3 flex-1 whitespace-pre-line text-sm leading-7 text-[#625b55]">{item.description || "এই অর্জনের গল্প শিগগিরই বিস্তারিতভাবে যুক্ত হবে।"}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#eee7e0] pt-5 text-xs font-semibold text-[#9f2d22]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9f2d22]" />
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
