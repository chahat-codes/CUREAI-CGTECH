"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Calendar, FolderHeart, Bot, Building2, Globe, CheckCircle2, TrendingUp, Layers } from "lucide-react";

export default function Solution() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: 0,
      title: "AI Doctor Finder",
      desc: "Find the right specialist in 30 seconds.",
      icon: Stethoscope,
      color: "text-blue-600",
      bg: "bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      id: 1,
      title: "Smart Appointments",
      desc: "Book clinics with real-time availability.",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      id: 2,
      title: "Digital Health Vault",
      desc: "Secure space for prescriptions, lab reports, and medical history.",
      icon: FolderHeart,
      color: "text-purple-600",
      bg: "bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      id: 3,
      title: "AI Health Assistant",
      desc: "24/7 healthcare guidance and symptom explanations powered by AI.",
      icon: Bot,
      color: "text-rose-600",
      bg: "bg-rose-100",
      borderColor: "border-rose-200"
    },
    {
      id: 4,
      title: "Clinic Management",
      desc: "Digital tools for healthcare providers to manage patients efficiently.",
      icon: Building2,
      color: "text-amber-600",
      bg: "bg-amber-100",
      borderColor: "border-amber-200"
    },
    {
      id: 5,
      title: "Accessibility Platform",
      desc: "Helping underserved communities access quality healthcare remotely.",
      icon: Globe,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      borderColor: "border-cyan-200"
    },
    {
      id: 6,
      title: "Predictive Analytics",
      desc: "AI forecasts potential health risks before they become critical.",
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      borderColor: "border-indigo-200"
    },
    {
      id: 7,
      title: "Ecosystem Integration",
      desc: "Seamlessly connects wearables, pharmacies, and labs in one app.",
      icon: Layers,
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-100",
      borderColor: "border-fuchsia-200"
    }
  ];

  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block">The Solution</span>
          <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight">
            One Platform For Your <br className="hidden sm:block"/> Entire Healthcare Journey.
          </h2>
          <p className="text-xl text-slate-600 font-sans">
            Everything you need to manage your health, find the right doctors, and keep your records secure—in one seamless ecosystem.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Tab List */}
          <div className="lg:col-span-5 space-y-2">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border ${
                  activeTab === feature.id 
                    ? `bg-white shadow-lg shadow-slate-200/50 ${feature.borderColor} scale-[1.02]` 
                    : 'bg-transparent border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`mt-1 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activeTab === feature.id ? feature.bg : 'bg-slate-100'}`}>
                    <feature.icon className={`w-6 h-6 ${activeTab === feature.id ? feature.color : 'text-slate-500'}`} />
                  </div>
                  <div>
                    <h3 className={`font-outfit font-bold text-lg mb-1 ${activeTab === feature.id ? 'text-slate-900' : 'text-slate-600'}`}>
                      {feature.title}
                    </h3>
                    <AnimatePresence>
                      {activeTab === feature.id && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-slate-500 font-sans text-sm leading-relaxed"
                        >
                          {feature.desc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Visual Mockup Area */}
          <div className="lg:col-span-7">
            <div className="relative w-full h-[500px] bg-slate-50 rounded-[2rem] border border-slate-200 shadow-inner overflow-hidden flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full p-8 flex items-center justify-center"
                >
                  
                  {/* Dynamic UI Content based on Active Tab */}
                  {activeTab === 0 && (
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="bg-blue-50 p-2 rounded-lg"><Stethoscope className="text-blue-500 w-6 h-6" /></div>
                        <h4 className="font-bold text-slate-800">AI Matching Engine</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5 }} className="h-full bg-blue-500" />
                        </div>
                        <p className="text-sm text-slate-500 text-center font-medium">Scanning 10,000+ Verified Doctors</p>
                        <div className="flex items-center p-3 border border-blue-100 bg-blue-50/50 rounded-xl mt-4">
                          <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-slate-700">Best Match: Neurologist</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
                      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <h4 className="font-bold text-slate-800">Select Time</h4>
                        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Today</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {["09:00 AM", "10:30 AM", "11:15 AM", "02:00 PM", "04:30 PM", "06:00 PM"].map((time, i) => (
                          <div key={i} className={`p-2 text-center text-sm font-medium rounded-lg border ${i === 2 ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' : 'border-slate-200 text-slate-600'}`}>
                            {time}
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30">Confirm Booking</button>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="w-full max-w-md space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="bg-purple-50 p-2 rounded-lg">
                              <FolderHeart className="text-purple-500 w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-slate-800 text-sm">Blood Test Report</h5>
                              <p className="text-xs text-slate-500">Uploaded 2 days ago</p>
                            </div>
                          </div>
                          <button className="text-purple-600 text-sm font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">View</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(activeTab > 2) && (
                    <div className="text-center">
                      <div className={`w-24 h-24 mx-auto rounded-full ${features[activeTab].bg} flex items-center justify-center mb-6 shadow-inner`}>
                        {(() => {
                          const Icon = features[activeTab].icon;
                          return <Icon className={`w-12 h-12 ${features[activeTab].color}`} />;
                        })()}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{features[activeTab].title}</h3>
                      <p className="text-slate-500 max-w-sm mx-auto">Experience the future of medical care with our advanced ecosystem tools.</p>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
