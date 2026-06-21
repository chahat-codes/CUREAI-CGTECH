"use client";

import type { Session } from "@supabase/supabase-js";
import type { AppUser, UserRole } from "./mvp-types";
import { getUser, saveUser } from "./mvp-storage";
import { supabase } from "./supabase";

export function routeForRole(role: UserRole) {
  if (role === "doctor") return "/doctor-dashboard";
  if (role === "receptionist") return "/receptionist-dashboard";
  if (role === "admin") return "/admin";
  return "/patient-dashboard";
}

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function getProfileForSession(session: Session | null): Promise<AppUser | null> {
  if (!session?.user || !supabase) return getUser();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const profile = {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as UserRole,
  };
  saveUser(profile);
  return profile;
}

export async function createOrUpdateMvpUser(input: {
  name: string;
  identifier: string;
  role: UserRole;
}) {
  const contact = input.identifier.trim().toLowerCase();
  const fallbackName = contact.includes("@") ? contact.split("@")[0] : "Cure AI User";
  const cleanName = input.name.trim() || fallbackName;

  if (supabase) {
    const { data: existing, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("email", contact)
      .maybeSingle();

    if (findError) throw new Error(findError.message);

    if (existing) {
      const { data, error } = await supabase
        .from("users")
        .update({
          name: cleanName,
          role: input.role,
        })
        .eq("id", existing.id)
        .select("*")
        .single();

      if (error) throw new Error(error.message);

      const profile = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role as UserRole,
      };
      saveUser(profile);
      return profile;
    }

    const { data, error } = await supabase
      .from("users")
      .insert({
        id: crypto.randomUUID(),
        name: cleanName,
        email: contact,
        role: input.role,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    const profile = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
    };
    saveUser(profile);
    return profile;
  }

  const localUser = getUser();
  const profile = {
    id: localUser?.email === contact ? localUser.id : crypto.randomUUID(),
    name: cleanName,
    email: contact,
    role: input.role,
  };
  saveUser(profile);
  return profile;
}

// Supabase Auth OTP helpers are intentionally kept for the future production auth flow.
// The active MVP login page does not call these functions, so users are not blocked by
// magic links, email verification, or SMS provider setup.
export async function sendEmailOtp(email: string) {
  if (!supabase) throw new Error("Supabase env keys are missing.");

  // Supabase sends the same OTP request through the "Magic Link" email template.
  // Configure that template to show {{ .Token }} and remove {{ .ConfirmationURL }}
  // so patients receive a 6-digit code instead of a magic-link email.
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) throw new Error(error.message);
}

export async function sendPhoneOtp(phone: string) {
  if (!supabase) throw new Error("Supabase env keys are missing.");

  // Phone OTP requires Supabase phone auth plus an SMS provider such as Twilio.
  // Once that is configured in Supabase, this call will send an SMS OTP.
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw new Error(error.message);
}

export async function verifyOtp(input: {
  email?: string;
  phone?: string;
  token: string;
}) {
  if (!supabase) throw new Error("Supabase env keys are missing.");
  const token = input.token.replace(/\s/g, "");

  if (!/^\d{6}$/.test(token)) {
    throw new Error("Enter the 6-digit OTP code from your email.");
  }

  const response = input.email
    ? await supabase.auth.verifyOtp({
        email: input.email.trim().toLowerCase(),
        token,
        type: "email",
      })
    : await supabase.auth.verifyOtp({
        phone: input.phone || "",
        token,
        type: "sms",
      });

  if (response.error) throw new Error(response.error.message);
  return response.data.session;
}

export async function upsertUserProfile(input: {
  session: Session;
  name: string;
  role: UserRole;
}) {
  if (!supabase) throw new Error("Supabase env keys are missing.");

  const email = input.session.user.email || input.session.user.phone || "";
  const profile = {
    id: input.session.user.id,
    name: input.name || email.split("@")[0] || "Cure AI User",
    email,
    role: input.role,
  };

  const { error } = await supabase.from("users").upsert(profile);
  if (error) throw new Error(error.message);

  saveUser(profile);
  return profile;
}

export async function logout() {
  if (supabase) await supabase.auth.signOut();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("cure-ai-user");
  }
}
