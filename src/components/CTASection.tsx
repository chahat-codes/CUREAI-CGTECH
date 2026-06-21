"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export default function CTASection() {
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#0A66FF', '#00C2FF', '#ffffff']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#0A66FF', '#00C2FF', '#ffffff']
      });
    }, 250);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden"
        >
          {/* Stunning Background Gradient */}
          <div className="absolute inset-0 bg-[#0F172A]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0A66FF]/40 via-transparent to-[#00C2FF]/30" />
          
          {/* Animated Glow Dots */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00C2FF]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0A66FF]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />
          
          {/* Grid Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50" />

          <div className="relative p-12 md:p-24 text-center z-10 flex flex-col items-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium text-white">Join the Next Generation of Healthcare</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-outfit font-extrabold text-white mb-6 tracking-tight max-w-4xl mx-auto leading-tight">
              The Future of Healthcare <br className="hidden sm:block"/> Starts Here.
            </h2>
            
            <p className="text-xl text-blue-100 max-w-2xl mx-auto font-sans mb-10 leading-relaxed">
              Find doctors, manage records, and access AI-powered healthcare assistance from one unified platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={triggerConfetti}
                className="w-full sm:w-auto px-10 py-5 bg-white text-[#0A66FF] rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center justify-center space-x-2 transform hover:-translate-y-1"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <p className="mt-8 text-sm text-blue-200">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
