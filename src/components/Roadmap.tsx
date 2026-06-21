"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Milestone } from "lucide-react";

export default function Roadmap() {
  const phases = [
    {
      phase: "Phase 1",
      title: "Doctor Discovery & Booking",
      desc: "Instant search, verified reviews, and real-time appointment scheduling.",
      status: "completed"
    },
    {
      phase: "Phase 2",
      title: "AI Healthcare Assistant",
      desc: "Intelligent symptom parsing and automated specialist matching.",
      status: "completed"
    },
    {
      phase: "Phase 3",
      title: "Digital Health Records",
      desc: "Secure vault for prescriptions, lab reports, and medical imaging.",
      status: "in-progress"
    },
    {
      phase: "Phase 4",
      title: "Hospital & Clinic Integration",
      desc: "B2B SaaS tools for healthcare providers to manage patient inflow.",
      status: "upcoming"
    },
    {
      phase: "Phase 5",
      title: "Tier 2 & Tier 3 Expansion",
      desc: "Bringing accessible digital healthcare to underserved communities across India.",
      status: "upcoming"
    }
  ];

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block">Our Vision</span>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6">
            The Journey Ahead
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-sans">
            We are systematically building the infrastructure to power the next generation of accessible healthcare.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2" />
          
          <div className="space-y-12">
            {phases.map((phase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full border-4 border-slate-50 bg-white -translate-x-1/2 flex items-center justify-center z-10 shadow-sm">
                  {phase.status === "completed" && <CheckCircle2 className="w-6 h-6 text-[#0A66FF]" />}
                  {phase.status === "in-progress" && <div className="w-3 h-3 bg-[#00C2FF] rounded-full animate-pulse" />}
                  {phase.status === "upcoming" && <CircleDashed className="w-5 h-5 text-slate-300" />}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                  <div className={`bg-white p-6 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                    phase.status === "completed" ? 'border-[#0A66FF]/20 shadow-md' :
                    phase.status === "in-progress" ? 'border-[#00C2FF] shadow-lg shadow-[#00C2FF]/10' :
                    'border-slate-200 shadow-sm opacity-80'
                  }`}>
                    <span className={`text-xs font-bold tracking-wider uppercase mb-2 block ${
                      phase.status === "completed" ? 'text-[#0A66FF]' :
                      phase.status === "in-progress" ? 'text-[#00C2FF]' :
                      'text-slate-400'
                    }`}>
                      {phase.phase}
                    </span>
                    <h3 className="text-xl font-bold font-outfit text-slate-900 mb-2">{phase.title}</h3>
                    <p className="text-slate-600 font-sans text-sm">{phase.desc}</p>
                    
                    {phase.status === "in-progress" && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-[#00C2FF]">
                        <Milestone className="w-4 h-4 mr-1" />
                        Currently Building
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
