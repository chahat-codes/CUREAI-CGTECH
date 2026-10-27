"use client";

import { useState } from "react";
import { appointments } from "@/lib/data";

export default function ReceptionistDashboardPage() {
  const [statuses, setStatuses] = useState(appointments.map((item) => item.status));

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Receptionist dashboard</p>
        <h1>Appointment desk</h1>
        {appointments.map((item, index) => (
          <div className="status-row" key={item.patient}>
            <span>{item.time} · {item.patient} · {item.doctor}</span>
            <select value={statuses[index]} onChange={(event) => setStatuses(statuses.map((status, statusIndex) => statusIndex === index ? event.target.value : status))}>
              <option>Booked</option>
              <option>Confirmed</option>
              <option>Checked in</option>
              <option>Completed</option>
            </select>
          </div>
        ))}
        <h2>Manage doctor schedule</h2>
        <div className="list-row">Dr. Ananya Rao · 9 AM - 6 PM · 12 slots</div>
        <div className="list-row">Dr. Neel Shah · 2 PM - 8 PM · 7 slots</div>
      </section>
    </main>
  );
}
