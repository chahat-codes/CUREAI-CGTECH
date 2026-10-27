import Link from "next/link";
import { CalendarDays, MapPin, Star } from "lucide-react";
import type { Doctor } from "@/lib/data";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="doctor-card">
      <div>
        <div className="avatar">{doctor.name.split(" ")[1][0]}</div>
      </div>
      <div className="doctor-card-body">
        <div className="doctor-card-top">
          <div>
            <h3>{doctor.name}</h3>
            <p>{doctor.qualification}</p>
          </div>
          <span className="rating"><Star size={15} /> {doctor.rating}</span>
        </div>
        <p className="strong">{doctor.specialization} · {doctor.experience}</p>
        <p><MapPin size={15} /> {doctor.clinic}, {doctor.location}</p>
        <p><CalendarDays size={15} /> Next: {doctor.availability[0]}</p>
        <div className="card-actions">
          <span className="fee">{doctor.fee}</span>
          <Link className="button secondary" href={`/doctors/${doctor.id}`}>View profile</Link>
          <Link className="button" href={`/booking?doctor=${doctor.id}`}>Book</Link>
        </div>
      </div>
    </article>
  );
}
