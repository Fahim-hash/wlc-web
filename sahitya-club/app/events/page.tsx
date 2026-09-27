import { listPublished } from "@/lib/cms";

type EventRecord = {
  id: string;
  title?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  thumbnail?: string;
  status?: string;
};

export const revalidate = 30;

export default async function EventsPage() {
  const events = (await listPublished("events", 50)) as EventRecord[];

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-rose-200 pb-20">
      <section className="bg-white border-b border-gray-200 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-rose-700 text-sm font-bold tracking-widest uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Timeline
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mt-4 mb-4">
            ইভেন্ট ও নোটিশ বোর্ড
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Telegram থেকে প্রকাশিত WLC-এর ইভেন্ট ও আয়োজনের live archive।
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 mt-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-serif text-gray-900">ইভেন্ট ও আয়োজন</h2>
            <p className="text-sm text-gray-500 mt-1">Published records from Firestore</p>
          </div>
          <span className="text-xs font-semibold bg-stone-100 text-stone-600 px-3 py-1.5 rounded-full">
            {events.length} published
          </span>
        </div>

        {events.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-sm">
            <span className="text-3xl block mb-3">⏳</span>
            <h3 className="text-xl font-bold font-serif text-gray-950 mb-2">নতুন আয়োজনের অপেক্ষায়</h3>
            <p className="text-gray-500 text-sm">
              Telegram CMS থেকে কোনো event publish করলে সেটি এখানে automatically দেখাবে।
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <article key={event.id} className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center gap-2 text-xs text-rose-700 font-bold mb-3">
                  {event.date && <span>📅 {event.date}</span>}
                  {event.time && <span>· ⏰ {event.time}</span>}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold font-serif text-gray-900 mb-3">
                  {event.title || "Untitled event"}
                </h3>
                {event.venue && (
                  <p className="text-sm text-stone-500 font-medium mb-4">📍 {event.venue}</p>
                )}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
                  {event.description || "No description available."}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
