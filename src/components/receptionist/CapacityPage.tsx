"use client";

import { useState } from "react";
import { CalendarDays, CheckCircle2, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { bookedCountForDate, getCapacity, isBookingClosed, localDateKey, setCapacity, type CapacitySetting } from "@/lib/receptionist/demo-service";
import { useReceptionistDemo } from "@/components/receptionist/ReceptionistPortal";

export function BookingAvailabilityPreview({ date }: { date: string }) {
  const { state } = useReceptionistDemo();
  const setting = getCapacity(state, date);
  const booked = bookedCountForDate(state, date);
  const closed = isBookingClosed(state, date);
  const today = date === localDateKey();
  return <div className={`rp-availability-preview ${closed ? "is-closed" : "is-open"}`}><span>{closed ? <LockKeyhole size={17} /> : <CheckCircle2 size={17} />} Patient-facing booking preview</span><strong>{closed ? (today ? "BOOKINGS CLOSED FOR TODAY" : "BOOKINGS CLOSED FOR THIS DATE") : `${Math.max(0, setting.maxBookings - booked)} slots remaining`}</strong><small>Availability is a local prototype preview.</small></div>;
}

export default function CapacityPage() {
  const { state, update, ready, setNotice } = useReceptionistDemo();
  const [date, setDate] = useState(localDateKey());
  const [draft, setDraft] = useState<{ date: string; maxBookings: number; manuallyClosed: boolean } | null>(null);
  const booked = bookedCountForDate(state, date);
  const configured: CapacitySetting = getCapacity(state, date);
  const max = draft?.date === date ? draft.maxBookings : configured.maxBookings;
  const manualClosed = draft?.date === date ? draft.manuallyClosed : configured.manuallyClosed;
  const saved = draft?.date !== date;
  const closed = isBookingClosed(state, date);
  const remaining = Math.max(0, configured.maxBookings - booked);
  const save = () => {
    const nextMax = Math.max(0, Math.floor(Number(max) || 0));
    update(setCapacity(state, date, { maxBookings: nextMax, manuallyClosed: manualClosed }));
    setDraft(null);
    setNotice("Booking capacity saved in browser demo state.");
  };
  const closeBookings = () => {
    update(setCapacity(state, date, { ...configured, manuallyClosed: true }));
    setDraft(null);
    setNotice("Bookings manually closed for the selected date.");
  };
  const reopenBookings = () => {
    update(setCapacity(state, date, { ...configured, manuallyClosed: false }));
    setDraft(null);
    setNotice(booked >= configured.maxBookings ? "Manual closure cleared, but bookings remain closed because capacity is full." : "Bookings reopened for the selected date.");
  };
  const today = date === localDateKey();
  const message = closed ? today ? "BOOKINGS CLOSED FOR TODAY" : "BOOKINGS CLOSED FOR THIS DATE" : "Bookings are open";
  return <>
    <div className="rp-page-heading"><div><h1>Booking Capacity</h1><p>Edit date-specific booking limits and control availability.</p><span className="rp-demo-label"><i /> Demo settings · Stored in this browser</span></div></div>
    <div className="rp-capacity-grid">
      <section className="rp-panel rp-capacity-form"><div className="rp-panel-heading"><div><h2>Capacity settings</h2><p>Each date has its own limit and manual closure.</p></div><CalendarDays size={20} /></div>
        <label className="rp-capacity-field">Select date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label className="rp-capacity-field">Maximum bookings<input type="number" min="0" max="500" value={max} onChange={(event) => setDraft({ date, maxBookings: Number(event.target.value), manuallyClosed: manualClosed })} /><small>Existing appointments remain visible if you lower the limit.</small></label>
        <div className="rp-capacity-count"><div><span>Booked appointments</span><strong>{booked}</strong></div><b>/</b><div><span>Configured limit</span><strong>{configured.maxBookings}</strong></div></div>
        <div className="rp-capacity-bar" role="progressbar" aria-label="Booking capacity" aria-valuenow={Math.min(booked, configured.maxBookings)} aria-valuemin={0} aria-valuemax={Math.max(1, configured.maxBookings)}><span style={{ width: `${configured.maxBookings ? Math.min(100, booked / configured.maxBookings * 100) : booked ? 100 : 0}%` }} /></div>
        <div className={`rp-booking-status ${closed ? "closed" : "open"}`}><span>{closed ? <LockKeyhole size={17} /> : <CheckCircle2 size={17} />}{message}</span><small>{closed ? manualClosed ? "Manually closed by receptionist." : "Automatically closed: the configured limit is full." : `${remaining} remaining slots`}</small></div>
        <div className="rp-capacity-actions"><button className="rp-primary-button" type="button" onClick={save} disabled={saved}>Save changes</button>{closed ? <button className="rp-outline-button" type="button" onClick={reopenBookings}><LockKeyholeOpen size={15} /> Reopen bookings</button> : <button className="rp-outline-button rp-close-bookings" type="button" onClick={closeBookings}><LockKeyhole size={15} /> Close bookings</button>}</div>
        {saved && <small className="rp-saved-note">{ready ? "Current settings are saved in this browser." : "Loading settings…"}</small>}
      </section>
      <aside className="rp-capacity-side"><BookingAvailabilityPreview date={date} /><section className="rp-panel rp-capacity-rules"><h2>How capacity works</h2><ul><li>Limits are maintained separately for each selected date.</li><li>Existing appointments are retained if the limit is reduced.</li><li>Full capacity closes booking automatically.</li><li>Manual closure stays in place until you reopen it.</li><li>Reopening cannot exceed the configured limit.</li><li>These changes are local to this browser prototype.</li></ul></section></aside>
    </div>
  </>;
}
