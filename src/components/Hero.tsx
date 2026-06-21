"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, Activity, Send, User, CheckCircle2, MapPin, Star } from "lucide-react";

export default function Hero() {
  const [chatStep, setChatStep] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Steps:
  // 0: Idle
  // 1: User says "I have chest pain."
  // 2: Processing 1
  // 3: AI asks follow up
  // 4: User says "Yes, and shortness of breath."
  // 5: Processing 2
  // 6: Results

  const startDemo = () => {
    if (chatStep !== 0) return;
    setInputValue("I have chest pain.");
    setTimeout(() => {
      handleStep1();
    }, 800);
  };

  const handleStep1 = () => {
    setInputValue("");
    setChatStep(1);
    setTimeout(() => setChatStep(2), 500);
    setTimeout(() => setChatStep(3), 2000);
    setTimeout(() => {
      setInputValue("Yes, and shortness of breath.");
      setTimeout(() => handleStep4(), 1000);
    }, 3500);
  };

  const handleStep4 = () => {
    setInputValue("");
    setChatStep(4);
    setTimeout(() => setChatStep(5), 500);
    setTimeout(() => setChatStep(6), 2500);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (chatStep === 0) handleStep1();
    if (chatStep === 3) handleStep4();
  };

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-dot-pattern">
      {/* Background Gradients */}
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
              <span className="text-sm font-medium text-blue-700">AI-Powered Healthcare</span>
            </div>

            <h1 className="font-outfit text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              Your personal AI healthcare companion.
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-sans">
              Cure AI listens to your symptoms, evaluates urgency, matches you with the right doctor, books appointments, and keeps your health records organized — all from one intelligent experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={startDemo}
                className="w-full sm:w-auto px-8 py-4 bg-[#0A66FF] hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 transform hover:-translate-y-1"
              >
                <span>Check Symptoms</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button 
                onClick={startDemo}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-full font-semibold text-lg transition-all flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <Play className="h-5 w-5 text-[#0A66FF] fill-current" />
                <span>Demo the AI</span>
              </button>
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

          {/* Right Column - Interactive Chat UI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66FF]/20 to-[#00C2FF]/20 rounded-3xl transform rotate-3 blur-xl"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-white shadow-2xl rounded-3xl overflow-hidden flex flex-col h-[580px]">
              {/* Chat Header */}
              <div className="bg-white/60 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between shadow-sm z-20">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#F5FAFF] p-2 rounded-lg border border-blue-100">
                    <Activity className="h-5 w-5 text-[#0A66FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 leading-tight">Cure AI Assistant</h3>
                    <p className="text-xs text-green-500 font-medium flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar relative bg-slate-50/50">
                
                {/* Initial AI Greeting */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shadow-md">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                    <p className="text-slate-700 text-sm">Hi there! 👋 I&apos;m your Cure AI healthcare assistant. Tell me how you feel, and I&apos;ll assess urgency, recommend a specialist, and book care for you.</p>
                  </div>
                </div>

                {/* User Message 1 */}
                <AnimatePresence>
                  {chatStep >= 1 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex items-start justify-end space-x-3"
                    >
                      <div className="bg-[#0A66FF] text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-[85%]">
                        <p className="text-sm">I have chest pain.</p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                        <User className="h-4 w-4 text-slate-500" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Processing Status 1 */}
                <AnimatePresence>
                  {chatStep === 2 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shadow-md">
                        <Activity className="h-4 w-4 text-white animate-pulse" />
                      </div>
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                        <div className="flex space-x-2 items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Follow up Question */}
                <AnimatePresence>
                  {chatStep >= 3 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shadow-md">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                        <p className="text-slate-700 text-sm">Chest pain can be serious. Are you also experiencing any shortness of breath, arm pain, or dizziness?</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* User Message 2 */}
                <AnimatePresence>
                  {chatStep >= 4 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex items-start justify-end space-x-3"
                    >
                      <div className="bg-[#0A66FF] text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-[85%]">
                        <p className="text-sm">Yes, and shortness of breath.</p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-white shadow-sm">
                        <User className="h-4 w-4 text-slate-500" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Processing Status 2 */}
                <AnimatePresence>
                  {chatStep === 5 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shadow-md">
                        <Activity className="h-4 w-4 text-white animate-pulse" />
                      </div>
                      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                        <div className="flex space-x-2 items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          <span className="text-xs text-slate-500 font-medium ml-2">Locating emergency care...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Results */}
                <AnimatePresence>
                  {chatStep === 6 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-[#0A66FF] to-[#00C2FF] flex items-center justify-center shadow-md">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-full max-w-[85%] space-y-3">
                        <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                          <p className="text-slate-700 text-sm">This may require urgent medical attention. Are you also experiencing <span className="font-semibold text-[#0A66FF]">shortness of breath</span> or chest pressure?</p>
                          <p className="text-slate-500 text-xs">I&apos;m matching you with the best available cardiologist nearby.</p>
                        </div>
                        
                        {/* Doctor Card Mockup */}
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 }}
                          className="bg-white border border-blue-100 p-4 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group hover:border-[#0A66FF]/50"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                          
                          <div className="flex space-x-3">
                            <img src="https://i.pravatar.cc/150?img=33" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Dr. Sharma" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 text-sm flex items-center">
                                Dr. Rahul Sharma
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 ml-1" />
                              </h4>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">General Physician • 15 Yrs Exp</p>
                              
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                  <Star className="h-3 w-3 fill-current mr-0.5" /> 4.9
                                </span>
                                <span className="flex items-center text-xs text-slate-500">
                                  <MapPin className="h-3 w-3 mr-0.5 text-slate-400" /> 2.4 km away
                                </span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => setChatStep(0)}
                            className="w-full mt-4 py-2.5 bg-rose-50 text-rose-600 font-medium text-xs rounded-lg hover:bg-rose-100 transition-colors border border-rose-100"
                          >
                            Call Ambulance Now
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="bg-white border-t border-slate-100 p-4 relative z-20">
                <form onSubmit={handleChatSubmit} className="relative flex items-center">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={chatStep === 0 ? "E.g., I have chest pain and fever..." : "Type your response..."}
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 px-5 pr-12 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/30 focus:border-[#0A66FF] transition-all placeholder:text-slate-400 shadow-inner"
                    disabled={chatStep === 2 || chatStep === 5 || chatStep === 6}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || chatStep === 2 || chatStep === 5 || chatStep === 6}
                    className={`absolute right-2 p-2 rounded-full transition-colors ${inputValue.trim() ? 'bg-[#0A66FF] text-white hover:bg-blue-700 shadow-md' : 'bg-slate-200 text-slate-400'}`}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
