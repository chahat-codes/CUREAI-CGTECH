import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ClipboardPlus, Microscope, Pill, ShieldCheck } from "lucide-react";

const serviceDetails: Record<string, { title: string; summary: string; icon: typeof ClipboardPlus; detail: string }> = {
  "health-checkups": { title: "Health checkups", summary: "Preventive checkups and routine health assessments.", icon: ClipboardPlus, detail: "Cure AI does not currently book health checkups. This page is an informational placeholder while the service is being planned." },
  "tests-diagnostics": { title: "Tests & diagnostics", summary: "Diagnostic tests and laboratory services.", icon: Microscope, detail: "Diagnostic test search, lab booking and result delivery are not integrated. No tests are available to book through this page." },
  "medicine-delivery": { title: "Medicine delivery", summary: "Medicine-delivery services where supported.", icon: Pill, detail: "Cure AI does not currently sell or deliver medicines. This page does not provide ordering, prescription review or payment." },
  "health-insurance": { title: "Health insurance", summary: "Health insurance information and available services.", icon: ShieldCheck, detail: "Insurance comparison, applications and purchasing are not available through Cure AI at this time." },
};

export default async function HealthcareServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = serviceDetails[slug];
  if (!service) notFound();
  const Icon = service.icon;
  return <div className="min-h-[65vh] bg-[#f8faf9] px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><Link href="/#services" className="inline-flex items-center gap-2 text-sm font-bold text-[#1768ee]"><ArrowLeft className="size-4"/>Healthcare services</Link><section className="mt-6 rounded-3xl border border-[#e4ece8] bg-white p-6 shadow-sm sm:p-10"><span className="grid size-14 place-items-center rounded-2xl bg-[#edf5f0] text-[#14734b]"><Icon className="size-7"/></span><p className="mt-6 text-xs font-extrabold uppercase tracking-[.14em] text-[#14734b]">Coming soon</p><h1 className="mt-2 font-outfit text-3xl font-extrabold text-[#172b35] sm:text-4xl">{service.title}</h1><p className="mt-3 text-lg text-[#52636a]">{service.summary}</p><p className="mt-5 rounded-xl bg-[#f7faf8] p-4 text-sm leading-6 text-[#687a7d]">{service.detail}</p><p className="mt-4 text-xs leading-5 text-[#839196]">No service booking, order, insurance application or payment is being accepted on this page.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/find-doctor" className="inline-flex items-center gap-2 rounded-xl bg-[#1768ee] px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">Find a doctor <ArrowRight className="size-4"/></Link><Link href="/ai-health-assistant" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Open AI Health Assistant</Link></div></section></div></div>;
}
