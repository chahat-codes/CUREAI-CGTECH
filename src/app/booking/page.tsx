"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MvpShell, { MvpCard, PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
import { createAppointment, hasSupabase } from "@/lib/mvp-api";
import { getFlow, getUser } from "@/lib/mvp-storage";
import type { MvpFlow } from "@/lib/mvp-types";

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function BookingPage() {
  const router = useRouter();
  const [flow, setFlow] = useState<MvpFlow | null>(null);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const appointmentTimes = flow?.doctor?.available_slots?.length ? flow.doctor.available_slots : ["10:00", "11:30", "14:00", "16:00"];

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
    if (!time) {
      setError("Choose an appointment time to continue.");
      return;
    }
    if (new Date(`${date}T${time}:00`).getTime() <= Date.now()) {
      setError("Choose a future appointment time.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await createAppointment({
        user: getUser(), doctor: flow.doctor, symptoms: flow.symptoms,
        specialist: flow.specialist, date, time,
      });
      router.push(`/booking/confirmation?id=${encodeURIComponent(result.appointment.id)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not book appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MvpShell
      eyebrow="Step 3"
        title="Request an appointment."
      description="Choose a date and a listed time, then review your details. Demo bookings are stored on this device and are not sent to a clinic."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {flow?.doctor && <MvpCard className="h-fit"><p className="text-sm font-bold text-slate-500">Selected doctor</p><h2 className="mt-2 font-outfit text-2xl font-extrabold text-slate-950">{flow.doctor.name}</h2><p className="font-semibold text-blue-700">{flow.doctor.specialization}</p><p className="mt-4 text-sm text-slate-600">{flow.doctor.clinic_name} · {flow.doctor.location}</p><p className="mt-4 text-sm font-bold text-slate-800">{flow.doctor.consultation_fee > 0 ? `Consultation fee: ₹${flow.doctor.consultation_fee}` : "Fee not listed"}</p>{!hasSupabase() && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demo mode: this creates a local sample appointment, not a confirmed clinic booking.</p>}</MvpCard>}

        <MvpCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Appointment date</span>
                <input
                  type="date"
                  min={today()}
                  value={date}
                  onChange={(event) => { setDate(event.target.value); setTime(""); }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Available time</span>
                <select required value={time} onChange={(event) => setTime(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"><option value="">Choose a time</option>{appointmentTimes.map((slot) => { const expired = date === today() && slot <= new Date().toTimeString().slice(0, 5); return <option key={slot} value={slot} disabled={expired}>{slot}{expired ? " · passed" : ""}</option>; })}</select>
              </label>
            </div>
            <p className="-mt-3 text-xs leading-5 text-slate-500">Displayed time options are demonstration slots unless the clinic directory has configured availability. Confirm the final time with the clinic.</p>

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
