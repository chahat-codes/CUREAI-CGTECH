"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
function CallbackContent() {
  const router = useRouter(); const params = useSearchParams(); const [message, setMessage] = useState("Securing your sign-in…");
  useEffect(() => { let active = true; (async () => {
    if (!isSupabaseConfigured || !supabase) { setMessage("Sign-in is not configured. Please contact the site administrator."); return; }
    const code = params.get("code");
    if (code) { const { error } = await supabase.auth.exchangeCodeForSession(code); if (error) { setMessage(error.message); return; } }
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) { setMessage(error?.message ?? "This sign-in link has expired. Please try again."); return; }
    const next = params.get("next"); const destination = next?.startsWith("/") && !next.startsWith("//") ? next : "/patient-dashboard";
    if (active) router.replace(destination);
  })(); return () => { active = false; }; }, [params, router]);
  return <main className="page-shell"><section className="panel auth-callback"><span className="auth-spinner"/><h1>Finishing sign-in</h1><p className="muted">{message}</p></section></main>;
}
export default function AuthCallbackPage() { return <Suspense fallback={<main className="page-shell"><section className="panel auth-callback">Securing your sign-in…</section></main>}><CallbackContent /></Suspense>; }
