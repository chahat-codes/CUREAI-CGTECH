"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, LocateFixed, MapPin, PhoneCall, ShieldAlert, X } from "lucide-react";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function EmergencyAssistance({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locationMessage, setLocationMessage] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationMessage("Location is not available in this browser. Enter your state and city manually."); return; }
    setLocationMessage("Requesting your location permission…");
    navigator.geolocation.getCurrentPosition(
      () => setLocationMessage("Location access was granted for this visit. Choose your state and city below; Cure AI does not send your location to emergency services."),
      () => setLocationMessage("Location was not shared. Enter your state and city manually; you can still call 112."),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    );
  };

  return <>
    <button ref={triggerRef} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className={compact
      ? "inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-800 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 sm:px-4 sm:text-sm"
      : "inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-800 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"}>
      <ShieldAlert className="size-4"/> <span>{compact ? "Emergency" : "Emergency assistance"}</span>
    </button>
    {open && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="emergency-title" aria-describedby="emergency-description" className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.14em] text-rose-700">Emergency assistance</p><h2 id="emergency-title" className="mt-2 font-outfit text-2xl font-extrabold text-slate-900">Find the right emergency contact</h2><p id="emergency-description" className="mt-2 text-sm leading-6 text-slate-600">Choose your location to check for local information. No verified ambulance-provider directory is connected.</p></div><button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label="Close emergency assistance" className="grid size-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"><X className="size-5"/></button></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">State or Union Territory</span><input list="india-states" value={state} onChange={(event)=>setState(event.target.value)} placeholder="Search or enter a state" className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"/><datalist id="india-states">{states.map((item)=><option key={item} value={item}/>)}</datalist></label><label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-700">City or district (optional)</span><input value={city} onChange={(event)=>setCity(event.target.value)} placeholder="Enter city or district" className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"/></label></div>
        <button type="button" onClick={requestLocation} className="mt-3 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"><LocateFixed className="size-4"/>Use my location</button>
        {locationMessage && <p role="status" className="mt-1 text-xs leading-5 text-slate-600">{locationMessage}</p>}
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-rose-700"><PhoneCall className="size-5"/></span><div className="min-w-0 flex-1"><p className="text-xs font-bold uppercase tracking-wide text-rose-800">India national emergency response</p><p className="mt-1 font-outfit text-3xl font-black text-slate-900">112</p><p className="mt-1 text-xs leading-5 text-slate-700">Government of India ERSS number for emergencies, including health assistance. This is a national emergency-response number, not a separately verified ambulance-provider contact.</p><a href="tel:112" className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-700 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"><PhoneCall className="size-4"/>Call 112</a></div></div></div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><a href="https://112.gov.in/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 underline decoration-blue-200 underline-offset-4">Official source: 112.gov.in <ExternalLink className="size-3.5"/></a><span className="inline-flex items-center gap-1 text-xs text-slate-500"><MapPin className="size-3.5"/>{[city, state].filter(Boolean).join(", ") || "No location selected"}</span></div>
        <p className="mt-4 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">Cure AI does not dispatch ambulances, verify vehicle availability or estimate response times. For an urgent emergency, call 112 directly.</p>
      </section>
    </div>}
  </>;
}
