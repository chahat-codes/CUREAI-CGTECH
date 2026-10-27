"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award, Banknote, Building2, CalendarDays, Check, ChevronDown, Clock3, Languages, MapPin, Search, SlidersHorizontal, Star, Stethoscope, X } from "lucide-react";
import { getDoctors, hasSupabase } from "@/lib/mvp-api";
import { getFlow, saveFlow, saveSelectedDoctor } from "@/lib/mvp-storage";
import type { Doctor, MvpFlow } from "@/lib/mvp-types";
import { demoDoctors } from "@/lib/demo-data";

const locations = ["Chandigarh", "Mohali", "Panchkula", "Zirakpur", "Kharar", "Rajpura"];
const specialties = ["General Physician", "Dermatologist", "Cardiologist", "Gynecologist", "Pediatrician", "Dentist", "Ophthalmologist"];
const normalizeTerm = (value: string) => value.toLowerCase().replace(/gynaecologist|gynaecology/g, "gynecology").replace(/gynecologist/g, "gynecology").replace(/orthopaedic|orthopedic/g, "orthopedics").replace(/orthopedist/g, "orthopedics");
const initials = (name: string) => name.replace(/^Dr\.\s*/, "").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

export default function FindDoctorPage() {
  const router = useRouter();
  const [flow, setFlow] = useState<MvpFlow | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [maxFee, setMaxFee] = useState(2000);
  const [sort, setSort] = useState<"rating" | "fee-low" | "experience">("rating");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [prioritiesOpen, setPrioritiesOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const requestId = useRef(0);

  const loadDoctors = useCallback(() => {
    const currentRequest = ++requestId.current;
    setLoading(true); setError(""); setUsingFallback(false);
    getDoctors().then((items) => { if (requestId.current === currentRequest) setDoctors(items); })
      .catch((err: Error) => { if (requestId.current === currentRequest) { if (process.env.NODE_ENV !== "production") { setDoctors(demoDoctors); setUsingFallback(true); } else setError(err.message || "Could not load doctors."); } })
      .finally(() => { if (requestId.current === currentRequest) setLoading(false); });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedFlow = getFlow();
    // Set the client search from the URL or the symptom assistant handoff.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlow(savedFlow);
    setQuery(params.get("q") || savedFlow?.specialist || "");
    setCity(params.get("city") || "");
    loadDoctors();
    return () => { requestId.current += 1; };
  }, [loadDoctors]);

  const results = useMemo(() => {
    const term = normalizeTerm(query.trim());
    const list = doctors.filter((doctor) => {
      const searchable = normalizeTerm([doctor.name, doctor.specialization, doctor.clinic_name, doctor.location, doctor.qualification].filter(Boolean).join(" "));
      const matchesText = !term || searchable.includes(term);
      const locationText = [doctor.city, doctor.location, doctor.clinic_address].filter(Boolean).join(" ").toLowerCase();
      const matchesCity = !city || locationText.includes(city.toLowerCase());
      const matchesFee = !doctor.consultation_fee || doctor.consultation_fee <= maxFee;
      return matchesText && matchesCity && matchesFee;
    });
    return list.sort((a, b) => sort === "fee-low" ? a.consultation_fee - b.consultation_fee : sort === "experience" ? (b.experience || 0) - (a.experience || 0) : b.rating - a.rating);
  }, [doctors, query, city, maxFee, sort]);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("city", city);
    router.replace(`/find-doctor${params.size ? `?${params.toString()}` : ""}`, { scroll: false });
  };

  const book = (doctor: Doctor) => {
    saveFlow({ symptoms: flow?.symptoms || "", specialist: doctor.specialization, doctor });
    saveSelectedDoctor(doctor);
    router.push("/booking");
  };

  const best = results[0];

  return <main className="doctor-results-page">
    <section className="doctor-results-top">
      <div className="doctor-results-container">
        <div className="doctor-result-utility">
          <button className="doctor-back" onClick={() => router.back()}><ArrowLeft size={18}/> Back</button>
          <label className="doctor-language"><Languages size={18}/><select aria-label="Language" value={language} onChange={(event) => setLanguage(event.target.value)}><option>English</option><option>हिन्दी</option></select><ChevronDown size={16}/></label>
        </div>
        <div className="doctor-offline-hero">
          <div className="doctor-offline-copy">
            <span className="doctor-offline-kicker"><Stethoscope size={14}/> IN-PERSON DOCTOR DISCOVERY</span>
            <h1>Find the right doctor for you.</h1>
            <p>{flow?.symptoms ? `Based on your concern: “${flow.symptoms}”. Compare nearby clinicians and confirm appointment details with the clinic.` : "Search by specialty, doctor or location and connect with trusted specialists near you."}</p>
            <div className="doctor-offline-points"><span><Check size={14}/> Clinic visits</span><span><Check size={14}/> Compare nearby care</span><span><Check size={14}/> Book in person</span></div>
          </div>
          <div className="doctor-offline-visual" aria-hidden="true"><span>CARE, CLOSER TO YOU</span></div>
        </div>
        <div className="doctor-results-actions">
          <button className="doctor-outline-btn" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={18}/> Filters</button>
          <Link className="doctor-outline-btn" href="/patient-dashboard#appointments"><CalendarDays size={18}/> My Bookings</Link>
        </div>
      </div>
    </section>

    <section className="doctor-results-container doctor-results-content">
      <form className="doctor-search-bar" onSubmit={submitSearch}>
        <Search size={19}/><input aria-label="Search doctors" placeholder="Search by doctor, specialty or clinic" value={query} onChange={(event) => setQuery(event.target.value)}/>
        <select aria-label="Search location" value={city} onChange={(event) => setCity(event.target.value)}><option value="">All locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select>
        <button type="submit">Search</button>
      </form>
      <div className="doctor-specialty-chips" aria-label="Popular specialties">{specialties.slice(0, 5).map((specialty) => <button key={specialty} className={normalizeTerm(query) === normalizeTerm(specialty) ? "selected" : ""} onClick={() => { setQuery(specialty); router.replace(`/find-doctor?q=${encodeURIComponent(specialty)}`, { scroll: false }); }} type="button">{specialty}</button>)}</div>
      {(!hasSupabase() || usingFallback) && <p className="doctor-demo-note">{usingFallback ? "The live directory is temporarily unavailable. Showing sample doctors for preview; availability and booking need clinic confirmation." : "Sample directory for preview. Availability and appointment requests are demonstrations."}</p>}
      <div className="doctor-results-summary"><div><p>{loading ? "Finding doctors…" : `${results.length} ${results.length === 1 ? "doctor" : "doctors"} found`}</p>{flow?.symptoms && <small>Recommendations use the specialty selected for your symptoms.</small>}</div><button className="doctor-outline-btn" onClick={() => setPrioritiesOpen(true)}><Award size={18}/> Customize priorities</button></div>

      {loading && <div className="doctor-empty-state"><span className="doctor-spinner"/>Loading doctor directory…</div>}
      {error && <div className="doctor-empty-state error"><p>{error}</p><button onClick={loadDoctors}>Try again</button></div>}
      {!loading && !error && best && <>
        <section className="best-doctor-card">
          <h2><Award size={23}/> Best option for you</h2>
          <article className="best-doctor-profile">
            <Avatar doctor={best}/><div><h3>{best.name}</h3><p>{best.specialization}</p><span><Star size={17} fill="currentColor"/> {best.rating > 0 ? best.rating.toFixed(1) : "New"}{best.experience ? ` · ${best.experience} years` : ""}</span></div>
          </article>
          <div className="best-doctor-stats">
            <Stat icon={<Building2/>} label="Clinic" value={best.clinic_name || "Clinic details on profile"}/>
            <Stat icon={<Banknote/>} label="Consultation fee" value={best.consultation_fee ? `₹${best.consultation_fee}` : "Ask clinic"}/>
            <Stat icon={<MapPin/>} label="Location" value={best.location || best.city || "Not listed"}/>
            <Stat icon={<Clock3/>} label="Listed hours" value={best.available_time || "Confirm with clinic"}/>
          </div>
          <div className="best-match-reason"><span>Why this recommendation</span><strong>{query ? `Matches your ${query} search` : "Top rated in the available directory"}{best.experience ? ` · ${best.experience} years of experience` : ""}</strong></div>
          <button className="best-book-button" onClick={() => book(best)}>Book appointment with {best.name}</button>
        </section>

        <div className="recommended-heading"><div><h2>All recommended doctors</h2><p>Ranked by your selected priorities</p></div><label>Sort by <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="rating">Rating</option><option value="fee-low">Lowest fee</option><option value="experience">Experience</option></select></label></div>
        <div className="recommended-doctor-grid">{results.map((doctor, index) => <DoctorResultCard key={doctor.id} doctor={doctor} rank={index + 1} featured={index === 0} onBook={() => book(doctor)}/>)}</div>
      </>}
      {!loading && !error && results.length === 0 && <div className="doctor-empty-state"><span><Stethoscope size={24}/></span><h2>No doctors found</h2><p>Try a different specialty or broaden your location and fee filters.</p><button onClick={() => { setQuery(""); setCity(""); setMaxFee(2000); router.replace("/find-doctor"); }}>Clear filters</button></div>}
    </section>

    {filtersOpen && <Dialog title="Filters" onClose={() => setFiltersOpen(false)}><label className="doctor-dialog-field">Location<select value={city} onChange={(event) => setCity(event.target.value)}><option value="">All locations</option>{locations.map((item) => <option key={item}>{item}</option>)}</select></label><label className="doctor-dialog-field">Maximum consultation fee <strong>₹{maxFee}</strong><input type="range" min="200" max="2000" step="100" value={maxFee} onChange={(event) => setMaxFee(Number(event.target.value))}/></label><label className="doctor-dialog-field">Sort results<select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="rating">Rating</option><option value="fee-low">Lowest fee</option><option value="experience">Experience</option></select></label><button className="doctor-dialog-primary" onClick={() => setFiltersOpen(false)}>Show {results.length} doctors</button></Dialog>}
    {prioritiesOpen && <Dialog title="Customize your priorities" onClose={() => setPrioritiesOpen(false)}><p className="doctor-dialog-description">Choose what matters most when ordering the doctor list.</p>{([ ["rating", "Patient rating", "See the highest-rated listed doctors first"], ["fee-low", "Consultation fee", "Show lower consultation fees first"], ["experience", "Experience", "Prioritize more years in practice"] ] as const).map(([value, title, description]) => <label className="priority-option" key={value}><input type="radio" name="priority" checked={sort === value} onChange={() => setSort(value)}/><span><strong>{title}</strong><small>{description}</small></span>{sort === value && <Check size={18}/>}</label>)}<button className="doctor-dialog-primary" onClick={() => setPrioritiesOpen(false)}>Apply priorities</button></Dialog>}
  </main>;
}

