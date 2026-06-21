"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, Ticket, Bell, CheckCircle2, ChevronRight, Smartphone } from "lucide-react";

export default function LiveQueue() {
  const [currentToken, setCurrentToken] = useState(39);
  const [myToken] = useState(47);
  const [isNotified, setIsNotified] = useState(false);
  const [celebrated, setCelebrated] = useState(false);

  const patientsAhead = Math.max(0, myToken - currentToken);
  const estimatedMinutes = patientsAhead * 4;
  const progress = Math.min(100, ((currentToken - 30) / (myToken - 30)) * 100);

  useEffect(() => {
    if (currentToken >= myToken) return;
    const interval = setInterval(() => {
      setCurrentToken(prev => {
        if (prev >= myToken - 1) {
          clearInterval(interval);
          setCelebrated(true);
          return myToken;
        }
        return prev + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [myToken, currentToken]);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0A66FF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00C2FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Live Queue Widget */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            {/* Main Queue Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0A66FF] to-blue-700 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Apollo Hospital, Sector 12</p>
                    <h3 className="text-2xl font-outfit font-bold">OPD Queue</h3>
                  </div>
                  <div className="bg-emerald-400 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span>LIVE</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Token Numbers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Current Token</p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentToken}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-5xl font-outfit font-black text-slate-900"
                      >
                        #{currentToken}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className={`rounded-2xl p-5 text-center border-2 relative overflow-hidden ${celebrated ? "bg-emerald-50 border-emerald-400" : "bg-blue-50 border-[#0A66FF]"}`}>
                    {celebrated && (
                      <div className="absolute inset-0 bg-emerald-400/10 animate-pulse" />
                    )}
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 relative z-10">Your Token</p>
                    <p className={`text-5xl font-outfit font-black relative z-10 ${celebrated ? "text-emerald-600" : "text-[#0A66FF]"}`}>
                      #{myToken}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Queue Progress</span>
                    <span className="text-xs font-bold text-[#0A66FF]">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0A66FF] to-[#00C2FF] rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-slate-400 mr-1" />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={patientsAhead}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-outfit font-black text-slate-900"
                      >
                        {patientsAhead}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Ahead</p>
                  </div>
                  <div className="text-center border-x border-slate-100">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={estimatedMinutes}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-2xl font-outfit font-black text-slate-900"
                      >
                        {estimatedMinutes}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Min Wait</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Ticket className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-2xl font-outfit font-black text-slate-900">4</p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Min/Patient</p>
                  </div>
                </div>

                {/* Alert / CTA */}
                <AnimatePresence mode="wait">
                  {celebrated ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center space-x-3"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-bold text-emerald-800 text-sm">You&apos;re next! Please proceed to Room 4.</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Dr. Sharma is ready for you.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsNotified(true)}
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                        isNotified
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-[#0A66FF] text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                      }`}
                    >
                      {isNotified ? (
                        <><CheckCircle2 className="w-4 h-4" /><span>SMS Alert Set ✓</span></>
                      ) : (
                        <><Bell className="w-4 h-4" /><span>Notify Me When I&apos;m Next</span></>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile notification preview */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 bg-slate-900 rounded-2xl p-4 flex items-center space-x-3 shadow-xl"
            >
              <div className="bg-[#0A66FF] p-2 rounded-xl shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-bold">Cure AI • Just now</p>
                <p className="text-slate-300 text-xs mt-0.5">🏥 You&apos;re 3 patients away! Head to Apollo Hospital now.</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-emerald-700">Live Feature</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Never Waste Another{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66FF] to-[#00C2FF]">
                Hour Waiting.
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Our live hospital queue system shows your real-time position, sends SMS alerts when you&apos;re close, and estimates your wait to the minute. No more guessing, no more crowded lobbies.
            </p>

            <div className="space-y-5">
              {[
                { icon: Ticket, color: "text-blue-500 bg-blue-50", title: "Real-time token tracking", desc: "Updates every 60 seconds from hospital systems." },
                { icon: Bell, color: "text-amber-500 bg-amber-50", title: "SMS & push notifications", desc: "Get alerted when you&apos;re 3 patients away." },
                { icon: Clock, color: "text-emerald-500 bg-emerald-50", title: "Accurate wait times", desc: "AI predicts wait time based on historical data per doctor." },
                { icon: ChevronRight, color: "text-purple-500 bg-purple-50", title: "Works at 500+ hospitals", desc: "Integrated with major hospital chains across India." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
