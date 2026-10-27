import { appointments, records } from "@/lib/data";

export default function DoctorDashboardPage() {
  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Doctor dashboard</p>
        <h1>Today’s care schedule</h1>
        <div className="dashboard-grid compact">
          <div><strong>Today’s appointments</strong><span>{appointments.length}</span></div>
          <div><strong>Upcoming</strong><span>8</span></div>
          <div><strong>Availability</strong><span>9 AM - 7 PM</span></div>
        </div>
        {appointments.map((item) => <div className="list-row" key={item.patient}>{item.time} · {item.patient} · {item.status}</div>)}
        <h2>Patient uploaded records</h2>
        {records.map((item) => <div className="list-row" key={item.title}>{item.title} · {item.type}</div>)}
      </section>
    </main>
  );
}
