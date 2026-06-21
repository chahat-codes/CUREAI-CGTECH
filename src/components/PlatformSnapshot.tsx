"use client";

import { motion } from "framer-motion";
import { Bot, Calendar, FolderHeart, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PlatformSnapshot() {
  const cards = [
    {
      title: "AI Doctor Finder",
      desc: "Smart matchmaking to find the exact specialist you need based on symptoms.",
      icon: Bot,
      color: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-200"
    },
    {
      title: "Smart Appointments",
      desc: "Instant booking with real-time availability and smart reminders.",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      border: "border-emerald-200"
    },
    {
      title: "Digital Health Vault",
      desc: "A secure, encrypted space for all your medical history and reports.",
      icon: FolderHeart,
      color: "text-purple-600",
      bg: "bg-purple-100",
      border: "border-purple-200"
    },
    {
      title: "AI Health Assistant",
      desc: "24/7 symptom guidance and medical explanation powered by Cure AI.",
      icon: Activity,
      color: "text-rose-600",
      bg: "bg-rose-100",
      border: "border-rose-200"
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block">Platform Overview</span>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight">
            One platform for your <br className="hidden sm:block"/> entire healthcare journey.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`p-6 rounded-2xl border ${card.border} bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h3 className="font-outfit font-bold text-lg text-slate-900 mb-2 group-hover:text-[#0A66FF] transition-colors">{card.title}</h3>
              <p className="text-slate-500 font-sans text-sm leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/features"
            className="inline-flex items-center space-x-2 text-[#0A66FF] font-bold hover:text-blue-800 transition-colors bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-100"
          >
            <span>View all 20+ features</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
