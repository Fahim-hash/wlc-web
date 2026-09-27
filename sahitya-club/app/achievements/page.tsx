import { listPublished } from "@/lib/cms";

type Achievement = {
  id: string;
  title?: string;
  category?: string;
  date?: string;
  description?: string;
};

export const revalidate = 30;

export default async function AchievementsPage() {
  const achievements = (await listPublished("achievements", 100)) as Achievement[];

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#211d1a] pb-24">
      <section className="mx-auto max-w-6xl px-6 pb-14 pt-16 md:pb-20 md:pt-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#9f2d22]">Our Journey</p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-7xl">অর্জন ও স্বীকৃতি</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#746c66] md:text-lg">
            WLC-এর পথচলায় অর্জিত স্বীকৃতি, সাফল্য ও স্মরণীয় মুহূর্তগুলোর সংরক্ষিত গল্প।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        {achievements.length === 0 ? (
          <div className="rounded-[2rem] border border-[#ded7ce] bg-white p-12 text-center">
            <div className="mx-auto mb-5 text-4xl">🏆</div>
            <h2 className="font-serif text-2xl font-bold">গল্পগুলো আসছে</h2>
            <p className="mt-3 text-sm text-[#746c66]">WLC-এর অর্জন ও স্বীকৃতির তথ্য প্রকাশিত হলে এখানে দেখা যাবে।</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((item, index) => (
              <article key={item.id} className="group relative overflow-hidden rounded-[2rem] border border-[#ded7ce] bg-white p-7 shadow-[0_14px_45px_rgba(33,29,26,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(33,29,26,.1)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#f6e9e5] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9f2d22]">{item.category || "Achievement"}</span>
                  <span className="text-3xl font-serif font-bold text-[#e8e0d8]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-10 text-4xl">🏆</div>
                <h2 className="mt-5 font-serif text-2xl font-bold leading-snug">{item.title || "Achievement"}</h2>
                {item.date && <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#9f2d22]">{item.date}</p>}
                <p className="mt-4 text-sm leading-7 text-[#625b55]">{item.description || "এই অর্জন সম্পর্কে বিস্তারিত তথ্য শিগগিরই যুক্ত হবে।"}</p>
                <div className="mt-7 h-1 w-10 rounded-full bg-[#9f2d22] transition-all group-hover:w-20" />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
