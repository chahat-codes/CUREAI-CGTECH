import Image from "next/image";

export default function BetaHome() {
  return (
    <main className="fixed inset-0 z-50 isolate overflow-y-auto bg-white text-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(10,102,255,0.18),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f5faff_46%,#eaf3ff_100%)]" />
      <div className="absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0A66FF]/10 blur-3xl sm:h-96 sm:w-96" />

      <section className="mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="mb-8 rounded-[2rem] border border-blue-100 bg-white/80 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur">
          <Image
            src="/cure-ai-logo.png"
            alt="Cure AI logo"
            width={220}
            height={220}
            priority
            className="h-28 w-28 object-contain sm:h-36 sm:w-36"
          />
        </div>

        <p className="mb-4 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0A66FF] shadow-sm">
          Coming soon
        </p>

        <h1 className="max-w-4xl font-outfit text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Healthcare needs an upgrade.
        </h1>

        <p className="mt-5 font-outfit text-2xl font-semibold text-[#0A66FF] sm:text-4xl">
          We&apos;re building it.
        </p>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          The future of healthcare starts with less waiting.
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#0A66FF] px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
          >
            Join waitlist
          </button>
          <a
            href="https://www.instagram.com/cureaihealth.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full border border-blue-100 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0A66FF] hover:text-[#0A66FF] sm:w-auto"
          >
            @cureaihealth.in
          </a>
        </div>
      </section>
    </main>
  );
}
