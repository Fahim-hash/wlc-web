import { listPublished } from "@/lib/cms";

type Member = { id: string; name?: string; role?: string; batch?: string; bio?: string; department?: string; sortOrder?: number };

export const revalidate = 30;

export default async function RunningPanelPage() {
  const members = (await listPublished("members", 100)) as Member[];
  const executive = members.filter((m) => !m.department || m.department === "administrative");
  const editorial = members.filter((m) => m.department === "editorial");

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="text-center mb-14">
        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">WLC Leadership Tree</span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mt-4">বর্তমান কমিটি প্যানেল</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">Telegram থেকে published member records দিয়েই এই panel তৈরি হচ্ছে।</p>
      </header>

      {members.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center">
          <p className="text-gray-500">No published members yet. Telegram CMS থেকে members publish করুন।</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {[["প্রশাসনিক বিভাগ", executive], ["সম্পাদনা বিভাগ", editorial]].map(([title, group]) => (
            <section key={String(title)} className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-6">{String(title)}</h2>
              <div className="space-y-4">
                {(group as Member[]).map((member) => (
                  <article key={member.id} className="border border-gray-100 rounded-2xl p-4">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-rose-700 mt-1">{member.role}</p>
                    {member.batch && <span className="text-xs text-gray-500">{member.batch}</span>}
                    {member.bio && <p className="text-sm text-gray-500 mt-2">{member.bio}</p>}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
