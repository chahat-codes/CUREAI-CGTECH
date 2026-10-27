"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import MvpShell, { MvpCard, PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
import { getCurrentSession, getProfileForSession, updateProfileName } from "@/lib/auth";
import { getUser } from "@/lib/mvp-storage";
import type { AppUser } from "@/lib/mvp-types";

export default function PatientProfilePage() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => { getCurrentSession().then(getProfileForSession).then((profile) => { const current = profile || getUser(); setUser(current); setName(current?.name || ""); }).catch((err: Error)=>setError(err.message)).finally(()=>setLoading(false)); }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSuccess("");
    if (!user) { setError("We could not load your profile. Please log in again."); return; }
    setSaving(true);
    try { const updated = await updateProfileName(user, name); setUser(updated); setName(updated.name); setSuccess("Your name was saved."); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not save your profile."); }
    finally { setSaving(false); }
  };
  return <AuthGuard roles={["patient"]}><MvpShell eyebrow="My profile" title="Your account details." description="Review the information currently available to Cure AI and update your display name.">
    <nav aria-label="Patient dashboard" className="mb-6 flex flex-wrap gap-2">{[["Overview","/patient-dashboard"],["Health records","/patient-dashboard/records"],["Follow-ups","/patient-dashboard/follow-ups"],["Profile","/patient-dashboard/profile"]].map(([label,href])=><Link key={label} href={href} className={`rounded-lg px-4 py-2 text-sm font-bold ${label === "Profile" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{label}</Link>)}</nav>
    {loading && <StatusMessage type="loading">Loading your profile…</StatusMessage>}
    {!loading && <div className="max-w-2xl"><MvpCard><form onSubmit={submit} className="space-y-5"><label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Name</span><input required minLength={2} value={name} onChange={(event)=>setName(event.target.value)} autoComplete="name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"/></label><label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Email</span><input readOnly value={user?.email || "Not provided"} className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"/><span className="mt-1 block text-xs text-slate-500">Email changes are not supported in this demo.</span></label><p className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600">Phone, date of birth and health measurements are not connected to the current profile model, so they are not collected here.</p>{error && <StatusMessage type="error">{error}</StatusMessage>}{success && <StatusMessage type="success">{success}</StatusMessage>}<PrimaryAction type="submit" disabled={saving || loading}>{saving ? "Saving…" : "Save profile"}</PrimaryAction></form></MvpCard></div>}
  </MvpShell></AuthGuard>;
}
