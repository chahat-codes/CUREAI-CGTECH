"use client";

import Link from "next/link";
import { Activity, CheckCircle2, CreditCard, Stethoscope } from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import MvpShell, { MvpCard } from "@/components/mvp/MvpShell";

export default function AdminPage() {
  return (
    <AdminGuard>
      <MvpShell
        eyebrow="Admin"
        title="Cure AI admin dashboard."
        description="Manage doctor listings, activation status, consultation fees, clinic details, and onboarding credits."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <MvpCard>
            <Stethoscope className="mb-4 h-7 w-7 text-[#0A66FF]" />
            <h2 className="font-outfit text-2xl font-extrabold text-slate-950">Doctors</h2>
            <p className="mt-2 text-sm text-slate-600">
              View, search, activate, deactivate, edit, and add doctors.
            </p>
            <Link
              href="/admin/doctors"
              className="mt-5 inline-flex rounded-full bg-[#0A66FF] px-5 py-2.5 text-sm font-bold text-white"
            >
              Manage Doctors
            </Link>
          </MvpCard>

          <MvpCard>
            <CreditCard className="mb-4 h-7 w-7 text-[#0A66FF]" />
            <h2 className="font-outfit text-2xl font-extrabold text-slate-950">Credits</h2>
            <p className="mt-2 text-sm text-slate-600">
              New doctors automatically receive 500 free onboarding credits.
            </p>
          </MvpCard>

          <MvpCard>
            <CheckCircle2 className="mb-4 h-7 w-7 text-[#0A66FF]" />
            <h2 className="font-outfit text-2xl font-extrabold text-slate-950">Public Listings</h2>
            <p className="mt-2 text-sm text-slate-600">
              Only active doctors appear in patient doctor search.
            </p>
          </MvpCard>
        </div>

        <MvpCard className="mt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-[#0A66FF]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-950">Admin MVP scope</p>
              <p className="text-sm text-slate-600">
                Payments, advanced verification workflows, and audit trails are intentionally not added yet.
              </p>
            </div>
          </div>
        </MvpCard>
      </MvpShell>
    </AdminGuard>
  );
}
