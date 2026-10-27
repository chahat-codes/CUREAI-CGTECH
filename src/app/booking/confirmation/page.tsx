"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarCheck, CheckCircle2, MapPin, Ticket } from "lucide-react";
import MvpShell, { MvpCard, StatusMessage } from "@/components/mvp/MvpShell";
import { getPatientAppointments, hasSupabase } from "@/lib/mvp-api";
import { getUser } from "@/lib/mvp-storage";
import type { AppointmentWithDetails } from "@/lib/mvp-types";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    const lookup = id ? getPatientAppointments(getUser()).then((items) => items.find((item) => item.id === id) || null) : Promise.resolve(null);
    lookup.then((item) => setAppointment(item))
      .catch(() => setAppointment(null)).finally(() => setLoading(false));
  }, []);
  return <MvpShell eyebrow="Appointment request" title={appointment ? "Your appointment is recorded." : "Booking details"} description="Review the appointment information and the next steps below.">
    {loading && <StatusMessage type="loading">Retrieving your appointment…</StatusMessage>}
    {!loading && !appointment && <MvpCard><StatusMessage type="error">This appointment could not be found for the current patient session.</StatusMessage><button onClick={()=>router.push("/patient-dashboard")} className="mt-5 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white">Open my care</button></MvpCard>}
    {appointment && <div className="mx-auto max-w-3xl"><MvpCard>
      <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 className="size-7"/></span><div><h2 className="text-xl font-extrabold text-slate-900">{hasSupabase() ? "Request submitted" : "Demo appointment saved"}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{hasSupabase() ? "Your appointment has been recorded. Contact the clinic if you need to confirm the time." : "This sample appointment is saved in this browser only. It has not been sent to a doctor or clinic."}</p></div></div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Doctor</p><p className="mt-1 font-bold text-slate-900">{appointment.doctor.name}</p><p className="text-sm text-blue-700">{appointment.doctor.specialization}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Clinic</p><p className="mt-1 font-bold text-slate-900">{appointment.doctor.clinic_name}</p><p className="text-sm text-slate-600">{appointment.doctor.location}</p></div><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><CalendarCheck className="size-5 text-blue-700"/><div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Date & time</p><p className="mt-1 font-bold text-slate-900">{appointment.appointment_date} at {appointment.appointment_time}</p></div></div><div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><Ticket className="size-5 text-blue-700"/><div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reference</p><p className="mt-1 break-all font-bold text-slate-900">{appointment.id}</p></div></div></div>
      <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500"><MapPin className="mt-0.5 size-4 shrink-0"/>Queue position and waiting estimates are shown only when live clinic queue data is available.</p>
      <div className="mt-7 flex flex-wrap gap-3"><Link href="/patient-dashboard" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700">View my appointments <ArrowRight className="size-4"/></Link><Link href="/find-doctor" className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700">Find another doctor</Link></div>
    </MvpCard></div>}
  </MvpShell>;
}
