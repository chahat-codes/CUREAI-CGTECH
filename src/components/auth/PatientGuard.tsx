"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
export function PatientGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const [ready, setReady] = useState(false);
  useEffect(() => { let active = true; (async () => {
    if (!isSupabaseConfigured || !supabase) { router.replace("/login"); return; }
    const { data } = await supabase.auth.getSession();
    if (!data.session) { router.replace("/login"); return; }
    const response = await fetch("/api/patient/profile", { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: "no-store" });
    if (!response.ok) { router.replace("/login"); return; }
    if (active) setReady(true);
  })(); return () => { active = false; }; }, [router]);
  return ready ? children : <main className="page-shell"><section className="panel"><span className="auth-spinner"/> Verifying your secure patient session…</section></main>;
}
