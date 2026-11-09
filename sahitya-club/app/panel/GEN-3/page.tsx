import Link from "next/link";

const executiveMembers = [
  { name: "হাসনাত আযান", role: "সভাপতি" },
  { name: "তৌসিফ মাহমুদ গুঞ্জন", role: "সহ সভাপতি" },
  { name: "সুদিঠি বিনতে সাখাওয়াত", role: "সাধারণ সম্পাদক" },
  { name: "আয়েশা খান", role: "সম্পাদক (সম্পাদনা বিভাগ)" },
  { name: "ফারহানা তাসনিম রাইসা", role: "সাংগঠনিক সম্পাদক" },
  { name: "উম্মে ওয়াকিয়া জারা", role: "মুখ্য সংগঠক" },
  { name: "ওয়ালিন হোসেন সিকদার", role: "নিয়ন্ত্রক (বাংলা সাহিত্য)" },
  { name: "সামশিহা পরী", role: "নিয়ন্ত্রক (ইংরেজি সাহিত্য)" },
  { name: "সায়েম আহমেদ", role: "নিয়ন্ত্রক (ধর্মীয় সাহিত্য)" },
  { name: "আব্দুল কাইয়ুম ত্বোহা", role: "নিয়ন্ত্রক (বিশেষ শিশু শাখা)" },
  { name: "শেখ তাসিন", role: "যোগাযোগ বিষয়ক সম্পাদক" },
  { name: "আতিক আহরার", role: "প্রকাশনা বিষয়ক সম্পাদক" },
  { name: "সুরাইয়া আক্তার", role: "গ্রন্থাগার বিষয়ক সম্পাদক" },
  { name: "রাকিবুল ইসলাম আকাশ", role: "চলচ্চিত্র বিষয়ক সম্পাদক" },
  { name: "তানভীর আহমেদ", role: "স্থিরচিত্র বিষয়ক সম্পাদক" },
  { name: "মেঘলা আহসান", role: "দেয়ালিকা বিষয়ক সম্পাদক" },
  { name: "মেহরাব জামান আরিয়ান", role: "দেয়ালিকা বিষয়ক সহ-সম্পাদক" },
  { name: "আহনাফ অমি", role: "নথিসংগ্রাহক" },
  { name: "সুমাইয়া আল-আমিন ইশা", role: "কার্যনির্বাহী" },
  { name: "মিশকাত রহমান", role: "কার্যনির্বাহী" },
  { name: "আব্দুল্লাহ আহমেদ", role: "কার্যনির্বাহী" },
];

const advisorDepartments = [
  {
    name: "প্রশাসনিক বিভাগ",
    accent: "slate" as const,
    members: [
      { name: "আরিয়ান আজমাইন মিয়ন", role: "উপদেষ্টা" },
      { name: "এহসান আহমেদ সিয়াম", role: "উপদেষ্টা" },
      { name: "মোল্লা সৌম্য রহমান", role: "পরামর্শদাতা" },
      { name: "রাফিদুল আমিন সাব্বির", role: "পরামর্শদাতা" },
    ],
  },
  {
    name: "সম্পাদনা বিভাগ",
    accent: "amber" as const,
    members: [
      { name: "আইশান শান", role: "উপদেষ্টা" },
      { name: "সৈয়দ ফাহিম মুদ্দাসির", role: "পরামর্শদাতা" },
      { name: "নাজমুস সাকিব", role: "পরামর্শদাতা" },
    ],
  },
];

