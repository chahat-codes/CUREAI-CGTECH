"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import { doctors } from "@/lib/data";
import { PatientGuard } from "@/components/auth/PatientGuard";

const slots = ["9:30 AM", "10:30 AM", "12:00 PM", "4:30 PM", "6:00 PM"];
const baseDate = new Date(Date.UTC(2026, 6, 2, 12));
const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

function BookingContent() {
  const params = useSearchParams();
  const selectedDoctor = doctors.find((doctor) => doctor.id === params.get("doctor")) ?? doctors[0];
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate);
    date.setUTCDate(date.getUTCDate() + index);
    return date;
  }), []);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(slots[3]);

  return (
    <main className="page-shell">
      <section className="panel booking-panel">
        <p className="eyebrow">Appointment booking</p>
        <h1>Schedule with {selectedDoctor.name}</h1>
        <p className="muted">Calendly-style MVP scheduler. Placeholder integration can be swapped for Calendly later.</p>
        <div className="date-grid">
          {days.map((date, index) => (
            <button className={day === index ? "selected" : ""} key={date.toDateString()} onClick={() => setDay(index)}>
              <span>{dayFormatter.format(date)}</span>
              <strong>{date.getUTCDate()}</strong>
            </button>
          ))}
        </div>
        <div className="slot-grid">
          {slots.map((item) => <button className={slot === item ? "selected" : ""} key={item} onClick={() => setSlot(item)}>{item}</button>)}
        </div>
        <div className="confirmation">
          <CalendarCheck size={22} />
          <div>
            <strong>Appointment held locally</strong>
            <span>{dateFormatter.format(days[day])} at {slot} · {selectedDoctor.fee}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function BookingPage() {
  return (
    <PatientGuard><Suspense fallback={<main className="page-shell"><section className="panel">Loading scheduler...</section></main>}><BookingContent /></Suspense></PatientGuard>
  );
}
