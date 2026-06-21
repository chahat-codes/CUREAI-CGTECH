"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Edit, Plus, Search } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import MvpShell, { MvpCard, StatusMessage } from "@/components/mvp/MvpShell";
import { getAdminDoctors, setDoctorActive } from "@/lib/mvp-api";
import type { Doctor } from "@/lib/mvp-types";

type StatusFilter = "all" | "active" | "inactive";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  const loadDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      setDoctors(await getAdminDoctors(search, status));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadDoctors, 250);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const stats = useMemo(
    () => ({
      total: doctors.length,
      active: doctors.filter((doctor) => doctor.is_active !== false).length,
      inactive: doctors.filter((doctor) => doctor.is_active === false).length,
    }),
    [doctors],
  );

  const toggleActive = async (doctor: Doctor) => {
    setWorkingId(doctor.id);
    setError("");
    try {
      await setDoctorActive(doctor.id, doctor.is_active === false);
      await loadDoctors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update doctor status.");
    } finally {
      setWorkingId("");
    }
  };

  return (
    <AdminGuard>
      <MvpShell
        eyebrow="Admin"
        title="Manage doctor listings."
        description="Search, filter, activate, deactivate, and edit doctors shown in Cure AI doctor discovery."
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat label="Total" value={stats.total} />
            <MiniStat label="Active" value={stats.active} />
            <MiniStat label="Inactive" value={stats.inactive} />
          </div>
          <Link
            href="/admin/doctors/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0A66FF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25"
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </Link>
        </div>

        <MvpCard className="mb-5">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, clinic, specialization, city..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
              <option value="all">All doctors</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        </MvpCard>

        {loading && <StatusMessage type="loading">Loading doctors...</StatusMessage>}
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {!loading && doctors.length === 0 && <StatusMessage type="empty">No doctors found.</StatusMessage>}

        <div className="space-y-3">
          {doctors.map((doctor) => (
            <MvpCard key={doctor.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-outfit text-xl font-extrabold text-slate-950">{doctor.name}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        doctor.is_active === false
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {doctor.is_active === false ? "Inactive" : "Active"}
                    </span>
                    {doctor.is_verified && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0A66FF]">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {doctor.specialization} · {doctor.clinic_name} · {doctor.city || doctor.location}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    ₹{doctor.consultation_fee} · {doctor.credits ?? 0} credits · {doctor.available_days?.join(", ") || doctor.available_time}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={workingId === doctor.id}
                    onClick={() => toggleActive(doctor)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-[#0A66FF] hover:text-[#0A66FF] disabled:opacity-50"
                  >
                    {doctor.is_active === false ? "Activate" : "Deactivate"}
                  </button>
                  <Link
                    href={`/admin/doctors/${doctor.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A66FF] px-4 py-2 text-sm font-bold text-white"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Link>
                </div>
              </div>
            </MvpCard>
          ))}
        </div>
      </MvpShell>
    </AdminGuard>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-outfit text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
