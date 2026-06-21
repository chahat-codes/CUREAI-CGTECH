"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Phone, Navigation, Stethoscope, Building2, FlaskConical, Pill, Ambulance, Clock, CheckCircle2 } from "lucide-react";

type Category = "doctors" | "hospitals" | "labs" | "pharmacies" | "ambulances";

const categories: { id: Category; label: string; icon: React.ElementType; color: string }[] = [
  { id: "doctors",     label: "Doctors",     icon: Stethoscope, color: "text-blue-500" },
  { id: "hospitals",   label: "Hospitals",   icon: Building2,   color: "text-purple-500" },
  { id: "labs",        label: "Labs",        icon: FlaskConical, color: "text-emerald-500" },
  { id: "pharmacies",  label: "Pharmacies",  icon: Pill,        color: "text-amber-500" },
  { id: "ambulances",  label: "Ambulances",  icon: Ambulance,   color: "text-rose-500" },
];

type NearbyItem = {
  name: string;
  sub: string;
  distance: string;
  rating?: string;
  open: boolean;
  wait?: string;
  emergency?: boolean;
};

const nearbyData: Record<Category, NearbyItem[]> = {
  doctors: [
    { name: "Dr. Rahul Sharma", sub: "General Physician • 15 Yrs Exp", distance: "1.2 km", rating: "4.9", open: true, wait: "~12 min" },
    { name: "Dr. Anita Desai", sub: "Cardiologist • 12 Yrs Exp", distance: "2.1 km", rating: "4.8", open: true, wait: "~25 min" },
    { name: "Dr. Priya Mehta", sub: "Dermatologist • 8 Yrs Exp", distance: "3.4 km", rating: "4.7", open: false },
  ],
  hospitals: [
    { name: "Apollo Hospital", sub: "Multi-specialty • 24/7 Emergency", distance: "1.2 km", open: true, emergency: true },
    { name: "Fortis Memorial", sub: "Tertiary Care Centre", distance: "2.8 km", open: true, emergency: true },
    { name: "Medanta Hospital", sub: "Super-specialty Hospital", distance: "5.2 km", open: true },
  ],
  labs: [
    { name: "SRL Diagnostics", sub: "Home collection available", distance: "0.8 km", rating: "4.6", open: true },
    { name: "Thyrocare", sub: "Budget-friendly packages", distance: "1.9 km", rating: "4.4", open: true },
    { name: "Metropolis Healthcare", sub: "NABL Accredited", distance: "3.1 km", rating: "4.8", open: false },
  ],
  pharmacies: [
    { name: "MedPlus Pharmacy", sub: "GenericFirst • Home delivery", distance: "0.3 km", open: true },
    { name: "Apollo Pharmacy", sub: "OTC + Prescription", distance: "0.9 km", open: true },
    { name: "NetMeds Partner", sub: "Online + Offline", distance: "1.4 km", open: false },
  ],
  ambulances: [
    { name: "Apollo Emergency", sub: "ALS Ambulance • ICU Equipped", distance: "1.2 km", open: true, emergency: true },
    { name: "Ziqitza Healthcare", sub: "Basic Life Support", distance: "2.0 km", open: true, emergency: true },
    { name: "StanPlus", sub: "Tech-enabled EMS", distance: "2.8 km", open: true, emergency: true },
  ],
};

