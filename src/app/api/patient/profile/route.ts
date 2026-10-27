import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!url || !anonKey) return NextResponse.json({ error: "Patient profile service is not configured." }, { status: 503 });
  if (!token) return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
  const client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data: userData, error: userError } = await client.auth.getUser(token);
  if (userError || !userData.user) return NextResponse.json({ error: "Session expired. Please sign in again." }, { status: 401 });
  const { data: profile, error } = await client.from("patient_profiles").select("cure_id,full_name,email,mobile_number").eq("user_id", userData.user.id).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load patient profile." }, { status: 500 });
  if (!profile) return NextResponse.json({ error: "Patient profile is still being created. Please try again shortly." }, { status: 404 });
  return NextResponse.json({ profile }, { headers: { "Cache-Control": "no-store" } });
}
