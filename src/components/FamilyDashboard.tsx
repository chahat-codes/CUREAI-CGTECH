"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Calendar, HeartPulse, ChevronRight, Star } from "lucide-react";

type Member = {
  id: string;
  name: string;
  relation: string;
  age: number;
  img: number;
  score: number;
  scoreLabel: string;
  scoreColor: string;
  nextAppt: { date: string; doctor: string; spec: string } | null;
  conditions: string[];
  recentAlert: string | null;
};

const members: Member[] = [
  {
    id: "you",
    name: "You (Rahul)",
    relation: "Self",
    age: 28,
    img: 33,
    score: 82,
    scoreLabel: "Good",
    scoreColor: "text-emerald-600",
    nextAppt: { date: "Jun 20", doctor: "Dr. Sharma", spec: "General Physician" },
    conditions: [],
    recentAlert: null,
  },
  {
    id: "mom",
    name: "Sunita Verma",
    relation: "Mother",
    age: 54,
    img: 32,
    score: 68,
    scoreLabel: "Fair",
    scoreColor: "text-amber-600",
    nextAppt: { date: "Jun 18", doctor: "Dr. Desai", spec: "Cardiologist" },
    conditions: ["Hypertension", "Diabetes T2"],
    recentAlert: "BP reading was 145/92 yesterday",
  },
  {
    id: "dad",
    name: "Rajesh Verma",
    relation: "Father",
    age: 58,
    img: 59,
    score: 71,
    scoreLabel: "Good",
    scoreColor: "text-emerald-600",
    nextAppt: null,
    conditions: ["Cholesterol"],
    recentAlert: null,
  },
  {
    id: "son",
    name: "Arjun Verma",
    relation: "Son",
    age: 7,
    img: 11,
    score: 94,
    scoreLabel: "Excellent",
    scoreColor: "text-emerald-600",
    nextAppt: { date: "Jul 5", doctor: "Dr. Roy", spec: "Paediatrician" },
    conditions: [],
    recentAlert: null,
  },
];

export default function FamilyDashboard() {
  const [activeMember, setActiveMember] = useState("you");
  const member = members.find(m => m.id === activeMember)!;

  return (
    <section className="py-32 bg-[#F5FAFF] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(10,102,255,0.06),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white border border-blue-100 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Users className="w-4 h-4 text-[#0A66FF]" />
              <span className="text-sm font-semibold text-[#0A66FF]">Family Health Dashboard</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              One Account.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66FF] to-[#00C2FF]">
                Entire Family Protected.
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Manage your parents&apos; chronic conditions, children&apos;s vaccinations, and spouse&apos;s appointments — all from one account with individual health profiles.
            </p>

            <div className="space-y-5 mb-8">
              {[
                { icon: Users,     title: "Up to 6 family members",    desc: "Add parents, children, spouse, and siblings." },
                { icon: HeartPulse, title: "Individual health scores",  desc: "Each member gets their own AI-powered health profile." },
                { icon: Calendar,  title: "Unified appointment view",   desc: "See everyone's upcoming appointments in one calendar." },
                { icon: Star,      title: "Condition tracking",         desc: "Track chronic conditions and medications per member." },
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

          {/* Right — Family UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              {/* Member Selector */}
              <div className="p-5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Family Members</p>
                <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                  {members.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMember(m.id)}
                      className={`flex flex-col items-center space-y-1.5 transition-all ${activeMember === m.id ? "scale-105" : "opacity-60 hover:opacity-80"}`}
                    >
                      <div className={`relative w-12 h-12 rounded-full overflow-hidden border-3 transition-all ${activeMember === m.id ? "border-[#0A66FF] shadow-lg shadow-blue-500/20" : "border-slate-200"}`}
                        style={{ borderWidth: activeMember === m.id ? 3 : 2 }}
                      >
                        <img src={`https://i.pravatar.cc/100?img=${m.img}`} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{m.relation}</span>
                    </button>
                  ))}
                  <button className="flex flex-col items-center space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Add</span>
                  </button>
                </div>
              </div>

              {/* Member Detail */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMember}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-6 space-y-4"
                >
                  {/* Profile */}
                  <div className="flex items-center space-x-4">
                    <img src={`https://i.pravatar.cc/100?img=${member.img}`} className="w-14 h-14 rounded-full border-2 border-[#0A66FF]/20 shadow-md" alt={member.name} />
                    <div>
                      <h3 className="font-outfit font-bold text-slate-900 text-lg">{member.name}</h3>
                      <p className="text-slate-500 text-sm">{member.relation} • Age {member.age}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-3xl font-outfit font-black text-slate-900">{member.score}</p>
                      <p className={`text-xs font-bold ${member.scoreColor}`}>{member.scoreLabel}</p>
                    </div>
                  </div>

                  {/* Alert */}
                  {member.recentAlert && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 flex items-start space-x-3">
                      <HeartPulse className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 font-medium">{member.recentAlert}</p>
                    </div>
                  )}

                  {/* Conditions */}
                  {member.conditions.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {member.conditions.map(c => (
                          <span key={c} className="bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold px-3 py-1 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next Appointment */}
                  {member.nextAppt ? (
                    <div className="bg-gradient-to-r from-[#0A66FF] to-blue-700 rounded-2xl p-4 text-white flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-200" />
                        <div>
                          <p className="font-bold text-sm">{member.nextAppt.doctor}</p>
                          <p className="text-blue-200 text-xs">{member.nextAppt.spec} • {member.nextAppt.date}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-blue-200" />
                    </div>
                  ) : (
                    <button className="w-full py-3 border-2 border-dashed border-[#0A66FF]/30 text-[#0A66FF] rounded-2xl text-sm font-bold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Book Appointment</span>
                    </button>
                  )}

                  {member.conditions.length === 0 && !member.recentAlert && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 text-center">
                      <p className="text-emerald-700 text-sm font-semibold">✅ All health indicators are normal</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
