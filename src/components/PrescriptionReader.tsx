"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, Sparkles, Clock, Pill, CheckCircle2, Bell, Upload } from "lucide-react";

const parsedMeds = [
  { name: "Paracetamol 500mg", dosage: "1 tablet", timing: "Twice daily (morning & night)", duration: "5 days", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { name: "Azithromycin 250mg", dosage: "1 tablet", timing: "Once daily (morning)", duration: "3 days", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
  { name: "Cetirizine 10mg", dosage: "1 tablet", timing: "At night (before sleep)", duration: "7 days", color: "bg-purple-50 border-purple-100 text-purple-700" },
];

export default function PrescriptionReader() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");

  const startScan = () => {
    if (state !== "idle") return;
    setState("scanning");
    setTimeout(() => setState("done"), 2800);
  };

  return (
    <section className="py-32 bg-[#0F172A] relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(10,102,255,0.2),transparent_60%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-900/50 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
            <ScanLine className="w-4 h-4 text-[#00C2FF]" />
            <span className="text-sm font-semibold text-blue-200">AI Prescription Reader</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold mb-5 tracking-tight">
            Doctor&apos;s Handwriting,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#0A66FF]">
              Decoded Instantly.
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Upload any prescription — printed or handwritten. Our AI reads it and converts it to a clear, structured format with automatic medicine reminders.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">

          {/* Left: Prescription Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-3xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-outfit font-bold text-white flex items-center">
                  <Upload className="w-4 h-4 mr-2 text-[#00C2FF]" /> Original Prescription
                </h3>
                <span className="text-xs text-slate-400 bg-slate-700/60 px-2 py-1 rounded">Dr. R. Sharma</span>
              </div>

              {/* Fake handwritten prescription */}
              <div className="relative bg-amber-50/10 border border-amber-500/20 rounded-2xl p-5 min-h-[260px] overflow-hidden">
                {/* Handwriting simulation */}
                <div className="space-y-3 opacity-80" style={{ fontFamily: "'Segoe Script', cursive" }}>
                  <p className="text-amber-200/90 text-sm" style={{ transform: "rotate(-1deg)" }}>Rx</p>
                  <p className="text-amber-200/80 text-sm leading-loose" style={{ transform: "rotate(-0.5deg)" }}>
                    Tab. Paracetamol 500 mg<br />
                    <span className="text-xs">1-0-1 × 5 days</span>
                  </p>
                  <p className="text-amber-200/80 text-sm leading-loose" style={{ transform: "rotate(0.3deg)" }}>
                    Cap. Azithromycin 250mg<br />
                    <span className="text-xs">1-0-0 × 3 days</span>
                  </p>
                  <p className="text-amber-200/80 text-sm leading-loose" style={{ transform: "rotate(-0.8deg)" }}>
                    Tab. Cetirizine 10mg<br />
                    <span className="text-xs">0-0-1 × 7 days</span>
                  </p>
                  <p className="text-amber-200/60 text-xs mt-4" style={{ transform: "rotate(0.5deg)" }}>Plenty of water, rest well</p>
                </div>

                {/* Scan line animation */}
                <AnimatePresence>
                  {state === "scanning" && (
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2.5, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-[#00C2FF] shadow-[0_0_12px_4px_rgba(0,194,255,0.5)] z-10"
                      style={{ position: "absolute" }}
                    />
                  )}
                </AnimatePresence>

                {state === "scanning" && (
                  <div className="absolute inset-0 bg-[#00C2FF]/5 animate-pulse rounded-2xl" />
                )}
              </div>

              <button
                onClick={startScan}
                disabled={state !== "idle"}
                className={`w-full mt-5 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                  state === "idle"
                    ? "bg-gradient-to-r from-[#0A66FF] to-[#00C2FF] text-white hover:opacity-90 shadow-lg shadow-blue-500/30"
                    : state === "scanning"
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                }`}
              >
                {state === "idle" && <><ScanLine className="w-4 h-4" /><span>Scan with AI</span></>}
                {state === "scanning" && <><Sparkles className="w-4 h-4 animate-spin" /><span>AI is reading...</span></>}
                {state === "done" && <><CheckCircle2 className="w-4 h-4" /><span>Scan Complete</span></>}
              </button>
            </div>
          </motion.div>

          {/* Right: Parsed Output */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-outfit font-bold text-white flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400" /> AI Parsed Output
                </h3>
                <AnimatePresence>
                  {state === "done" && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-full"
                    >
                      3 medicines found
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-4 min-h-[260px]">
                <AnimatePresence>
                  {state === "done" ? (
                    parsedMeds.map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="bg-[#0A66FF]/20 p-2 rounded-xl mt-0.5">
                              <Pill className="w-4 h-4 text-[#00C2FF]" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{med.name}</p>
                              <p className="text-slate-400 text-xs mt-1">{med.dosage} • {med.timing}</p>
                              <div className="flex items-center space-x-1 mt-2">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span className="text-[10px] text-slate-500 font-semibold">{med.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                      <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
                        <Sparkles className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-slate-500 text-sm">Parsed medicines will appear here after scanning.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {state === "done" && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full mt-4 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Set Medicine Reminders</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
