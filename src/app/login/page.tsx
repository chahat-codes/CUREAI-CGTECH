"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MvpShell, { MvpCard, PrimaryAction, StatusMessage } from "@/components/mvp/MvpShell";
import {
  createOrUpdateMvpUser,
  getCurrentSession,
  getProfileForSession,
  routeForRole,
} from "@/lib/auth";
import { getUser } from "@/lib/mvp-storage";
import type { UserRole } from "@/lib/mvp-types";
import { hasSupabase } from "@/lib/mvp-api";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const activeSession = await getCurrentSession();
        const profile = await getProfileForSession(activeSession);
        const user = profile || getUser();
        if (user) router.replace(routeForRole(user.role));
      } catch {
        const user = getUser();
        if (user) router.replace(routeForRole(user.role));
      }
    };

    restoreSession();
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Enter your name.");
      return;
    }

    if (!identifier.trim()) {
      setError("Enter your phone number or email address.");
      return;
    }

    setLoading(true);
    try {
      const profile = await createOrUpdateMvpUser({
        name,
        identifier,
        role,
      });
      setMessage("Profile saved. Redirecting...");
      router.push(routeForRole(profile.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MvpShell
      eyebrow="Login"
      title="Access Cure AI."
      description="Enter your details to continue. OTP and magic-link verification are disabled for the MVP."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <MvpCard>
          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Phone number or email
              </span>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="you@example.com or +919000000000"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">Role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            {error && <StatusMessage type="error">{error}</StatusMessage>}
            {message && <StatusMessage type="success">{message}</StatusMessage>}
            {!hasSupabase() && (
              <StatusMessage type="empty">
                Supabase is not configured, so Cure AI will save this MVP session locally.
              </StatusMessage>
            )}

            <PrimaryAction type="submit" disabled={loading}>
              {loading ? "Saving..." : "Continue"}
            </PrimaryAction>
          </form>
        </MvpCard>

        <MvpCard className="h-fit">
          <h2 className="font-outfit text-2xl font-extrabold text-slate-950 mb-3">
            MVP login
          </h2>
          <p className="text-sm text-slate-600">
            This creates or updates your Cure AI profile and stores your session locally.
            Supabase Auth OTP code is still available in the codebase for later production login.
          </p>
        </MvpCard>
      </div>
    </MvpShell>
  );
}
