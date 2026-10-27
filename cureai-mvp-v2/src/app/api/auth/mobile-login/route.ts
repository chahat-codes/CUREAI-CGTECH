import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const attempts = new Map<string, { count: number; since: number }>();
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now(); const entry = attempts.get(ip);
  if (entry && now - entry.since < 10 * 60_000 && entry.count >= 8) return NextResponse.json({ error: "Too many attempts. Please wait a few minutes and try again." }, { status: 429 });
  if (!entry || now - entry.since >= 10 * 60_000) attempts.set(ip, { count: 1, since: now }); else entry.count++;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) return NextResponse.json({ error: "Mobile sign-in is not configured. Use email sign-in or contact the site administrator." }, { status: 503 });
  try {
    const body = await request.json(); const mobile = String(body.mobile ?? "").replace(/\D/g, ""); const password = String(body.password ?? "");
    if (!/^\d{10}$/.test(mobile) || !password) return NextResponse.json({ error: "Enter your 10-digit mobile number and password." }, { status: 400 });
    const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: profile, error: lookupError } = await admin.from("patient_profiles").select("email").eq("mobile_number", `+91${mobile}`).maybeSingle();
    if (lookupError || !profile?.email) return NextResponse.json({ error: "Unable to sign in with those details. Check your number and password." }, { status: 401 });
    const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await auth.auth.signInWithPassword({ email: profile.email, password });
    if (error || !data.session) return NextResponse.json({ error: "Unable to sign in with those details. Check your number and password." }, { status: 401 });
    return NextResponse.json({ session: { access_token: data.session.access_token, refresh_token: data.session.refresh_token } }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Unable to process sign-in. Please try again." }, { status: 400 }); }
}