function MemberNode({
  name,
  role,
  index,
  accent = "rose",
}: {
  name: string;
  role: string;
  index: number;
  accent?: "rose" | "amber" | "slate";
}) {
  const dotColor =
    accent === "rose" ? "bg-rose-700" : accent === "amber" ? "bg-amber-600" : "bg-slate-600";
  const avatarColor =
    accent === "rose"
      ? "border-rose-100 bg-rose-50 text-rose-800"
      : accent === "amber"
        ? "border-amber-100 bg-amber-50 text-amber-800"
        : "border-slate-200 bg-slate-100 text-slate-700";
  const roleColor =
    accent === "rose" ? "text-rose-700" : accent === "amber" ? "text-amber-700" : "text-slate-600";

  return (
    <article className="group relative flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md sm:gap-4 sm:p-4">
      <span className={`absolute -left-[31px] h-3 w-3 rounded-full border-2 border-white ${dotColor}`} />
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-serif text-xl font-bold ${avatarColor}`}>
        {name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-rose-900 sm:text-[17px]">
          {name}
        </h3>
        <p className={`mt-1 text-xs font-medium leading-relaxed sm:text-sm ${roleColor}`}>{role}</p>
      </div>
      <span className="shrink-0 text-[10px] font-semibold text-gray-300">
        {String(index + 1).padStart(2, "0")}
      </span>
    </article>
  );
}

export default function GenThreePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in-up">
      <header className="mb-16 text-center">
        <span className="rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
          WLC Leadership Tree
        </span>
        <h1 className="mt-3 mb-4 font-serif text-3xl font-bold text-gray-900 sm:text-5xl">
          জেনারেশন - ৩ প্যানেল
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
          উইল্‌স সাহিত্য ক্লাবের তৃতীয় প্রজন্মের নির্বাহী ও উপদেষ্টা পর্ষদের পরিচিতি,
          দায়িত্ব এবং সাংগঠনিক বিন্যাস।
        </p>
      </header>

      <section className="relative flex flex-col items-center">
        <div className="z-10 rounded-xl border border-gray-800 bg-gray-900 px-8 py-4 text-center font-serif text-xl font-bold text-white shadow-md">
          উইল্‌স সাহিত্য ক্লাব
          <span className="mt-1 block font-sans text-xs font-normal text-gray-400">GEN-3 (২০২৬)</span>
        </div>
        <div className="relative h-12 w-0.5 bg-gray-300" />
        <div className="relative hidden h-8 w-full max-w-4xl justify-between md:flex">
          <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gray-300" />
          <div className="absolute left-1/4 h-8 w-0.5 bg-gray-300" />
          <div className="absolute right-1/4 h-8 w-0.5 bg-gray-300" />
        </div>

        <div className="mt-0 grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:gap-10">
          <section className="relative rounded-2xl border border-rose-100/70 bg-gradient-to-b from-rose-50/50 to-transparent p-5 shadow-sm sm:p-6">
            <div className="absolute -top-4 left-6 rounded-full bg-rose-800 px-5 py-1 text-sm font-semibold text-white shadow-sm">
              ■ Executive Panel
            </div>
            <div className="mb-5 mt-6 rounded-xl border border-rose-100 bg-white/80 px-4 py-3 text-center">
              <h2 className="font-serif text-lg font-bold text-gray-900">নির্বাহী বিভাগ</h2>
              <p className="mt-1 text-xs font-medium text-rose-700">২১ জন সদস্য</p>
            </div>
            <div className="ml-5 space-y-4 border-l-2 border-rose-200/70 pl-5">
              {executiveMembers.map((member, index) => (
                <MemberNode key={member.name} name={member.name} role={member.role} index={index} />
              ))}
            </div>
          </section>

          <section className="relative mt-4 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/80 to-transparent p-5 shadow-sm sm:p-6 md:mt-0">
            <div className="absolute -top-4 left-6 rounded-full bg-slate-800 px-5 py-1 text-sm font-semibold text-white shadow-sm">
              ■ Advisor Panel
            </div>
            <div className="mb-5 mt-6 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-center">
              <h2 className="font-serif text-lg font-bold text-gray-900">উপদেষ্টা ও পরামর্শদাতা পর্ষদ</h2>
              <p className="mt-1 text-xs font-medium text-slate-600">২টি বিভাগ · ৭ জন সদস্য</p>
            </div>

            <div className="space-y-8">
              {advisorDepartments.map((department) => (
                <section
                  key={department.name}
                  className={`relative rounded-xl border p-4 ${department.accent === "amber" ? "border-amber-100 bg-amber-50/40" : "border-slate-200 bg-white/70"}`}
                >
                  <h3 className={`mb-5 inline-flex rounded-full px-4 py-1.5 text-sm font-semibold text-white ${department.accent === "amber" ? "bg-amber-700" : "bg-slate-700"}`}>
                    ■ {department.name}
                  </h3>
                  <div className={`ml-3 space-y-4 border-l-2 pl-5 ${department.accent === "amber" ? "border-amber-200/80" : "border-slate-200"}`}>
                    {department.members.map((member, index) => (
                      <MemberNode
                        key={member.name}
                        name={member.name}
                        role={member.role}
                        index={index}
                        accent={department.accent}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        </div>
      </section>

      <footer className="mt-14 border-t border-gray-200 pt-7 text-center">
        <p className="font-serif text-sm italic text-gray-500">“সাহিত্যের বন্ধনে, প্রতিভার সন্ধানে।”</p>
        <Link
          href="/panel"
          className="mt-5 inline-flex rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-900"
        >
          ← প্যানেল আর্কাইভে ফিরে যান
        </Link>
      </footer>
    </div>
  );
}
