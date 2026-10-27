"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Check, Eye, Search, X } from "lucide-react";
import { localDateKey, makeAppointmentPatch, type DemoAppointment } from "@/lib/receptionist/demo-service";
import { StatusBadge, useReceptionistDemo } from "@/components/receptionist/ReceptionistPortal";

export default function AppointmentsPage() {
  const { state, update, ready, setNotice } = useReceptionistDemo();
  const [date, setDate] = useState(localDateKey());
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [doctor, setDoctor] = useState("All doctors");
  const [selected, setSelected] = useState<DemoAppointment | null>(null);
  const doctors = Array.from(new Set(state.appointments.map((item) => item.doctor)));
  const filtered = useMemo(() => state.appointments.filter((item) => item.date === date &&
    (!query || `${item.patient} ${item.id}`.toLowerCase().includes(query.toLowerCase())) &&
    (status === "All statuses" || item.status === status || status === "Emergency" && item.emergency) &&
    (doctor === "All doctors" || item.doctor === doctor)), [state.appointments, date, query, status, doctor]);
  const checkIn = (item: DemoAppointment) => {
    if (item.status !== "Scheduled") return;
    if (!window.confirm(`Check in ${item.patient}? This only updates local demo data.`)) return;
    const clock = new Date().toTimeString().slice(0, 5);
    update(makeAppointmentPatch(state, item.id, { status: "Waiting", called: false, checkedInAt: clock, queuePosition: state.appointments.filter((row) => row.date === date && row.status === "Waiting").length + 1 }));
    setNotice(`${item.patient} checked in. Demo data updated.`);
  };
  const toggleEmergency = (item: DemoAppointment) => {
    if (!item.emergency && !window.confirm(`Mark ${item.patient} as an emergency? This will flag the record without changing queue order.`)) return;
    if (item.emergency && !window.confirm(`Clear the emergency flag for ${item.patient}?`)) return;
    update(makeAppointmentPatch(state, item.id, { emergency: !item.emergency, emergencyAcknowledged: false }));
    setNotice(item.emergency ? "Emergency flag cleared in demo mode." : "Emergency flagged. Contact the clinic’s clinical team immediately.");
  };
  return <>
    <div className="rp-page-heading"><div><h1>Appointments</h1><p>Search, review and check in today’s sample appointments.</p><span className="rp-demo-label"><i /> Demo data · Changes stay in this browser</span></div></div>
    {state.appointments.some((item) => item.date === date && item.emergency) && <div className="rp-emergency-banner"><AlertTriangle size={19} /><div><strong>Emergency attention required</strong><span>Contact the clinic’s clinical team. The flagged appointment has not been reordered.</span></div></div>}
    <section className="rp-panel rp-appointments-page">
      <div className="rp-panel-heading"><div><h2>Appointment list</h2><p>{filtered.length} sample appointments</p></div><span className="rp-table-caption">Bookings remain visible when capacity is closed.</span></div>
      <div className="rp-filter-row">
        <label>Date<input aria-label="Appointment date" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label className="rp-search-field">Search patient or reference<span><Search size={16} /><input type="search" placeholder="Search…" value={query} onChange={(event) => setQuery(event.target.value)} /></span></label>
        <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option><option>Scheduled</option><option>Checked in</option><option>Waiting</option><option>In consultation</option><option>Completed</option><option>Emergency</option></select></label>
        <label>Doctor<select value={doctor} onChange={(event) => setDoctor(event.target.value)}><option>All doctors</option>{doctors.map((name) => <option key={name}>{name}</option>)}</select></label>
      </div>
      {!ready ? <p className="rp-empty-state">Loading sample appointments…</p> : <div className="rp-table-wrap rp-full-table"><table><thead><tr><th>Reference</th><th>Patient</th><th>Doctor</th><th>Date &amp; time</th><th>Status</th><th>Check-in</th><th>Queue</th><th>Actions</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td className="rp-reference">{item.id}</td><td>{item.patient}{item.emergency && <span className="rp-emergency-badge">EMERGENCY</span>}</td><td>{item.doctor}</td><td>{item.date} · {item.time}</td><td><StatusBadge appointment={item} /></td><td>{item.checkedInAt || "—"}</td><td>{item.queuePosition ?? "—"}</td><td><div className="rp-row-actions"><button type="button" title="View appointment details" aria-label={`View ${item.id}`} onClick={() => setSelected(item)}><Eye size={15} /></button>{item.status === "Scheduled" && <button type="button" className="rp-check-action" onClick={() => checkIn(item)}><Check size={14} /> Check in</button>}<button type="button" className={item.emergency ? "rp-emergency-action" : ""} onClick={() => toggleEmergency(item)}>{item.emergency ? "Clear flag" : "Mark emergency"}</button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="rp-empty-state">No appointments match these filters.</p>}</div>}
    </section>
    {selected && <div className="rp-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="rp-modal" role="dialog" aria-modal="true" aria-labelledby="rp-appointment-dialog-title"><div className="rp-modal-heading"><div><p>Appointment details</p><h2 id="rp-appointment-dialog-title">{selected.id}</h2></div><button type="button" aria-label="Close details" onClick={() => setSelected(null)}><X size={18} /></button></div><dl className="rp-details-list"><div><dt>Patient</dt><dd>{selected.patient}</dd></div><div><dt>Doctor</dt><dd>{selected.doctor}</dd></div><div><dt>Date &amp; time</dt><dd>{selected.date} · {selected.time}</dd></div><div><dt>Status</dt><dd><StatusBadge appointment={selected} /></dd></div><div><dt>Checked in</dt><dd>{selected.checkedInAt || "Not checked in"}</dd></div><div><dt>Queue position</dt><dd>{selected.queuePosition ?? "Not queued"}</dd></div></dl><button type="button" className="rp-primary-button rp-modal-close" onClick={() => setSelected(null)}>Close</button></section></div>}
    <p className="rp-note"><AlertTriangle size={14} /> Urgent medical situations require immediate contact with the clinical team or emergency services.</p>
  </>;
}
