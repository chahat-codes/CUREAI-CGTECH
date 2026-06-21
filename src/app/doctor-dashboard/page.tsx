"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import MvpShell, { MvpCard, PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
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

  return (
    <AuthGuard roles={["doctor"]}>
      <MvpShell
        eyebrow="Doctor dashboard"
        title="Clinical workspace."
        description="Review today’s appointments, search medical IDs, inspect patient records, and write follow-up notes."
      >
      {loading && <StatusMessage type="loading">Loading doctor dashboard...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {success && <StatusMessage type="success">{success}</StatusMessage>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MvpCard key={card.label}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                <p className="font-outfit text-4xl font-black text-slate-950">{card.value}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-[#0A66FF]">
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </MvpCard>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <MvpCard>
          <h2 className="font-outfit text-2xl font-extrabold text-slate-950 mb-4">
            Today’s appointments
          </h2>
          <div className="space-y-3">
            {appointments.length === 0 && (
              <StatusMessage type="empty">No appointments for today.</StatusMessage>
            )}
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-slate-950">
                      {appointment.patient?.name || "Patient"}
                    </p>
                    <p className="text-sm text-slate-600">
                      {appointment.appointment_time} · Token #{appointment.token_number}
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-bold capitalize text-slate-600">
                    {appointment.queue_token?.current_status || appointment.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{appointment.symptoms}</p>
              </div>
            ))}
          </div>
        </MvpCard>

        <MvpCard>
          <h2 className="font-outfit text-2xl font-extrabold text-slate-950 mb-4">
            Patient Medical ID search
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
              <input
                value={medicalId}
                onChange={(event) => setMedicalId(event.target.value)}
                placeholder="Example: CURE-DEMO-001"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <PrimaryAction type="submit" disabled={searching}>
              {searching ? "Searching..." : "Search"}
            </PrimaryAction>
          </form>

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
        </MvpCard>
      </div>
      </MvpShell>
    </AuthGuard>
  );
}
