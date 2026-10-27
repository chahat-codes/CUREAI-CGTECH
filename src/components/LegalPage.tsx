import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: Array<[string, string]> }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 grid size-12 place-items-center rounded-2xl bg-blue-50 text-[#0A66FF]"><ShieldCheck className="size-6" /></div>
        <h1 className="font-outfit text-4xl font-black tracking-tight text-[#071A3D]">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{intro}</p>
        <div className="mt-10 space-y-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {sections.map(([heading, body]) => <section key={heading}><h2 className="text-xl font-bold text-[#071A3D]">{heading}</h2><p className="mt-3 leading-7 text-slate-600">{body}</p></section>)}
        </div>
        <p className="mt-8 text-sm text-slate-500">Questions? <Link href="/contact" className="font-bold text-[#0A66FF]">Contact Cure AI</Link>.</p>
      </div>
    </div>
  );
}
