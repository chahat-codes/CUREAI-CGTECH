"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, LogOut, ShieldCheck } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/auth/supabase";
type Profile = { cure_id: string; full_name: string; email: string | null; mobile_number: string | null };
export default function DashboardPage() {
  const router = useRouter(); const [profile, setProfile] = useState<Profile | null>(null); const [error, setError] = useState(""); const [copied, setCopied] = useState(false);
  useEffect(() => { let active = true; (async () => {
    if (!isSupabaseConfigured || !supabase) { router.replace("/login"); return; }
    const { data } = await supabase.auth.getSession(); if (!data.session) { router.replace("/login"); return; }
    const response = await fetch("/api/patient/profile", { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: "no-store" }); const result = await response.json();
    if (!response.ok) { if (active) setError(result.error ?? "Could not load your profile."); return; }
    if (active) setProfile(result.profile);
  })(); return () => { active = false; }; }, [router]);
  const logout = async () => { await supabase?.auth.signOut(); router.replace("/login"); };
  const copy = async () => { if (!profile) return; await navigator.clipboard.writeText(profile.cure_id); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  if (!profile) return <main className="page-shell"><section className="panel">{error ? <><h1>Profile unavailable</h1><p className="muted">{error}</p><Link className="button" href="/login">Return to login</Link></> : <><span className="auth-spinner"/> Loading your secure patient profile…</>}</section></main>;
  return <main className="page-shell"><div className="dashboard-grid patient-dashboard-grid"><section className="panel patient-welcome"><p className="eyebrow">My Cure AI</p><h1>Welcome, {profile.full_name}</h1><p className="muted">Your personal health space is ready. Choose where you would like to continue.</p><span className="patient-privacy"><ShieldCheck size={17}/> Your account is private and linked to your Cure ID.</span><button type="button" className="button secondary logout-button" onClick={logout}><LogOut size={16}/> Sign out</button></section><section className="panel cure-id-panel"><p className="eyebrow">Patient identity</p><span>Your Cure ID</span><strong>{profile.cure_id}</strong><button type="button" className="button secondary" onClick={copy}><Copy size={16}/>{copied ? "Copied" : "Copy Cure ID"}</button><small>This is a Cure AI patient identifier, not a government health ID.</small></section><section className="panel"><h2>My profile</h2><div className="list-row">{profile.full_name}</div><div className="list-row">{profile.email ?? "No email on file"}</div><div className="list-row">{profile.mobile_number ?? "No mobile on file"}</div></section><section className="panel patient-links"><h2>Your care tools</h2><Link href="/vault">Health Vault <span>View your records</span></Link><Link href="/booking">Appointments <span>Explore appointment options</span></Link><Link href="/doctors/ananya-rao">Find doctors <span>Browse care professionals</span></Link><Link href="/symptoms">AI Health Assistant <span>Prepare for a care conversation</span></Link></section></div></main>;
}
