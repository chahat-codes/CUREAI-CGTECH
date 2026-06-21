"use client";

import { motion } from "framer-motion";
import { Zap, HeartPulse, Smartphone, Globe } from "lucide-react";

export default function WhyCureAIShort() {
  const points = [
    {
      title: "AI-Powered Matching",
      desc: "Connect with the right specialist based on intelligent symptom understanding.",
      icon: Zap,
    },
    {
      title: "Fast Recommendations",
      desc: "From symptom input to doctor discovery in under 30 seconds.",
      icon: HeartPulse,
    },
    {
      title: "Digital-First Records",
      desc: "Prescriptions, reports, and bills are instantly digitized and secured.",
      icon: Smartphone,
    },
    {
      title: "Accessible Anywhere",
      desc: "Consult with top-tier doctors regardless of your geographical location.",
      icon: Globe,
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-100 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-xs mb-3 block">Why Cure AI</span>
          <h2 className="text-3xl md:text-4xl font-outfit font-extrabold text-slate-900 mb-4">
            Built for better healthcare.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <point.icon className="w-5 h-5 text-[#0A66FF]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{point.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
