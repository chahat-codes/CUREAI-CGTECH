"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, Ticket } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import MvpShell, { MvpCard, StatusMessage } from "@/components/mvp/MvpShell";
import { getDoctorQueue, getPatientAppointments, updateQueueTokenStatus } from "@/lib/mvp-api";
import { getUser } from "@/lib/mvp-storage";
import type { AppointmentWithDetails, QueueToken } from "@/lib/mvp-types";

type QueueItem = Awaited<ReturnType<typeof getDoctorQueue>>[number];

export default function PatientDashboardPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [currentToken, setCurrentToken] = useState<QueueToken | null>(null);
  const [doctorQueue, setDoctorQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const patientAppointments = await getPatientAppointments(getUser());
        setAppointments(patientAppointments);

        const latest = patientAppointments[0];
        if (latest) {
          const queue = await getDoctorQueue(latest.doctor_id);
          setDoctorQueue(queue);
          setCurrentToken(queue.find((item) => item.token.current_status === "current")?.token || null);
        } else {
          setDoctorQueue([]);
          setCurrentToken(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const latest = appointments.find((appointment) => appointment.status === "booked") || appointments[0];
  const patientTokenNumber = latest?.queue_token?.token_number || latest?.token_number || 0;
  const activeQueue = doctorQueue.filter(
    (item) =>
      item.token.current_status === "current" ||
      item.token.current_status === "arrived" ||
      item.token.current_status === "waiting",
  );
  const currentNumber = currentToken?.token_number || activeQueue[0]?.token.token_number || 0;
  const currentTokenLabel = currentNumber ? `#${currentNumber}` : "Queue pending";

  const cancelAppointment = async (appointment: AppointmentWithDetails) => {
    if (!appointment.queue_token || !window.confirm("Cancel this appointment?")) return;
    setUpdatingId(appointment.id);
    try {
      await updateQueueTokenStatus({ tokenId: appointment.queue_token.id, appointmentId: appointment.id, status: "cancelled", appointmentStatus: "cancelled" });
      setAppointments((items) => items.map((item) => item.id === appointment.id ? { ...item, status: "cancelled", queue_token: item.queue_token ? { ...item.queue_token, current_status: "cancelled" } : undefined } : item));
    } catch (err) { setError(err instanceof Error ? err.message : "Could not cancel appointment."); }
    finally { setUpdatingId(""); }
  };

  return (
    <AuthGuard roles={["patient"]}>
      <MvpShell
        eyebrow="Patient dashboard"
        title="Your appointment and queue token."
        description="Track your booked appointment, digital token, current doctor queue, and estimated wait time."
      >
      <nav aria-label="Patient dashboard" className="mb-6 flex flex-wrap gap-2">{[["Overview","/patient-dashboard"],["Appointments","/patient-dashboard#appointments"],["Health records","/patient-dashboard/records"],["Follow-ups","/patient-dashboard/follow-ups"],["Profile","/patient-dashboard/profile"],["Find doctors","/find-doctor"]].map(([label,href])=><Link key={label} href={href} className={`rounded-lg px-4 py-2 text-sm font-bold ${label === "Overview" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300"}`}>{label}</Link>)}</nav>
      {loading && <StatusMessage type="loading">Loading appointment...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}

      {!loading && !latest && (
        <MvpCard>
          <StatusMessage type="empty">No appointment found yet.</StatusMessage>
          <div className="mt-5">
            <Link
              href="/symptoms"
              className="inline-flex items-center justify-center rounded-full bg-[#0A66FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700"
            >
              Start Symptom Check
            </Link>
          </div>
        </MvpCard>
      )}

      {latest && (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <MvpCard className="bg-[#0F172A] text-white">
            <div className="mb-5 inline-flex rounded-2xl bg-blue-500/20 p-3 text-[#00C2FF]">
              <Ticket className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">{latest.doctor_id.startsWith("doctor-") ? "Sample queue token" : "Your token"}</p>
            <h2 className="font-outfit text-6xl font-black">
              {patientTokenNumber ? `#${patientTokenNumber}` : "Pending"}
            </h2>
            <p className="mt-3 text-slate-300">{latest.doctor_id.startsWith("doctor-") ? "Demonstration queue status · not live clinic data" : `Current token: ${currentTokenLabel}`}</p>
            <p className="mt-2 text-sm text-slate-300">Waiting time is not estimated because current clinic updates are unavailable.</p>
          </MvpCard>

          <MvpCard>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-500">Doctor</p>
                <h3 className="font-outfit text-2xl font-extrabold text-slate-950">
                  {latest.doctor.name}
                </h3>
                <p className="font-semibold text-[#0A66FF]">{latest.doctor.specialization}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Clinic</p>
                <p className="font-bold text-slate-900">{latest.doctor.clinic_name}</p>
                <p className="text-sm text-slate-600">{latest.doctor.location}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <CalendarCheck className="mb-2 w-5 h-5 text-[#0A66FF]" />
                <p className="text-sm font-semibold text-slate-500">Appointment</p>
                <p className="font-bold text-slate-950">
                  {latest.appointment_date} at {latest.appointment_time}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <Clock className="mb-2 w-5 h-5 text-[#0A66FF]" />
                <p className="text-sm font-semibold text-slate-500">Status</p>
                <p className="font-bold capitalize text-slate-950">
                  {latest.queue_token?.current_status || "booked"}
                </p>
              </div>
            </div>
          </MvpCard>
        </div>
      )}
      <section id="appointments" className="mt-7">
        <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="font-outfit text-2xl font-extrabold text-slate-900">My appointments</h2><p className="mt-1 text-sm text-slate-500">Upcoming, completed and cancelled visits</p></div><Link href="/find-doctor" className="text-sm font-bold text-blue-700">Find a doctor</Link></div>
        {appointments.length === 0 ? <MvpCard><StatusMessage type="empty">No appointments yet. Start by finding a doctor.</StatusMessage></MvpCard> : <div className="space-y-3">{[...appointments].sort((a,b)=>`${b.appointment_date}${b.appointment_time}`.localeCompare(`${a.appointment_date}${a.appointment_time}`)).map((appointment)=><MvpCard key={appointment.id} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-bold text-slate-900">{appointment.doctor.name}</p><p className="text-sm text-blue-700">{appointment.doctor.specialization}</p><p className="mt-1 text-xs text-slate-500">{appointment.appointment_date} at {appointment.appointment_time} · {appointment.doctor.clinic_name}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${appointment.status === "cancelled" ? "bg-rose-50 text-rose-700" : appointment.status === "completed" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>{appointment.status}</span>{appointment.status === "booked" && appointment.appointment_date >= new Date().toISOString().slice(0,10) && appointment.queue_token && <button disabled={updatingId === appointment.id} onClick={()=>cancelAppointment(appointment)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-rose-300 hover:text-rose-700 disabled:opacity-50">{updatingId === appointment.id ? "Cancelling…" : "Cancel"}</button>}</div></MvpCard>)}</div>}
      </section>
      </MvpShell>
    </AuthGuard>
  );
}
