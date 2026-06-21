"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Phone, MapPin, Heart, Pill, Droplets, Share2, X, ChevronRight } from "lucide-react";

const emergencyData = {
  name: "Rahul Verma",
  age: 28,
  bloodGroup: "B+",
  allergies: ["Penicillin", "Sulfa drugs"],
  medications: ["Metformin 500mg", "Vitamin D3"],
  contacts: [
    { name: "Sunita Verma", relation: "Mother", phone: "+91 98765 43210" },
    { name: "Dr. Rahul Sharma", relation: "Family Doctor", phone: "+91 87654 32109" },
  ],
  hospitals: [
    { name: "Apollo Hospital", distance: "1.2 km", open: true },
    { name: "Fortis Memorial", distance: "2.8 km", open: true },
    { name: "AIIMS Emergency", distance: "4.1 km", open: true },
  ],
};

export default function EmergencyMode() {
  const [isActive, setIsActive] = useState(false);
  const [shared, setShared] = useState(false);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(239,68,68,0.04),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Emergency Widget */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center"
          >
            {/* Big Emergency Button */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isActive ? "bg-rose-500/30 scale-110 animate-pulse" : "bg-rose-500/10 scale-100"}`} style={{ borderRadius: "50%" }} />
              <button
                onClick={() => { setIsActive(!isActive); setShared(false); }}
                className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? "bg-rose-500 shadow-rose-500/40 scale-105"
                    : "bg-white border-4 border-rose-200 hover:border-rose-400 hover:bg-rose-50"
                }`}
              >
                <AlertTriangle className={`w-10 h-10 mb-1.5 ${isActive ? "text-white" : "text-rose-500"}`} />
                <span className={`text-xs font-black uppercase tracking-widest ${isActive ? "text-white" : "text-rose-500"}`}>
                  {isActive ? "ACTIVE" : "EMERGENCY"}
                </span>
              </button>
            </div>

            {/* Emergency Card */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="w-full max-w-sm bg-white border border-rose-100 rounded-3xl shadow-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-rose-500 p-5 text-white flex items-center justify-between">
                    <div>
                      <p className="text-rose-100 text-xs font-semibold uppercase tracking-wider">Emergency Card</p>
                      <h3 className="font-outfit font-bold text-xl mt-0.5">{emergencyData.name}</h3>
                      <p className="text-rose-100 text-sm">Age {emergencyData.age}</p>
                    </div>
                    <button onClick={() => setIsActive(false)} className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Blood Group */}
                    <div className="flex items-center space-x-3 bg-rose-50 border border-rose-100 rounded-2xl p-3.5">
                      <Droplets className="w-6 h-6 text-rose-500 shrink-0" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Blood Group</p>
                        <p className="text-2xl font-outfit font-black text-rose-600">{emergencyData.bloodGroup}</p>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                        <AlertTriangle className="w-3 h-3 text-amber-500 mr-1.5" /> Allergies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {emergencyData.allergies.map(a => (
                          <span key={a} className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold px-3 py-1 rounded-full">⚠️ {a}</span>
                        ))}
                      </div>
                    </div>

                    {/* Medications */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                        <Pill className="w-3 h-3 text-blue-500 mr-1.5" /> Current Medications
                      </p>
                      <div className="space-y-1">
                        {emergencyData.medications.map(m => (
                          <p key={m} className="text-sm text-slate-700 font-medium">• {m}</p>
                        ))}
                      </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
                        <Phone className="w-3 h-3 text-emerald-500 mr-1.5" /> Emergency Contacts
                      </p>
                      <div className="space-y-2">
                        {emergencyData.contacts.map((c, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{c.name}</p>
                              <p className="text-xs text-slate-500">{c.relation}</p>
                            </div>
                            <a href={`tel:${c.phone}`} className="bg-emerald-500 text-white p-2 rounded-xl hover:bg-emerald-600 transition-colors">
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Share Button */}
                    <button
                      onClick={() => setShared(true)}
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                        shared ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{shared ? "Shared with paramedic ✓" : "Share with Paramedic"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isActive && (
              <p className="text-slate-500 text-sm text-center max-w-xs">
                Tap the button above to activate Emergency Mode and reveal your full emergency card.
              </p>
            )}
          </motion.div>

          {/* Right — copy + nearby ERs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full mb-6">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-semibold text-rose-600">Emergency Mode</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Critical Info,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-[#0A66FF]">
                One Tap Away.
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              In emergencies, seconds matter. Your blood group, allergies, medications, and emergency contacts — instantly accessible and shareable with paramedics, even without internet.
            </p>

            {/* Nearby ERs */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Nearby Emergency Rooms
              </p>
              <div className="space-y-3">
                {emergencyData.hospitals.map((h, i) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 hover:border-rose-200 hover:shadow-sm transition-all">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{h.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />{h.distance}
                        <span className="ml-2 text-emerald-500 font-semibold">• Open</span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
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
