import Link from "next/link";
import type { ComponentType } from "react";
import {
  Bot,
  Brain,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  Hospital,
  LayoutDashboard,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
} from "lucide-react";
import { DoctorCard } from "@/components/DoctorCard";
import { Section } from "@/components/Section";
import { doctors } from "@/lib/data";

const features: Array<[
  string,
  string,
  ComponentType<{ size?: number }>
]> = [
  ["Describe symptoms", "Start with plain-language symptoms instead of guessing which department to visit.", ClipboardList],
  ["Get AI doctor-type suggestion", "Cure AI maps your concern to the most relevant specialist for the next step.", Brain],
  ["View trusted doctor profiles", "Compare specialization, experience, clinic details, fees, and patient feedback.", UserRoundCheck],
  ["Book appointments easily", "Choose a doctor and reserve a clear appointment slot up to 7 days ahead.", CalendarCheck],
  ["Store records in My Vault", "Keep prescriptions, lab reports, and consultation notes ready for every visit.", LockKeyhole],
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Cure AI consultation MVP</p>
          <h1>Find the right doctor with AI-powered guidance</h1>
          <p>
            Describe your symptoms, discover the right specialist, book appointments, and keep
            your health records safely in one place.
          </p>
          <div className="search-shell">
            <Search size={20} />
            <input placeholder="Search doctors, symptoms, specialities, or hospitals" />
            <Link className="button" href="/symptoms">Start search</Link>
          </div>
          <div className="hero-actions">
            <Link className="button" href="/symptoms">Try AI assistant <ChevronRight size={17} /></Link>
            <Link className="button secondary" href="/doctors/ananya-rao">View doctor profile</Link>
          </div>
          <div className="trust-row" aria-label="Cure AI trust signals">
            <span><ShieldCheck size={17} /> Verified doctors</span>
            <span><CalendarClock size={17} /> 7-day booking</span>
            <span><LockKeyhole size={17} /> Secure health vault</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Doctor consultation and Cure AI product preview">
          <div className="consult-scene">
            <div className="doctor-figure">
              <div className="doctor-head" />
              <div className="doctor-coat"><Stethoscope size={31} /></div>
            </div>
            <div className="patient-card">
              <span><HeartPulse size={16} /> Symptoms added</span>
              <strong>Fever, cough, fatigue</strong>
            </div>
          </div>
          <div className="ai-card">
            <div className="visual-icon"><Bot size={22} /></div>
            <div>
              <span>AI suggestion</span>
              <strong>General Physician</strong>
            </div>
          </div>
          <div className="doctor-preview-card">
            <div className="avatar">A</div>
            <div>
              <strong>Dr. Ananya Rao</strong>
              <span>Internal Medicine · 11 years</span>
            </div>
            <span className="available-chip">Today 4:30 PM</span>
          </div>
          <div className="visual-grid">
            <div><CalendarCheck size={18} /><b>Book visit</b><small>Choose slot</small></div>
            <div><FileText size={18} /><b>My Vault</b><small>3 records ready</small></div>
          </div>
        </div>
      </section>

      <Section eyebrow="How Cure AI helps" title="Simple guidance from symptoms to appointment">
        <div className="help-grid">
          {features.map(([title, copy, Icon]) => (
            <article className="feature-card" key={title as string}>
              <span className="feature-icon"><Icon size={23} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </Section>

      <section className="spotlight-section">
        <div className="spotlight-copy">
          <p className="eyebrow">AI Symptom Assistant</p>
          <h2>Not sure which doctor to visit?</h2>
          <p>
            Cure AI helps you understand the right specialist based on your symptoms, then
            shows matching doctor profiles so your next step feels clear.
          </p>
          <Link className="button" href="/symptoms">Describe symptoms</Link>
        </div>
        <div className="assistant-graphic" aria-label="AI symptom assistant preview">
          <div className="message patient-message">I have chest tightness and breathlessness.</div>
          <div className="message ai-message"><Sparkles size={16} /> Cardiologist may be relevant</div>
          <div className="mini-specialist-card">
            <HeartPulse size={22} />
            <div>
              <strong>Cardiology</strong>
              <span>Heart, blood pressure, palpitations</span>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Doctor Discovery" title="Compare trusted doctors with clarity">
        <p className="section-copy">
          Compare doctors by specialization, experience, availability, hospital details,
          consultation fee, and patient testimonials.
        </p>
        <div className="doctor-list">
          {doctors.slice(0, 3).map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </div>
      </Section>

      <section className="product-grid-section">
        <article className="product-panel vault-panel">
          <div>
            <p className="eyebrow">My Vault</p>
            <h2>Health records, organized for every consultation</h2>
            <p>
              Keep prescriptions, lab reports, and previous consultation records organized
              in your secure health vault.
            </p>
          </div>
          <div className="vault-graphic" aria-label="Health record vault preview">
            <div className="vault-lock"><LockKeyhole size={28} /></div>
            <div className="record-strip"><FileText size={18} /> Lab report</div>
            <div className="record-strip"><ClipboardList size={18} /> Prescription</div>
            <div className="record-strip"><ShieldCheck size={18} /> Consultation note</div>
          </div>
        </article>

        <article className="product-panel dashboard-panel">
          <div>
            <p className="eyebrow">Dashboards</p>
            <h2>Operations tools for clinics and care teams</h2>
            <p>
              Separate dashboards for doctors, receptionists, and admins to manage
              appointments, schedules, and patient records smoothly.
            </p>
          </div>
          <div className="dashboard-preview" aria-label="Dashboard preview cards">
            <div><LayoutDashboard size={20} /><strong>Doctor</strong><span>Today’s appointments</span></div>
            <div><CalendarClock size={20} /><strong>Reception</strong><span>Check-ins and status</span></div>
            <div><Hospital size={20} /><strong>Admin</strong><span>Doctors and clinics</span></div>
          </div>
        </article>
      </section>
    </main>
  );
}
