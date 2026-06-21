"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ShieldCheck, Lock, Clock, CalendarCheck, Network } from "lucide-react";

export default function Trust() {
  const cards = [
    {
      title: "AI-Powered Matching",
      description: "Intelligent symptom analysis connects you to the right specialist instantly.",
      icon: BrainCircuit,
      iconColor: "text-blue-600",
      bg: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "Trusted Doctor Network",
      description: "Verified top-tier healthcare professionals across all medical fields.",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      bg: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      title: "Secure Health Records",
      description: "End-to-end encrypted storage for your personal medical history.",
      icon: Lock,
      iconColor: "text-violet-600",
      bg: "bg-violet-50",
      borderColor: "border-violet-100"
    },
    {
      title: "Faster Healthcare Access",
      description: "Skip the waiting room. Connect with doctors in under 30 seconds.",
      icon: Clock,
      iconColor: "text-amber-600",
      bg: "bg-amber-50",
      borderColor: "border-amber-100"
    },
    {
      title: "Smart Appointments",
      description: "Automated scheduling, reminders, and seamless follow-ups.",
      icon: CalendarCheck,
      iconColor: "text-rose-600",
      bg: "bg-rose-50",
      borderColor: "border-rose-100"
    },
    {
      title: "Digital Ecosystem",
      description: "One unified platform for patients, doctors, and clinics.",
      icon: Network,
      iconColor: "text-cyan-600",
      bg: "bg-cyan-50",
      borderColor: "border-cyan-100"
    }
  ];

  return (
    <section className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block">Trust & Infrastructure</span>
          <h2 className="text-3xl md:text-4xl font-outfit font-bold text-slate-900 mb-6">
            Built for Modern Healthcare
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Experience a secure, fast, and intelligent medical ecosystem designed completely around patient needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-[2rem] border border-slate-100 bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle gradient hover background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className={`relative w-14 h-14 rounded-2xl ${card.bg} border ${card.borderColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <card.icon className={`h-7 w-7 ${card.iconColor}`} />
              </div>
              
              <h3 className="relative text-xl font-bold text-slate-900 mb-3 font-outfit">{card.title}</h3>
              <p className="relative text-slate-600 leading-relaxed font-sans text-sm">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
