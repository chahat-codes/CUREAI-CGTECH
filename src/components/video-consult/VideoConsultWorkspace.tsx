"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Activity, ArrowRight, CalendarDays, Check, CheckCircle2, Circle, Clock3,
  FileText, Headphones, LockKeyhole, MonitorCheck, Paperclip,
  ShieldCheck, Stethoscope, Upload, Video, Wifi, X,
} from "lucide-react";
import { getPatientAppointments } from "@/lib/mvp-api";
import { getUser } from "@/lib/mvp-storage";
import type { AppointmentWithDetails } from "@/lib/mvp-types";

const checklistItems = [
  "Check your camera, microphone and speakers",
  "Choose a quiet, private place with good lighting",
  "Keep your appointment details nearby",
];

function formatAppointmentDate(date: string, time: string) {
  const value = parseAppointmentDate(date, time);
  if (Number.isNaN(value.getTime())) return `${date} · ${time}`;
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" }).format(value);
}

function parseAppointmentDate(date: string, time: string) {
  const normalizedTime = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!normalizedTime) return new Date(`${date}T${time}`);
  let hours = Number(normalizedTime[1]) % 12;
  if (normalizedTime[3].toUpperCase() === "PM") hours += 12;
  return new Date(`${date}T${String(hours).padStart(2, "0")}:${normalizedTime[2]}:00`);
}

