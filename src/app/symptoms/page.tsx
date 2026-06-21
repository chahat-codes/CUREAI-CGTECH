"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Stethoscope } from "lucide-react";
import MvpShell, { MvpCard, PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
import { saveFlow } from "@/lib/mvp-storage";
import { suggestSpecialist } from "@/lib/symptoms";

export default function SymptomsPage() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (symptoms.trim().length < 3) {
      setError("Please enter a few symptoms before continuing.");
      return;
    }

    const specialist = suggestSpecialist(symptoms);
    saveFlow({ symptoms: symptoms.trim(), specialist });
    router.push("/find-doctor");
  };

  return (
    <MvpShell
      eyebrow="Step 1"
      title="Tell Cure AI what you are feeling."
      description="Enter symptoms in your own words. The MVP uses simple keyword matching today and can be upgraded to a real AI triage API later."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <MvpCard>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Symptoms</span>
              <textarea
                value={symptoms}
                onChange={(event) => setSymptoms(event.target.value)}
                rows={8}
                placeholder="Example: I have fever, cough, and body pain since yesterday."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            {error && <StatusMessage type="error">{error}</StatusMessage>}

            <PrimaryAction type="submit">Find Suggested Specialist</PrimaryAction>
          </form>
        </MvpCard>

        <MvpCard className="bg-[#0F172A] text-white">
          <div className="mb-6 inline-flex rounded-2xl bg-blue-500/20 p-3 text-[#00C2FF]">
            <Brain className="w-7 h-7" />
          </div>
          <h2 className="font-outfit text-2xl font-extrabold mb-3">Current MVP logic</h2>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="flex gap-2"><Stethoscope className="w-4 h-4 text-[#00C2FF]" /> skin, rash, acne → Dermatologist</p>
            <p className="flex gap-2"><Stethoscope className="w-4 h-4 text-[#00C2FF]" /> tooth, dental → Dentist</p>
            <p className="flex gap-2"><Stethoscope className="w-4 h-4 text-[#00C2FF]" /> fever, cough, cold → General Physician</p>
            <p className="flex gap-2"><Stethoscope className="w-4 h-4 text-[#00C2FF]" /> chest, heart → Cardiologist</p>
            <p className="flex gap-2"><Stethoscope className="w-4 h-4 text-[#00C2FF]" /> pregnancy, periods → Gynecologist</p>
            <p className="flex gap-2"><Stethoscope className="w-4 h-4 text-[#00C2FF]" /> eye, vision → Ophthalmologist</p>
          </div>
        </MvpCard>
      </div>
    </MvpShell>
  );
}
