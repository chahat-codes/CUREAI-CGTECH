"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Alok Verma",
      role: "Cardiologist",
      text: "Cure AI has completely transformed how my clinic operates. The AI pre-screening ensures I get accurate symptom summaries before the patient even walks in, saving me 10 minutes per consultation.",
      type: "practitioner",
      img: "60"
    },
    {
      name: "Priya Sharma",
      role: "Patient",
      text: "I was confused about who to see for my chronic back pain. The AI assistant instantly recommended a great orthopedic surgeon nearby, and I booked an appointment for the very next day. Incredibly smooth experience.",
      type: "patient",
      img: "44"
    },
    {
      name: "Rahul Mehta",
      role: "Patient",
      text: "Having all my family's medical records in the Digital Health Vault is a lifesaver. No more carrying heavy files to the hospital. I can just share a secure link with my doctor.",
      type: "patient",
      img: "11"
    },
    {
      name: "Dr. Sneha Patil",
      role: "General Physician",
      text: "The Smart Appointment booking system eliminated double-bookings completely. My patients are happier because they don't have to wait for hours in the lobby anymore.",
      type: "practitioner",
      img: "32"
    },
    {
      name: "Arjun Nair",
      role: "Patient",
      text: "The interface is so clean and easy to use. I described my daughter's symptoms to the AI, and it not only suggested the right pediatrician but also gave me immediate home-care tips while we waited for the appointment.",
      type: "patient",
      img: "33"
    },
    {
      name: "Dr. Karan Singh",
      role: "Neurologist",
      text: "As a specialist, getting patients who actually need my specific expertise is crucial. Cure AI acts as the perfect triage system, ensuring the right patients get to the right doctors.",
      type: "practitioner",
      img: "68"
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100 relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#0A66FF] font-semibold tracking-wider uppercase text-sm mb-4 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-outfit font-extrabold text-slate-900 mb-4">
            Trusted by Doctors. <br className="hidden md:block"/> Loved by Patients.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-sans">
            Don&apos;t just take our word for it. Here is what healthcare professionals and patients are saying about Cure AI.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="break-inside-avoid bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-100 group-hover:text-blue-50 transition-colors" />
              
              <div className="flex space-x-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-slate-700 font-sans leading-relaxed mb-8 relative z-10">
                &quot;{t.text}&quot;
              </p>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={`https://i.pravatar.cc/150?img=${t.img}`} 
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 font-outfit flex items-center">
                    {t.name}
                    {t.type === "practitioner" && <CheckCircle2 className="w-3.5 h-3.5 text-[#0A66FF] ml-1" />}
                  </h4>
                  <p className={`text-xs font-medium ${t.type === "practitioner" ? "text-[#0A66FF]" : "text-slate-500"}`}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
