"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { DoctorCard } from "@/components/DoctorCard";
import { suggestSpeciality } from "@/lib/data";

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState("Fever, cough, fatigue for two days");
  const result = useMemo(() => suggestSpeciality(symptoms), [symptoms]);

  return (
    <main className="page-shell">
      <section className="assistant-layout">
        <div className="panel">
          <p className="eyebrow">AI symptom assistant</p>
          <h1>Describe what you are feeling</h1>
          <p className="muted">Gemini free model integration placeholder. MVP currently uses local rules to suggest a speciality.</p>
          <textarea value={symptoms} onChange={(event) => setSymptoms(event.target.value)} />
          <div className="suggestion">
            <Sparkles size={20} />
            <div>
              <span>Suggested speciality</span>
              <strong>{result.speciality}</strong>
            </div>
          </div>
        </div>
        <div className="doctor-list">
          {result.matches.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </div>
      </section>
    </main>
  );
}
