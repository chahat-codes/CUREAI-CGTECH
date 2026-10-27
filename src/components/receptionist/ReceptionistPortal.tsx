"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Activity, Bell, CalendarDays, CheckCircle2, ChevronRight, Clock3, LayoutDashboard, ListChecks, LogOut, Menu, PhoneCall, UsersRound, X } from "lucide-react";
import { averageActualWaitMinutes, DEFAULT_BOOKING_CAPACITY, loadDemoState, localDateKey, makeAppointmentPatch, saveDemoState, type DemoAppointment, type ReceptionistDemoState } from "@/lib/receptionist/demo-service";
import { logout } from "@/lib/auth";

type PortalContextValue = { state: ReceptionistDemoState; update: (next: ReceptionistDemoState) => void; ready: boolean; notice: string; setNotice: (value: string) => void };
const PortalContext = createContext<PortalContextValue | null>(null);
export function useReceptionistDemo() { const context = useContext(PortalContext); if (!context) throw new Error("Receptionist portal context is missing"); return context; }

const nav = [
  { label: "Dashboard", href: "/clinics/receptionist", icon: LayoutDashboard },
  { label: "Appointments", href: "/clinics/receptionist/appointments", icon: CalendarDays },
  { label: "Live Queue", href: "/clinics/receptionist/queue", icon: ListChecks },
  { label: "Booking Capacity", href: "/clinics/receptionist/capacity", icon: Activity },
];

