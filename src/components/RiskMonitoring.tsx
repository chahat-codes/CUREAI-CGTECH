"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Wind, Thermometer, Bug, Droplets, ShieldAlert, Info } from "lucide-react";

const alerts = [
  {
    level: "high",
    icon: Thermometer,
    title: "Extreme Heat Warning",
    location: "Sirsa, Haryana",
    desc: "Temperature reaching 46°C today. Risk of heat stroke is very high.",
    tips: ["Stay indoors 12PM–4PM", "Drink 3L+ water", "Avoid direct sunlight"],
    color: "from-rose-500 to-orange-500",
    border: "border-rose-200",
    bg: "bg-rose-50",
    badge: "HIGH RISK",
    badgeColor: "bg-rose-500",
  },
  {
    level: "medium",
    icon: Bug,
    title: "Dengue Outbreak Alert",
    location: "Delhi NCR Region",
    desc: "High dengue activity reported in your area. 340 new cases this week.",
    tips: ["Use mosquito repellent", "Wear full-sleeve clothing", "Eliminate stagnant water"],
    color: "from-amber-500 to-yellow-500",
    border: "border-amber-200",
    bg: "bg-amber-50",
    badge: "MEDIUM RISK",
    badgeColor: "bg-amber-500",
  },
  {
    level: "low",
    icon: Wind,
    title: "Air Quality: Moderate",
    location: "Your Location",
    desc: "AQI is 87 today — moderate. Sensitive groups may feel discomfort.",
    tips: ["Wear mask if going out", "Avoid outdoor exercise", "Keep windows closed"],
    color: "from-blue-400 to-cyan-500",
    border: "border-blue-200",
    bg: "bg-blue-50",
    badge: "LOW RISK",
    badgeColor: "bg-blue-500",
  },
];

const aqiSegments = [
  { label: "Good",        range: "0-50",   color: "bg-emerald-400" },
  { label: "Moderate",    range: "51-100", color: "bg-yellow-400" },
  { label: "Sensitive",   range: "101-150", color: "bg-orange-400" },
  { label: "Unhealthy",   range: "151+",   color: "bg-red-500" },
];

export default function RiskMonitoring() {
  const currentAqi = 87;
  const aqiPosition = Math.min((currentAqi / 200) * 100, 100);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-50 rounded-full blur-3xl pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-100 px-4 py-2 rounded-full mb-6">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-semibold text-rose-600">Health Risk Monitoring</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-5 tracking-tight">
            Your AI Watches the World{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-[#0A66FF]">
              For Health Threats.
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Weather conditions, air quality, disease outbreaks — Cure AI monitors your environment 24/7 and sends proactive alerts before health risks reach you.
          </p>
        </div>

        {/* AQI Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 mb-10 max-w-4xl mx-auto text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Live Air Quality Index</p>
              <div className="flex items-end space-x-3">
                <span className="text-6xl font-outfit font-black text-yellow-400">{currentAqi}</span>
                <span className="text-slate-400 text-lg mb-2">AQI</span>
              </div>
              <p className="text-yellow-300 font-semibold flex items-center mt-1"><Info className="w-4 h-4 mr-1.5" /> Moderate — Sensitive groups should take precautions</p>
            </div>
            <div className="hidden sm:flex flex-col items-center text-center">
              <Wind className="w-12 h-12 text-[#00C2FF] mb-2" />
              <p className="text-slate-400 text-xs">Updated 2 min ago</p>
            </div>
          </div>

          {/* AQI Bar */}
          <div className="relative">
            <div className="flex h-4 rounded-full overflow-hidden mb-2">
              {aqiSegments.map((seg, i) => (
                <div key={i} className={`${seg.color} flex-1`} />
              ))}
            </div>
            <div
              className="absolute top-0 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-slate-800 -translate-x-1/2 transition-all duration-1000"
              style={{ left: `${aqiPosition}%` }}
            />
            <div className="flex justify-between text-xs text-slate-400 font-semibold mt-2">
              {aqiSegments.map(s => <span key={s.label}>{s.label}</span>)}
            </div>
          </div>
        </motion.div>

        {/* Alert Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {alerts.map((alert, i) => {
            const Icon = alert.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl border ${alert.border} ${alert.bg} p-6 overflow-hidden hover:shadow-lg transition-all`}
              >
                {/* Gradient accent top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${alert.color}`} />

                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${alert.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-[10px] font-black text-white ${alert.badgeColor} px-2.5 py-1 rounded-full`}>
                    {alert.badge}
                  </span>
                </div>

                <h3 className="font-outfit font-bold text-slate-900 text-lg mb-1">{alert.title}</h3>
                <p className="text-xs text-slate-500 font-semibold mb-3 flex items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-1.5" />
                  {alert.location}
                </p>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">{alert.desc}</p>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">What to do:</p>
                  {alert.tips.map((tip, j) => (
                    <div key={j} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${alert.color} flex items-center justify-center shrink-0`}>
                        <AlertTriangle className="w-2.5 h-2.5 text-white" />
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{tip}</p>
                    </div>
                  ))}
                </div>

                {/* Pulsing dot for high risk */}
                {alert.level === "high" && (
                  <div className="absolute top-4 right-4 w-3 h-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stat bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-slate-900 rounded-2xl p-5 max-w-5xl mx-auto grid grid-cols-3 divide-x divide-slate-700"
        >
          {[
            { icon: Thermometer, label: "Weather Monitored", value: "24/7" },
            { icon: Droplets, label: "Data Sources", value: "50+" },
            { icon: Bug, label: "Disease Outbreaks Tracked", value: "120+" },
          ].map((stat, i) => (
            <div key={i} className="text-center px-4">
              <stat.icon className="w-5 h-5 text-[#00C2FF] mx-auto mb-2" />
              <p className="text-2xl font-outfit font-black text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 font-semibold">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
