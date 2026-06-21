"use client";

import { useState, useEffect } from "react";
import { Bot, Zap, ShieldCheck, Activity, Stethoscope, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function AIAssistant() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { time: "00:00", title: "Symptom Input", desc: "User describes symptoms naturally in plain text.", icon: UserIcon },
    { time: "00:05", title: "AI Parsing", desc: "NLP extracts key medical entities and severity.", icon: Bot },
    { time: "00:15", title: "Diagnostic Match", desc: "Cross-referencing 10M+ medical data points.", icon: Activity },
    { time: "00:25", title: "Specialist Routing", desc: "Finding the best local doctors and availability.", icon: Stethoscope },
    { time: "00:30", title: "Resolution", desc: "Booking confirmed instantly.", icon: CheckCircle2 }
  ];

  // Auto-play the timeline
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev < 4 ? prev + 1 : 0));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 bg-[#0F172A] relative overflow-hidden text-white">
      {/* Dark mode premium background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A66FF]/20 via-[#0F172A] to-[#0F172A] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00C2FF]/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-900/50 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
            <Zap className="w-4 h-4 text-[#00C2FF]" />
            <span className="text-sm font-medium text-blue-200">Lightning Fast Processing</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold mb-6 tracking-tight text-white">
            Healthcare Guidance <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C2FF] to-[#0A66FF]">
              Powered by AI.
            </span>
          </h2>
          <p className="text-xl text-slate-400 font-sans max-w-2xl mx-auto">
            From your first symptom to a confirmed appointment in under 30 seconds. Experience the speed of intelligent care.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - The 30s Timeline */}
          <div className="relative">
            <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-800" />
            <div 
              className="absolute left-6 top-10 w-0.5 bg-gradient-to-b from-[#00C2FF] to-[#0A66FF] transition-all duration-500 ease-in-out" 
              style={{ height: `${(activeStep / 4) * 100}%` }}
            />

            <div className="space-y-8 relative">
              {steps.map((step, i) => (
                <div 
                  key={i} 
                  className={`flex items-start space-x-6 transition-all duration-500 cursor-pointer ${activeStep === i ? 'opacity-100 scale-105' : 'opacity-40 scale-100'}`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${activeStep >= i ? 'bg-[#0A66FF] border-[#00C2FF] shadow-[0_0_20px_rgba(10,102,255,0.5)]' : 'bg-slate-900 border-slate-700'}`}>
                    <step.icon className={`w-5 h-5 ${activeStep >= i ? 'text-white' : 'text-slate-500'}`} />
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className={`font-mono text-sm font-bold ${activeStep >= i ? 'text-[#00C2FF]' : 'text-slate-500'}`}>
                        {step.time}
                      </span>
                      <h4 className={`text-xl font-bold font-outfit ${activeStep >= i ? 'text-white' : 'text-slate-400'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-slate-400 font-sans text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Deep Dive AI Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0A66FF]/20 rounded-full blur-[80px]" />
            
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-[#0A66FF] to-[#00C2FF] p-2.5 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg font-outfit">Diagnostic Analysis</h3>
                  <p className="text-xs text-[#00C2FF] font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> Total processing time: 24.3s
                  </p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="space-y-6 relative z-10">
              {/* User Input */}
              <div className="bg-slate-900/80 border border-slate-700/50 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">1. Symptoms Detected</span>
                <p className="text-slate-300 text-sm italic">&quot;I&apos;ve been having a severe headache, slight fever, and stiff neck since yesterday.&quot;</p>
                <div className="flex space-x-2 mt-3">
                  <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-1 rounded">Severe Headache</span>
                  <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-1 rounded">Fever</span>
                  <span className="bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-1 rounded">Stiff Neck</span>
                </div>
              </div>

              {/* AI Causes */}
              <div className="bg-blue-900/20 border border-blue-500/20 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-[#00C2FF] uppercase tracking-wider mb-2 block">2. Possible Causes Analysis</span>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">
                  The combination of sudden high fever, severe headache, and neck stiffness could indicate potential viral or bacterial infection requiring immediate attention.
                </p>
              </div>

              {/* Action Plan */}
              <div className="bg-emerald-900/20 border border-emerald-500/20 p-5 rounded-2xl">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 block">3. Recommended Next Steps</span>
                <div className="flex items-start space-x-3 mt-2">
                  <Stethoscope className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">Consult a General Physician immediately.</h4>
                    <p className="text-slate-400 text-xs mt-1">I have found 3 specialists available within 5km for an immediate consultation.</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center space-x-2">
                  <span>View Doctors & Book</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
