import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Quote, Star } from "lucide-react";
import { doctors } from "@/lib/data";

export default async function DoctorProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doctor = doctors.find((item) => item.id === id);
  if (!doctor) notFound();

  return (
    <main className="page-shell">
      <section className="profile-hero">
        <div className="avatar large">{doctor.name.split(" ")[1][0]}</div>
        <div>
          <p className="eyebrow">{doctor.specialization}</p>
          <h1>{doctor.name}</h1>
          <p>{doctor.qualification} · {doctor.experience} experience</p>
          <p><MapPin size={16} /> {doctor.clinic}, {doctor.location}</p>
          <p><Star size={16} /> {doctor.rating} patient rating</p>
        </div>
        <Link className="button" href={`/booking?doctor=${doctor.id}`}>Book appointment</Link>
      </section>
      <section className="two-column">
        <div className="panel">
          <h2>Availability</h2>
          {doctor.availability.map((slot) => <div className="list-row" key={slot}><CalendarDays size={18} /> {slot}</div>)}
          <div className="fee profile-fee">Consultation fee: {doctor.fee}</div>
        </div>
        <div className="panel">
          <h2>Patient testimonials</h2>
          {doctor.testimonials.map((item) => <div className="list-row" key={item}><Quote size={18} /> {item}</div>)}
        </div>
      </section>
    </main>
  );
}
