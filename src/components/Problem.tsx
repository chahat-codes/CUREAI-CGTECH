"use client";

import { motion } from "framer-motion";
import { FileQuestion, Hourglass, Files, MapPinned, MonitorX } from "lucide-react";

export default function Problem() {
  const problems = [
    {
      title: "Confusing Specializations",
      desc: "Patients struggle to determine the right specialist for their symptoms, causing delays and wrong bookings.",
      icon: FileQuestion,
      colSpan: "md:col-span-2 lg:col-span-2"
    },
    {
      title: "Long Waiting Times",
      desc: "Traditional clinic systems lead to hours of unpredictable waiting room delays.",
      icon: Hourglass,
      colSpan: "md:col-span-1 lg:col-span-1"
    },
    {
      title: "Scattered Records",
      desc: "Prescriptions, lab reports, and medical scans are lost across multiple physical files and apps.",
      icon: Files,
      colSpan: "md:col-span-1 lg:col-span-1"
    },
    {
      title: "Poor Accessibility",
      desc: "Quality healthcare remains geographically bound, making it hard for non-metro patients.",
      icon: MapPinned,
      colSpan: "md:col-span-1 lg:col-span-1"
    },
    {
      title: "Outdated Systems",
      desc: "The lack of modern digital tools causes friction for both medical professionals and patients.",
      icon: MonitorX,
      colSpan: "md:col-span-1 lg:col-span-1"
    }
  ];

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-100/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm mb-4 block">The Problem</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight">
              Healthcare Shouldn&apos;t <br className="hidden sm:block"/> Be This Difficult.
            </h2>
            <p className="text-xl text-slate-600 font-sans leading-relaxed">
              The traditional medical experience is broken. Patients face constant friction when trying to get the correct care they need, exactly when they need it.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300 ${prob.colSpan} relative overflow-hidden group`}
            >
              {/* Background abstract icon for premium feel */}
              <div className="absolute -top-10 -right-10 p-8 opacity-5 transform group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none">
                <prob.icon className="w-48 h-48 text-slate-900" />
              </div>
              
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 border border-red-100 group-hover:scale-110 transition-transform duration-300">
                <prob.icon className="w-6 h-6 text-red-500" />
              </div>
              
              <h3 className="text-xl lg:text-2xl font-bold font-outfit text-slate-900 mb-3 relative z-10">
                {prob.title}
              </h3>
              <p className="text-slate-600 font-sans relative z-10 leading-relaxed">
                {prob.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
