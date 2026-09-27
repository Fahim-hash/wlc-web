import { listPublished } from "@/lib/cms";

type Achievement = { id: string; title?: string; category?: string; date?: string; description?: string; imageName?: string };

export const revalidate = 30;

export default async function AchievementsPage() {
  const achievements = (await listPublished("achievements", 100)) as Achievement[];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-rose-700">WLC Achievements</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3">অর্জন ও স্বীকৃতি</h1>
          <p className="text-stone-500 max-w-2xl mx-auto mt-4">Telegram CMS থেকে প্রকাশিত WLC-এর verified achievement records।</p>
        </div>

        {achievements.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
            <p className="text-stone-500">এখনও কোনো published achievement নেই।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((item) => (
              <article key={item.id} className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full">{item.category || "Achievement"}</span>
                  <span className="text-xs text-stone-400">{item.date}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold mb-3">{item.title}</h2>
                <p className="text-stone-600 leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
