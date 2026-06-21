"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight, Activity, Shield, Zap, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function HeroHome() {
  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-dot-pattern">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#F5FAFF] to-transparent -z-10" />
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-[#4DA3FF]/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 -left-64 w-[600px] h-[600px] bg-[#00C2FF]/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left z-10"
          >
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-8 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A66FF]"></span>
              </span>
              <span className="text-sm font-medium text-blue-700">AI-Powered Healthcare Ecosystem</span>
            </div>

            <h1 className="font-outfit text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              Find the Right Doctor in 30 Seconds
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-sans">
              Cure AI listens to your symptoms, evaluates urgency, matches you with the right doctor, and books care — in one app.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                href="/features"
                className="w-full sm:w-auto px-8 py-4 bg-[#0A66FF] hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transform hover:-translate-y-1"
              >
                <span>Check Symptoms</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link 
                href="/features"
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-full font-semibold text-lg transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <Play className="h-5 w-5 text-[#0A66FF] fill-current" />
                <span>Watch Demo</span>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p>Trusted by <span className="font-semibold text-slate-800">10,000+</span> patients</p>
            </div>
          </motion.div>

          {/* Right Column - Static Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66FF]/20 to-[#00C2FF]/20 rounded-3xl transform rotate-3 blur-xl"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl overflow-hidden flex flex-col p-8 h-[580px] justify-center items-center">
              
              {/* App UI Snapshot Card */}
              <div className="w-full max-w-sm bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A66FF]/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-[#0A66FF] p-2.5 rounded-xl shadow-md text-white">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">Cure AI Match</h3>
                    <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit mt-1">Smart Diagnosis Active</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Symptoms Analyzed</h4>
                      <p className="text-xs text-slate-500 mt-0.5">High Fever, Neck Stiffness</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Urgency Evaluation</h4>
                      <p className="text-xs text-rose-500 font-semibold mt-0.5">High Priority</p>
                    </div>
                  </div>

                  <div className="bg-[#0A66FF] p-4 rounded-xl shadow-md border border-blue-600 flex items-center space-x-4 text-white">
                    <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Top Match</h4>
                      <p className="text-xs text-blue-100 mt-0.5">Dr. Rahul Sharma (Neurologist)</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
