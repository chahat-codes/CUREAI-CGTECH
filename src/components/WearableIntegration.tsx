"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Watch, Heart, Activity, Moon, Footprints, Sparkles, Wifi, TrendingUp, TrendingDown } from "lucide-react";

type Device = "apple" | "fitbit" | "samsung";

const devices: { id: Device; name: string; model: string }[] = [
  { id: "apple", name: "Apple Watch", model: "Series 9" },
  { id: "fitbit", name: "Fitbit", model: "Sense 2" },
  { id: "samsung", name: "Samsung", model: "Galaxy Watch 6" },
];

type Metric = {
  label: string;
  icon: React.ElementType;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendText: string;
  history: number[];
  color: string;
  insight: string;
};

const metricsData: Record<Device, Metric[]> = {
  apple: [
    { label: "Heart Rate", icon: Heart, value: "72", unit: "bpm", trend: "up", trendText: "+8 bpm this week", history: [68, 70, 71, 69, 72, 75, 72], color: "from-rose-400 to-pink-500", insight: "Resting HR slightly elevated. Try evening walks." },
    { label: "SpO₂", icon: Activity, value: "98", unit: "%", trend: "stable", trendText: "Normal range", history: [97, 98, 98, 99, 98, 97, 98], color: "from-blue-400 to-cyan-500", insight: "Excellent oxygen saturation. Keep it up!" },
    { label: "Sleep", icon: Moon, value: "7h 23m", unit: "", trend: "down", trendText: "-42min this week", history: [8.2, 7.8, 8.0, 7.5, 7.2, 7.4, 7.4], color: "from-indigo-400 to-purple-500", insight: "Sleep slightly down. Aim for 8 hours nightly." },
    { label: "Steps", icon: Footprints, value: "6,247", unit: "/day", trend: "up", trendText: "+1,200 from last week", history: [4200, 5100, 4800, 5500, 6000, 6247, 5900], color: "from-emerald-400 to-teal-500", insight: "Great progress! 3,753 steps to your 10K goal." },
  ],
  fitbit: [
    { label: "Heart Rate", icon: Heart, value: "74", unit: "bpm", trend: "stable", trendText: "Normal range", history: [72, 73, 74, 74, 73, 75, 74], color: "from-rose-400 to-pink-500", insight: "Healthy resting heart rate for your age." },
    { label: "SpO₂", icon: Activity, value: "97", unit: "%", trend: "stable", trendText: "Normal range", history: [97, 96, 98, 97, 97, 98, 97], color: "from-blue-400 to-cyan-500", insight: "SpO₂ is healthy. Continue regular monitoring." },
    { label: "Sleep", icon: Moon, value: "6h 50m", unit: "", trend: "down", trendText: "-30min this week", history: [7.5, 7.0, 6.8, 7.2, 6.9, 6.8, 6.8], color: "from-indigo-400 to-purple-500", insight: "Aim for 7.5+ hours for optimal recovery." },
    { label: "Steps", icon: Footprints, value: "7,832", unit: "/day", trend: "up", trendText: "+800 from last week", history: [6500, 6800, 7000, 7200, 7500, 7800, 7832], color: "from-emerald-400 to-teal-500", insight: "Excellent! You&apos;re close to your 10K goal." },
  ],
  samsung: [
    { label: "Heart Rate", icon: Heart, value: "69", unit: "bpm", trend: "down", trendText: "-3 bpm this week", history: [73, 72, 71, 70, 70, 69, 69], color: "from-rose-400 to-pink-500", insight: "Heart rate improving — great fitness progress!" },
    { label: "SpO₂", icon: Activity, value: "99", unit: "%", trend: "stable", trendText: "Excellent", history: [98, 99, 99, 98, 99, 99, 99], color: "from-blue-400 to-cyan-500", insight: "Perfect oxygen saturation levels." },
    { label: "Sleep", icon: Moon, value: "8h 10m", unit: "", history: [8.0, 8.2, 8.0, 8.3, 8.1, 8.2, 8.2], trend: "up", trendText: "+20min this week", color: "from-indigo-400 to-purple-500", insight: "Excellent sleep duration! Well above average." },
    { label: "Steps", icon: Footprints, value: "9,120", unit: "/day", trend: "up", trendText: "+2,000 from last week", history: [7000, 7500, 8000, 8500, 9000, 9100, 9120], color: "from-emerald-400 to-teal-500", insight: "Almost at 10K! One more short walk and you're there." },
  ],
};

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60; const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={color.includes("rose") ? "text-rose-400" : color.includes("blue") ? "text-blue-400" : color.includes("indigo") ? "text-indigo-400" : "text-emerald-400"} />
    </svg>
  );
}

export default function WearableIntegration() {
  const [device, setDevice] = useState<Device>("apple");
  const [activeMetric, setActiveMetric] = useState<number | null>(null);
  const metrics = metricsData[device];

  return (
    <section className="py-32 bg-[#0F172A] relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_30%,rgba(10,102,255,0.15),transparent_60%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 bg-blue-900/50 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
            <Watch className="w-4 h-4 text-[#00C2FF]" />
            <span className="text-sm font-semibold text-blue-200">Wearable Integration</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold mb-5 tracking-tight">
            Your Body Talks.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#0A66FF]">
              Cure AI Listens.
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Connect your smartwatch and let AI analyse your heart rate, sleep, SpO₂, and activity trends to catch health issues before they escalate.
          </p>
        </div>

        {/* Device Selector */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-800/60 border border-slate-700 p-1.5 rounded-2xl flex space-x-1">
            {devices.map(d => (
              <button
                key={d.id}
                onClick={() => { setDevice(d.id); setActiveMetric(null); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  device === d.id
                    ? "bg-[#0A66FF] text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Device Status Bar */}
        <motion.div
          key={device}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-3 mb-8"
        >
          <Wifi className="w-4 h-4 text-emerald-400" />
          <p className="text-sm text-emerald-400 font-semibold">
            {devices.find(d => d.id === device)?.name} {devices.find(d => d.id === device)?.model} — Synced 2 minutes ago
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
          >
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className={`bg-slate-800/60 backdrop-blur-xl border rounded-3xl p-5 cursor-pointer hover:border-[#0A66FF]/50 transition-all ${
                  activeMetric === i ? "border-[#0A66FF] shadow-lg shadow-blue-500/10" : "border-slate-700"
                }`}
                onClick={() => setActiveMetric(activeMetric === i ? null : i)}
              >
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4 shadow-md`}>
                  <m.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">{m.label}</p>
                <p className="text-3xl font-outfit font-black text-white mb-0.5">
                  {m.value}<span className="text-sm font-semibold text-slate-400 ml-1">{m.unit}</span>
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className={`flex items-center space-x-1 text-xs font-semibold ${m.trend === "up" ? "text-emerald-400" : m.trend === "down" ? "text-rose-400" : "text-slate-400"}`}>
                    {m.trend === "up" ? <TrendingUp className="w-3 h-3" /> : m.trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                    <span>{m.trendText}</span>
                  </div>
                  <MiniChart data={m.history} color={m.color} />
                </div>
                <AnimatePresence>
                  {activeMetric === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 pt-3 border-t border-slate-700 flex items-start space-x-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00C2FF] shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 leading-relaxed">{m.insight}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
