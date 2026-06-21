"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Stethoscope, Syringe, FlaskConical, ChevronDown, Plus } from "lucide-react";

type TimelineEvent = {
  year: string;
  month: string;
  type: "illness" | "consultation" | "vaccination" | "report";
  title: string;
  doctor?: string;
  detail: string;
};

const events: TimelineEvent[] = [
  { year: "2024", month: "Oct", type: "consultation", title: "Seasonal Flu Consultation", doctor: "Dr. Rahul Sharma", detail: "Prescribed Azithromycin & Paracetamol. Recovered in 5 days." },
  { year: "2024", month: "Aug", type: "report", title: "Complete Blood Count (CBC)", detail: "All values normal. Hemoglobin 14.2 g/dL, WBC 7.2K/uL." },
  { year: "2024", month: "Mar", type: "vaccination", title: "Flu Vaccine (Annual)", detail: "Administered at Apollo Pharmacy. Next due: March 2025." },
  { year: "2023", month: "Nov", type: "consultation", title: "Eye Examination", doctor: "Dr. Priya Mehta", detail: "Mild myopia detected. Prescribed -0.5 corrective lenses." },
  { year: "2023", month: "Jun", type: "illness", title: "Viral Fever", doctor: "Dr. Anita Desai", detail: "High fever for 3 days. Full recovery with antivirals." },
  { year: "2022", month: "Dec", type: "report", title: "Lipid Profile & Thyroid", detail: "Vitamin D slightly low (28 ng/mL). Prescribed supplements." },
];

const typeConfig = {
  illness:      { color: "bg-rose-500",    light: "bg-rose-50 border-rose-100",     text: "text-rose-600",    icon: Calendar },
  consultation: { color: "bg-[#0A66FF]",   light: "bg-blue-50 border-blue-100",     text: "text-[#0A66FF]",   icon: Stethoscope },
  vaccination:  { color: "bg-emerald-500", light: "bg-emerald-50 border-emerald-100", text: "text-emerald-600", icon: Syringe },
  report:       { color: "bg-purple-500",  light: "bg-purple-50 border-purple-100", text: "text-purple-600",   icon: FlaskConical },
};

export default function HealthTimeline() {
  const [expanded, setExpanded] = useState<number | null>(0);
  const [filter, setFilter] = useState<"all" | TimelineEvent["type"]>("all");

  const filtered = filter === "all" ? events : events.filter(e => e.type === filter);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-50 rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-100 px-4 py-2 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Health Timeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Your Entire Health{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-[#0A66FF]">
                History, In One View.
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Every illness, consultation, vaccination, and report — organized in a beautiful timeline. Share it with any new doctor instantly.
            </p>

            {/* Filter buttons */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Filter by type</p>
              <div className="flex flex-wrap gap-2">
                {(["all", "illness", "consultation", "vaccination", "report"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                      filter === f
                        ? "bg-[#0A66FF] text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button className="mt-8 flex items-center space-x-2 px-6 py-3 bg-[#0A66FF] text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4" />
              <span>Add Health Event</span>
            </button>

            {/* Legend */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {(Object.entries(typeConfig) as [TimelineEvent["type"], typeof typeConfig[keyof typeof typeConfig]][]).map(([type, cfg]) => (
                <div key={type} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${cfg.color}`} />
                  <span className="text-sm text-slate-600 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — timeline */}
          <div className="relative">
            {/* Line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />

            <div className="space-y-6">
              <AnimatePresence>
                {filtered.map((event, i) => {
                  const cfg = typeConfig[event.type];
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={`${event.year}-${event.title}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start space-x-5 relative"
                    >
                      {/* Node */}
                      <div className={`w-10 h-10 rounded-full ${cfg.color} flex items-center justify-center shrink-0 shadow-md z-10 relative`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>

                      {/* Card */}
                      <div
                        className={`flex-1 border rounded-2xl overflow-hidden cursor-pointer hover:shadow-md transition-all ${cfg.light}`}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-xs font-bold ${cfg.text} uppercase tracking-wider`}>{event.type}</span>
                                <span className="text-xs text-slate-400">• {event.month} {event.year}</span>
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm">{event.title}</h4>
                              {event.doctor && <p className="text-xs text-slate-500 mt-0.5">with {event.doctor}</p>}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform mt-1 ${expanded === i ? "rotate-180" : ""}`} />
                          </div>
                          <AnimatePresence>
                            {expanded === i && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="text-sm text-slate-600 mt-3 pt-3 border-t border-white/60 leading-relaxed"
                              >
                                {event.detail}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
