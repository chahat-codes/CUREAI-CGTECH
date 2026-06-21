"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Syringe, Eye, Heart, Smile, CheckCircle2, AlertCircle, Calendar, ChevronRight, Shield } from "lucide-react";

type Status = "done" | "due-soon" | "overdue" | "upcoming";

type Reminder = {
  icon: React.ElementType;
  title: string;
  desc: string;
  dueDate: string;
  status: Status;
  color: string;
};

const reminders: Reminder[] = [
  { icon: Syringe, title: "Flu Vaccine (Annual)", desc: "Recommended yearly for all adults", dueDate: "Due: Jul 2025", status: "due-soon", color: "text-amber-500 bg-amber-50 border-amber-100" },
  { icon: Smile, title: "Dental Checkup", desc: "Last visit: 8 months ago", dueDate: "Overdue since: Feb 2025", status: "overdue", color: "text-rose-500 bg-rose-50 border-rose-100" },
  { icon: Eye, title: "Eye Examination", desc: "Annual vision test recommended", dueDate: "Due: Sep 2025", status: "upcoming", color: "text-blue-500 bg-blue-50 border-blue-100" },
  { icon: Heart, title: "Cardiac Screening", desc: "Age-appropriate preventive check", dueDate: "Due: Dec 2025", status: "upcoming", color: "text-purple-500 bg-purple-50 border-purple-100" },
  { icon: Syringe, title: "Typhoid Vaccine", desc: "Booster every 2–3 years", dueDate: "Completed: Jan 2024 ✓", status: "done", color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
];

const statusConfig: Record<Status, { label: string; labelColor: string; badge: string }> = {
  "done":      { label: "Completed",  labelColor: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  "due-soon":  { label: "Due Soon",   labelColor: "text-amber-600",   badge: "bg-amber-100 text-amber-700" },
  "overdue":   { label: "Overdue!",   labelColor: "text-rose-600",    badge: "bg-rose-100 text-rose-700" },
  "upcoming":  { label: "Upcoming",   labelColor: "text-blue-600",    badge: "bg-blue-100 text-blue-700" },
};

const healthChecks = [
  { age: "18–30", checks: ["Blood Pressure", "Blood Sugar", "BMI", "Vision"] },
  { age: "31–45", checks: ["Lipid Profile", "Thyroid", "ECG", "Dental"] },
  { age: "46–60", checks: ["Colonoscopy", "Bone Density", "Mammogram", "Cardiac Stress Test"] },
];

export default function PreventiveCare() {
  const [scheduledIdx, setScheduledIdx] = useState<number[]>([]);

  const schedule = (i: number) => {
    setScheduledIdx(prev => prev.includes(i) ? prev : [...prev, i]);
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Preventive Healthcare</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-5 tracking-tight">
            Prevention is Better{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-[#0A66FF]">
              Than Cure.
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Cure AI tracks your vaccination schedule, sends reminders for overdue checkups, and creates a personalised preventive health calendar based on your age.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Left: Reminder Cards */}
          <div>
            <h3 className="font-outfit font-bold text-slate-900 text-xl mb-5 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-[#0A66FF]" /> Your Health Reminders
            </h3>
            <div className="space-y-3">
              {reminders.map((r, i) => {
                const cfg = statusConfig[r.status];
                const isScheduled = scheduledIdx.includes(i);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-center space-x-4 p-4 border rounded-2xl transition-all hover:shadow-md ${r.color}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.color.includes("emerald") ? "bg-emerald-100" : r.color.includes("amber") ? "bg-amber-100" : r.color.includes("rose") ? "bg-rose-100" : r.color.includes("blue") ? "bg-blue-100" : "bg-purple-100"}`}>
                      <r.icon className={`w-5 h-5 ${r.color.split(" ")[0]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-0.5">
                        <p className="font-bold text-slate-900 text-sm truncate">{r.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-slate-500">{r.desc}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${cfg.labelColor}`}>{r.dueDate}</p>
                    </div>
                    {r.status !== "done" && (
                      <button
                        onClick={() => schedule(i)}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isScheduled
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-white shadow-sm hover:shadow-md border border-slate-200 text-slate-700"
                        }`}
                      >
                        {isScheduled ? <><CheckCircle2 className="w-3 h-3 inline mr-0.5" /> Booked</> : "Schedule"}
                      </button>
                    )}
                    {r.status === "done" && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Age-Based Calendar */}
          <div>
            <h3 className="font-outfit font-bold text-slate-900 text-xl mb-5 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#0A66FF]" /> Age-Based Checkup Calendar
            </h3>
            <div className="space-y-4">
              {healthChecks.map((group, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-5 border ${i === 0 ? "border-[#0A66FF] bg-blue-50 shadow-md" : "border-slate-100 bg-white"}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${i === 0 ? "bg-[#0A66FF] text-white" : "bg-slate-100 text-slate-600"}`}>
                      Age {group.age}
                    </span>
                    {i === 0 && <span className="text-[10px] font-bold text-[#0A66FF] bg-white px-2 py-1 rounded-full border border-blue-100">Your Group</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {group.checks.map(c => (
                      <div key={c} className="flex items-center space-x-2">
                        <ChevronRight className={`w-3 h-3 shrink-0 ${i === 0 ? "text-[#0A66FF]" : "text-slate-400"}`} />
                        <span className={`text-sm font-medium ${i === 0 ? "text-slate-800" : "text-slate-500"}`}>{c}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Tip box */}
              <div className="bg-gradient-to-r from-[#0A66FF] to-blue-700 rounded-2xl p-5 text-white">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-200 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm mb-1">AI Health Tip</p>
                    <p className="text-blue-100 text-xs leading-relaxed">
                      Regular preventive checkups can detect 70% of chronic diseases in their early stages when they&apos;re most treatable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
