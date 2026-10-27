"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Bot, CheckCircle2, Mic, RotateCcw, Send, ShieldCheck } from "lucide-react";
import { saveFlow } from "@/lib/mvp-storage";

type Answer = { key: string; question: string; answer: string };

const emergencyTerms = [
  "chest pain", "difficulty breathing", "shortness of breath", "can't breathe", "cannot breathe",
  "unconscious", "heavy bleeding", "stroke", "face drooping", "one-sided weakness", "seizure",
  "severe allergic", "serious accident", "suicidal", "immediate danger",
];

const prompts = [
  { key: "duration", text: "When did this begin?", quick: ["Today", "2–3 days ago", "About a week ago", "More than a month ago"] },
  { key: "change", text: "Has it improved, worsened, or remained the same?", quick: ["Improved", "Worsened", "About the same"] },
  { key: "severity", text: "How severe does it feel right now?", quick: ["Mild", "Moderate", "Severe"] },
  { key: "related", text: "Are there any related symptoms you have noticed?", quick: ["No other symptoms", "Fever", "Pain", "Nausea"] },
  { key: "medication", text: "Have you taken any medication for this concern?", quick: ["No", "Yes — I will describe it"] },
  { key: "condition", text: "Do you have a relevant existing condition, medication allergy, or previous similar episode?", quick: ["None that I know of", "Yes — I will describe it"] },
  { key: "location", text: "Which city are you in?", quick: ["Chandigarh", "Mohali", "Panchkula", "Zirakpur"] },
  { key: "mode", text: "Would you prefer a clinic visit or video consultation?", quick: ["Clinic visit", "Video consultation", "Either works"] },
];

function specialistFor(text: string) {
  const value = text.toLowerCase();
  if (/rash|skin|acne|itch/.test(value)) return ["Dermatologist", "A dermatologist commonly assesses concerns involving the skin, hair and nails."];
  if (/tooth|teeth|gum|dental/.test(value)) return ["Dentist", "A dentist is the relevant category for tooth, gum and oral-health concerns."];
  if (/period|pregnan|vaginal|pelvic/.test(value)) return ["Gynaecologist", "A gynaecologist commonly assesses reproductive and menstrual-health concerns."];
  if (/ear|nose|throat|sinus/.test(value)) return ["ENT", "An ENT specialist commonly assesses ear, nose, throat and sinus concerns."];
  if (/joint|bone|back|knee|shoulder/.test(value)) return ["Orthopaedic", "An orthopaedic specialist commonly assesses bone, joint and musculoskeletal concerns."];
  return ["General Physician", "A general physician is a suitable first point of care for broad or undifferentiated symptoms."];
}

