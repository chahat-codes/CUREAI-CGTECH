"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { eyebrow: "LAB TESTING · COMING SOON", title: "Explore lab testing options", text: "Diagnostic test booking is not connected yet. See what we’re working toward.", href: "/services/tests-diagnostics", image: "https://images.unsplash.com/photo-1578496480240-32d3e0c04525?auto=format&fit=crop&w=1400&q=85", alt: "Laboratory professional holding test tubes", credit: "National Cancer Institute / Unsplash", creditHref: "https://unsplash.com/photos/woman-holding-test-tubes-GcrSgHDrniY" },
  { eyebrow: "CARE, MADE CLEARER", title: "A little more clarity for your next step", text: "Explore doctors and prepare questions for a conversation with a clinician.", href: "/find-doctor", image: "https://images.unsplash.com/photo-1758691462878-6edc3d3da1be?auto=format&fit=crop&w=1400&q=85", alt: "Doctor speaking with a patient in a clinic", credit: "Vitaly Gariev / Unsplash", creditHref: "https://unsplash.com/photos/doctor-consults-with-patient-in-medical-office-iyeUwItlIPk" },
  { eyebrow: "INSURANCE INFORMATION · COMING SOON", title: "Health cover, easier to understand", text: "Insurance tools and provider connections are still in development.", href: "/services/health-insurance", image: "https://images.unsplash.com/photo-1758691462126-2ee47c8bf9e7?auto=format&fit=crop&w=1400&q=85", alt: "Doctor speaking with a parent and child in a clinic", credit: "Vitaly Gariev / Unsplash", creditHref: "https://unsplash.com/photos/doctor-consults-with-mother-and-child-in-office-ibZ2QiKkEsg" },
];

export default function PromoCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const show = (index: number) => setActive((index + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[active];
  return (
    <section aria-label="Cure AI updates and featured services" aria-roledescription="carousel" className="promo-carousel mx-auto mt-5 w-full max-w-6xl">
      <div className="relative isolate flex min-h-[165px] flex-col justify-between overflow-hidden rounded-[18px] bg-[#123b70] p-4 text-white shadow-[0_14px_36px_rgba(18,59,112,.12)] sm:min-h-[170px] sm:px-5 sm:py-4 lg:min-h-[175px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}>
        <div key={slide.image} role="img" aria-label={slide.alt} className="absolute inset-0 -z-20 bg-cover bg-center motion-safe:animate-[promoFade_.55s_ease-out]" style={{backgroundImage:`url("${slide.image}")`}}/>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#103764]/90 via-[#174d86]/70 to-[#1768ee]/12"/>
        <div className="pointer-events-none absolute inset-y-0 right-8 -z-[5] hidden w-52 opacity-35 sm:block [background-image:radial-gradient(rgba(255,255,255,.75)_1px,transparent_1px)] [background-size:13px_13px] [mask-image:linear-gradient(to_left,black,transparent)]"/>
        <div className="relative z-10 flex flex-1 flex-col justify-center pb-6 sm:w-[72%] sm:pb-5">
          <span className="inline-flex w-fit rounded-full border border-white/35 bg-white/10 px-2.5 py-1 text-[9px] font-extrabold tracking-[.13em] text-white backdrop-blur-sm">{slide.eyebrow}</span>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"><h2 className="font-outfit text-lg font-extrabold leading-tight sm:text-xl">{slide.title}</h2><Link href={slide.href} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold text-[#123b70] transition hover:bg-[#eaf2ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">Explore <ArrowRight className="size-3.5"/></Link></div>
          <p className="mt-1 max-w-xl line-clamp-1 text-[11px] leading-4 text-white/90 sm:text-xs">{slide.text}</p>
        </div>
        <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between gap-3 sm:bottom-3.5 sm:left-5 sm:right-5"><a href={slide.creditHref} target="_blank" rel="noreferrer" className="truncate text-[9px] font-medium text-white/80 underline decoration-white/40 underline-offset-2">Photo: {slide.credit}</a><div className="flex shrink-0 items-center gap-1" aria-label={`Slide ${active + 1} of ${slides.length}`}>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume promotional slides" : "Pause promotional slides"} className="grid size-6 place-items-center rounded-full border border-white/35 bg-black/20 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{paused ? <Play className="size-3"/> : <Pause className="size-3"/>}</button>
          <button type="button" onClick={() => show(active - 1)} aria-label="Previous promotion" className="grid size-6 place-items-center rounded-full border border-white/35 bg-black/20 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ChevronLeft className="size-3.5"/></button>
          <button type="button" onClick={() => show(active + 1)} aria-label="Next promotion" className="grid size-6 place-items-center rounded-full border border-white/35 bg-black/20 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"><ChevronRight className="size-3.5"/></button>
        </div></div>
      </div>
      <div className="mt-2 flex justify-center gap-1.5" role="group" aria-label="Choose a promotion">{slides.map((item, index) => <button key={item.eyebrow} type="button" onClick={() => show(index)} aria-label={`Show promotion ${index + 1}: ${item.title}`} aria-current={index === active ? "true" : undefined} className={`h-1 rounded-full transition-all ${active === index ? "w-6 bg-[#1768ee]" : "w-2.5 bg-[#cbd9d2] hover:bg-[#91aa9a]"}`}/>)}</div>
    </section>
  );
}
