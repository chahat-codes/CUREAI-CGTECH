import Link from "next/link";
import { ArrowRight, Baby, Brain, CalendarCheck, ChevronDown, CircleHelp, ClipboardPlus, HeartPulse, Hospital, MapPin, Microscope, Pill, Search, ShieldCheck, Stethoscope, Video } from "lucide-react";
import EmergencyAssistance from "@/components/EmergencyAssistance";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";
import PromoCarousel from "@/components/PromoCarousel";

const specialties = [
  ["General Physician", "Everyday health"], ["Dermatologist", "Skin & hair"],
  ["Cardiologist", "Heart health"], ["Gynecologist", "Women’s health"],
  ["Orthopedist", "Bones & joints"], ["Pediatrician", "Child health"],
  ["Neurologist", "Brain & nerves"], ["ENT Specialist", "Ear, nose & throat"],
];

const quickCare = [
  { title: "Health checkups", text: "Explore preventive care and routine assessments.", href: "/services/health-checkups", label: "Coming soon", icon: ClipboardPlus, kind: "checkup" as const },
  { title: "Tests and services", text: "Explore diagnostic tests and lab services.", href: "/services/tests-diagnostics", label: "Coming soon", icon: Microscope, kind: "tests" as const },
  { title: "Medicine order", text: "Medicine ordering is being prepared for patients.", href: "/services/medicine-delivery", label: "Coming soon", icon: Pill, kind: "medicine" as const },
  { title: "Health insurances", text: "Explore health cover information and support.", href: "/services/health-insurance", label: "Coming soon", icon: ShieldCheck, kind: "insurance" as const },
];

const steps = [
  { title: "Describe your symptoms", text: "Use the guided assistant to organise the concerns and questions you want to discuss.", icon: ClipboardPlus },
  { title: "Find the right doctor", text: "Browse available specialties and review the doctor information in the directory.", icon: Stethoscope },
  { title: "Book your consultation", text: "Choose a date and time option, then review your appointment request.", icon: CalendarCheck },
  { title: "Consult online", text: "Join a video consultation when your selected doctor or clinic offers one.", icon: Video },
];

const faqs = [
  ["What is Cure AI?", "Cure AI helps patients explore care options, prepare for consultations and manage appointment information in one place."],
  ["How does the AI Health Assistant work?", "The current assistant is a guided demonstration intake. It records your answers in a summary and can suggest a specialty category. A live AI model is not connected."],
  ["Can Cure AI diagnose my medical condition?", "No. Cure AI does not diagnose or replace a qualified healthcare professional. Seek urgent help for emergencies."],
  ["How can I find the right doctor?", "Search by doctor name, specialty or location, then review the information shown in the directory. Sample listings are labelled as demonstration data."],
  ["How do I book an online consultation?", "You can submit an appointment request through the booking flow. Online consultations are not yet enabled in the demo; consult type and availability depend on clinic integrations."],
  ["Can I manage my appointments through Cure AI?", "The patient dashboard can show demo appointments and supports cancellation in the current MVP. Demo bookings are stored in this browser and are not sent to a clinic."],
  ["Can I upload and manage my medical reports?", "The current Patient Vault offers temporary, in-session file previews only. Files are not uploaded or retained after the tab closes."],
  ["How does Cure AI protect my personal health information?", "Review the Privacy Policy for current data practices. The demo vault does not upload files; do not add sensitive records until secure patient storage is configured."],
  ["Does Cure AI provide emergency ambulance services?", "No. Cure AI does not dispatch ambulances or confirm vehicle availability. In India, call the official national emergency response number 112 for emergencies. See 112.gov.in."],
  ["Which healthcare services are currently available?", "Doctor discovery, guided symptom intake and MVP appointment flows are available. Checkups, diagnostics, medicine delivery, insurance and video consultation are not integrated yet."],
];

