"use client";

import { FormEvent } from "react";
import type { DoctorFormInput } from "@/lib/mvp-api";
import { MvpCard, PrimaryAction } from "@/components/mvp/MvpShell";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type DoctorFormProps = {
  value: DoctorFormInput;
  onChange: (next: DoctorFormInput) => void;
  onSubmit: () => void;
  submitLabel: string;
  loading?: boolean;
};

export default function DoctorForm({
  value,
  onChange,
  onSubmit,
  submitLabel,
  loading,
}: DoctorFormProps) {
  const setField = <K extends keyof DoctorFormInput>(key: K, nextValue: DoctorFormInput[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <MvpCard>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Doctor name" value={value.name} onChange={(next) => setField("name", next)} required />
          <TextField label="Specialization" value={value.specialization} onChange={(next) => setField("specialization", next)} required />
          <TextField label="Qualification" value={value.qualification} onChange={(next) => setField("qualification", next)} />
          <NumberField label="Experience (years)" value={value.experience} onChange={(next) => setField("experience", next)} />
          <TextField label="Clinic name" value={value.clinic_name} onChange={(next) => setField("clinic_name", next)} required />
          <TextField label="Clinic address" value={value.clinic_address} onChange={(next) => setField("clinic_address", next)} />
          <TextField label="City" value={value.city} onChange={(next) => setField("city", next)} />
          <TextField label="Public location" value={value.location} onChange={(next) => setField("location", next)} required />
          <TextField label="Phone" value={value.phone} onChange={(next) => setField("phone", next)} />
          <TextField label="Profile image URL" value={value.profile_image_url} onChange={(next) => setField("profile_image_url", next)} />
          <NumberField label="Consultation fee" value={value.consultation_fee} onChange={(next) => setField("consultation_fee", next)} />
          <NumberField label="Wait time (minutes)" value={value.wait_time} onChange={(next) => setField("wait_time", next)} />
          <NumberField label="Rating" value={value.rating} step="0.1" onChange={(next) => setField("rating", next)} />
          <NumberField label="Credits" value={value.credits} onChange={(next) => setField("credits", next)} />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-slate-700">Available days</p>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day) => {
              const active = value.available_days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() =>
                    setField(
                      "available_days",
                      active
                        ? value.available_days.filter((item) => item !== day)
                        : [...value.available_days, day],
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    active ? "bg-[#0A66FF] text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <TextField
          label="Available slots (comma separated)"
          value={value.available_slots.join(", ")}
          onChange={(next) =>
            setField(
              "available_slots",
              next.split(",").map((slot) => slot.trim()).filter(Boolean),
            )
          }
        />

        <TextField
          label="Public available time text"
          value={value.available_time}
          onChange={(next) => setField("available_time", next)}
        />

        <div className="flex flex-wrap gap-3">
          <Toggle
            label="Active listing"
            checked={value.is_active}
            onChange={(next) => setField("is_active", next)}
          />
          <Toggle
            label="Verified"
            checked={value.is_verified}
            onChange={(next) => setField("is_verified", next)}
          />
        </div>

        <PrimaryAction type="submit" disabled={loading}>
          {loading ? "Saving..." : submitLabel}
        </PrimaryAction>
      </form>
    </MvpCard>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-[#0A66FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#0A66FF]"
      />
      {label}
    </label>
  );
}
