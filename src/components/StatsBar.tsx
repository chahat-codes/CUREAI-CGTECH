"use client";

import { motion } from "framer-motion";
import { Users, Stethoscope, CalendarCheck, Star } from "lucide-react";

const stats = [
  { icon: Users,         value: "10,000+",  label: "Patients Served"   },
  { icon: Stethoscope,   value: "5,000+",   label: "Verified Doctors"  },
  { icon: CalendarCheck, value: "< 30 sec", label: "Avg. Booking Time" },
  { icon: Star,          value: "4.9 / 5",  label: "User Satisfaction" },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-y border-slate-100 py-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-slate-100">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-6 py-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                <stat.icon className="w-5 h-5 text-[#0A66FF]" />
              </div>
              <p className="font-outfit font-extrabold text-2xl text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
