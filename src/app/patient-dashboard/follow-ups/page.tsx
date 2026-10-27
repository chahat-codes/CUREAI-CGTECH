"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, CalendarPlus, ClipboardList } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import MvpShell, { MvpCard, StatusMessage } from "@/components/mvp/MvpShell";
import { getPatientAppointments } from "@/lib/mvp-api";
import { getUser } from "@/lib/mvp-storage";
import type { AppointmentWithDetails } from "@/lib/mvp-types";

export default function FollowUpsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getPatientAppointments(getUser()).then(setAppointments).catch(()=>setAppointments([])).finally(()=>setLoading(false)); }, []);
  return <AuthGuard roles={["patient"]}><MvpShell eyebrow="Follow-ups" title="Stay on top of your next steps." description="Follow-up plans appear here when your care team records them.">
    <div className="mb-5 flex flex-wrap gap-2">{[["Overview","/patient-dashboard"],["Appointments","/patient-dashboard#appointments"],["Health records","/patient-dashboard/records"],["Follow-ups","/patient-dashboard/follow-ups"]].map(([label,href])=><Link key={label} href={href} className={`rounded-lg px-4 py-2 text-sm font-bold ${label === "Follow-ups" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{label}</Link>)}</div>
    {loading && <StatusMessage type="loading">Loading your care history…</StatusMessage>}
    {!loading && <div className="grid gap-5 lg:grid-cols-[1fr_.75fr]">
      <MvpCard><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><BellRing className="size-5"/></span><div><h2 className="font-bold text-slate-900">Follow-up reminders</h2><p className="text-xs text-slate-500">No reminders are configured</p></div></div><p className="mt-5 text-sm leading-6 text-slate-600">Cure AI does not send SMS, WhatsApp or email reminders yet. Contact your clinic directly if you need to confirm follow-up instructions.</p><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"><ClipboardList className="mb-2 size-5 text-slate-500"/>{appointments.length ? `${appointments.length} appointment${appointments.length === 1 ? "" : "s"} in your available history.` : "No appointments are available in this session yet."}</div></MvpCard>
      <MvpCard className="h-fit"><h2 className="font-bold text-slate-900">Need another consultation?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Browse the doctor directory or open your appointments to review a previous booking.</p><Link href="/find-doctor" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"><CalendarPlus className="size-4"/> Find a doctor</Link></MvpCard>
    </div>}
  </MvpShell></AuthGuard>;
}
