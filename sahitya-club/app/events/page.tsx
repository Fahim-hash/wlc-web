import Link from "next/link";
import { listPublished } from "@/lib/cms";

type EventRecord = {
  id: string;
  title?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  link?: string;
};

export const revalidate = 30;

export default async function EventsPage() {
  const events = (await listPublished("events", 50)) as EventRecord[];

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#211d1a] pb-24">
      <section className="relative overflow-hidden border-b border-[#ded7ce] bg-[#211d1a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(185,28,28,.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,.08),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#e9b8a9]">উইল্‌স সাহিত্য ক্লাব</p>
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl font-bold leading-[1.02] md:text-7xl">ইভেন্ট ও আয়োজন</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
              সাহিত্য, সংস্কৃতি ও সৃজনশীলতার প্রতিটি আয়োজন—এক জায়গায়। সামনে কী আছে, আর কী হয়ে গেছে, তার একটি সহজ timeline।
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80">{events.length}টি প্রকাশিত আয়োজন</span>
            <Link href="/" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#211d1a] hover:bg-[#f2e8e2]">← মূল পাতা</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        {events.length === 0 ? (
          <div className="rounded-[2rem] border border-[#ded7ce] bg-white p-12 text-center shadow-[0_20px_60px_rgba(33,29,26,.06)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f6e9e5] text-2xl">✦</div>
            <h2 className="font-serif text-2xl font-bold">নতুন আয়োজন খুব শিগগিরই</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#746c66]">WLC-এর পরবর্তী আয়োজন প্রকাশিত হলে এখানেই দেখা যাবে।</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 hidden h-full w-px bg-[#d9d0c7] md:block" />
            <div className="space-y-8">
              {events.map((event, index) => (
                <article key={event.id} className="relative md:pl-14">
                  <span className="absolute left-0 top-7 hidden h-9 w-9 items-center justify-center rounded-full border-4 border-[#f7f4ef] bg-[#9f2d22] text-xs font-bold text-white shadow md:flex">{index + 1}</span>
                  <div className="rounded-[2rem] border border-[#ded7ce] bg-white p-7 shadow-[0_14px_45px_rgba(33,29,26,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(33,29,26,.09)] md:p-9">
                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-[#9f2d22]">
                      {event.date && <span>📅 {event.date}</span>}
                      {event.time && <span>• {event.time}</span>}
                      {event.venue && <span>• {event.venue}</span>}
                    </div>
                    <h2 className="mt-4 font-serif text-3xl font-bold md:text-4xl">{event.title || "নামহীন আয়োজন"}</h2>
                    <p className="mt-4 whitespace-pre-line text-sm leading-8 text-[#625b55] md:text-base">{event.description || "এই আয়োজন সম্পর্কে বিস্তারিত তথ্য শিগগিরই যুক্ত হবে।"}</p>
                    {event.link && event.link.startsWith("/") && (
                      <Link href={event.link} className="mt-6 inline-flex rounded-full bg-[#211d1a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9f2d22]">বিস্তারিত →</Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
