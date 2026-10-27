import { appointments, doctors } from "@/lib/data";

export default function AdminDashboardPage() {
  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Admin dashboard</p>
        <h1>Clinic operations</h1>
        <div className="admin-grid">
          <button>Add doctor</button>
          <button>Edit doctor</button>
          <button>Remove doctor</button>
          <button>Manage clinic details</button>
        </div>
        <h2>Doctors</h2>
        {doctors.map((doctor) => <div className="list-row" key={doctor.id}>{doctor.name} · {doctor.specialization} · {doctor.clinic}</div>)}
        <h2>All appointments</h2>
        {appointments.map((item) => <div className="list-row" key={item.patient}>{item.patient} · {item.doctor} · {item.status}</div>)}
        <h2>Users</h2>
        <div className="list-row">Meera Nair · Patient</div>
        <div className="list-row">Cure AI Front Desk · Receptionist</div>
      </section>
    </main>
  );
}
