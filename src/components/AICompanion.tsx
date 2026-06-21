"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Zap, Droplets, Moon, Footprints, MessageSquare } from "lucide-react";

export default function AICompanion() {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout;
    if (stage === 0) {
      t1 = setTimeout(() => setStage(1), 2000);
    } else if (stage === 1) {
      t2 = setTimeout(() => setStage(2), 2500);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [stage]);

  const reset = () => setStage(0);

  return (
    <section className="py-32 bg-[#020617] relative overflow-hidden text-white border-t border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(10,102,255,0.1),transparent_50%)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-[#00C2FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-200">Future Vision</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold mb-6 tracking-tight leading-tight">
            The Ultimate{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-purple-400">
              AI Health Companion.
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Imagine an AI that knows your medical history, recent lab reports, daily activity, and sleep patterns — answering your complex health questions with deep, personalized context.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative mt-20 mb-10">
          {/* Main Chat Interface */}
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl relative z-20 min-h-[400px] flex flex-col justify-end">
            
            <div className="flex-1 space-y-6 mb-6">
              {/* User message */}
              <div className="flex justify-end">
                <div className="bg-[#0A66FF] text-white px-5 py-3.5 rounded-2xl rounded-tr-none shadow-lg max-w-[85%]">
                  <p className="text-sm md:text-base leading-relaxed">Why have I been feeling so tired lately? I can barely focus in the afternoons.</p>
                </div>
              </div>

              {/* AI Processing / Response */}
              <AnimatePresence mode="wait">
                {stage === 0 && (
                  <motion.div
                    key="stage-0"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66FF] to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                      <Brain className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/50 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-2">
                      {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                    </div>
                  </motion.div>
                )}

                {stage === 1 && (
                  <motion.div
                    key="stage-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66FF] to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/50 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm space-y-3 w-full max-w-[85%]">
                      <div className="flex items-center space-x-2 text-sm text-[#00C2FF] font-semibold mb-2">
                        <Zap className="w-4 h-4" />
                        <span>Analysing your health data...</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-700/30 border border-slate-600/50 p-2 rounded-lg flex items-center space-x-2 animate-pulse">
                          <Moon className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-xs text-slate-300">Checking sleep logs</span>
                        </div>
                        <div className="bg-slate-700/30 border border-slate-600/50 p-2 rounded-lg flex items-center space-x-2 animate-pulse" style={{ animationDelay: '200ms' }}>
                          <Droplets className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xs text-slate-300">Scanning recent blood reports</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {stage === 2 && (
                  <motion.div
                    key="stage-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A66FF] to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/50 p-5 md:p-6 rounded-2xl rounded-tl-none shadow-sm w-full max-w-[90%] space-y-4">
                      <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                        I&apos;ve analyzed your recent data. There are two primary factors contributing to your fatigue:
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-xl flex items-start space-x-3">
                          <Moon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white text-sm">Sleep Deficit Detected</p>
                            <p className="text-slate-400 text-xs mt-1">Your Apple Watch shows your deep sleep has dropped by 25% over the last 5 days, averaging just 4.5 hours per night.</p>
                          </div>
                        </div>

                        <div className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl flex items-start space-x-3">
                          <Droplets className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-white text-sm">Borderline Vitamin D</p>
                            <p className="text-slate-400 text-xs mt-1">Your CBC report from last month showed Vitamin D levels at 22 ng/mL (borderline low), which often causes afternoon fatigue.</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm italic border-t border-slate-700 pt-3">
                        Would you like me to book a quick consultation with Dr. Sharma to discuss Vitamin D supplements?
                      </p>
                      
                      <div className="flex space-x-2 pt-1">
                        <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-500/30 transition-colors">
                          Yes, book appointment
                        </button>
                        <button className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors">
                          Remind me later
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <input type="text" placeholder="Type a message..." disabled className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 px-5 pr-14 text-sm text-slate-300 focus:outline-none" />
              <button disabled className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-800 text-slate-500 rounded-lg">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Floating Data Nodes */}
          <AnimatePresence>
            {stage >= 1 && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0, x: -100, y: 100 }}
                  animate={{ opacity: 1, scale: 1, x: -40, y: 40 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute bottom-1/4 -left-12 lg:-left-24 bg-slate-800/80 backdrop-blur-md border border-slate-600 p-3 rounded-xl shadow-xl flex items-center space-x-2 z-30"
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Apple Watch Data</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0, x: 100, y: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 20, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                  className="absolute top-1/2 -right-8 lg:-right-20 bg-slate-800/80 backdrop-blur-md border border-slate-600 p-3 rounded-xl shadow-xl flex items-center space-x-2 z-30"
                >
                  <Droplets className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white">Oct 12 Blood Report</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0, x: 50, y: -100 }}
                  animate={{ opacity: 1, scale: 1, x: -10, y: -30 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
                  className="absolute top-0 right-1/4 bg-slate-800/80 backdrop-blur-md border border-slate-600 p-3 rounded-xl shadow-xl flex items-center space-x-2 z-30"
                >
                  <Footprints className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Activity Logs</span>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center">
          {stage === 2 ? (
            <button onClick={reset} className="text-sm text-slate-500 hover:text-slate-300 font-semibold underline">Reset Demo</button>
          ) : (
            <p className="text-sm text-slate-500">Wait for the AI response...</p>
          )}
        </div>
      </div>
    </section>
  );
}
