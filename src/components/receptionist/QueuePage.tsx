"use client";

import { useMemo } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Check, PhoneCall, Play, Siren, UserCheck } from "lucide-react";
import { estimateWaitMinutes, localDateKey, makeAppointmentPatch, type DemoAppointment } from "@/lib/receptionist/demo-service";
import { StatusBadge, useReceptionistDemo } from "@/components/receptionist/ReceptionistPortal";

export default function QueuePage() {
  const { state, update, ready, setNotice } = useReceptionistDemo();
  const today = localDateKey();
  const todayRows = state.appointments.filter((item) => item.date === today);
  const current = todayRows.find((item) => item.status === "In consultation");
  const queue = useMemo(() => todayRows.filter((item) => item.status === "Waiting" || item.status === "Checked in")
    .sort((a, b) => Number(b.called) - Number(a.called) || Number(b.priority) - Number(a.priority) || (a.queuePosition ?? 999) - (b.queuePosition ?? 999)), [todayRows]);
  const waiting = todayRows.filter((item) => item.status === "Waiting" || item.status === "Checked in");
  const patch = (item: DemoAppointment, values: Partial<DemoAppointment>, message: string) => { update(makeAppointmentPatch(state, item.id, values)); setNotice(message); };
  const callNext = () => {
    if (!queue.length) { setNotice("No checked-in patient is waiting."); return; }
    const item = queue[0];
    if (!window.confirm(`Call ${item.patient} next? This action updates demo state only.`)) return;
    patch(item, { status: "Waiting", called: true, queuePosition: 1 }, `${item.patient} has been called (demo mode).`);
  };
  const startConsultation = (item: DemoAppointment) => {
    if (!window.confirm(`Start consultation for ${item.patient}?`)) return;
    const stamp = new Date().toTimeString().slice(0, 5);
    const updated = makeAppointmentPatch(state, item.id, { status: "In consultation", called: false, consultationStartedAt: stamp, queuePosition: null });
    update({ ...updated, appointments: updated.appointments.map((row) => row.status === "Waiting" && row.id !== item.id ? { ...row, queuePosition: Math.max(1, (row.queuePosition || 1) - 1) } : row) });
    setNotice(`${item.patient} consultation started in demo mode.`);
  };
  const checkIn = (item: DemoAppointment) => {
    const now = new Date().toTimeString().slice(0, 5);
    patch(item, { status: "Waiting", called: false, checkedInAt: now, queuePosition: waiting.length + 1 }, `${item.patient} checked in and joined the demo queue.`);
  };
  const complete = (item: DemoAppointment) => {
    if (!window.confirm(`Mark consultation for ${item.patient} as complete?`)) return;
    patch(item, { status: "Completed", consultationCompletedAt: new Date().toTimeString().slice(0, 5), queuePosition: null }, "Consultation marked complete in demo mode.");
  };
  const toggleEmergency = (item: DemoAppointment) => {
    if (!item.emergency && !window.confirm(`Flag ${item.patient} as an emergency? Queue order will not change.`)) return;
    if (item.emergency && !window.confirm(`Clear the emergency flag for ${item.patient}?`)) return;
    patch(item, { emergency: !item.emergency, emergencyAcknowledged: false }, item.emergency ? "Emergency flag cleared." : "Emergency flagged. Contact the clinic’s clinical team immediately.");
  };
  const togglePriority = (item: DemoAppointment) => {
    if (!window.confirm(`${item.priority ? "Remove priority for" : "Move"} ${item.patient} ${item.priority ? "from" : "to the front of"} the demo queue?`)) return;
    patch(item, { priority: !item.priority, queuePosition: item.priority ? Math.max(1, queue.length) : 1 }, item.priority ? "Queue priority removed." : "Queue priority updated explicitly in demo mode.");
  };
  const acknowledge = (item: DemoAppointment) => patch(item, { emergencyAcknowledged: true }, "Emergency acknowledged by receptionist in demo mode.");
  const activeEmergency = todayRows.filter((item) => item.emergency);
  return <>
    <div className="rp-page-heading"><div><h1>Live Queue</h1><p>Manage check-ins and consultation flow for today.</p><span className="rp-demo-label"><i /> Demo queue · Not synced in real time</span></div></div>
    {activeEmergency.length > 0 && <div className="rp-emergency-banner"><AlertTriangle size={19} /><div><strong>Emergency flag active</strong><span>{activeEmergency.map((item) => item.patient).join(", ")} · Contact the clinic’s clinical team or emergency services for urgent situations.</span></div><div className="rp-emergency-alert-actions">{activeEmergency.map((item) => item.emergencyAcknowledged ? <span key={item.id} className="rp-acknowledged">Acknowledged</span> : <button key={item.id} type="button" onClick={() => acknowledge(item)}>Acknowledge</button>)}</div></div>}
    <section className="rp-queue-overview">
      <article><span>Currently consulting</span><strong>{current?.patient || "No active consultation"}</strong><small>{current?.doctor || "—"}</small></article>
      <article><span>Next patient</span><strong>{queue[0]?.patient || "No one waiting"}</strong><small>{queue[0]?.time || "—"}</small></article>
      <article><span>Total waiting</span><strong>{waiting.length}</strong><small>Checked in</small></article>
      <article><span>Estimated wait</span><strong>{queue.length ? `~${estimateWaitMinutes(1) + (current?.expectedMinutes || 0)} min` : "—"}</strong><small>Queue position + current visit estimate</small></article>
    </section>
    <section className="rp-panel rp-queue-table-panel"><div className="rp-panel-heading"><div><h2>Today’s queue</h2><p>Estimated waits are based on queue position, not live clinic telemetry.</p></div><button className="rp-primary-button" type="button" onClick={callNext} disabled={!queue.length}><PhoneCall size={15} /> Call next</button></div>
      {!ready ? <p className="rp-empty-state">Loading queue…</p> : <div className="rp-table-wrap rp-full-table"><table><thead><tr><th>Position</th><th>Patient</th><th>Appointment</th><th>Check-in</th><th>Doctor</th><th>Est. wait</th><th>Status</th><th>Actions</th></tr></thead><tbody>{todayRows.filter((item) => ["Scheduled", "Checked in", "Waiting", "In consultation"].includes(item.status)).sort((a, b) => a.status === "In consultation" ? -1 : b.status === "In consultation" ? 1 : (a.queuePosition ?? 999) - (b.queuePosition ?? 999)).map((item) => {
        const position = queue.findIndex((row) => row.id === item.id) + 1;
        return <tr key={item.id} className={item.emergency ? "rp-emergency-row" : ""}><td>{item.status === "In consultation" ? <span className="rp-current-tag">Now</span> : position > 0 && item.status !== "Scheduled" ? `#${position}` : "—"}{item.priority && <span className="rp-priority-tag">Priority</span>}</td><td>{item.patient}{item.emergency && <span className="rp-emergency-badge">EMERGENCY</span>}</td><td>{item.time}</td><td>{item.checkedInAt || "—"}</td><td>{item.doctor}</td><td>{position > 0 ? `~${estimateWaitMinutes(position)} min` : "—"}</td><td><StatusBadge appointment={item} /></td><td><div className="rp-row-actions rp-queue-actions">{item.status === "Scheduled" && <button className="rp-check-action" type="button" onClick={() => checkIn(item)}><UserCheck size={14} /> Check in</button>}{(item.status === "Waiting" || item.status === "Checked in") && <button className="rp-check-action" type="button" onClick={() => startConsultation(item)}><Play size={14} /> Start</button>}{item.status === "In consultation" && <button className="rp-check-action" type="button" onClick={() => complete(item)}><Check size={14} /> Complete</button>}{item.status !== "Scheduled" && item.status !== "Completed" && <button type="button" title="Explicitly change queue priority" onClick={() => togglePriority(item)}>{item.priority ? <ArrowDown size={14} /> : <ArrowUp size={14} />} {item.priority ? "Unprioritize" : "Priority"}</button>}{item.status !== "Completed" && <button type="button" className={item.emergency ? "rp-emergency-action" : ""} onClick={() => toggleEmergency(item)}><Siren size={14} /> {item.emergency ? "Clear flag" : "Emergency"}</button>}</div></td></tr>;
      })}</tbody></table>{todayRows.filter((item) => ["Scheduled", "Checked in", "Waiting", "In consultation"].includes(item.status)).length === 0 && <p className="rp-empty-state">No patients to show for today.</p>}</div>}
    </section>
    <p className="rp-note"><AlertTriangle size={14} /> Emergency flags do not change queue order. Priority changes require an explicit confirmation and do not replace clinical judgment.</p>
  </>;
}
