"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertCircle, Flame, Pill, RefreshCw } from "lucide-react";

type TimeSlot = "morning" | "afternoon" | "night";

type Medicine = {
  name: string;
  dose: string;
  taken: { morning: boolean; afternoon: boolean; night: boolean };
  times: TimeSlot[];
  refillDays: number;
};

const initialMeds: Medicine[] = [
  { name: "Metformin 500mg",    dose: "1 tablet", taken: { morning: true, afternoon: false, night: false }, times: ["morning", "night"],    refillDays: 3 },
  { name: "Atorvastatin 10mg",  dose: "1 tablet", taken: { morning: false, afternoon: false, night: false }, times: ["night"],           refillDays: 14 },
  { name: "Vitamin D3 60K",     dose: "1 capsule", taken: { morning: true, afternoon: false, night: false }, times: ["morning"],         refillDays: 21 },
];

const slotColors: Record<TimeSlot, string> = {
  morning:   "bg-amber-50 border-amber-100 text-amber-700",
  afternoon: "bg-blue-50 border-blue-100 text-blue-700",
  night:     "bg-purple-50 border-purple-100 text-purple-700",
};

const slotEmoji: Record<TimeSlot, string> = {
  morning: "🌅",
  afternoon: "☀️",
  night: "🌙",
};

export default function MedicineReminders() {
  const [meds, setMeds] = useState(initialMeds);
  const [streak] = useState(7);

  const toggleTaken = (medIdx: number, slot: TimeSlot) => {
    setMeds(prev => prev.map((m, i) =>
      i === medIdx ? { ...m, taken: { ...m.taken, [slot]: !m.taken[slot] } } : m
    ));
  };

  const totalDoses = meds.reduce((sum, m) => sum + m.times.length, 0);
  const takenDoses = meds.reduce((sum, m) => sum + m.times.filter(t => m.taken[t]).length, 0);
  const adherence = Math.round((takenDoses / totalDoses) * 100);

  return (
    <section className="py-32 bg-[#F5FAFF] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(10,102,255,0.06),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white border border-amber-100 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-600">Medicine Reminders</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Never Miss a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-[#0A66FF]">
                Single Dose.
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Cure AI automatically creates reminders from your prescription, tracks daily adherence, warns about refills, and celebrates streaks to keep you consistent.
            </p>

            <div className="space-y-5">
              {[
                { icon: Bell,        title: "Smart reminders",     desc: "Notifications at exact medicine times, every day." },
                { icon: RefreshCw,   title: "Refill alerts",       desc: "Get reminded 7 days before your medicine runs out." },
                { icon: Flame,       title: "Adherence streaks",   desc: "Gamified streaks keep you motivated and consistent." },
                { icon: CheckCircle2, title: "Full history",       desc: "See every dose taken or missed over time." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#0A66FF]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Interactive Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-outfit font-bold text-slate-900 text-lg">Today&apos;s Medicines</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Sunday, 15 June 2025</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-semibold">Streak</p>
                    <p className="text-sm font-bold text-amber-600 flex items-center"><Flame className="w-4 h-4 mr-1" />{streak} days</p>
                  </div>
                </div>
              </div>

              {/* Adherence Ring */}
              <div className="p-6 bg-gradient-to-r from-[#F5FAFF] to-white border-b border-slate-100 flex items-center space-x-5">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle
                      cx="32" cy="32" r="26"
                      fill="none"
                      stroke={adherence === 100 ? "#22c55e" : adherence >= 60 ? "#0A66FF" : "#f59e0b"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - adherence / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-slate-900">{adherence}%</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-slate-900">{takenDoses}/{totalDoses} doses taken</p>
                  <p className="text-sm text-slate-500 mt-0.5">Today&apos;s adherence</p>
                  {takenDoses < totalDoses && (
                    <p className="text-xs text-[#0A66FF] font-semibold mt-1">{totalDoses - takenDoses} dose{totalDoses - takenDoses > 1 ? "s" : ""} remaining</p>
                  )}
                </div>
              </div>

              {/* Med List */}
              <div className="p-6 space-y-4">
                {meds.map((med, i) => (
                  <div key={i} className="border border-slate-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-50 p-2 rounded-xl">
                          <Pill className="w-4 h-4 text-[#0A66FF]" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{med.name}</p>
                          <p className="text-xs text-slate-500">{med.dose}</p>
                        </div>
                      </div>
                      {med.refillDays <= 7 && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${med.refillDays <= 3 ? "bg-rose-50 text-rose-500 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                          <AlertCircle className="w-3 h-3 inline mr-0.5" />
                          Refill in {med.refillDays}d
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {med.times.map(slot => (
                        <button
                          key={slot}
                          onClick={() => toggleTaken(i, slot)}
                          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            med.taken[slot]
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                              : slotColors[slot]
                          }`}
                        >
                          <span>{slotEmoji[slot]}</span>
                          <span className="capitalize">{slot}</span>
                          {med.taken[slot] && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
