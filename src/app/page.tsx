"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserType = "patient" | "doctor" | "clinic" | "hospital";

const userTypes: Array<{ label: string; value: UserType }> = [
  { label: "Patient", value: "patient" },
  { label: "Doctor", value: "doctor" },
  { label: "Clinic", value: "clinic" },
  { label: "Hospital", value: "hospital" },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  userType: "patient" as UserType,
  city: "",
};

export default function Home() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const openWaitlist = () => {
    setStatus(null);
    setIsWaitlistOpen(true);
  };

  const closeWaitlist = () => {
    if (isSubmitting) return;
    setIsWaitlistOpen(false);
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (status?.type === "error") setStatus(null);
  };

  const submitWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!supabase) {
      setStatus({
        type: "error",
        message: "Waitlist is not configured yet. Please try again soon.",
      });
      return;
    }

    const payload = {
      full_name: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.replace(/\s+/g, "").trim(),
      user_type: form.userType,
      city: form.city.trim(),
    };

    if (
      !payload.full_name ||
      !payload.email ||
      !payload.phone ||
      !payload.user_type ||
      !payload.city
    ) {
      setStatus({
        type: "error",
        message: "Please fill in every field to join the waitlist.",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("waitlist").insert(payload);

    setIsSubmitting(false);

    if (error) {
      const duplicateSubmission = error.code === "23505";
      setStatus({
        type: "error",
        message: duplicateSubmission
          ? "This email or phone number is already on the Cure AI waitlist."
          : "We could not add you to the waitlist. Please try again.",
      });
      return;
    }

    setForm(initialForm);
    setStatus({
      type: "success",
      message: "You’re on the Cure AI waitlist. We’ll contact you soon.",
    });
  };

  return (
    <main className="fixed inset-0 z-50 isolate overflow-y-auto bg-white text-slate-950">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(10,102,255,0.18),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f5faff_46%,#eaf3ff_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0A66FF]/10 blur-3xl sm:h-96 sm:w-96" />

      <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="mb-8 rounded-[2rem] border border-blue-100 bg-white/80 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur">
          <Image
            src="/cure-ai-logo.png"
            alt="Cure AI logo"
            width={220}
            height={220}
            priority
            className="h-28 w-28 object-contain sm:h-36 sm:w-36"
          />
        </div>

        <p className="mb-4 rounded-full border border-blue-100 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0A66FF] shadow-sm">
          Coming soon
        </p>

        <h1 className="max-w-4xl font-outfit text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Healthcare needs an upgrade.
        </h1>

        <p className="mt-5 font-outfit text-2xl font-semibold text-[#0A66FF] sm:text-4xl">
          We&apos;re building it.
        </p>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
          The future of healthcare starts with less waiting.
        </p>

        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={openWaitlist}
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#0A66FF] px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700 sm:w-auto"
          >
            Join waitlist
          </button>
          <a
            href="https://www.instagram.com/cureaihealth.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full border border-blue-100 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0A66FF] hover:text-[#0A66FF] sm:w-auto"
          >
            @cureaihealth.in
          </a>
        </div>
      </section>

      {isWaitlistOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
          onMouseDown={closeWaitlist}
        >
          <div
            className="max-h-[calc(100svh-3rem)] w-full max-w-xl overflow-y-auto rounded-[1.75rem] border border-blue-100 bg-white p-6 text-left shadow-2xl shadow-blue-950/20 sm:p-8"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0A66FF]">
                  Join waitlist
                </p>
                <h2
                  id="waitlist-title"
                  className="mt-2 font-outfit text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl"
                >
                  Be first in line for Cure AI.
                </h2>
              </div>
              <button
                type="button"
                onClick={closeWaitlist}
                disabled={isSubmitting}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-500 transition hover:border-[#0A66FF] hover:text-[#0A66FF] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close waitlist form"
              >
                Close
              </button>
            </div>

            <form className="space-y-4" onSubmit={submitWaitlist}>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Full name
                </span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  autoComplete="name"
                  required
                  className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Your full name"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Email
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    autoComplete="email"
                    required
                    className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Phone number
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    autoComplete="tel"
                    required
                    className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="+91 98765 43210"
                  />
                </label>
              </div>

              <div>
                <span className="text-sm font-semibold text-slate-700">
                  User type
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {userTypes.map((type) => (
                    <label key={type.value}>
                      <input
                        type="radio"
                        name="userType"
                        value={type.value}
                        checked={form.userType === type.value}
                        onChange={() => updateField("userType", type.value)}
                        className="peer sr-only"
                      />
                      <span className="flex cursor-pointer items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/40 px-3 py-3 text-sm font-semibold text-slate-600 transition peer-checked:border-[#0A66FF] peer-checked:bg-[#0A66FF] peer-checked:text-white">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  City
                </span>
                <input
                  type="text"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  autoComplete="address-level2"
                  required
                  className="mt-2 w-full rounded-2xl border border-blue-100 bg-blue-50/40 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Your city"
                />
              </label>

              {status && (
                <p
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#0A66FF] px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-blue-300"
              >
                {isSubmitting ? "Joining..." : "Join waitlist"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
