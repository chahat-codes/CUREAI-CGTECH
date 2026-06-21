"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorCard from "@/components/mvp/DoctorCard";
import MvpShell, { MvpCard, StatusMessage } from "@/components/mvp/MvpShell";
import { getDoctors } from "@/lib/mvp-api";
import { getFlow, saveSelectedDoctor } from "@/lib/mvp-storage";
import type { Doctor, MvpFlow } from "@/lib/mvp-types";

export default function FindDoctorPage() {
  const router = useRouter();
  const [flow, setFlow] = useState<MvpFlow | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedFlow = getFlow();
    if (!savedFlow) {
      router.push("/symptoms");
      return;
    }

    // Reads the local MVP handoff that was saved by the symptom form.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlow(savedFlow);
    setLoading(true);
    getDoctors(savedFlow.specialist)
      .then(setDoctors)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  const handleBook = (doctor: Doctor) => {
    saveSelectedDoctor(doctor);
    router.push("/booking");
  };

  return (
    <MvpShell
      eyebrow="Step 2"
      title="Choose a matching doctor."
      description="Doctors are fetched from Supabase when configured. Until then, Cure AI uses the same seeded demo doctors so you can test the full flow."
    >
      {flow && (
        <MvpCard className="mb-6">
          <p className="text-sm font-semibold text-slate-500">Suggested specialist</p>
          <h2 className="font-outfit text-3xl font-black text-slate-950">{flow.specialist}</h2>
          <p className="mt-2 text-sm text-slate-600">Symptoms: {flow.symptoms}</p>
        </MvpCard>
      )}

      {loading && <StatusMessage type="loading">Loading matching doctors...</StatusMessage>}
      {error && <StatusMessage type="error">{error}</StatusMessage>}
      {!loading && !error && doctors.length === 0 && (
        <StatusMessage type="empty">No doctors found for this specialization yet.</StatusMessage>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBook} />
        ))}
      </div>
    </MvpShell>
  );
}
