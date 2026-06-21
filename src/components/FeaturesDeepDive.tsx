"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Activity, AlertTriangle, Stethoscope, MapPin, Star, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

type Message = {
  sender: "user" | "ai";
  text: string;
  type?: "normal" | "urgent" | "doctor";
  doctor?: { name: string; spec: string; rating: string; distance: string; img: number; fee: string };
};

const conversation: Message[] = [
  { sender: "ai", text: "Hi! I'm your Cure AI assistant. Tell me your symptoms and I'll help you find the right care.", type: "normal" },
  { sender: "user", text: "I have a headache and fever." },
  { sender: "ai", text: "I understand. A few quick questions to assess urgency. How old are you?", type: "normal" },
  { sender: "user", text: "28 years old." },
  { sender: "ai", text: "Got it. How long have you had these symptoms? And what's your temperature?", type: "normal" },
  { sender: "user", text: "Since yesterday. Temperature is 102°F." },
  { sender: "ai", text: "Do you have any existing conditions or are you taking any current medications?", type: "normal" },
  { sender: "user", text: "No existing conditions. Not on any medication." },
  {
    sender: "ai",
    text: "⚠️ Based on your symptoms — 102°F fever + headache for 24hrs — this requires medical attention today. I'm recommending a General Physician or Neurologist.",
    type: "urgent"
  },
  {
    sender: "ai",
    text: "I found the best available doctor near you:",
    type: "doctor",
    doctor: { name: "Dr. Rahul Sharma", spec: "General Physician", rating: "4.9", distance: "1.8 km", img: 33, fee: "₹499" }
  },
];

export default function FeaturesDeepDive() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const startDemo = () => {
    if (isPlaying) return;
    setVisibleCount(1);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || visibleCount === 0 || visibleCount >= conversation.length) {
      return;
    }
    const next = conversation[visibleCount];
    const delay = next.sender === "ai" ? 1200 : 800;
    const typingDuration = next.sender === "ai" ? 900 : 0;

    const t1 = setTimeout(() => {
      if (next.sender === "ai") setIsTyping(true);
      const t2 = setTimeout(() => {
        setIsTyping(false);
        setVisibleCount(v => v + 1);
      }, typingDuration);
      return () => clearTimeout(t2);
    }, delay);
    return () => clearTimeout(t1);
  }, [visibleCount, isPlaying]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleCount, isTyping]);

  const reset = () => {
    setVisibleCount(0);
    setIsPlaying(false);
    setIsTyping(false);
  };

  return (
    <section className="py-32 bg-[#0F172A] relative overflow-hidden text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(10,102,255,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(0,194,255,0.1),transparent_60%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center space-x-2 bg-blue-900/50 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#00C2FF]" />
              <span className="text-sm font-semibold text-blue-200">Hero Feature</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold mb-6 tracking-tight leading-tight">
              Your AI Health{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#0A66FF]">
                First Responder
              </span>
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Stop Googling symptoms. Cure AI asks the right questions, estimates urgency, and connects you with the right specialist — in under 30 seconds.
            </p>

            <div className="space-y-5 mb-10">
              {[
                { icon: Bot, title: "Understands Natural Language", desc: "Say it how you feel it. No medical jargon needed." },
                { icon: AlertTriangle, title: "Urgency Assessment", desc: "AI flags critical symptoms that need immediate attention." },
                { icon: Stethoscope, title: "Specialist Matching", desc: "Finds the exact right doctor type for your condition." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-900/50 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#00C2FF]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-0.5">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={visibleCount >= conversation.length ? reset : startDemo}
              disabled={isPlaying && visibleCount < conversation.length}
              className="px-8 py-4 bg-gradient-to-r from-[#0A66FF] to-[#00C2FF] hover:opacity-90 text-white rounded-full font-bold text-base transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{visibleCount >= conversation.length ? "Replay Demo" : isPlaying ? "Running..." : "▶  Watch the AI in Action"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Right — chat demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66FF]/20 to-[#00C2FF]/10 rounded-3xl blur-2xl transform scale-95" />
            <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
              {/* Header */}
              <div className="bg-slate-900/80 border-b border-slate-700/50 p-4 flex items-center space-x-3">
                <div className="bg-gradient-to-br from-[#0A66FF] to-[#00C2FF] p-2 rounded-xl">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Cure AI Assistant</p>
                  <p className="text-xs text-emerald-400 flex items-center"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" />Online — Always available</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                {visibleCount === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-slate-400 text-sm max-w-xs">Click &quot;Watch the AI in Action&quot; to see a live demo of how Cure AI handles your health query.</p>
                  </div>
                )}

                <AnimatePresence>
                  {conversation.slice(0, visibleCount).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className={`flex items-end space-x-2 ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      {msg.sender === "ai" && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shrink-0 shadow-md">
                          <Activity className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[82%] ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col space-y-2`}>
                        {msg.type === "urgent" ? (
                          <div className="bg-rose-500/20 border border-rose-500/40 p-3.5 rounded-2xl rounded-bl-none">
                            <p className="text-rose-300 text-sm leading-relaxed">{msg.text}</p>
                          </div>
                        ) : msg.type === "doctor" ? (
                          <div className="space-y-2 w-full">
                            <div className="bg-slate-700/60 border border-slate-600/50 p-3.5 rounded-2xl rounded-bl-none">
                              <p className="text-slate-200 text-sm">{msg.text}</p>
                            </div>
                            {msg.doctor && (
                              <div className="bg-white/5 border border-blue-500/30 p-4 rounded-2xl w-full">
                                <div className="flex items-center space-x-3 mb-3">
                                  <img src={`https://i.pravatar.cc/100?img=${msg.doctor.img}`} className="w-12 h-12 rounded-full border-2 border-blue-500/30" alt={msg.doctor.name} />
                                  <div>
                                    <p className="font-bold text-white text-sm flex items-center">
                                      {msg.doctor.name}
                                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 ml-1.5" />
                                    </p>
                                    <p className="text-xs text-slate-400">{msg.doctor.spec}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="flex items-center text-[10px] font-bold text-amber-400">
                                        <Star className="w-3 h-3 fill-current mr-0.5" /> {msg.doctor.rating}
                                      </span>
                                      <span className="flex items-center text-[10px] text-slate-400">
                                        <MapPin className="w-3 h-3 mr-0.5" /> {msg.doctor.distance}
                                      </span>
                                      <span className="text-[10px] text-emerald-400 font-bold">{msg.doctor.fee}</span>
                                    </div>
                                  </div>
                                </div>
                                <button className="w-full py-2 bg-gradient-to-r from-[#0A66FF] to-[#00C2FF] text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                                  Book Appointment Now
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`p-3.5 rounded-2xl ${msg.sender === "user" ? "bg-[#0A66FF] rounded-br-none" : "bg-slate-700/60 border border-slate-600/50 rounded-bl-none"}`}>
                            <p className={`text-sm leading-relaxed ${msg.sender === "user" ? "text-white" : "text-slate-200"}`}>{msg.text}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-end space-x-2"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shrink-0">
                        <Activity className="w-3.5 h-3.5 text-white animate-pulse" />
                      </div>
                      <div className="bg-slate-700/60 border border-slate-600/50 px-4 py-3 rounded-2xl rounded-bl-none flex space-x-1.5">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="w-2 h-2 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
