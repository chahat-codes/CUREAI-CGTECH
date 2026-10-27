"use client";

import Link from "next/link";
import { Building2, MapPin, Star } from "lucide-react";
import { hasSupabase } from "@/lib/mvp-api";
import type { Doctor } from "@/lib/mvp-types";
import { MvpCard, PrimaryAction } from "./MvpShell";

type DoctorCardProps = {
  doctor: Doctor;
  onBook?: (doctor: Doctor) => void;
};

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const showRating = hasSupabase() && doctor.rating > 0;
  return (
    <MvpCard className="flex h-full flex-col justify-between">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-outfit text-xl font-extrabold text-slate-950">{doctor.name}</h3>
            <p className="font-semibold text-[#0A66FF]">{doctor.specialization}</p>
          </div>
          {showRating && <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700"><Star className="size-3.5 fill-current"/>{doctor.rating}</span>}
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            {doctor.clinic_name || "Clinic not provided"}
          </p>
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" />{doctor.location || doctor.city || "Location not provided"}</p>
          {doctor.qualification && <p>{doctor.qualification}</p>}
          {doctor.experience != null && doctor.experience > 0 && <p>{doctor.experience} years of experience</p>}
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Consultation fee
          </p>
          <p className="font-outfit text-2xl font-black text-slate-950">{doctor.consultation_fee > 0 ? `₹${doctor.consultation_fee}` : "Fee not provided"}</p>
        </div>
        <Link href={`/doctor/${encodeURIComponent(doctor.id)}`} className="mt-4 inline-flex text-sm font-bold text-[#1768ee] hover:underline">View doctor profile</Link>
        {doctor.id.startsWith("doctor-") && <p className="mt-3 text-[11px] text-slate-400">Sample doctor · demonstration data</p>}
      </div>

      {onBook && (
        <div className="mt-6">
          <PrimaryAction onClick={() => onBook(doctor)}>Book Appointment</PrimaryAction>
        </div>
      )}
    </MvpCard>
  );
}
