import Link from "next/link";

export default function ControlHubPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
      <section className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="text-emerald-400 text-sm font-bold tracking-widest uppercase">WLC Control System</div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold mt-3">Telegram-first CMS</h1>
        <p className="text-neutral-400 mt-4 leading-relaxed">WLC website-এর structured content এখন Telegram Control Hub থেকে manage করার জন্য তৈরি। Browser dashboard-এ কোনো admin PIN বা secret রাখা হয় না.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-8">
          {[
            ["/event", "📅 Events"], ["/member", "👥 Members"], ["/achievement", "🏆 Achievements"],
            ["/announcement", "📢 Announcements"], ["/writing", "📝 Writing"], ["/knowledge", "🤖 Kothasokhi"],
          ].map(([command, label]) => (
            <div key={command} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4">
              <div className="font-semibold">{label}</div>
              <code className="text-xs text-emerald-400 mt-2 block">{command} ... | publish</code>
            </div>
          ))}
        </div>
        <div className="mt-8 bg-neutral-950 border border-neutral-800 rounded-2xl p-5">
          <h2 className="font-bold">Management commands</h2>
          <pre className="text-xs text-neutral-400 mt-3 whitespace-pre-wrap">{`/cms
/cmslist events
/cmslist members
/archive <collection> <id>`}</pre>
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/events" className="px-5 py-3 rounded-xl bg-white text-black text-sm font-semibold">Open website</Link>
          <Link href="/album" className="px-5 py-3 rounded-xl bg-neutral-800 text-white text-sm font-semibold">Open album</Link>
        </div>
      </section>
    </main>
  );
}