"use client";

import { motion } from "framer-motion";
import { Zap, HeartPulse, Smartphone, Globe } from "lucide-react";

export default function WhyCureAI() {
  const features = [
    {
      title: "AI-Powered Matching",
      desc: "98% accuracy specialist recommendations.",
      icon: Zap,
      colSpan: "md:col-span-1",
      bg: "bg-slate-50",
      color: "text-slate-600",
      border: "border-slate-200"
    },
    {
      title: "Fast Recommendations",
      desc: "From symptom input to doctor discovery in under 30 seconds.",
      icon: HeartPulse,
      colSpan: "md:col-span-2",
      bg: "bg-rose-50",
      color: "text-rose-600",
      border: "border-rose-100"
    },
    {
      title: "Digital First",
      desc: "Prescriptions, reports, and bills are instantly digitized.",
      icon: Smartphone,
      colSpan: "md:col-span-2",
      bg: "bg-purple-50",
      color: "text-purple-600",
      border: "border-purple-100"
    },
    {
      title: "Accessible Anywhere",
      desc: "Consult with top-tier doctors regardless of your geographical location.",
      icon: Globe,
      colSpan: "md:col-span-1",
      bg: "bg-cyan-50",
      color: "text-cyan-600",
      border: "border-cyan-100"
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-4">
            Why Choose Cure AI?
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-sans">
            We are redefining the healthcare experience by combining advanced artificial intelligence with human medical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`p-8 rounded-3xl border ${feature.border} ${feature.colSpan} hover:shadow-xl transition-shadow bg-white relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} rounded-bl-full -mr-8 -mt-8 opacity-50 transition-transform group-hover:scale-110`} />
              
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 relative z-10`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold font-outfit text-slate-900 mb-2 relative z-10">{feature.title}</h3>
              <p className="text-slate-600 font-sans relative z-10">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