export default function ReceptionistPortal({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ReceptionistDemoState>({ appointments: [], capacities: {} });
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    // Load browser-only demo state after hydration to avoid a server/client storage mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadDemoState());
    setReady(true);
  }, []);
  const update = (next: ReceptionistDemoState) => { setState(next); saveDemoState(next); };
  const contextValue = useMemo(() => ({ state, update, ready, notice, setNotice }), [state, ready, notice]);
  return <PortalContext.Provider value={contextValue}>
    <div className="rp-portal">
      <header className="rp-header">
        <Link className="rp-brand" href="/" aria-label="Cure AI home"><Image src="/cure-ai-logo-mark.png" alt="" width={42} height={42} /><span>cure <b>ai</b></span></Link>
        <span className="rp-portal-title">Receptionist Portal</span>
        <div className="rp-header-right"><span className="rp-clinic-name">Sunrise Multispeciality Clinic</span><button className="rp-icon-button" type="button" aria-label="Notifications"><Bell size={17} /><i /></button><span className="rp-user-pill"><b>R</b> Receptionist</span><button className="rp-logout-button" type="button" onClick={async () => { await logout(); window.location.href = "/login"; }}><LogOut size={15} /><span>Logout</span></button><button className="rp-icon-button rp-mobile-menu-toggle" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
      </header>
      <div className="rp-body">
        <aside className={`rp-sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Receptionist navigation">
          <nav>{nav.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={() => setMobileOpen(false)} aria-current={pathname === href ? "page" : undefined} className={pathname === href ? "active" : ""}><Icon size={17} /><span>{label}</span></Link>)}</nav>
          <div className="rp-sidebar-bottom"><span>Cure AI <b>•</b> Clinic Operations</span><Link href="/" aria-label="Exit portal"><LogOut size={15} /> Exit portal</Link></div>
        </aside>
        <main className="rp-main">
          {notice && <div className="rp-toast" role="status"><CheckCircle2 size={17} />{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice("")}><X size={15} /></button></div>}
          {children}
        </main>
      </div>
    </div>
  </PortalContext.Provider>;
}

export function DashboardPage() {
  const { state, update, ready, setNotice } = useReceptionistDemo();
  const today = localDateKey();
  const items = state.appointments.filter((item) => item.date === today);
  const waiting = items.filter((item) => ["Waiting", "Checked in"].includes(item.status));
  const current = items.find((item) => item.status === "In consultation");
  const next = waiting[0];
  const slots = Math.max(0, DEFAULT_BOOKING_CAPACITY - items.length);
  const average = averageActualWaitMinutes(state.appointments);
  const stats = [
    { label: "Today’s Appointments", value: items.length, note: "Sample data for today", icon: CalendarDays },
    { label: "Waiting Patients", value: waiting.length, note: "Checked in and waiting", icon: UsersRound },
    { label: "Average Waiting Time", value: average === null ? "Not enough data" : `${average} min`, note: "Historical sample visits", icon: Clock3 },
    { label: "Available Booking Slots", value: slots, note: `Demo limit: ${DEFAULT_BOOKING_CAPACITY} bookings`, icon: Activity },
  ];
  const checkIn = (appointment: DemoAppointment) => {
    if (appointment.status !== "Scheduled") return;
    const time = new Date();
    const checkedInAt = `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;
    update(makeAppointmentPatch(state, appointment.id, { status: "Waiting", checkedInAt, queuePosition: waiting.length + 1 }));
    setNotice(`${appointment.patient} checked in. Demo queue updated.`);
  };
  const callNext = () => {
    if (!next) { setNotice("There are no checked-in patients waiting."); return; }
    const queued = state.appointments.filter((item) => item.date === today && item.status === "Waiting");
    const nextState = makeAppointmentPatch(state, next.id, { status: "In consultation", called: false, consultationStartedAt: new Date().toTimeString().slice(0, 5), queuePosition: null });
    update({ ...nextState, appointments: nextState.appointments.map((item) => item.id !== next.id && item.status === "Waiting" ? { ...item, queuePosition: Math.max(1, queued.findIndex((queuedItem) => queuedItem.id === item.id)) } : item) });
    setNotice(`${next.patient} moved to consultation in demo mode.`);
  };
  return <>
    <div className="rp-page-heading"><div><h1>Receptionist Dashboard</h1><p>Manage today’s appointments and keep the patient queue moving.</p><span className="rp-demo-label"><i /> Demo data · Changes stay in this browser</span></div><div className="rp-date-chip">Today <b>•</b> {new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit" }).format(new Date())}</div></div>
    {!ready ? <div className="rp-panel rp-loading">Loading demo dashboard…</div> : <>
      <div className="rp-stats">{stats.map(({ label, value, note, icon: Icon }) => <article className="rp-stat" key={label}><div className="rp-stat-top"><span className="rp-stat-icon"><Icon size={17} /></span><span>{label}</span></div><strong className={typeof value === "string" && value.length > 7 ? "rp-stat-text" : ""}>{value}</strong><small>{note}</small></article>)}</div>
      <div className="rp-dashboard-grid">
        <section className="rp-panel rp-appointments-panel"><div className="rp-panel-heading"><div><h2>Today’s Appointments</h2><p>Sample appointments · not clinic records</p></div><Link href="/clinics/receptionist/appointments">All appointments <ChevronRight size={15} /></Link></div>
          <div className="rp-table-wrap"><table><thead><tr><th>Patient</th><th>Doctor</th><th>Time</th><th>Status</th><th>Action</th></tr></thead><tbody>{items.slice(0, 5).map((appointment) => <tr key={appointment.id}><td>{appointment.patient}</td><td>{appointment.doctor}</td><td>{appointment.time}</td><td><StatusBadge appointment={appointment} /></td><td>{appointment.status === "Scheduled" ? <button className="rp-table-action" type="button" onClick={() => checkIn(appointment)}>Check in</button> : <Link className="rp-table-action rp-link-action" href="/clinics/receptionist/appointments">View <ChevronRight size={13} /></Link>}</td></tr>)}</tbody></table></div>
        </section>
        <section className="rp-panel rp-queue-panel"><div className="rp-panel-heading"><div><h2>Live Queue</h2><p>Demo queue · estimated wait uses 15 min per patient</p></div><Link href="/clinics/receptionist/queue">Full queue <ChevronRight size={15} /></Link></div>
          <div className="rp-current-next"><div><small>Currently consulting</small><strong>{current?.patient || "No active consultation"}</strong><span>{current ? current.doctor : "—"}</span></div><div><small>Next patient</small><strong>{next?.patient || "No patient waiting"}</strong><span>{next ? next.time : "—"}</span></div></div>
          {waiting.length ? <div className="rp-queue-list">{waiting.slice(0, 4).map((appointment, index) => <div className="rp-queue-row" key={appointment.id}><b className="rp-position">{String(index + 1).padStart(2, "0")}</b><span>{appointment.patient}</span><small>{appointment.time}</small><strong>~{(index + 1) * appointment.expectedMinutes} min</strong></div>)}</div> : <p className="rp-empty-inline">No checked-in patients in the queue.</p>}
          <button className="rp-primary-button rp-call-next" type="button" onClick={callNext} disabled={!next}><PhoneCallIcon /> Call next patient</button>
        </section>
      </div>
      <p className="rp-note"><Bell size={14} /> Urgent situations require immediate contact with the clinic’s clinical team or emergency services.</p>
    </>}
  </>;
}

function PhoneCallIcon() { return <PhoneCall size={15} />; }
export function StatusBadge({ appointment }: { appointment: DemoAppointment }) { const status = appointment.emergency ? "Emergency" : appointment.called && appointment.status === "Waiting" ? "Called" : appointment.status; return <span className={`rp-status rp-status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>; }