function Avatar({ doctor }: { doctor: Doctor }) {
  const portraits = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=240&h=240&q=85",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=240&h=240&q=85",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=240&h=240&q=85",
    "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=240&h=240&q=85",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=240&h=240&q=85",
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=240&h=240&q=85",
  ];
  const portraitIndex = Array.from(doctor.id).reduce((sum, character) => sum + character.charCodeAt(0), 0) % portraits.length;
  const portrait = doctor.profile_image_url || portraits[portraitIndex];
  // Doctor photos may be hosted by the connected clinic directory.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="doctor-avatar" src={portrait} alt={doctor.name} onError={(event) => { event.currentTarget.style.display = "none"; }}/>
}
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="best-stat"><span>{icon}{label}</span><strong>{value}</strong></div>; }
function DoctorResultCard({ doctor, rank, featured, onBook }: { doctor: Doctor; rank: number; featured: boolean; onBook: () => void }) {
  return <article className={`doctor-result-card ${featured ? "featured" : ""}`}>
    <div className="doctor-result-badge">{featured ? <><Award size={14}/> Best match for you</> : `#${rank} recommended`}</div>
    <div className="doctor-card-person"><Avatar doctor={doctor}/><div><h3>{doctor.name}</h3><p>{doctor.specialization}</p><span><Star size={16} fill="currentColor"/> {doctor.rating > 0 ? doctor.rating.toFixed(1) : "New"}{doctor.experience ? ` (${doctor.experience} years)` : ""}</span></div></div>
    <div className="doctor-match-score"><span>Listed rating</span><strong>{doctor.rating > 0 ? `${doctor.rating.toFixed(1)} / 5` : "Not rated"}</strong><div><i style={{ width: `${doctor.rating > 0 ? doctor.rating / 5 * 100 : 0}%` }}/></div></div>
    <div className="doctor-card-facts"><span><Banknote size={16}/> ₹{doctor.consultation_fee || "—"}</span><span><MapPin size={16}/> {doctor.location || doctor.city || "Location not listed"}</span><span><Building2 size={16}/> {doctor.clinic_name || "Clinic details on profile"}</span><span><Clock3 size={16}/> {doctor.available_time || "Hours not listed"}</span></div>
    <div className="doctor-card-actions"><Link href={`/doctor/${encodeURIComponent(doctor.id)}`}>View details</Link><button onClick={onBook}>Book appointment</button></div>
  </article>;
}
function Dialog({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="doctor-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="doctor-dialog" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button onClick={onClose} aria-label="Close"><X size={20}/></button></header>{children}</section></div>;
}