export default function VideoConsultWorkspace() {
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<boolean[]>([false, false, false]);
  const [questions, setQuestions] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [deviceMessage, setDeviceMessage] = useState("");
  const [networkMessage, setNetworkMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let active = true;
    getPatientAppointments(getUser())
      .then((items) => {
        const now = new Date();
        const next = items
          .filter((item) => item.status === "booked" && parseAppointmentDate(item.appointment_date, item.appointment_time).getTime() >= now.getTime())
          .sort((a, b) => parseAppointmentDate(a.appointment_date, a.appointment_time).getTime() - parseAppointmentDate(b.appointment_date, b.appointment_time).getTime())[0] || null;
        if (active) setAppointment(next);
      })
      .catch(() => { if (active) setAppointment(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
  }, [cameraOn]);

  async function testDevices() {
    setDeviceMessage("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setDeviceMessage("Camera and microphone access is unavailable in this browser or page context.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setCameraOn(true);
      setDeviceMessage("Camera and microphone are available on this device. This is only a local preview; no call has started.");
    } catch {
      setDeviceMessage("Access was denied or a camera/microphone could not be found. Check browser permissions and device settings.");
    }
  }

  function stopPreview() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    setDeviceMessage("Camera and microphone preview stopped.");
  }

  function checkConnection() {
    setNetworkMessage(navigator.onLine ? "Your device reports that it is online. This does not test call quality." : "Your device reports that it is offline. Check your Wi-Fi or mobile data.");
  }

  return (
    <main className="vc-workspace">
      <div className="vc-container">
        <header className="vc-page-heading">
          <div>
            <span className="vc-eyebrow"><Video size={15} /> Patient care</span>
            <h1>Video consultation</h1>
            <p>Prepare for your visit and keep your next steps together.</p>
          </div>
          <Link className="vc-find-link" href="/find-doctor">Find a doctor <ArrowRight size={16} /></Link>
        </header>

        <section className="vc-upcoming" aria-labelledby="vc-upcoming-title">
          <div className="vc-upcoming-main">
            <div className="vc-label"><CalendarDays size={15} /> Upcoming consultation</div>
            {loading ? <p className="vc-muted">Checking your appointments…</p> : appointment ? <>
              <h2 id="vc-upcoming-title">{appointment.doctor.name}</h2>
              <p className="vc-specialty">{appointment.doctor.specialization} <span>·</span> {appointment.doctor.clinic_name}</p>
              <div className="vc-appointment-meta"><span><Clock3 size={16} />{formatAppointmentDate(appointment.appointment_date, appointment.appointment_time)}</span><span><Stethoscope size={16} /> Appointment request</span></div>
              <p className="vc-confirm-note">Please confirm the appointment time with the clinic. Online video visits are not connected yet.</p>
            </> : <>
              <h2 id="vc-upcoming-title">No upcoming consultation yet</h2>
              <p className="vc-specialty">When you book an appointment, its details will appear here.</p>
              <Link className="vc-inline-link" href="/find-doctor">Browse doctors <ArrowRight size={15} /></Link>
            </>}
          </div>
          <div className="vc-call-panel">
            {cameraOn ? <div className="vc-preview-wrap"><video ref={videoRef} autoPlay muted playsInline aria-label="Local camera preview" /><button className="vc-stop-button" type="button" onClick={stopPreview}><X size={15} /> Stop preview</button></div> : <div className="vc-call-art"><span className="vc-art-orbit vc-art-orbit-one" /><span className="vc-art-orbit vc-art-orbit-two" /><div className="vc-device-circle"><Video size={35} /><span className="vc-pulse-dot" /></div><div className="vc-art-caption"><strong>Ready when you are</strong><small>Your device preview stays private to this browser.</small></div></div>}
            <div className="vc-call-actions">
              <button type="button" className="vc-button vc-button-disabled" disabled title="Online consultations are not connected yet"><Video size={17} /> Join consultation <span>Not available</span></button>
              <button type="button" className="vc-button vc-button-outline" onClick={testDevices}><MonitorCheck size={17} /> Test camera &amp; microphone</button>
            </div>
            {deviceMessage && <p className="vc-feedback" role="status">{deviceMessage}</p>}
          </div>
        </section>

        <section className="vc-section" aria-labelledby="vc-ready-title">
          <div className="vc-section-heading"><div className="vc-step">01</div><div><p className="vc-kicker">Before your visit</p><h2 id="vc-ready-title">Get ready for your consultation</h2></div></div>
          <div className="vc-ready-grid">
            <article className="vc-card vc-check-card"><div className="vc-card-title"><span className="vc-icon"><CheckCircle2 size={20} /></span><div><h3>Pre-consultation checklist</h3><p>{checklist.filter(Boolean).length} of {checklistItems.length} complete</p></div></div>
              <div className="vc-progress"><span style={{ width: `${(checklist.filter(Boolean).length / checklistItems.length) * 100}%` }} /></div>
              <ul className="vc-checklist">{checklistItems.map((item, index) => <li key={item}><button type="button" aria-pressed={checklist[index]} onClick={() => setChecklist((current) => current.map((checked, i) => i === index ? !checked : checked))}>{checklist[index] ? <Check size={17} /> : <Circle size={17} />}<span>{item}</span></button></li>)}</ul>
            </article>
            <article className="vc-card vc-questions-card"><div className="vc-card-title"><span className="vc-icon vc-icon-lavender"><FileText size={20} /></span><div><h3>Prepare questions</h3><p>Make a note of what you’d like to discuss.</p></div></div><label className="vc-sr-only" htmlFor="vc-questions">Questions for your consultation</label><textarea id="vc-questions" value={questions} onChange={(event) => setQuestions(event.target.value)} placeholder="For example: When should I expect symptoms to improve?" maxLength={1000} /><small className="vc-local-note">Saved only while this page is open · {questions.length}/1000</small></article>
            <article className="vc-card vc-upload-card"><div className="vc-card-title"><span className="vc-icon vc-icon-sky"><Paperclip size={20} /></span><div><h3>Upload reports</h3><p>Keep reports handy for your visit.</p></div></div><label className="vc-upload-zone"><Upload size={19} /><span>Select files</span><small>PDF or image · kept on this device only</small><input type="file" accept="application/pdf,image/*" multiple onChange={(event) => setFiles(Array.from(event.target.files || []).map((file) => file.name))} /></label>{files.length > 0 && <ul className="vc-file-list">{files.map((name) => <li key={name}><FileText size={14} />{name}</li>)}</ul>}<small className="vc-local-note">Files aren’t uploaded or shared.</small></article>
          </div>
        </section>

        <section className="vc-section" aria-labelledby="vc-during-title">
          <div className="vc-section-heading"><div className="vc-step">02</div><div><p className="vc-kicker">During your visit</p><h2 id="vc-during-title">During your consultation</h2></div></div>
          <div className="vc-during-grid">
            <article className="vc-card vc-notes-card"><div className="vc-card-title"><span className="vc-icon"><FileText size={20} /></span><div><h3>My consultation notes</h3><p>Jot down points to remember.</p></div></div><label className="vc-sr-only" htmlFor="vc-notes">Consultation notes</label><textarea id="vc-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Your notes stay in this page for now…" maxLength={2000} /><small className="vc-local-note">Private to this page · {notes.length}/2000</small></article>
            <article className="vc-card vc-docs-card"><div className="vc-card-title"><span className="vc-icon vc-icon-sky"><LockKeyhole size={20} /></span><div><h3>Shared documents</h3><p>Secure sharing is not connected.</p></div></div><div className="vc-unavailable"><ShieldCheck size={20} /><span>Documents from your care team will appear here when sharing is available.</span></div></article>
            <article className="vc-card vc-help-card"><div className="vc-card-title"><span className="vc-icon vc-icon-lavender"><Wifi size={20} /></span><div><h3>Connection help</h3><p>Check your device’s basic connection status.</p></div></div><button className="vc-small-button" type="button" onClick={checkConnection}><Activity size={16} /> Check internet status</button>{networkMessage && <p className="vc-feedback" role="status">{networkMessage}</p>}<p className="vc-local-note">This does not measure video-call quality.</p></article>
          </div>
        </section>

        <section className="vc-section vc-after-section" aria-labelledby="vc-after-title">
          <div className="vc-section-heading"><div className="vc-step">04</div><div><p className="vc-kicker">After your visit</p><h2 id="vc-after-title">After your consultation</h2></div></div>
          <div className="vc-after-grid">
            <article className="vc-after-card"><span className="vc-icon"><FileText size={20} /></span><div><h3>Consultation summary</h3><p>A summary will be available here if your clinic provides one.</p><span className="vc-status-pill"><Clock3 size={13} /> Not available yet</span></div></article>
            <article className="vc-after-card"><span className="vc-icon vc-icon-sky"><ShieldCheck size={20} /></span><div><h3>Prescription access</h3><p>Prescriptions are not connected to this page yet.</p><span className="vc-status-pill"><LockKeyhole size={13} /> Not connected</span></div></article>
            <article className="vc-after-card"><span className="vc-icon vc-icon-lavender"><Headphones size={20} /></span><div><h3>Follow-up reminders</h3><p>Follow-up scheduling will appear when clinic support is available.</p><span className="vc-status-pill"><Clock3 size={13} /> Not available yet</span></div></article>
          </div>
        </section>
        <p className="vc-disclaimer"><ShieldCheck size={15} /> This page helps you prepare for care. It does not provide live video calls, messaging or secure medical-record sharing.</p>
      </div>
    </main>
  );
}
