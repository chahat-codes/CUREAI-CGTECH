"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, Check, Copy, Eye, EyeOff, HeartPulse, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Mode = "login" | "register";
type Profile = { cure_id: string; full_name: string; email: string | null };

function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 48 48" width="19" height="19"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.1c-1.8 1.2-4 2-6.8 2-5.2 0-9.7-3.5-11.3-8.2H5.8v5.3A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.7 27.8a12 12 0 0 1 0-7.6v-5.3H5.8a20 20 0 0 0 0 18.2l6.9-5.3Z"/><path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4A20 20 0 0 0 5.8 14.9l6.9 5.3C14.3 15.5 18.8 12 24 12Z"/></svg>;
}

export function AuthExperience({ initialMode }: { initialMode: Mode }) {
  const router = useRouter();
  const search = useSearchParams();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState({ name: "", identity: "", mobile: "", password: "", confirm: "" });
  const next = safeNext(search.get("next"));
  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const switchMode = (target: Mode) => { setMode(target); setError(""); setNotice(""); };

  const fetchProfile = async (token: string) => {
    const response = await fetch("/api/patient/profile", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok) return null;
    const body = await response.json();
    return (body.profile ?? null) as Profile | null;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setNotice("");
    if (!isSupabaseConfigured || !supabase) { setError("Authentication is not configured yet. Add the Supabase URL and anon key to cureai-mvp-v2/.env.local."); return; }
    if (mode === "register") {
      if (values.name.trim().length < 2) return setError("Please enter your full name.");
      if (!/^\d{10}$/.test(values.mobile.replace(/\D/g, ""))) return setError("Enter a valid 10-digit Indian mobile number.");
      if (values.password.length < 8) return setError("Use a password with at least 8 characters.");
      if (values.password !== values.confirm) return setError("Your passwords do not match.");
      if (!accepted) return setError("Please accept the Terms of Service and Privacy Policy to continue.");
    } else if (!values.identity.trim() || !values.password) return setError("Enter your email or mobile number and password.");

    setBusy(true);
    try {
      if (mode === "register") {
        const email = values.identity.trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
        const { data, error: authError } = await supabase.auth.signUp({
          email, password: values.password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`, data: { full_name: values.name.trim(), mobile_number: `+91${values.mobile.replace(/\D/g, "")}`, role: "patient" } },
        });
        if (authError) throw authError;
        if (data.session?.access_token) {
          const created = await fetchProfile(data.session.access_token);
          if (created) setProfile(created);
          else setNotice("Your account is created. Your Cure ID will appear after email confirmation and profile setup.");
        } else setNotice("Check your email to confirm your account. Then log in to view your Cure ID.");
      } else {
        let session;
        if (values.identity.includes("@")) {
          const result = await supabase.auth.signInWithPassword({ email: values.identity.trim().toLowerCase(), password: values.password });
          if (result.error) throw result.error;
          session = result.data.session;
        } else {
          const response = await fetch("/api/auth/mobile-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: values.identity, password: values.password }) });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error ?? "Unable to sign in. Check your details and try again.");
          const stored = await supabase.auth.setSession({ access_token: result.session.access_token, refresh_token: result.session.refresh_token });
          if (stored.error) throw stored.error;
          session = stored.data.session;
        }
        const patient = session ? await fetchProfile(session.access_token) : null;
        if (!patient) throw new Error("Your patient profile could not be loaded. Please try again.");
        setProfile(patient);
        setTimeout(() => router.push(next), 1300);
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again."); }
    finally { setBusy(false); }
  };

  const google = async () => {
    setError(""); setNotice("");
    if (!isSupabaseConfigured || !supabase) { setError("Google sign-in is not configured. Add Supabase credentials and enable Google in Supabase Auth."); return; }
    setBusy(true);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
    if (oauthError) { setError(oauthError.message); setBusy(false); }
  };

  const forgot = async () => {
    if (!isSupabaseConfigured || !supabase) return setError("Password reset is unavailable until Supabase is configured.");
    if (!/^\S+@\S+\.\S+$/.test(values.identity.trim())) return setError("Enter your account email first to receive a reset link.");
    setBusy(true); setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.identity.trim().toLowerCase(), { redirectTo: `${window.location.origin}/auth/callback?next=/reset-password` });
    setBusy(false);
    if (resetError) setError(resetError.message); else setNotice("If an account exists for that email, a password reset link is on its way.");
  };

  const copyId = async () => { if (!profile) return; await navigator.clipboard.writeText(profile.cure_id); setCopied(true); setTimeout(() => setCopied(false), 1600); };

  return <main className="auth-page"><div className="auth-shell">
    {!profile && <div className="auth-tabs" role="tablist" aria-label="Account access">
      <button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Login</button>
      <button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>Register</button>
    </div>}
    <div className="auth-wrap">
      <section className="auth-art" aria-label="Cure AI patient-first care">
        <div className="auth-illustration" aria-hidden="true">
          <svg viewBox="0 0 480 360" role="presentation">
            <defs><linearGradient id="ill-blue" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#58c7f3"/><stop offset="1" stopColor="#2c78ed"/></linearGradient><linearGradient id="ill-violet" x1="0" x2="1"><stop stopColor="#a7a5ff"/><stop offset="1" stopColor="#7068ed"/></linearGradient></defs>
            <path d="M64 177c6-72 74-130 157-132 88-2 158 61 179 126 19 59-15 127-70 153-61 28-190 18-238-17-27-20-31-81-28-130Z" fill="#edf6ff"/>
            <circle cx="377" cy="76" r="27" fill="#e1f7f3"/><path d="M372 76h10M377 71v10" stroke="#28a88b" strokeWidth="4" strokeLinecap="round"/>
            <rect x="114" y="80" width="204" height="230" rx="28" fill="white" stroke="#d8e8f8" strokeWidth="3"/>
            <rect x="164" y="64" width="104" height="34" rx="14" fill="#99d8f2"/><rect x="179" y="71" width="74" height="9" rx="4.5" fill="white" opacity=".8"/>
            <rect x="142" y="123" width="148" height="88" rx="18" fill="#eef5ff"/><path d="M158 171h22l13-22 18 42 16-29 12 9h36" fill="none" stroke="#378af0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="215" cy="252" r="34" fill="#e0f5f0"/><path d="M215 271s-22-13-22-27a12 12 0 0 1 22-7 12 12 0 0 1 22 7c0 14-22 27-22 27Z" fill="#35af9b"/>
            <rect x="335" y="165" width="92" height="112" rx="24" fill="url(#ill-violet)" transform="rotate(8 335 165)"/><path d="M357 220c10-20 20-20 28 0 8-20 18-20 28 0" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"/><path d="M371 239h31" stroke="white" strokeWidth="5" strokeLinecap="round"/>
            <circle cx="93" cy="118" r="24" fill="#fff0dc"/><path d="M93 105v26M80 118h26" stroke="#f2a54a" strokeWidth="5" strokeLinecap="round"/>
            <circle cx="336" cy="85" r="11" fill="#ffd879"/><path d="m336 69 3 12 12 4-12 3-3 12-3-12-12-3 12-4Z" fill="#ffc64e"/>
            <rect x="53" y="254" width="53" height="53" rx="18" fill="#dff6f2"/><path d="M79 267v27M65 281h28" stroke="#29a58e" strokeWidth="5" strokeLinecap="round"/>
            <path d="M310 319h94" stroke="#d4e7fa" strokeWidth="5" strokeLinecap="round"/><circle cx="425" cy="317" r="5" fill="#83c5ef"/><circle cx="443" cy="317" r="5" fill="#b6d8f0"/>
          </svg>
        </div>
        <div className="auth-art-copy"><p className="eyebrow">YOUR HEALTH, IN ONE PLACE</p><h1>Your health journey, connected.</h1><p>Manage your care journey with one trusted Cure AI account.</p></div>
        <div className="auth-points"><span><ShieldCheck size={17}/> Private by design</span><span><LockKeyhole size={17}/> Secure account access</span></div>
      </section>
      <section className="auth-card">
      {profile ? <div className="auth-success"><span className="auth-success-icon"><Check size={28}/></span><p className="eyebrow">Account ready</p><h2>Your Cure ID is ready!</h2><p className="auth-description">Your personal health identity is now active. Keep it handy when using Cure AI.</p><div className="cure-id-card"><span>Your Cure ID</span><strong>{profile.cure_id}</strong><button type="button" onClick={copyId}><Copy size={16}/>{copied ? "Copied" : "Copy Cure ID"}</button></div><Link className="button auth-submit" href={next}>Go to My Dashboard</Link><small>Cure ID is a Cure AI patient identifier. It is not a government health ID.</small></div> : <>
      <div className="auth-heading"><span className="auth-mobile-mark"><HeartPulse size={23}/></span><p className="eyebrow">Welcome to Cure AI</p><h2>{mode === "register" ? "Create your Cure ID" : "Welcome back"}</h2><p className="auth-description">{mode === "register" ? "Your personal health identity for records, appointments and care." : "Sign in to continue your health journey."}</p></div>
      <button className="google-button" type="button" onClick={google} disabled={busy}><GoogleMark/> Continue with Google</button>
      <div className="auth-divider"><span>or continue with email</span></div>
      <form onSubmit={submit} noValidate>
        {mode === "register" && <label className="auth-field"><span>Full name</span><div className="auth-input-wrap"><UserRound size={18}/><input autoComplete="name" placeholder="Your full name" value={values.name} onChange={set("name")}/></div></label>}
        <label className="auth-field"><span>{mode === "login" ? "Mobile Number / Email ID" : "Email address"}</span><div className="auth-input-wrap"><span className="field-at">@</span><input autoComplete="email" inputMode="email" placeholder={mode === "login" ? "Mobile Number / Email ID" : "you@example.com"} value={values.identity} onChange={set("identity")}/></div></label>
        {mode === "register" && <label className="auth-field"><span>Mobile number</span><div className="auth-input-wrap"><span className="phone-code">🇮🇳 +91</span><input autoComplete="tel-national" inputMode="tel" placeholder="98765 43210" value={values.mobile} onChange={set("mobile")}/></div></label>}
        <label className="auth-field"><span>Password</span><div className="auth-input-wrap"><LockKeyhole size={17}/><input autoComplete={mode === "register" ? "new-password" : "current-password"} type={showPassword ? "text" : "password"} placeholder="Password" value={values.password} onChange={set("password")}/><button className="reveal-button" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>
        {mode === "register" && <label className="auth-field"><span>Confirm password</span><div className="auth-input-wrap"><LockKeyhole size={17}/><input autoComplete="new-password" type={showConfirm ? "text" : "password"} placeholder="Re-enter your password" value={values.confirm} onChange={set("confirm")}/><button className="reveal-button" type="button" aria-label={showConfirm ? "Hide password" : "Show password"} onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>}
        {mode === "login" ? <button className="forgot-link" type="button" onClick={forgot}>Forgot password?</button> : <label className="auth-consent"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}/><span>I agree to the <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link>.</span></label>}
        {error && <p className="auth-message error" role="alert">{error}</p>}{notice && <p className="auth-message info" role="status">{notice}</p>}
        <button className="button auth-submit" type="submit" disabled={busy}>{busy ? <><span className="auth-spinner"/> {mode === "login" ? "Signing in…" : "Creating your account…"}</> : mode === "login" ? "Login" : "Create Cure ID"}</button>
      </form>
      <p className="auth-switch">{mode === "login" ? <>New to Cure AI? <button type="button" onClick={() => switchMode("register")}>Create your Cure ID</button></> : <>Already have an account? <button type="button" onClick={() => switchMode("login")}>Login</button></>}</p>
      <p className="auth-legal"><ShieldCheck size={15}/> Your health identity is protected with secure account access.</p>
      </>}
      </section>
    </div>
  </div></main>;
}

function safeNext(path: string | null) { return path && path.startsWith("/") && !path.startsWith("//") ? path : "/patient-dashboard"; }
