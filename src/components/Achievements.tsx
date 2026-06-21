"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Star, ShieldCheck } from "lucide-react";

export default function Achievements() {
  const partners = [
    "Microsoft Gurugram",
    "Policybazaar",
    "IIM Lucknow Noida",
    "CEED",
    "IGNISIA Startup"
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block">Recognition</span>
          <h2 className="text-3xl md:text-4xl font-outfit font-extrabold text-slate-900 mb-4">
            Trusted & Recognized By
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-sans">
            Backed by industry leaders and recognized for our innovative approach to healthcare technology.
          </p>
        </div>

        {/* Premium Award Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="relative rounded-[2rem] bg-gradient-to-tr from-[#0F172A] to-slate-800 p-1 overflow-hidden shadow-2xl">
            {/* Animated border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00C2FF] to-transparent w-[200%] animate-[spin_4s_linear_infinite] opacity-50" />
            
            <div className="relative bg-slate-900 rounded-[calc(2rem-4px)] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between z-10 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#0A66FF]/20 rounded-full blur-[80px]" />
              
              <div className="flex items-center space-x-6 md:space-x-8 mb-8 md:mb-0">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                    <Trophy className="w-10 h-10 text-amber-900" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                
                <div className="text-left text-white z-10">
                  <span className="text-amber-400 font-bold tracking-wider uppercase text-xs mb-2 block">Award Winner</span>
                  <h3 className="text-2xl md:text-3xl font-outfit font-bold mb-2">Second Runner-Up</h3>
                  <p className="text-slate-400 font-sans max-w-sm">
                    IGNISIA Startup & Innovation Competition
                  </p>
                </div>
              </div>
              
              <div className="text-center md:text-right z-10">
                <div className="inline-flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-full mb-3">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300">Verified Achievement</span>
                </div>
                <p className="text-slate-500 text-sm">Recognized for Excellence in HealthTech</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logo Wall */}
        <div className="border-t border-slate-100 pt-16">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
            Incubated, Supported, and Associated With
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center space-x-3 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-[#0A66FF] transition-colors" />
                </div>
                <span className="font-bold font-outfit text-xl text-slate-800 tracking-tight group-hover:text-[#0A66FF] transition-colors">
                  {partner}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
