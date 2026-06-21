"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Moon, Activity, Droplets, Scale, Stethoscope, Sparkles, ArrowUp } from "lucide-react";

const metrics = [
  { label: "Sleep",     icon: Moon,       score: 7,  max: 10, color: "from-indigo-400 to-purple-500",  tip: "Get 30 more min of sleep nightly" },
  { label: "Activity",  icon: Activity,   score: 6,  max: 10, color: "from-emerald-400 to-teal-500",   tip: "Add a 15-min walk each day" },
  { label: "Checkups",  icon: Stethoscope, score: 9, max: 10, color: "from-blue-400 to-[#0A66FF]",     tip: "Great! Keep up regular checkups" },
  { label: "Hydration", icon: Droplets,   score: 5,  max: 10, color: "from-cyan-400 to-blue-400",      tip: "Drink 2 more glasses of water daily" },
  { label: "Weight",    icon: Scale,      score: 8,  max: 10, color: "from-rose-400 to-pink-500",      tip: "Maintain healthy diet habits" },
];

const history = [68, 71, 74, 72, 78, 82];

export default function HealthScore() {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeMetric, setActiveMetric] = useState<number | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const totalScore = 82;

  useEffect(() => {
    if (!hasAnimated) return;
    let frame = 0;
    const target = totalScore;
    const duration = 60;
    const increment = target / duration;
    const timer = setInterval(() => {
      frame++;
      setAnimatedScore(prev => {
        const next = Math.min(prev + increment, target);
        if (frame >= duration) clearInterval(timer);
        return next;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [hasAnimated, totalScore]);

  const scoreColor = totalScore >= 75 ? "#22c55e" : totalScore >= 50 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  return (
    <section className="py-32 bg-[#F5FAFF] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(10,102,255,0.07),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white border border-blue-100 px-4 py-2 rounded-full mb-6 shadow-sm">
            <TrendingUp className="w-4 h-4 text-[#0A66FF]" />
            <span className="text-sm font-semibold text-[#0A66FF]">Health Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-5 tracking-tight">
            Your Personal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66FF] to-[#00C2FF]">
              Health Score
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-sans">
            Like a credit score, but for your wellbeing. AI analyses your sleep, activity, checkups, and vitals to give you a real-time health rating.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setHasAnimated(true)}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 max-w-5xl mx-auto"
        >
          <div className="grid lg:grid-cols-3 gap-8 items-center">

            {/* Left: Score Gauge */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ filter: `drop-shadow(0 0 6px ${scoreColor}60)` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-outfit font-black text-slate-900">{Math.round(animatedScore)}</span>
                  <span className="text-slate-500 text-sm font-semibold">/ 100</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-emerald-600 font-bold text-lg mb-1">Good Health</p>
                <p className="text-slate-500 text-sm">Top 23% of your age group</p>
              </div>

              {/* History sparkline */}
              <div className="mt-6 w-full">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">6-Month Trend</p>
                <div className="flex items-end justify-center space-x-2 h-12">
                  {history.map((val, i) => (
                    <div key={i} className="flex flex-col items-center space-y-1">
                      <div
                        className="w-5 rounded-t-sm bg-gradient-to-t from-[#0A66FF] to-[#00C2FF] transition-all"
                        style={{ height: `${(val / 100) * 48}px` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 px-1">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(m => (
                    <span key={m} className="text-[9px] text-slate-400 font-semibold">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle: Metric Bars */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-outfit font-bold text-slate-900 text-lg mb-2">Score Breakdown</h3>
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeMetric === i ? "border-[#0A66FF] bg-blue-50/50 shadow-md" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveMetric(activeMetric === i ? null : i)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                        <m.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm">{m.label}</span>
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{m.score}/{m.max}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${m.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(m.score / m.max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.08 }}
                    />
                  </div>
                  {activeMetric === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-blue-100 flex items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4 text-[#0A66FF] shrink-0" />
                      <p className="text-sm text-[#0A66FF] font-medium">{m.tip}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {/* AI suggestion highlight */}
              <div className="bg-gradient-to-r from-[#0A66FF] to-blue-700 rounded-2xl p-4 text-white flex items-center space-x-4 mt-2">
                <div className="bg-white/20 p-2.5 rounded-xl shrink-0">
                  <ArrowUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">Boost your score by +6 points</p>
                  <p className="text-blue-100 text-xs mt-0.5">Drink more water and get 30 extra minutes of sleep nightly.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
