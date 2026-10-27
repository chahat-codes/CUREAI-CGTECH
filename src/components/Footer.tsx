import Link from "next/link";
import Image from "next/image";

const columns = [
  { title: "Explore", links: [["Home", "/"], ["How it works", "/#how-it-works"], ["AI Health Assistant", "/ai-health-assistant"], ["Find Doctors", "/find-doctor"], ["Video Consult", "/video-consult"], ["Login / Sign Up", "/login"]] },
  { title: "Services", links: [["Health Checkups", "/services/health-checkups"], ["Tests & Diagnostics", "/services/tests-diagnostics"], ["Medicine Delivery", "/services/medicine-delivery"], ["Health Insurance", "/services/health-insurance"]] },
  { title: "Support & policies", links: [["FAQs", "/#faqs"], ["Contact Us", "/contact"], ["Privacy Policy", "/privacy"], ["Terms and Conditions", "/terms"], ["Medical Disclaimer", "/medical-disclaimer"]] },
];

export default function Footer() {
  return <footer id="contact" className="scroll-mt-24 border-t border-[#dbe7f5] bg-[#f1f6fd] text-[#31455e]">
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-12">
        <div className="max-w-sm"><Link href="/" className="inline-flex items-center gap-2"><Image src="/cure-ai-logo-mark.png" alt="" width={40} height={40} className="size-10 rounded-lg bg-white object-contain"/><span className="font-outfit text-xl font-extrabold text-[#142c37]">cure <span className="text-[#1768ee]">ai</span></span></Link><p className="mt-3 text-sm leading-6 text-[#5e7188]">Your AI Health Companion. Explore care options and prepare for conversations with healthcare professionals.</p><p className="mt-3 text-xs leading-5 text-[#71839a]">Healthcare discovery and guided preparation; not a diagnostic or emergency-dispatch service.</p></div>
        {columns.map((column)=><div key={column.title}><h2 className="text-sm font-extrabold text-[#1e3653]">{column.title}</h2><ul className="mt-3 space-y-2.5">{column.links.map(([label,href])=><li key={label}><Link href={href} className="text-sm text-[#5e7188] transition hover:text-[#1768ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">{label}</Link></li>)}</ul></div>)}
      </div>
      <div className="mt-8 rounded-2xl border border-[#d8e6f8] bg-white/80 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5 sm:p-5"><div><p className="text-sm font-bold text-[#1e3653]">Emergency information for India</p><p className="mt-1 max-w-3xl text-xs leading-5 text-[#647991]">For emergencies, call the national emergency response number 112. Cure AI does not dispatch ambulances or confirm vehicle availability.</p></div><a href="https://112.gov.in/" target="_blank" rel="noreferrer" className="mt-3 inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#eaf2ff] px-3.5 py-2.5 text-sm font-bold text-[#155ac4] transition hover:bg-[#dceaff] sm:mt-0">Official 112 information <span aria-hidden="true">↗</span></a></div>
      <div className="mt-7 flex flex-col gap-3 border-t border-[#d8e3f0] pt-5 text-xs text-[#6c7e93] sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} Cure AI. Your AI Health Companion.</p><div className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/privacy" className="transition hover:text-[#1768ee]">Privacy</Link><Link href="/terms" className="transition hover:text-[#1768ee]">Terms</Link><Link href="/data-deletion" className="transition hover:text-[#1768ee]">Data deletion</Link></div></div>
    </div>
  </footer>;
}