export default function AssistantPage() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [input, setInput] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [complete, setComplete] = useState(false);
  const current = answers.length === 0
    ? { key: "concern", text: "What problem are you experiencing?", quick: ["Fever or cough", "Skin concern", "Pain or injury", "Something else"] }
    : prompts[answers.length - 1];
  const suggestion = useMemo(() => specialistFor(answers[0]?.answer || ""), [answers]);

  const reply = (value: string) => {
    const clean = value.trim();
    if (!clean || !current) return;
    if (emergencyTerms.some((term) => clean.toLowerCase().includes(term))) {
      setEmergency(true);
      setAnswers((items) => [...items, { key: current.key, question: current.text, answer: clean }]);
      setInput("");
      return;
    }
    const next = [...answers, { key: current.key, question: current.text, answer: clean }];
    setAnswers(next);
    setInput("");
    if (next.length > prompts.length) {
      const [specialist] = specialistFor(next[0]?.answer || "");
      const symptomNotes = next.filter((item) => !["location", "mode"].includes(item.key))
        .map((item) => `${item.question} ${item.answer}`).join(". ");
      saveFlow({ symptoms: symptomNotes, specialist });
      setComplete(true);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    reply(input);
  };

  const restart = () => {
    setAnswers([]);
    setEmergency(false);
    setComplete(false);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#0A66FF]">GUIDED SYMPTOM ASSISTANT</p>
            <h1 className="mt-1 font-outfit text-3xl font-black text-[#071A3D]">Prepare for your consultation</h1>
            <p className="mt-2 text-xs font-semibold text-slate-500">Demonstration mode · structured intake · no live AI model connected</p>
          </div>
          <button onClick={restart} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"><RotateCcw className="size-4" />Restart</button>
        </div>

        <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <span className="font-bold">Important:</span> This assistant collects patient-reported information and may suggest a specialist category. It does not diagnose conditions or replace professional medical advice.
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 p-4">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-[#0A66FF]"><Bot className="size-5" /></div>
              <div><p className="font-bold text-[#071A3D]">Cure AI Assistant</p><p className="text-xs text-emerald-600">Pre-consultation intake</p></div>
              <span className="ml-auto text-xs font-semibold text-slate-500">{Math.min(answers.length + 1, 9)} of 9</span>
            </div>
            <div className="h-1 bg-slate-100"><div className="h-full bg-[#0A66FF] transition-all" style={{ width: `${Math.min((answers.length / 9) * 100, 100)}%` }} /></div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <div className="max-w-[84%] rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-sm leading-6 text-slate-700">
                I’ll ask a few questions that adapt to your answers, then prepare a summary for you to review before sharing.
              </div>
              {answers.map((item) => (
                <div key={`${item.key}-${item.answer}`} className="space-y-3">
                  <div className="max-w-[84%] rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-sm text-slate-700">{item.question}</div>
                  <div className="ml-auto max-w-[84%] rounded-2xl rounded-tr-sm bg-[#0A66FF] p-4 text-sm text-white">{item.answer}</div>
                </div>
              ))}

              {emergency ? (
                <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 text-red-950">
                  <div className="flex items-center gap-2 text-lg font-black"><AlertTriangle className="size-6" />Seek urgent help now</div>
                  <p className="mt-2 text-sm leading-6">Your message includes a possible emergency warning sign. Stop this intake and contact local emergency services or go to the nearest emergency department now. Cure AI cannot assess how serious this is.</p>
                </div>
              ) : complete ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <p className="flex items-center gap-2 font-black text-emerald-900"><CheckCircle2 className="size-5" />Your intake summary is ready</p>
                  <dl className="mt-4 space-y-3 text-sm">
                    {answers.map((item) => <div key={item.key}><dt className="font-bold text-slate-500">{item.question}</dt><dd className="mt-1 text-slate-800">{item.answer}</dd></div>)}
                    <div><dt className="font-bold text-slate-500">Suggested specialist</dt><dd className="mt-1 font-bold text-[#071A3D]">{suggestion[0]}</dd><dd className="mt-1 text-slate-600">{suggestion[1]}</dd></div>
                  </dl>
                  <p className="mt-5 rounded-xl bg-white p-3 text-xs font-semibold leading-5 text-slate-600">Patient-reported information. Not a diagnosis. Requires review by a qualified healthcare professional.</p>
                  <Link href={`/find-doctor?q=${encodeURIComponent(suggestion[0])}`} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0A66FF] px-5 py-3 text-sm font-bold text-white">Find a {suggestion[0]} <ArrowRight className="size-4" /></Link>
                </div>
              ) : current ? (
                <div>
                  <div className="max-w-[84%] rounded-2xl rounded-tl-sm bg-slate-100 p-4 text-sm font-semibold text-slate-800">{current.text}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {current.quick.map((item) => <button key={item} onClick={() => reply(item)} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100">{item}</button>)}
                  </div>
                </div>
              ) : null}
            </div>

            {!emergency && !complete && (
              <form onSubmit={submit} className="flex gap-2 border-t border-slate-100 p-4">
                <button type="button" title="Voice input is not enabled yet" className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-400"><Mic className="size-5" /></button>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your answer…" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 outline-none focus:border-blue-500" />
                <button className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#0A66FF] text-white"><Send className="size-5" /></button>
              </form>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-bold text-[#071A3D]">Your control</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#0A66FF]" />Review the summary before it is shared.</p>
                <p className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#0A66FF]" />A doctor sees it only after explicit consent.</p>
                <p className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#0A66FF]" />AI content stays separate from clinical notes.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#071A3D] p-5 text-white">
              <p className="font-bold">Not for emergencies</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">If you may be in immediate danger, contact local emergency services or visit the nearest emergency department.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
