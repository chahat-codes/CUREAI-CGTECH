"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import DoctorForm from "@/components/admin/DoctorForm";
import MvpShell, { StatusMessage } from "@/components/mvp/MvpShell";
import {
  doctorToFormInput,
  getAdminDoctor,
  updateAdminDoctor,
  type DoctorFormInput,
} from "@/lib/mvp-api";

export default function EditDoctorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<DoctorFormInput>(() => doctorToFormInput());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("[Cure AI admin] Edit page doctor ID from URL:", id);
        const doctor = await getAdminDoctor(id);
        if (!doctor) {
          setError(`Doctor not found for ID: ${id}. Check that this URL matches a row in the doctors table.`);
          return;
        }
        setForm(doctorToFormInput(doctor));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load doctor.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      await updateAdminDoctor(id, form);
      router.push("/admin/doctors");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update doctor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminGuard>
      <MvpShell
        eyebrow="Admin"
        title="Edit doctor listing."
        description="Update fees, clinic details, specialization, availability, credits, and public listing status."
      >
        {loading && <StatusMessage type="loading">Loading doctor...</StatusMessage>}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {!loading && !error && (
          <DoctorForm
            value={form}
            onChange={setForm}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            loading={saving}
          />
        )}
      </MvpShell>
    </AdminGuard>
  );
}