function PatientTestimonials() {
  return <section className="border-y border-[#e8efeb] bg-white" aria-labelledby="testimonials-heading"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-extrabold uppercase tracking-[.14em] text-[#1768ee]">Patient stories</p><h2 id="testimonials-heading" className="mt-2 font-outfit text-3xl font-extrabold tracking-tight text-[#172b35] sm:text-4xl">Trusted by Patients on Their Healthcare Journey</h2><p className="mt-3 text-sm leading-6 text-[#718085]">We only publish feedback with permission. No verified patient testimonials are available for display yet.</p></div><div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-[#cbd9d2] bg-[#f8faf9] px-6 py-9 text-center"><span className="mx-auto grid size-11 place-items-center rounded-xl bg-white text-[#637a70]"><CircleHelp className="size-5"/></span><p className="mt-3 font-bold text-[#29434c]">Patient feedback will appear here</p><p className="mt-1 text-sm text-[#7b898d]">Cure AI does not publish demonstration reviews as real patient experiences.</p></div></div></section>;
}

function FAQSection() {
  return <section id="faqs" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-20" aria-labelledby="faq-heading"><div className="text-center"><p className="text-sm font-extrabold uppercase tracking-[.14em] text-[#1768ee]">Good to know</p><h2 id="faq-heading" className="mt-2 font-outfit text-3xl font-extrabold tracking-tight text-[#172b35] sm:text-4xl">Frequently asked questions</h2></div><div className="mt-8 divide-y divide-[#e7eeea] rounded-2xl border border-[#e4ece8] bg-white px-5 sm:px-7">{faqs.map(([question, answer], index)=><details key={question} className="group py-1"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-bold text-[#29434c] outline-none focus-visible:ring-4 focus-visible:ring-blue-50 sm:text-base"><span><span className="mr-3 text-xs font-extrabold text-[#7c9b89]">{String(index+1).padStart(2,"0")}</span>{question}</span><ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[#70817a] transition-transform duration-200 group-open:rotate-180"/></summary><div className="pb-4 pl-9 pr-7 text-sm leading-6 text-[#687a7d]">{answer}</div></details>)}</div></section>;
}

function CareArtwork({ kind }: { kind: "checkup" | "tests" | "medicine" | "insurance" }) {
  const gradients = { checkup: ["#eff6ff", "#dcecff"], tests: ["#effaff", "#d9f1f8"], medicine: ["#f2f4ff", "#e2e8ff"], insurance: ["#edf8fb", "#d9f0ef"] } as const;
  const [start, end] = gradients[kind];
  return <svg aria-hidden="true" viewBox="0 0 320 180" className="absolute inset-0 h-full w-full">
    <defs><linearGradient id={`service-${kind}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={start}/><stop offset="1" stopColor={end}/></linearGradient></defs>
    <rect width="320" height="180" fill={`url(#service-${kind})`}/><circle cx="41" cy="27" r="50" fill="#fff" opacity=".48"/><circle cx="282" cy="153" r="62" fill="#fff" opacity=".38"/>
    <path d="M20 132c33-19 57-18 88 0m118-75c27-16 48-14 76 1" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8"/>
    {kind === "checkup" && <g><rect x="104" y="25" width="112" height="130" rx="20" fill="#fff"/><rect x="137" y="18" width="46" height="18" rx="8" fill="#83b5f0"/><rect x="122" y="52" width="76" height="73" rx="12" fill="#eff6ff"/><path d="M135 89h12l8-17 11 33 9-22 8 6h5" fill="none" stroke="#267fee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="208" cy="126" r="23" fill="#dff4f3"/><path d="M208 140s-12-7-12-15a7 7 0 0112-4 7 7 0 0112 4c0 8-12 15-12 15z" fill="#39a69c"/><circle cx="94" cy="57" r="14" fill="#fff"/><path d="M94 50v14m-7-7h14" stroke="#4389e9" strokeWidth="3" strokeLinecap="round"/></g>}
    {kind === "tests" && <g><rect x="74" y="24" width="172" height="132" rx="24" fill="#fff" opacity=".82"/><path d="M138 42h44m-13 0v38l33 49c5 7 0 14-8 14h-68c-8 0-13-7-8-14l33-49V42" fill="#f9fcff" stroke="#4e91dc" strokeWidth="5" strokeLinejoin="round"/><path d="M124 112c17-7 37 7 62 0l13 19c3 4-1 8-7 8h-65c-6 0-10-4-6-9z" fill="#73c9dd"/><circle cx="145" cy="119" r="4" fill="#fff"/><circle cx="176" cy="131" r="3" fill="#fff"/><path d="M103 53h18v52h-18zm98 0h18v52h-18z" fill="#e8f3ff" stroke="#8bb7e9" strokeWidth="4"/><path d="M103 85h18m80 0h18" stroke="#69bed5" strokeWidth="8"/><path d="M228 37l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#ffc76b"/></g>}
    {kind === "medicine" && <g><rect x="72" y="24" width="176" height="132" rx="24" fill="#fff" opacity=".82"/><g transform="rotate(-32 160 90)"><rect x="118" y="52" width="84" height="82" rx="22" fill="#fff" stroke="#7aaef0" strokeWidth="5"/><path d="M118 93h84v19c0 12-10 22-22 22h-40c-12 0-22-10-22-22z" fill="#6aa7ef"/><path d="M160 93v41" stroke="#fff" strokeWidth="4"/></g><circle cx="101" cy="52" r="18" fill="#fff"/><path d="M101 43v18m-9-9h18" stroke="#2b9c91" strokeWidth="4" strokeLinecap="round"/><circle cx="222" cy="128" r="15" fill="#dff4f3"/><path d="M215 128h14" stroke="#29968c" strokeWidth="3" strokeLinecap="round"/></g>}
    {kind === "insurance" && <g><rect x="75" y="24" width="170" height="132" rx="24" fill="#fff" opacity=".82"/><path d="M160 40l49 18v34c0 29-20 47-49 60-29-13-49-31-49-60V58z" fill="#fff" stroke="#639fe9" strokeWidth="5" strokeLinejoin="round"/><path d="M160 58l32 12v22c0 19-12 32-32 42-20-10-32-23-32-42V70z" fill="#eaf4ff"/><path d="M160 79v28m-14-14h28" stroke="#2786ed" strokeWidth="7" strokeLinecap="round"/><circle cx="91" cy="123" r="15" fill="#dff4f3"/><path d="M84 123l5 5 10-11" fill="none" stroke="#238c82" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M229 39l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#ffc76b"/></g>}
  </svg>;
}

export default function Home() {
  return (
    <main className="cure-home min-h-screen bg-[#f8faf9] text-[#172b35]">
      <HomeHeader/>

      <section className="relative isolate overflow-hidden border-b border-[#e9efec] bg-[#0d2542]">
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2200&q=90')" }}/>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f5f9ff]/94 via-[#eaf3ff]/86 to-[#e9f5ff]/72"/>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-[72px]">
          <div className="mx-auto max-w-4xl text-center text-white">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[.15em] text-[#1d4f8a] backdrop-blur-sm"><HeartPulse className="size-3.5 text-[#72b5ff]"/> Your care, made clearer</p>
            <h1 className="mt-4 font-outfit text-3xl font-extrabold tracking-[-.035em] text-[#142c37] sm:text-5xl lg:text-[56px]">Healthcare for every next step.</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#526b86] sm:text-base">Find trusted care, prepare for a visit, and make your next step feel simpler.</p>
          </div>
          <form action="/find-doctor" className="mx-auto mt-7 grid max-w-5xl gap-2 rounded-[20px] border border-white/60 bg-white p-2 shadow-[0_22px_60px_rgba(3,18,39,.28)] sm:grid-cols-[minmax(0,1fr)_250px_auto] sm:gap-0 sm:p-2">
            <label className="flex min-h-12 items-center gap-3 rounded-xl px-3 focus-within:ring-4 focus-within:ring-blue-50 sm:border-r sm:border-[#e8edf4]"><Search aria-hidden="true" className="size-[18px] shrink-0 text-[#728196]"/><input name="q" aria-label="Search doctors or specialties" placeholder="Search doctors, specialties or concerns" className="min-w-0 flex-1 bg-transparent text-sm text-[#203347] outline-none placeholder:text-[#8997a7]"/></label>
            <label className="flex min-h-12 items-center gap-3 rounded-xl px-3 focus-within:ring-4 focus-within:ring-blue-50"><MapPin aria-hidden="true" className="size-[18px] shrink-0 text-[#728196]"/><select name="city" defaultValue="" aria-label="Location" className="min-w-0 flex-1 bg-transparent text-sm text-[#52636a] outline-none"><option value="">Chandigarh Tricity & nearby</option>{["Chandigarh","Mohali","Panchkula","Zirakpur","Kharar","Rajpura"].map(city=><option key={city}>{city}</option>)}</select></label>
            <button className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1768ee] px-6 text-sm font-bold text-white transition hover:bg-[#0d54cc]">Search doctors <ArrowRight className="size-4"/></button>
          </form>
          <nav aria-label="Popular specialties" className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center justify-center gap-2"><span className="mr-1 text-xs font-bold text-[#526b86]">Popular:</span>{specialties.slice(0,5).map(([name])=><Link key={name} href={`/find-doctor?q=${encodeURIComponent(name)}`} className="rounded-full border border-[#cbdcf1] bg-white/85 px-3 py-1.5 text-xs font-semibold text-[#38536f] backdrop-blur-sm transition hover:border-[#9ebce1] hover:bg-white">{name}</Link>)}</nav>
        </div>
      </section>

      <section aria-label="Explore care" className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{quickCare.map(({title,text,href,label,icon:Icon,kind})=><Link key={title} href={href} className="group overflow-hidden rounded-[18px] border border-[#e5ebf2] bg-white shadow-[0_8px_24px_rgba(19,44,76,.06)] transition duration-200 hover:-translate-y-1 hover:border-[#bfd4f2] hover:shadow-[0_16px_34px_rgba(19,44,76,.12)]">
          <div className="relative h-32 overflow-hidden bg-[#e8f2ff] sm:h-[138px]"><CareArtwork kind={kind}/><span className="absolute left-3 top-3 rounded-full border border-white/75 bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-[#24405f] shadow-sm">{label}</span><span className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-2xl border border-white/80 bg-white/90 text-[#1768ee] shadow-[0_5px_16px_rgba(18,59,112,.14)]"><Icon className="size-5"/></span></div>
          <div className="flex min-h-[103px] items-center justify-between gap-3 px-4 py-3.5"><span><span className="block font-outfit text-base font-extrabold text-[#203347]">{title}</span><span className="mt-1 block text-xs leading-5 text-[#748395]">{text}</span></span><ArrowRight aria-hidden="true" className="size-4 shrink-0 text-[#1768ee] transition-transform group-hover:translate-x-1"/></div>
        </Link>)}</div>
        <div className="pb-2 pt-5"><PromoCarousel/></div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 border-y border-[#e8efeb] bg-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div className="max-w-2xl"><p className="text-sm font-extrabold uppercase tracking-[.14em] text-[#1768ee]">How online consultation works</p><h2 className="mt-2 font-outfit text-3xl font-extrabold tracking-tight text-[#172b35] sm:text-4xl">A clearer path from concern to care.</h2><p className="mt-3 text-sm leading-6 text-[#718085]">Follow a few simple steps. Video consultations are available only where a doctor or clinic supports them.</p></div><Link href="/find-doctor" className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dbe5e1] bg-white px-4 py-3 text-sm font-bold text-[#29434c] hover:border-[#b8d8c8]">Find a Doctor <ArrowRight className="size-4"/></Link></div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{steps.map(({title,text,icon:Icon},index)=><article key={title} className="relative rounded-2xl border border-[#e5ece8] bg-[#fbfcfb] p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#24453a]/5"><span className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-[#eef5ff] text-[#1768ee]"><Icon className="size-5"/></span><span className="font-outfit text-2xl font-black text-[#d5e5db]">0{index+1}</span></span><h3 className="mt-5 text-base font-extrabold text-[#29434c]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#718085]">{text}</p></article>)}</div>
          <div className="mt-6 flex flex-col gap-5 overflow-hidden rounded-2xl bg-[#123b70] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7"><div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[#aacaff]"><Video className="size-6"/></span><div><p className="font-bold">Video consultation, when offered</p><p className="mt-1 text-xs leading-5 text-[#dceaff]">Online visits are not enabled in this demo. Ask your clinic which consultation options are available.</p></div></div><Link href="/video-consult" className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/25 px-4 py-3 text-sm font-bold hover:bg-white/10 sm:self-auto">Consultation details <ArrowRight className="size-4"/></Link></div>
        </div></section>

      <section id="find-doctors" className="scroll-mt-28 border-y border-[#e8efeb] bg-white"><div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-extrabold uppercase tracking-[.14em] text-[#1768ee]">Doctor discovery</p><h2 className="mt-2 font-outfit text-3xl font-extrabold tracking-tight text-[#172b35] sm:text-4xl">Start with the kind of care you need.</h2></div><Link href="/find-doctor" className="inline-flex items-center gap-1 text-sm font-bold text-[#1768ee]">Browse all doctors <ArrowRight className="size-4"/></Link></div><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{specialties.map(([name,sub],index)=>{const icons=[Stethoscope,ClipboardPlus,HeartPulse,Hospital,Baby,Brain,Microscope,Video];const Icon=icons[index];return <Link key={name} href={`/find-doctor?q=${encodeURIComponent(name)}`} className="group rounded-2xl border border-[#e4ece8] bg-[#fbfcfb] p-4 transition hover:-translate-y-0.5 hover:border-[#b8d8c8] hover:shadow-lg hover:shadow-[#24453a]/5 sm:p-5"><span className="grid size-10 place-items-center rounded-xl bg-[#eff6ff] text-[#1768ee] transition group-hover:bg-[#dcefe4]"><Icon className="size-5"/></span><span className="mt-4 block text-sm font-bold text-[#29434c]">{name}</span><span className="mt-1 block text-xs text-[#829095]">{sub}</span></Link>})}</div></div></section>

      <PatientTestimonials/>
      <FAQSection/>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"><div className="flex flex-col justify-between gap-6 rounded-[24px] bg-[#123b70] p-7 text-white sm:p-10 md:flex-row md:items-center"><div className="max-w-xl"><p className="text-sm font-bold text-[#b8d4ff]">READY WHEN YOU ARE</p><h2 className="mt-2 font-outfit text-3xl font-extrabold">Take the next step in your care.</h2><p className="mt-3 text-sm leading-6 text-[#dceaff]">Explore doctors or organise your questions before a visit.</p></div><div className="flex flex-wrap gap-3"><Link href="/find-doctor" className="rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#123b70] hover:bg-[#eff6ff]">Find a doctor</Link><Link href="/ai-health-assistant" className="rounded-xl border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10">Open assistant</Link></div></div></section>
      <section id="emergency" className="border-y border-rose-100 bg-[#fffafa]"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><p className="font-bold text-[#7e3030]">Need emergency help?</p><p className="mt-1 text-sm text-[#7d6b6b]">Cure AI does not dispatch ambulances. See verified national emergency information.</p></div><EmergencyAssistance/></div></section>
      <Footer/>
    </main>
  );
}
