"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, CalendarDays, Clock3, MapPin, Star, Stethoscope } from "lucide-react";
import { getDoctors, hasSupabase } from "@/lib/mvp-api";
import { getFlow, saveFlow, saveSelectedDoctor } from "@/lib/mvp-storage";
import { demoDoctors } from "@/lib/demo-data";
import type { Doctor } from "@/lib/mvp-types";

export default function DoctorProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  useEffect(() => {
    getDoctors().then((items) => setDoctor(items.find((item) => item.id === params.id) || null))
      .catch((err: Error) => { if (process.env.NODE_ENV !== "production") { setDoctor(demoDoctors.find((item) => item.id === params.id) || null); setUsingFallback(true); } else setError(err.message || "Could not load this doctor."); })
      .finally(() => setLoading(false));
  }, [params.id]);
  const book = () => {
    if (!doctor) return;
    saveFlow({ symptoms: getFlow()?.symptoms || "", specialist: doctor.specialization, doctor });
    saveSelectedDoctor(doctor);
    router.push("/booking");
  };

  return <main className="doctor-profile-page"><div className="doctor-profile-container">
    <Link className="doctor-profile-back" href="/find-doctor"><ArrowLeft size={17}/> Back to doctors</Link>
    {loading && <div className="doctor-empty-state"><span className="doctor-spinner"/>Loading doctor profile…</div>}
    {error && <div className="doctor-empty-state error"><p>{error}</p><Link href="/find-doctor">Return to search</Link></div>}
    {!loading && !error && !doctor && <div className="doctor-empty-state"><span><Stethoscope size={24}/></span><h2>Doctor not found</h2><p>This doctor is no longer in the current directory.</p><Link href="/find-doctor">Browse doctors</Link></div>}
    {doctor && <>
      {(!hasSupabase() || usingFallback) && <p className="doctor-demo-note">Demonstration profile · sample directory data. Confirm availability directly with the clinic.</p>}
      <section className="doctor-profile-hero">
        <div className="doctor-profile-person"><span className="doctor-avatar doctor-avatar-fallback">{doctor.name.replace(/^Dr\.\s*/, "").split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><div><p className="profile-eyebrow">Doctor profile</p><h1>{doctor.name}</h1><p className="profile-specialty">{doctor.specialization}</p>{doctor.qualification && <p className="profile-qualification">{doctor.qualification}</p>}<div className="profile-rating"><Star size={18} fill="currentColor"/> <strong>{doctor.rating > 0 ? doctor.rating.toFixed(1) : "Not rated"}</strong>{doctor.experience ? <span>{doctor.experience} years experience</span> : null}</div></div></div>
        <p className="profile-bio">Review the clinic and appointment information before you request a visit. A detailed biography has not been provided in the current directory.</p>
      </section>
      <div className="doctor-profile-details">
        <section className="doctor-detail-card"><h2>Clinic details</h2><div className="doctor-detail-item"><Building2/><div><span>Clinic</span><strong>{doctor.clinic_name || "Clinic not listed"}</strong></div></div><div className="doctor-detail-item"><MapPin/><div><span>Location</span><strong>{doctor.clinic_address || doctor.location || doctor.city || "Location not listed"}</strong></div></div><div className="doctor-detail-item"><Clock3/><div><span>Listed hours</span><strong>{doctor.available_time || "Confirm with clinic"}</strong></div></div></section>
        <section className="doctor-detail-card doctor-fee-card"><h2>Consultation fee</h2><strong className="profile-fee">{doctor.consultation_fee > 0 ? `₹${doctor.consultation_fee}` : "Ask clinic"}</strong><p>Fee information is shown as listed in the directory.</p><button onClick={book}><CalendarDays size={18}/> Book appointment</button><small>Appointment time will be selected on the next step.</small></section>
      </div>
      <section className="doctor-availability-note"><Stethoscope size={20}/><div><strong>Availability</strong><p>{doctor.available_days?.length ? doctor.available_days.join(", ") : "The clinic has not provided confirmed appointment availability."}</p></div></section>
    </>}
  </div></main>;
}
