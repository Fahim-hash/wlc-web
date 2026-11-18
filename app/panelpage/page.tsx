import Image from "next/image";
import Link from "next/link";

export default function LegacyPanelPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-stone-900 p-4 text-stone-100">
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-rose-900/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-amber-600/10 blur-3xl" />
      <section className="relative z-10 w-full max-w-md rounded-3xl border border-stone-800 bg-stone-950/70 p-8 text-center shadow-2xl">
        <div className="relative mx-auto mb-4 h-16 w-16">
          <Image src="/logo.png" alt="Willes Literary Club logo" fill className="object-contain" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">Willes Literary Club</p>
        <h1 className="mt-3 text-2xl font-bold">Internal Panel</h1>
        <p className="mt-4 text-sm leading-6 text-stone-300">
          This legacy sign-in page is disabled because it did not verify credentials.
          Use the protected MemberHub sign-in instead.
        </p>
        <Link
          href="/memberhub"
          className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-rose-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700"
        >
          Open secure MemberHub sign-in →
        </Link>
        <Link href="/" className="mt-5 inline-block text-sm text-stone-400 hover:text-white">
          ← Back to website
        </Link>
      </section>
    </main>
  );
}
