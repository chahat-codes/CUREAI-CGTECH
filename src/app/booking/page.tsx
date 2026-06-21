"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorCard from "@/components/mvp/DoctorCard";
import MvpShell, { MvpCard, PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
import { createAppointment } from "@/lib/mvp-api";
import { getFlow, getUser } from "@/lib/mvp-storage";
import type { MvpFlow } from "@/lib/mvp-types";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingPage() {
  const router = useRouter();
  const [flow, setFlow] = useState<MvpFlow | null>(null);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedFlow = getFlow();
    if (!savedFlow?.doctor) {
      router.push("/find-doctor");
      return;
    }
    // Reads the local MVP handoff that was saved by the previous route.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlow(savedFlow);
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!flow?.doctor) return;

    setLoading(true);
    setError("");

    try {
      await createAppointment({
        user: getUser(),
        doctor: flow.doctor,
        symptoms: flow.symptoms,
        specialist: flow.specialist,
        date,
        time,
      });
      router.push("/patient-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MvpShell
      eyebrow="Step 3"
      title="Book your appointment."
      description="Pick a date and time. Cure AI creates the appointment, generates the next digital token, and adds you to the doctor's queue."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {flow?.doctor && <DoctorCard doctor={flow.doctor} />}

        <MvpCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Appointment date</span>
                <input
                  type="date"
                  min={today()}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Appointment time</span>
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-900">Symptoms</p>
              <p>{flow?.symptoms || "No symptoms selected."}</p>
            </div>

            {error && <StatusMessage type="error">{error}</StatusMessage>}

            <PrimaryAction type="submit" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </PrimaryAction>
          </form>
        </MvpCard>
      </div>
    </MvpShell>
  );
}
