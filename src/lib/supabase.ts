import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";

const anonKeyCandidates = [
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.VITE_SUPABASE_ANON_KEY,
].filter(Boolean) as string[];

function isLikelyAnonKey(value: string) {
  const trimmed = value.trim();
  return (
    (trimmed.startsWith("sb_publishable_") || trimmed.startsWith("eyJ")) &&
    !trimmed.startsWith("http") &&
    !trimmed.includes("supabase.co")
  );
}

const supabaseAnonKey =
  anonKeyCandidates.find(isLikelyAnonKey)?.trim() || anonKeyCandidates[0]?.trim() || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (supabaseUrl && !isLikelyAnonKey(supabaseAnonKey)) {
  console.error(
    "[Cure AI Supabase] Invalid anon key configuration. NEXT_PUBLIC_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY must be a Supabase anon/publishable key, not a REST URL.",
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
