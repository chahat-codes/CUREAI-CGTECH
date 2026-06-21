"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, Clock, Ticket } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import MvpShell, { MvpCard, StatusMessage } from "@/components/mvp/MvpShell";
import { getDoctorQueue, getPatientAppointments } from "@/lib/mvp-api";
import { getUser } from "@/lib/mvp-storage";
import type { AppointmentWithDetails, QueueToken } from "@/lib/mvp-types";

type QueueItem = Awaited<ReturnType<typeof getDoctorQueue>>[number];

export default function PatientDashboardPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [currentToken, setCurrentToken] = useState<QueueToken | null>(null);
  const [doctorQueue, setDoctorQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const latest = appointments[0];
  const patientTokenNumber = latest?.queue_token?.token_number || latest?.token_number || 0;
  const activeQueue = doctorQueue.filter(
    (item) =>
      item.token.current_status === "current" ||
      item.token.current_status === "arrived" ||
      item.token.current_status === "waiting",
  );
  const currentNumber = currentToken?.token_number || activeQueue[0]?.token.token_number || 0;
  const tokensAhead = latest
    ? activeQueue.filter((item) => item.token.token_number < patientTokenNumber).length
    : 0;
  const estimatedWait = latest ? tokensAhead * latest.doctor.wait_time : 0;
  const currentTokenLabel = currentNumber ? `#${currentNumber}` : "Queue pending";

  return (
    <AuthGuard roles={["patient"]}>
      <MvpShell
        eyebrow="Patient dashboard"
        title="Your appointment and queue token."
        description="Track your booked appointment, digital token, current doctor queue, and estimated wait time."
      >
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
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Your token</p>
            <h2 className="font-outfit text-6xl font-black">
              {patientTokenNumber ? `#${patientTokenNumber}` : "Pending"}
            </h2>
            <p className="mt-3 text-slate-300">
              Current token: {currentTokenLabel}
            </p>
            <p className="mt-2 text-slate-300">
              Estimated wait: {estimatedWait} minutes
            </p>
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
      </MvpShell>
    </AuthGuard>
  );
}
