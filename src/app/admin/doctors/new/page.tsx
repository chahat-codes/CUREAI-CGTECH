"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import DoctorForm from "@/components/admin/DoctorForm";
import MvpShell, { StatusMessage } from "@/components/mvp/MvpShell";
import { createAdminDoctor, doctorToFormInput, type DoctorFormInput } from "@/lib/mvp-api";

export default function NewDoctorPage() {
  const router = useRouter();
  const [form, setForm] = useState<DoctorFormInput>(() => doctorToFormInput());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await createAdminDoctor(form);
      router.push("/admin/doctors");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <MvpShell
        eyebrow="Admin"
        title="Add a doctor."
        description="New doctors receive 500 free credits automatically."
      >
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        <DoctorForm
          value={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          submitLabel="Create Doctor"
          loading={loading}
        />
      </MvpShell>
    </AdminGuard>
  );
}
