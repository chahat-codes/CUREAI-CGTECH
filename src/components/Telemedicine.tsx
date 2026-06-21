"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Mic, MicOff, Camera, CameraOff, MessageSquare, FileText, Calendar, PhoneOff, Send } from "lucide-react";

type CallState = "idle" | "connecting" | "active" | "ended";

const chatMessages = [
  { sender: "doctor", text: "Hello! I can see you're experiencing some fever. How long has it been?" },
  { sender: "patient", text: "Since yesterday evening, around 36 hours now." },
  { sender: "doctor", text: "I see. Any other symptoms — body aches, headache, or sore throat?" },
  { sender: "patient", text: "Yes, body aches and a mild headache." },
  { sender: "doctor", text: "That sounds like a viral infection. I'll prescribe Paracetamol and rest. Generating your prescription now..." },
];

export default function Telemedicine() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState(chatMessages.slice(0, 2));
  const [prescriptionReady, setPrescriptionReady] = useState(false);

  const startCall = () => {
    setCallState("connecting");
    setTimeout(() => {
      setCallState("active");
      // Simulate doctor messages appearing
      let idx = 2;
      const interval = setInterval(() => {
        if (idx < chatMessages.length) {
          setMessages(prev => [...prev, chatMessages[idx]]);
          if (idx === chatMessages.length - 1) setPrescriptionReady(true);
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 2500);
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    setMicOn(true);
    setCamOn(true);
    setChatVisible(false);
  };

  return (
    <section className="py-32 bg-[#F5FAFF] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(10,102,255,0.07),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white border border-blue-100 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Video className="w-4 h-4 text-[#0A66FF]" />
              <span className="text-sm font-semibold text-[#0A66FF]">Telemedicine</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              See a Doctor From{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66FF] to-[#00C2FF]">
                Anywhere.
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              HD video consultations, in-call chat, instant prescription generation, and automatic follow-up booking — all without leaving home.
            </p>

            <div className="space-y-5">
              {[
                { icon: Video, title: "HD Video Calls", desc: "Crystal-clear video with low-latency connections." },
                { icon: FileText, title: "Instant Prescriptions", desc: "Doctor generates and sends your prescription during the call." },
                { icon: MessageSquare, title: "In-call Chat", desc: "Share symptoms, images, or reports via chat." },
                { icon: Calendar, title: "Auto Follow-up", desc: "Book your next appointment before the call ends." },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#0A66FF]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-0.5">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Video Call UI */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-[4/3] relative flex flex-col">

              {/* Main video area */}
              <div className="flex-1 relative">
                {callState === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                      <Video className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-sm">Video consultation ready</p>
                    <button
                      onClick={startCall}
                      className="px-8 py-3 bg-gradient-to-r from-[#0A66FF] to-[#00C2FF] text-white rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30"
                    >
                      Start Consultation
                    </button>
                  </div>
                )}

                {callState === "connecting" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0A66FF] animate-pulse">
                      <img src="https://i.pravatar.cc/100?img=32" alt="Doctor" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-white font-semibold">Connecting to Dr. Anita Desai...</p>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-[#00C2FF] rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                    </div>
                  </div>
                )}

                {(callState === "active") && (
                  <>
                    {/* Doctor video (full bg) */}
                    <div className="absolute inset-0 bg-slate-800">
                      <img src="https://i.pravatar.cc/400?img=32" alt="Dr. Anita" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                          <p className="text-white text-xs font-bold">Dr. Anita Desai</p>
                          <p className="text-slate-300 text-[10px]">Cardiologist • Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Patient PiP */}
                    <div className="absolute top-4 right-4 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg">
                      <img src="https://i.pravatar.cc/100?img=11" alt="You" className="w-full h-full object-cover" />
                      {!camOn && <div className="absolute inset-0 bg-slate-900 flex items-center justify-center"><CameraOff className="w-5 h-5 text-slate-400" /></div>}
                    </div>

                    {/* Recording dot */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-bold">Recording</span>
                    </div>
                  </>
                )}

                {callState === "ended" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-center px-8">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-emerald-400" />
                    </div>
                    <p className="text-white font-bold text-lg">Consultation Complete</p>
                    <p className="text-slate-400 text-sm">Your prescription has been sent to your Health Vault</p>
                    <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors">
                      Book Follow-up
                    </button>
                  </div>
                )}
              </div>

              {/* Controls */}
              {callState === "active" && (
                <div className="bg-slate-900/90 backdrop-blur-sm p-4 flex items-center justify-between border-t border-slate-800">
                  <div className="flex space-x-3">
                    <button onClick={() => setMicOn(!micOn)} className={`p-3 rounded-xl transition-colors ${micOn ? "bg-slate-700 text-white" : "bg-rose-500 text-white"}`}>
                      {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setCamOn(!camOn)} className={`p-3 rounded-xl transition-colors ${camOn ? "bg-slate-700 text-white" : "bg-rose-500 text-white"}`}>
                      {camOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setChatVisible(!chatVisible)} className={`p-3 rounded-xl transition-colors relative ${chatVisible ? "bg-[#0A66FF] text-white" : "bg-slate-700 text-white"}`}>
                      <MessageSquare className="w-4 h-4" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                        {messages.length}
                      </span>
                    </button>
                  </div>
                  {prescriptionReady && (
                    <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 text-xs font-bold">Prescription Ready</span>
                    </div>
                  )}
                  <button onClick={endCall} className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-lg">
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Chat Panel */}
            <AnimatePresence>
              {chatVisible && callState === "active" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white border border-slate-100 rounded-2xl mt-3 overflow-hidden shadow-lg"
                >
                  <div className="max-h-40 overflow-y-auto p-4 space-y-3 no-scrollbar">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.sender === "patient" ? "bg-[#0A66FF] text-white" : "bg-slate-100 text-slate-700"}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-100 flex space-x-2">
                    <input value={msgInput} onChange={e => setMsgInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none" />
                    <button onClick={() => { if (msgInput.trim()) { setMessages(prev => [...prev, { sender: "patient", text: msgInput }]); setMsgInput(""); } }} className="bg-[#0A66FF] text-white p-2 rounded-lg">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