export default function NearbyEcosystem() {
  const [activeCategory, setActiveCategory] = useState<Category>("doctors");
  const items = nearbyData[activeCategory];

  return (
    <section className="py-32 bg-[#0F172A] relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,rgba(10,102,255,0.12),transparent_60%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "30px 30px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 bg-blue-900/50 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
            <MapPin className="w-4 h-4 text-[#00C2FF]" />
            <span className="text-sm font-semibold text-blue-200">Nearby Ecosystem</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold mb-5 tracking-tight">
            Everything Healthcare,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#0A66FF]">
              Near You.
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Doctors, hospitals, labs, pharmacies, and ambulances — all on one map. Filter by distance, rating, and availability.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto no-scrollbar">
          <div className="bg-slate-800/60 border border-slate-700 p-1.5 rounded-2xl flex space-x-1">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === c.id
                    ? "bg-white text-slate-900 shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <c.icon className={`w-4 h-4 ${activeCategory === c.id ? c.color : ""}`} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Map placeholder */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-3xl overflow-hidden relative h-[480px]">
            <div className="absolute inset-0 bg-[#1a2744] flex items-center justify-center">
              {/* Grid lines */}
              <div className="absolute inset-0" style={{
                backgroundImage: "linear-gradient(rgba(10,102,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(10,102,255,0.1) 1px,transparent 1px)",
                backgroundSize: "40px 40px"
              }} />
              {/* Center pulse */}
              <div className="relative z-10 text-center">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A66FF] opacity-30" />
                  <div className="relative flex items-center justify-center w-16 h-16 bg-[#0A66FF] rounded-full shadow-lg shadow-blue-500/40">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-semibold">Your Location</p>
                <p className="text-slate-500 text-xs mt-1">Sector 12, Gurugram</p>
              </div>

              {/* Scattered pins */}
              {[
                { top: "25%", left: "30%", color: "bg-emerald-500" },
                { top: "40%", left: "70%", color: "bg-blue-500" },
                { top: "65%", left: "55%", color: "bg-amber-500" },
                { top: "30%", left: "60%", color: "bg-blue-500" },
                { top: "70%", left: "25%", color: "bg-rose-500" },
              ].map((pin, i) => (
                <div key={i} className={`absolute w-4 h-4 rounded-full ${pin.color} shadow-lg`} style={{ top: pin.top, left: pin.left }}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pin.color} opacity-40`} style={{ animationDelay: `${i * 300}ms` }} />
                </div>
              ))}
            </div>

            {/* Distance filter */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">Show within</span>
                <div className="flex space-x-1">
                  {["1 km", "3 km", "5 km"].map(d => (
                    <button key={d} className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${d === "3 km" ? "bg-[#0A66FF] text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm"><span className="text-white font-bold">{items.length} results</span> near you</p>
              <p className="text-[#00C2FF] text-xs font-semibold">Sorted by distance</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 hover:border-[#0A66FF]/50 hover:bg-slate-800 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-0.5">
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          {item.emergency && <span className="text-[10px] font-black text-white bg-rose-500 px-1.5 py-0.5 rounded">24/7</span>}
                        </div>
                        <p className="text-xs text-slate-400">{item.sub}</p>
                        <div className="flex items-center space-x-3 mt-1.5">
                          <span className="text-xs text-slate-400 flex items-center"><MapPin className="w-3 h-3 mr-0.5" />{item.distance}</span>
                          {item.rating && <span className="text-xs text-amber-400 flex items-center font-semibold"><Star className="w-3 h-3 fill-current mr-0.5" />{item.rating}</span>}
                          {item.wait && <span className="text-xs text-slate-400 flex items-center"><Clock className="w-3 h-3 mr-0.5" />{item.wait}</span>}
                          <span className={`text-[10px] font-bold ${item.open ? "text-emerald-400" : "text-slate-500"}`}>
                            {item.open ? "• Open" : "• Closed"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 bg-[#0A66FF] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1">
                        <Navigation className="w-3.5 h-3.5" /><span>Directions</span>
                      </button>
                      {activeCategory !== "ambulances" ? (
                        <button className="flex-1 py-2 bg-slate-700 text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-600 transition-colors flex items-center justify-center space-x-1">
                          {activeCategory === "doctors" ? <><CheckCircle2 className="w-3.5 h-3.5" /><span>Book Now</span></> : <><Phone className="w-3.5 h-3.5" /><span>Call</span></>}
                        </button>
                      ) : (
                        <button className="flex-1 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-colors flex items-center justify-center space-x-1">
                          <Phone className="w-3.5 h-3.5" /><span>Call Now</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
