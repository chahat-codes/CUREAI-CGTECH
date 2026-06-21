"use client";

import { Building2, Clock, MapPin, Star } from "lucide-react";
import type { Doctor } from "@/lib/mvp-types";
import { MvpCard, PrimaryAction } from "./MvpShell";

type DoctorCardProps = {
  doctor: Doctor;
  onBook?: (doctor: Doctor) => void;
};

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <MvpCard className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-outfit text-xl font-extrabold text-slate-950">{doctor.name}</h3>
            <p className="font-semibold text-[#0A66FF]">{doctor.specialization}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-600">
            <Star className="w-4 h-4 fill-current" />
            {doctor.rating}
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            {doctor.clinic_name}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            {doctor.location}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            {doctor.available_time} · ~{doctor.wait_time} min wait
          </p>
        </div>

        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Consultation fee
          </p>
          <p className="font-outfit text-2xl font-black text-slate-950">
            ₹{doctor.consultation_fee}
          </p>
        </div>
      </div>

      {onBook && (
        <div className="mt-6">
          <PrimaryAction onClick={() => onBook(doctor)}>Book Appointment</PrimaryAction>
        </div>
      )}
    </MvpCard>
  );
}
