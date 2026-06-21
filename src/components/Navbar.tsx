"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Activity, User, Stethoscope, Bot,
  FileText, Calendar, ArrowRight,
  LogOut, Sparkles, Send, Check, Shield
} from "lucide-react";
import { getCurrentSession, getProfileForSession, logout, routeForRole } from "@/lib/auth";
import { getUser } from "@/lib/mvp-storage";
import type { UserRole } from "@/lib/mvp-types";
import { supabase } from "@/lib/supabase";

// ─── Simple Links ──────────────────────────────────────────────────

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Check Symptoms", href: "/symptoms" },
  { label: "Features", href: "/features" },
  { label: "For Patients", href: "/for-patients" },
  { label: "For Clinics & Hospitals", href: "/for-clinics" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact / Support", href: "/#contact" }
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isScrolled, setIsScrolled]         = useState(false);
  const [isMobileMenuOpen, setIsMobileMenu] = useState(false);
  const [authRole, setAuthRole]             = useState<UserRole | null>(null);

  // Portal drawer state
  const [isDrawerOpen, setIsDrawerOpen]         = useState(false);
  const [drawerTab, setDrawerTab]               = useState<"patient" | "doctor">("patient");
  const [isPatientLoggedIn, setIsPatientLogin]  = useState(false);
  const [isDoctorLoggedIn, setIsDoctorLogin]    = useState(false);

  // Patient AI chat
  const [chatInput, setChatInput]     = useState("");
  const [isChatTyping, setTyping]     = useState(false);
  const [chatMessages, setChatMsgs]   = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: "Hello Sarah! I am your Cure AI Assistant. Ask me anything about your vitals, reports, or symptoms." }
  ]);

  // Doctor diagnostic
  const [symptomInput, setSymptomInput]         = useState("");
  const [diagnosticStep, setDiagStep]           = useState<"idle" | "running" | "done">("idle");
  const [runProgress, setRunProgress]           = useState(0);
  const [diagnosticResult, setDiagResult]       = useState<{
    symptoms: string[]; causes: string;
    severity: "High" | "Medium" | "Low"; specialist: string; referred: boolean;
  } | null>(null);

  // File modal
  const [selectedFile, setSelectedFile] = useState<{ name: string; folder: string; date: string; size: string; content: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const session = await getCurrentSession();
        const profile = await getProfileForSession(session);
        const user = profile || getUser();
        setAuthRole(user?.role || null);
      } catch {
        setAuthRole(getUser()?.role || null);
      }
    };

    loadAuthState();

    const { data } =
      supabase?.auth.onAuthStateChange(() => {
        loadAuthState();
      }) || { data: null };

    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setAuthRole(null);
    setIsMobileMenu(false);
    window.location.href = "/login";
  };

  // ── Patient chat ────────────────────────────────────────────────────────
  const sendChat = (text: string) => {
    if (!text.trim() || isChatTyping) return;
    setChatMsgs(prev => [...prev, { sender: "user", text }]);
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      const q = text.toLowerCase();
      let reply = "I've logged that. Please consult a medical professional for personalised care advice.";
      if (q.includes("sugar") || q.includes("glucose")) reply = "Your blood sugar is 95 mg/dL — within the normal fasting range (70–99 mg/dL). No action needed.";
      else if (q.includes("heart") || q.includes("pulse")) reply = "Your average heart rate is 72 bpm today — a very healthy resting pulse.";
      else if (q.includes("blood pressure") || q.includes("bp")) reply = "Your last recorded BP was 120/80 mmHg. Maintain a low-sodium diet to keep it in range.";
      else if (q.includes("appointment") || q.includes("sharma")) reply = "You have a consultation with Dr. Rahul Sharma on Oct 15 at 10:30 AM. I can show directions or help you cancel.";
      setChatMsgs(prev => [...prev, { sender: "ai", text: reply }]);
      setTyping(false);
    }, 900);
  };

  // ── Doctor diagnostic engine ────────────────────────────────────────────
  const runDiagnostics = () => {
    if (!symptomInput.trim()) return;
    setDiagStep("running");
    setRunProgress(0);
    setDiagResult(null);
    const iv = setInterval(() => {
      setRunProgress(prev => {
        if (prev >= 100) {
          clearInterval(iv);
          const t = symptomInput.toLowerCase();
          let symptoms = ["General Symptoms"], causes = "Undetermined. Requires clinical lab confirmation.", severity: "High" | "Medium" | "Low" = "Medium", specialist = "General Physician";
          if (t.includes("headache") || t.includes("fever") || t.includes("neck")) {
            symptoms = ["Severe Headache", "High Fever", "Stiff Neck"];
            causes = "Meningitis symptoms detected. Secondary: acute migraine with infectious fever.";
            severity = "High"; specialist = "Neurologist & ER Specialist";
          } else if (t.includes("chest") || t.includes("breath")) {
            symptoms = ["Chest Tightness", "Dyspnea", "Mild Arrhythmia"];
            causes = "Angina or cardiorespiratory strain suspected. Recommend ECG immediately.";
            severity = "High"; specialist = "Cardiologist";
          } else if (t.includes("rash") || t.includes("itch") || t.includes("skin")) {
            symptoms = ["Erythematous Rash", "Severe Pruritus", "Local Inflammation"];
            causes = "Acute contact dermatitis or viral exanthem. Avoid scratching.";
            severity = "Low"; specialist = "Dermatologist";
          }
          setDiagResult({ symptoms, causes, severity, specialist, referred: false });
          setDiagStep("done");
          return 100;
        }
        return prev + 25;
      });
    }, 600);
  };

  const handleReferral = async () => {
    if (!diagnosticResult) return;
    setDiagResult({ ...diagnosticResult, referred: true });
    try {
      const m = await import("canvas-confetti");
      m.default({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch { /* ignore */ }
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm" : "bg-transparent"
      }`}
    >
      {/* ── Main bar ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <div className="bg-[#0A66FF] p-2 rounded-xl shadow-md shadow-blue-500/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-outfit font-bold text-2xl text-slate-900 tracking-tight">
              Cure<span className="text-[#0A66FF]">AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-[#0A66FF] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            {authRole ? (
              <>
                <Link
                  href={routeForRole(authRole)}
                  className="text-slate-600 hover:text-[#0A66FF] font-medium text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-red-500 font-medium text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-slate-600 hover:text-[#0A66FF] font-medium text-sm transition-colors"
              >
                Log in
              </Link>
            )}
            <Link
              href="/symptoms"
              className="bg-[#0A66FF] hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transform flex items-center space-x-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenu(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-[#0A66FF] focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile slide-down nav ────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenu(false)}
                  className="block px-3 py-3 text-slate-700 font-semibold text-sm hover:text-[#0A66FF] rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-slate-100 pt-4 mt-2 space-y-2.5">
                {authRole ? (
                  <>
                    <Link href={routeForRole(authRole)} onClick={() => setIsMobileMenu(false)} className="w-full text-center text-slate-600 font-semibold py-2.5 border border-slate-200 rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4 text-[#0A66FF]" /><span>Dashboard</span>
                    </Link>
                    <button type="button" onClick={handleLogout} className="w-full text-center text-slate-600 font-semibold py-2.5 border border-slate-200 rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors">
                      <LogOut className="w-4 h-4 text-red-400" /><span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenu(false)} className="w-full text-center text-slate-600 font-semibold py-2.5 border border-slate-200 rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors">
                      <User className="w-4 h-4 text-slate-400" /><span>Patient Login</span>
                    </Link>
                    <Link href="/login" onClick={() => setIsMobileMenu(false)} className="w-full text-center text-slate-600 font-semibold py-2.5 border border-slate-200 rounded-xl flex items-center justify-center space-x-2 hover:bg-slate-50 transition-colors">
                      <Stethoscope className="w-4 h-4 text-[#0A66FF]" /><span>Doctor Admin Login</span>
                    </Link>
                  </>
                )}
                <Link href="/symptoms" onClick={() => setIsMobileMenu(false)} className="block w-full text-center bg-[#0A66FF] text-white font-bold py-3 rounded-xl">
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cure AI Portal Drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
            >
              {/* Drawer header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="bg-[#0A66FF] p-2 rounded-xl"><Activity className="h-5 w-5 text-white" /></div>
                  <div>
                    <h3 className="font-outfit font-extrabold text-xl text-slate-950">Cure AI Portal</h3>
                    <p className="text-xs text-slate-500 font-medium">Secure channel</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab selector */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 shrink-0">
                <div className="bg-slate-200/60 p-1 rounded-xl flex">
                  {(["patient", "doctor"] as const).map(tab => (
                    <button key={tab} onClick={() => setDrawerTab(tab)}
                      className={`flex-1 py-2.5 text-center font-bold text-sm rounded-lg transition-all flex items-center justify-center space-x-2 ${
                        drawerTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {tab === "patient" ? <><User className="w-4 h-4" /><span>Patient Portal</span></> : <><Stethoscope className="w-4 h-4" /><span>Doctor Admin</span></>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                {drawerTab === "patient" ? (
                  !isPatientLoggedIn ? (
                    /* ── Patient login ── */
                    <div className="max-w-md mx-auto py-10">
                      <h4 className="font-outfit font-extrabold text-2xl text-slate-900 mb-2">Access Patient Portal</h4>
                      <p className="text-slate-500 text-sm mb-8">Manage appointments, records, and get AI health guidance.</p>
                      <div className="space-y-4 mb-6">
                        <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email address</label>
                          <input type="email" defaultValue="sarah.jenkins@cure.ai" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/25" /></div>
                        <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Password</label>
                          <input type="password" defaultValue="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/25" /></div>
                      </div>
                      <button onClick={() => setIsPatientLogin(true)} className="w-full bg-[#0A66FF] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mb-3">Sign In</button>
                      <button onClick={() => setIsPatientLogin(true)} className="w-full border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-[#0A66FF] font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2">
                        <Sparkles className="w-4 h-4" /><span>One-Click Demo Login</span>
                      </button>
                    </div>
                  ) : (
                    /* ── Patient dashboard ── */
                    <div className="space-y-5">
                      {/* Profile */}
                      <div className="bg-white border border-slate-200/60 p-4 rounded-2xl flex items-center space-x-4 shadow-sm">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Sarah" className="w-14 h-14 rounded-full border border-slate-200" />
                        <div className="flex-1">
                          <h4 className="font-outfit font-extrabold text-lg text-slate-900">Sarah Jenkins</h4>
                          <span className="text-xs font-semibold text-[#0A66FF] bg-blue-50 px-2 py-0.5 rounded">Premium Member</span>
                        </div>
                        <button onClick={() => setIsPatientLogin(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors" title="Sign Out"><LogOut className="w-5 h-5" /></button>
                      </div>

                      {/* Vitals */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Heart Rate", val: "72 bpm",    color: "text-rose-500"    },
                          { label: "BP",         val: "120/80",    color: "text-emerald-500" },
                          { label: "Glucose",    val: "95 mg/dL",  color: "text-blue-500"    },
                        ].map((v, i) => (
                          <div key={i} className="bg-white border border-slate-100 p-3 rounded-xl text-center shadow-xs">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{v.label}</p>
                            <p className={`text-base font-extrabold font-outfit ${v.color}`}>{v.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* AI chat */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                        <h4 className="font-outfit font-extrabold text-slate-900 text-sm mb-3 flex items-center">
                          <Bot className="w-4 h-4 mr-1.5 text-[#0A66FF]" /> AI Assistant
                        </h4>
                        <div className="border border-slate-100 rounded-xl bg-slate-50/80 p-3 max-h-44 overflow-y-auto mb-3 space-y-3">
                          {chatMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                msg.sender === "user" ? "bg-[#0A66FF] text-white rounded-br-none" : "bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-xs"
                              }`}>{msg.text}</div>
                            </div>
                          ))}
                          {isChatTyping && (
                            <div className="flex justify-start">
                              <div className="bg-white border border-slate-100 rounded-xl rounded-bl-none px-3 py-2 text-xs text-slate-400 flex items-center space-x-1">
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:100ms]" />
                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:200ms]" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {["Heart rate health?", "My BP update?", "Dr. Sharma details?"].map(chip => (
                            <button key={chip} onClick={() => sendChat(chip)} className="text-[10px] font-bold text-[#0A66FF] bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2 py-1 rounded-full transition-colors">{chip}</button>
                          ))}
                        </div>
                        <form onSubmit={e => { e.preventDefault(); sendChat(chatInput); }} className="flex space-x-2">
                          <input type="text" placeholder="Ask Cure AI something..." value={chatInput} onChange={e => setChatInput(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/20" />
                          <button type="submit" className="bg-[#0A66FF] text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"><Send className="w-3.5 h-3.5" /></button>
                        </form>
                      </div>

                      {/* Next appointment */}
                      <div className="bg-gradient-to-br from-[#0A66FF] to-blue-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                        <h4 className="font-outfit font-bold mb-4 flex items-center text-sm text-white/90"><Calendar className="w-4 h-4 mr-1.5" /> Next Appointment</h4>
                        <div className="flex items-center space-x-4 bg-white/10 p-3.5 rounded-xl border border-white/10">
                          <div className="bg-white p-2.5 rounded-lg text-[#0A66FF] font-bold text-center leading-tight shadow-sm shrink-0">15<br/><span className="text-[9px] font-extrabold tracking-wider uppercase">Oct</span></div>
                          <div>
                            <p className="font-bold text-base">Dr. Rahul Sharma</p>
                            <p className="text-blue-100 text-xs mt-0.5">General Physician • 10:30 AM</p>
                          </div>
                        </div>
                      </div>

                      {/* Vault files */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                        <h4 className="font-outfit font-extrabold text-slate-900 text-sm mb-4">Recent Vault Files</h4>
                        <div className="space-y-2.5">
                          {[
                            { name: "Complete Blood Count",      folder: "Blood Reports",  date: "Oct 12, 2024", size: "3.4 MB", content: "RBC 4.8M/uL (Normal), WBC 7.2K/uL (Normal), Hemoglobin 14.2 g/dL (Healthy). All vitals stable." },
                            { name: "Dr. Sharma Prescription",   folder: "Prescriptions",  date: "Oct 05, 2024", size: "1.2 MB", content: "Diagnosis: Seasonal flu. Acetaminophen 500mg 3× daily (3 days), Cough expectorant 10ml 2× daily (5 days). Rest recommended." },
                            { name: "MRI Brain Scan Summary",    folder: "MRI Scans",      date: "Sep 28, 2024", size: "8.1 MB", content: "Symmetry intact. Ventricles within normal parameters. No structural anomalies detected." },
                          ].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-blue-50 text-[#0A66FF]"><FileText className="w-4 h-4" /></div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold">{doc.date} • {doc.size}</p>
                                </div>
                              </div>
                              <button onClick={() => setSelectedFile(doc)} className="text-[10px] font-bold text-[#0A66FF] hover:underline">View</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  !isDoctorLoggedIn ? (
                    /* ── Doctor login ── */
                    <div className="max-w-md mx-auto py-10">
                      <h4 className="font-outfit font-extrabold text-2xl text-slate-900 mb-2">Doctor Diagnostic Console</h4>
                      <p className="text-slate-500 text-sm mb-8">Access the neural clinical parsing engine and specialist routing tools.</p>
                      <div className="space-y-4 mb-6">
                        <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Doctor License Key / Email</label>
                          <input type="text" defaultValue="anita.desai@cure.ai" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/25" /></div>
                        <div><label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Passcode</label>
                          <input type="password" defaultValue="••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66FF]/25" /></div>
                      </div>
                      <button onClick={() => setIsDoctorLogin(true)} className="w-full bg-[#0A66FF] hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mb-3">Authorize Console</button>
                      <button onClick={() => setIsDoctorLogin(true)} className="w-full border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-[#0A66FF] font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2">
                        <Sparkles className="w-4 h-4" /><span>One-Click Demo Login</span>
                      </button>
                    </div>
                  ) : (
                    /* ── Doctor dashboard ── */
                    <div className="space-y-5">
                      {/* Profile */}
                      <div className="bg-white border border-slate-200/60 p-4 rounded-2xl flex items-center space-x-4 shadow-sm">
                        <img src="https://i.pravatar.cc/150?img=32" alt="Dr. Desai" className="w-14 h-14 rounded-full border border-slate-200" />
                        <div className="flex-1">
                          <h4 className="font-outfit font-extrabold text-lg text-slate-900">Dr. Anita Desai</h4>
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center w-fit"><Shield className="w-3 h-3 mr-1" /> Chief Medical Officer</span>
                        </div>
                        <button onClick={() => { setIsDoctorLogin(false); setDiagStep("idle"); setDiagResult(null); }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors" title="Sign Out"><LogOut className="w-5 h-5" /></button>
                      </div>

                      {/* Diagnostic panel */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                        <h4 className="font-outfit font-extrabold text-slate-900 text-sm mb-3 flex items-center">
                          <Activity className="w-4 h-4 mr-1.5 text-[#0A66FF]" /> Clinical Diagnostic Simulator
                        </h4>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">Input patient-reported symptoms. The neural engine extracts entities and matches specialists.</p>
                        <textarea value={symptomInput} onChange={e => setSymptomInput(e.target.value)} placeholder="e.g., Severe headache, sudden high fever, and neck stiffness since yesterday..." rows={3}
                          className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed mb-3" />
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {[
                            { text: "Fever, stiff neck, severe headache", label: "Meningitis" },
                            { text: "Sudden chest pressure, breath shortness", label: "Cardiac" },
                            { text: "Red rash, severe itching on arm", label: "Dermatitis" },
                          ].map(p => (
                            <button key={p.label} onClick={() => setSymptomInput(p.text)} className="text-[9px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200/50 px-2 py-1 rounded-md transition-colors">{p.label}</button>
                          ))}
                        </div>
                        <button onClick={runDiagnostics} disabled={!symptomInput.trim() || diagnosticStep === "running"}
                          className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                            !symptomInput.trim() ? "bg-slate-100 text-slate-400 cursor-not-allowed" :
                            diagnosticStep === "running" ? "bg-slate-200 text-slate-600" :
                            "bg-[#0A66FF] hover:bg-blue-700 text-white shadow-md"
                          }`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{diagnosticStep === "running" ? "Analyzing..." : "Analyze with Cure AI"}</span>
                        </button>
                      </div>

                      {/* Timeline progress */}
                      {diagnosticStep === "running" && (
                        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-600"><span>Diagnostic Engine</span><span>{runProgress}%</span></div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${runProgress}%` }} className="h-full bg-[#0A66FF]" /></div>
                          <div className="space-y-3 pt-1">
                            {[
                              { label: "Entity extraction (NLP)", val: 25 },
                              { label: "AI diagnostic match (10M+ instances)", val: 50 },
                              { label: "Specialist routing logic", val: 75 },
                              { label: "Report compilation", val: 100 },
                            ].map((step, i) => (
                              <div key={i} className="flex items-center space-x-2.5 text-xs">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${runProgress >= step.val ? "bg-[#0A66FF] border-[#0A66FF] text-white" : "bg-slate-50 border-slate-200 text-slate-300"}`}>
                                  {runProgress >= step.val ? <Check className="w-2.5 h-2.5" /> : <span className="text-[8px] font-bold">{i+1}</span>}
                                </div>
                                <span className={`font-medium ${runProgress >= step.val ? "text-slate-800" : "text-slate-400"}`}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Results */}
                      {diagnosticStep === "done" && diagnosticResult && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A66FF]/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />
                          <div className="flex justify-between items-start">
                            <h4 className="font-outfit font-extrabold text-slate-900 text-sm uppercase tracking-wide">Analysis Result</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${diagnosticResult.severity === "High" ? "text-red-500 bg-red-50" : "text-amber-500 bg-amber-50"}`}>{diagnosticResult.severity} Severity</span>
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Identified Symptoms</span>
                            <div className="flex flex-wrap gap-1.5">
                              {diagnosticResult.symptoms.map((s, i) => <span key={i} className="text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-200/60 px-2.5 py-1 rounded-lg">{s}</span>)}
                            </div>
                          </div>
                          <div>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Diagnostic Hypothesis</span>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 border border-slate-100 p-3 rounded-xl">{diagnosticResult.causes}</p>
                          </div>
                          <div className="flex items-center space-x-3 p-3.5 bg-blue-50/50 border border-blue-100/60 rounded-xl">
                            <div className="p-2 bg-[#0A66FF] text-white rounded-lg"><Stethoscope className="w-4 h-4" /></div>
                            <div>
                              <span className="block text-[9px] font-bold text-[#0A66FF] uppercase">Recommended Specialist</span>
                              <p className="text-xs font-bold text-slate-900">{diagnosticResult.specialist}</p>
                            </div>
                          </div>
                          <button onClick={handleReferral} disabled={diagnosticResult.referred}
                            className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${diagnosticResult.referred ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md"}`}>
                            {diagnosticResult.referred ? <><Check className="w-4 h-4" /><span>Referral Logged ✓</span></> : <><ArrowRight className="w-4 h-4" /><span>Establish Patient Referral</span></>}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── File viewer modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedFile && (
          <div onClick={() => setSelectedFile(null)} className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200/60 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center space-x-2"><FileText className="w-4 h-4 text-[#0A66FF]" /><span className="font-outfit font-bold text-slate-800 text-sm">{selectedFile.folder}</span></div>
                <button onClick={() => setSelectedFile(null)} className="p-1 rounded-md hover:bg-slate-200 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-outfit font-extrabold text-base text-slate-900">{selectedFile.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{selectedFile.date} • {selectedFile.size}</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedFile.content}</p>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 text-[10px] font-bold text-[#0A66FF]">
                  <Shield className="w-3.5 h-3.5" /><span>End-to-end encrypted and stored securely.</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={() => setSelectedFile(null)} className="bg-[#0A66FF] hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-xs">Done</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
