"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  FileText,
  Search,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
import {
  getActiveDoctorId,
  getDoctorOverview,
  getPatientProfileBundle,
  getTodayAppointments,
  saveDoctorNote,
  searchPatientByMedicalId,
  type DoctorAppointment,
  type PatientProfileBundle,
} from "@/lib/mvp-api";

export default function DoctorDashboardPage() {
  const [doctorId, setDoctorId] = useState("doctor-gp-1");
  const [overview, setOverview] = useState({
    todayAppointments: 0,
    waitingPatients: 0,
    completedPatients: 0,
    followUpsDue: 0,
  });
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [medicalId, setMedicalId] = useState("");
  const [patientBundle, setPatientBundle] = useState<PatientProfileBundle | null>(null);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [appointmentFilter, setAppointmentFilter] = useState("All appointments");
  const [appointmentSearch, setAppointmentSearch] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const resolvedDoctorId = await getActiveDoctorId();
      setDoctorId(resolvedDoctorId);
      const [overviewData, todayAppointments] = await Promise.all([
        getDoctorOverview(resolvedDoctorId),
        getTodayAppointments(resolvedDoctorId),
      ]);
      setOverview(overviewData);
      setAppointments(todayAppointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load doctor dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Loads staff data from Supabase/local demo on first render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard();
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearching(true);
    setError("");
    setSuccess("");
    setPatientBundle(null);

    try {
      const patient = await searchPatientByMedicalId(medicalId);
      if (!patient) {
        setError("No patient found for that Medical ID.");
        return;
      }
      setPatientBundle(await getPatientProfileBundle(patient));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not search patient records.");
    } finally {
      setSearching(false);
    }
  };

  const handleSaveNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!patientBundle) return;

    setSavingNote(true);
    setError("");
    setSuccess("");

    try {
      await saveDoctorNote({
        patientId: patientBundle.patient.id,
        doctorId,
        appointmentId: patientBundle.appointments[0]?.id || null,
        notes,
        diagnosis,
        prescription,
        followUpDate,
      });
      setSuccess("Doctor note saved.");
      setNotes("");
      setDiagnosis("");
      setPrescription("");
      setFollowUpDate("");
      setPatientBundle(await getPatientProfileBundle(patientBundle.patient));
      setOverview(await getDoctorOverview(doctorId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save doctor note.");
    } finally {
      setSavingNote(false);
    }
  };

  const cards = [
    { label: "Today appointments", value: overview.todayAppointments, icon: CalendarClock },
    { label: "Waiting patients", value: overview.waitingPatients, icon: UsersRound },
    { label: "Completed patients", value: overview.completedPatients, icon: CheckCircle2 },
    { label: "Follow-ups due", value: overview.followUpsDue, icon: Stethoscope },
  ];

  const visibleAppointments = appointments.filter((appointment) => {
    const status = (appointment.queue_token?.current_status || appointment.status || "").toLowerCase();
    const matchesFilter = appointmentFilter === "All appointments"
      || (appointmentFilter === "Waiting" && status.includes("wait"))
      || (appointmentFilter === "Completed" && status.includes("complete"));
    const query = appointmentSearch.trim().toLowerCase();
    const matchesSearch = !query || `${appointment.patient?.name || ""} ${appointment.symptoms || ""} ${appointment.token_number || ""}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <AuthGuard roles={["doctor"]}>
      <div className="min-h-screen bg-[#f6fafb] text-[#102a43]">
        <header className="border-b border-[#e7eff2] bg-white">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
            <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Cure AI home">
              <Image src="/cure-ai-logo-mark.png" alt="" width={40} height={40} className="size-10 object-contain" />
              <span className="font-outfit text-2xl font-extrabold tracking-tight text-[#12365a]">cure <span className="text-[#0A66FF]">ai</span></span>
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-semibold text-[#526b80] md:flex">
              <Link href="/doctor-dashboard" className="border-b-2 border-[#1768ee] py-2 text-[#0A66FF]">Dashboard</Link>
              <a href="#appointments" className="py-2 transition hover:text-[#0A66FF]">Appointments</a>
              <a href="#patient-search" className="py-2 transition hover:text-[#0A66FF]">Patient records</a>
            </nav>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Notifications" className="rounded-full p-2.5 text-[#49647b] hover:bg-[#f2f8f9]"><Bell className="size-5" /></button>
              <div className="hidden text-right sm:block"><div className="text-sm font-bold">Doctor workspace</div><div className="text-xs text-[#7690a2]">Secure clinical access</div></div>
              <div className="grid size-10 place-items-center rounded-full bg-[#eaf2ff] text-sm font-extrabold text-[#0A66FF]">CA</div>
            </div>
          </div>
        </header>
        <section className="relative overflow-hidden border-b border-[#e3edfb] bg-[linear-gradient(110deg,#f2f7ff_0%,#f7fbff_60%,#eff5ff_100%)]">
          <div className="pointer-events-none absolute -left-20 top-0 size-64 rounded-full bg-[#dce9ff]/60 blur-2xl" />
          <div className="relative mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-bold text-[#0A66FF]"><Stethoscope className="size-3.5" /> DOCTOR WORKSPACE</span>
              <h1 className="mt-3 font-outfit text-3xl font-extrabold tracking-tight text-[#12345a] md:text-4xl">Your practice, at a glance.</h1>
              <p className="mt-2 text-sm leading-6 text-[#668096] md:text-base">Manage today’s appointments and securely look up patient records.</p>
            </div>
            <form id="patient-search" onSubmit={handleSearch} className="mt-6 flex max-w-5xl flex-col gap-2 rounded-2xl border border-[#e2edf0] bg-white p-2 shadow-[0_12px_35px_rgba(34,81,104,.08)] sm:flex-row">
              <div className="relative min-w-0 flex-1"><Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#7790a4]" /><input value={medicalId} onChange={(event) => setMedicalId(event.target.value)} placeholder="Search patient by Medical ID" className="w-full rounded-xl bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-[#8ca0af]" /></div>
              <PrimaryAction type="submit" disabled={searching}>{searching ? "Searching…" : "Find patient"}</PrimaryAction>
            </form>
          </div>
        </section>

        <main className="mx-auto max-w-[1440px] px-5 py-7 lg:px-10 lg:py-9">
      {loading && <StatusMessage type="loading">Loading doctor dashboard...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {success && <StatusMessage type="success">{success}</StatusMessage>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="flex items-center justify-between rounded-2xl border border-[#e4edf0] bg-white p-5 shadow-[0_4px_18px_rgba(34,81,104,.035)]">
              <div>
                <p className="text-sm font-semibold text-[#71879a]">{card.label}</p>
                <p className="font-outfit text-3xl font-extrabold text-[#12345a]">{card.value}</p>
              </div>
              <div className="rounded-2xl bg-[#e8f0ff] p-3 text-[#1768ee]">
                <card.icon className="size-6" />
              </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid items-start gap-5 xl:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-[#e4edf0] bg-white p-5 shadow-[0_4px_18px_rgba(34,81,104,.035)]">
          <div className="flex items-center justify-between"><h2 className="font-outfit text-lg font-bold">Appointments</h2><CalendarDays className="size-5 text-[#1768ee]" /></div>
          <p className="mt-1 text-xs text-[#8195a5]">Filter today’s schedule</p>
          <div className="mt-5 space-y-2">{["All appointments", "Waiting", "Completed"].map((filter) => {
            const selected = appointmentFilter === filter;
            const count = filter === "All appointments" ? appointments.length : filter === "Waiting" ? overview.waitingPatients : overview.completedPatients;
            return <button key={filter} type="button" onClick={() => setAppointmentFilter(filter)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${selected ? "bg-[#eaf2ff] text-[#0A66FF]" : "text-[#61798c] hover:bg-[#f6fafb]"}`}><span>{filter}</span><span className="text-xs">{count}</span></button>;
          })}</div>
          <div className="my-5 border-t border-[#edf2f4]" />
          <div className="flex items-center justify-between text-xs font-semibold text-[#7a8fa0]"><span>Today’s date</span><span className="text-[#12345a]">{new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(new Date())}</span></div>
        </aside>

        <section id="appointments" className="min-w-0">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-sm text-[#71879a]">{visibleAppointments.length} appointments</p><h2 className="mt-1 font-outfit text-2xl font-extrabold text-[#12345a]">Today’s schedule</h2></div>
            <label className="relative block w-full sm:max-w-xs"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#869cad]" /><input value={appointmentSearch} onChange={(event) => setAppointmentSearch(event.target.value)} placeholder="Search patient or concern" className="w-full rounded-xl border border-[#e3ecef] bg-white py-2.5 pl-10 pr-10 text-sm outline-none focus:border-[#94b8ff]" /><ChevronDown className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9aabb6]" /></label>
          </div>
          <div className="space-y-3">
            {visibleAppointments.length === 0 && <StatusMessage type="empty">{appointments.length === 0 ? "No appointments for today." : "No appointments match these filters."}</StatusMessage>}
            {visibleAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="grid gap-4 rounded-2xl border border-[#e3ebf7] bg-white p-4 shadow-[0_4px_18px_rgba(34,81,104,.035)] transition hover:border-[#b9d1ff] sm:grid-cols-[minmax(220px,1.1fr)_minmax(150px,.8fr)_minmax(150px,.8fr)_auto] sm:items-center sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-3"><div className="grid size-14 shrink-0 place-items-center rounded-xl bg-[#e8f0ff] text-lg font-extrabold text-[#0A66FF]">{(appointment.patient?.name || "Patient").split(/\s+/).map((part) => part[0]).slice(0,2).join("").toUpperCase()}</div><div className="min-w-0"><p className="truncate font-outfit text-lg font-bold text-[#12345a]">{appointment.patient?.name || "Patient"}</p><p className="mt-0.5 truncate text-sm text-[#70879a]">{appointment.symptoms || "Consultation"}</p><p className="mt-1 text-xs font-medium text-[#8a9ba8]">Token #{appointment.token_number}</p></div></div>
                <div><p className="text-xs text-[#8396a5]">Appointment time</p><p className="mt-1 font-semibold text-[#234560]">{appointment.appointment_time || "Time not set"}</p></div>
                <div><p className="text-xs text-[#8396a5]">Queue status</p><span className="mt-1 inline-flex rounded-full bg-[#e8f0ff] px-2.5 py-1 text-xs font-bold capitalize text-[#1768ee]">{appointment.queue_token?.current_status || appointment.status || "Scheduled"}</span></div>
                <button type="button" onClick={() => { document.getElementById("patient-search")?.scrollIntoView({ behavior: "smooth", block: "center" }); window.setTimeout(() => document.querySelector<HTMLInputElement>("#patient-search input")?.focus({ preventScroll: true }), 250); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d2e1fa] px-4 py-2.5 text-sm font-bold text-[#0A66FF] transition hover:bg-[#f2f7ff]">Patient record <ArrowRight className="size-4" /></button>
              </div>
            ))}
          </div>
        </section>

        <div className="xl:col-span-2">
          {patientBundle && (
            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm font-semibold text-[#0A66FF]">Patient profile</p>
                <h3 className="font-outfit text-2xl font-black text-slate-950">
                  {patientBundle.patient.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {patientBundle.patient.age} yrs · {patientBundle.patient.gender} · {patientBundle.patient.phone}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Height</p>
                    <p className="font-bold">{patientBundle.patient.height} cm</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Weight</p>
                    <p className="font-bold">{patientBundle.patient.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-slate-500">BMI</p>
                    <p className="font-bold">{patientBundle.patient.bmi}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 font-bold text-slate-950">
                  <Sparkles className="w-4 h-4 text-[#0A66FF]" />
                  AI summary placeholder
                </div>
                <p className="text-sm text-slate-600">
                  Future AI will summarize symptoms, recent records, appointment history, and risk flags here.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-950 mb-2">Uploaded records</h4>
                {patientBundle.records.length === 0 ? (
                  <p className="text-sm text-slate-500">No records uploaded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {patientBundle.records.map((record) => (
                      <a
                        key={record.id}
                        href={record.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#0A66FF]"
                      >
                        <FileText className="w-4 h-4" />
                        {record.file_name} · {record.record_type}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-950 mb-2">Appointment history</h4>
                <div className="space-y-2">
                  {patientBundle.appointments.map((appointment) => (
                    <div key={appointment.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                      <p className="font-semibold text-slate-900">
                        {appointment.appointment_date} · {appointment.specialist_suggested}
                      </p>
                      <p className="text-slate-600">{appointment.symptoms}</p>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-3 border-t border-slate-100 pt-5">
                <h4 className="font-bold text-slate-950">Doctor notes</h4>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Clinical notes"
                  rows={3}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={diagnosis}
                    onChange={(event) => setDiagnosis(event.target.value)}
                    placeholder="Diagnosis"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <input
                    value={prescription}
                    onChange={(event) => setPrescription(event.target.value)}
                    placeholder="Prescription"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Follow-up date</span>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(event) => setFollowUpDate(event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <PrimaryAction type="submit" disabled={savingNote}>
                  {savingNote ? "Saving..." : "Save Note"}
                </PrimaryAction>
              </form>
            </div>
          )}
        </div>
      </div>
      </main>
      </div>
    </AuthGuard>
  );
}
